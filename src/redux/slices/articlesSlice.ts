import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';
import { refreshSource } from './sourcesSlice';

export interface Article {
  id: number;
  source_id: number;
  title: string;
  content?: string;
  date?: string | null;
  authors?: string | null;
  link?: string;
  summary?: string | null;
  analysis?: string | null;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total_count: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

interface DeleteArticlesResponse {
  success: boolean;
  message: string;
  deleted_count: number;
  deleted_article_ids: number[];
  affected_source_ids: number[];
  not_found_ids: number[];
}

interface SourceArticles {
  articles: Article[];
  loading: boolean;
  error: string | null;
  lastFetched: number;
  pagination: PaginationInfo | null;
  selectedArticles: number[];
}

interface ArticlesGlobalState {
  deletingArticles: boolean;
  deleteError: string | null;
}

interface ArticlesState extends ArticlesGlobalState {
  bySourceId: Record<string, SourceArticles>;
}

const initialState: ArticlesState = {
  bySourceId: {},
  deletingArticles: false,
  deleteError: null,
};

const createInitialSourceState = (): SourceArticles => ({
  articles: [],
  loading: false,
  error: null,
  lastFetched: 0,
  pagination: null,
  selectedArticles: [],
});

export const fetchArticlesBySource = createAsyncThunk(
  'articles/fetchBySource',
  async ({ 
    sourceId, 
    page = 1, 
    limit = 20, 
    append = false 
  }: { 
    sourceId: string; 
    page?: number;
    limit?: number;
    forceRefresh?: boolean;
    append?: boolean;
  }, { rejectWithValue }) => {
    try {
      const numericSourceId = parseInt(sourceId, 10);
      if (isNaN(numericSourceId)) {
        throw new Error(`Invalid sourceId: ${sourceId}`);
      }
      
      console.log(`Fetching articles for source ${numericSourceId}, page ${page}, limit ${limit}`);
      
      const response = await axios.get(`${API_ENDPOINTS.articles}?sourceId=${numericSourceId}&page=${page}&limit=${limit}`);
      
      console.log(`API Response for source ${sourceId}:`, {
        status: response.status,
        articlesCount: response.data?.articles?.length || 0,
        pagination: response.data?.pagination,
        fullResponse: response.data
      });
      
      const articles = Array.isArray(response.data?.articles) ? response.data.articles : [];
      const pagination = response.data?.pagination || null;
      
      return {
        sourceId,
        articles,
        pagination,
        append,
      };
    } catch (error: unknown) {
      console.error('Error fetching articles:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url
        });
        return rejectWithValue(`API Error: ${error.response?.status} - ${error.response?.statusText || error.message}`);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch articles');
    }
  }
);

export const deleteArticles = createAsyncThunk(
  'articles/delete',
  async ({ articleIds }: { articleIds: number[] }, { rejectWithValue }) => {
    try {
      console.log(`Deleting articles:`, articleIds);
      
      const response = await axios.delete(API_ENDPOINTS.articles, {
        data: { article_ids: articleIds }
      });
      
      console.log(`Delete articles response:`, response.data);
      
      return response.data as DeleteArticlesResponse;
    } catch (error: unknown) {
      console.error('Error deleting articles:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url
        });
        return rejectWithValue(`API Error: ${error.response?.status} - ${error.response?.statusText || error.message}`);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete articles');
    }
  }
);

export const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearArticlesForSource: (state, action: PayloadAction<string>) => {
      const sourceId = action.payload;
      if (state.bySourceId[sourceId]) {
        state.bySourceId[sourceId] = createInitialSourceState();
      }
    },
    resetAllArticles: (state) => {
      state.bySourceId = {};
    },
    toggleArticleSelection: (state, action: PayloadAction<{ sourceId: string; articleId: number }>) => {
      const { sourceId, articleId } = action.payload;
      if (!state.bySourceId[sourceId]) {
        state.bySourceId[sourceId] = createInitialSourceState();
      }
      const sourceState = state.bySourceId[sourceId];
      const index = sourceState.selectedArticles.indexOf(articleId);
      if (index > -1) {
        sourceState.selectedArticles.splice(index, 1);
      } else {
        sourceState.selectedArticles.push(articleId);
      }
    },
    selectAllArticles: (state, action: PayloadAction<string>) => {
      const sourceId = action.payload;
      if (!state.bySourceId[sourceId]) {
        state.bySourceId[sourceId] = createInitialSourceState();
      }
      const sourceState = state.bySourceId[sourceId];
      sourceState.selectedArticles = sourceState.articles.map(article => article.id);
    },
    clearArticleSelection: (state, action: PayloadAction<string>) => {
      const sourceId = action.payload;
      if (!state.bySourceId[sourceId]) {
        state.bySourceId[sourceId] = createInitialSourceState();
      }
      state.bySourceId[sourceId].selectedArticles = [];
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticlesBySource.pending, (state, action) => {
        const { sourceId } = action.meta.arg;
        if (!state.bySourceId[sourceId]) {
          state.bySourceId[sourceId] = createInitialSourceState();
        }
        state.bySourceId[sourceId].loading = true;
        state.bySourceId[sourceId].error = null;
      })
      .addCase(fetchArticlesBySource.fulfilled, (state, action) => {
        const { sourceId, articles, pagination, append } = action.payload;
        if (!state.bySourceId[sourceId]) {
          state.bySourceId[sourceId] = createInitialSourceState();
        }
        
        const sourceState = state.bySourceId[sourceId];
        sourceState.loading = false;
        sourceState.error = null;
        sourceState.lastFetched = Date.now();
        sourceState.pagination = pagination;
        
        if (append && sourceState.articles.length > 0) {
          sourceState.articles = [...sourceState.articles, ...articles];
        } else {
          sourceState.articles = articles;
        }
      })
      .addCase(fetchArticlesBySource.rejected, (state, action) => {
        const { sourceId } = action.meta.arg;
        if (!state.bySourceId[sourceId]) {
          state.bySourceId[sourceId] = createInitialSourceState();
        }
        state.bySourceId[sourceId].loading = false;
        state.bySourceId[sourceId].error = action.payload as string;
      })
      .addCase(deleteArticles.pending, (state) => {
        state.deletingArticles = true;
        state.deleteError = null;
      })
      .addCase(deleteArticles.fulfilled, (state, action) => {
        state.deletingArticles = false;
        state.deleteError = null;
        
        const { deleted_article_ids, affected_source_ids } = action.payload;
        
        affected_source_ids.forEach(sourceId => {
          const sourceIdStr = sourceId.toString();
          if (state.bySourceId[sourceIdStr]) {
            const sourceState = state.bySourceId[sourceIdStr];
            sourceState.articles = sourceState.articles.filter(
              article => !deleted_article_ids.includes(article.id)
            );
            sourceState.selectedArticles = sourceState.selectedArticles.filter(
              articleId => !deleted_article_ids.includes(articleId)
            );
            if (sourceState.pagination) {
              sourceState.pagination.total_count -= deleted_article_ids.length;
              sourceState.pagination.total_pages = Math.ceil(
                sourceState.pagination.total_count / sourceState.pagination.limit
              );
            }
          }
        });
      })
      .addCase(deleteArticles.rejected, (state, action) => {
        state.deletingArticles = false;
        state.deleteError = action.payload as string;
      })
      .addCase(refreshSource.fulfilled, (state, action) => {
        const { sourceId } = action.payload;
        if (state.bySourceId[sourceId]) {
          state.bySourceId[sourceId].lastFetched = 0;
        }
      });
  },
});

export const { 
  clearArticlesForSource, 
  resetAllArticles, 
  toggleArticleSelection, 
  selectAllArticles, 
  clearArticleSelection,
  clearDeleteError 
} = articlesSlice.actions;

// Selectors
export const selectArticlesBySource = (state: { articles: ArticlesState }, sourceId: string) => {
  return state.articles.bySourceId[sourceId] || createInitialSourceState();
};

export const selectIsLoadingForSource = (state: { articles: ArticlesState }, sourceId: string) => {
  return state.articles.bySourceId[sourceId]?.loading || false;
};

export const selectErrorForSource = (state: { articles: ArticlesState }, sourceId: string) => {
  return state.articles.bySourceId[sourceId]?.error || null;
};

export const selectPaginationForSource = (state: { articles: ArticlesState }, sourceId: string) => {
  return state.articles.bySourceId[sourceId]?.pagination || null;
};

export const selectSelectedArticles = (state: { articles: ArticlesState }, sourceId: string) => {
  return state.articles.bySourceId[sourceId]?.selectedArticles || [];
};

export const selectIsArticleSelected = (state: { articles: ArticlesState }, sourceId: string, articleId: number) => {
  return state.articles.bySourceId[sourceId]?.selectedArticles.includes(articleId) || false;
};

export const selectIsDeletingArticles = (state: { articles: ArticlesState }) => {
  return state.articles.deletingArticles;
};

export const selectDeleteError = (state: { articles: ArticlesState }) => {
  return state.articles.deleteError;
};

export default articlesSlice.reducer;