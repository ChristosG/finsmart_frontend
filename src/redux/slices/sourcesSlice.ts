import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';

interface Source {
  id: string;
  name: string;
}

interface RefreshResponse {
  success: boolean;
  data: {
    articles_scraped: number;
    articles_skipped: number;
    message: string;
  };
  message: string;
}

interface DeleteSourceResponse {
  success: boolean;
  message: string;
  deleted_source_id: number;
  deleted_articles_count: number;
}

interface SourcesState {
  sources: Source[];
  loading: boolean;
  error: string | null;
  refreshing: Record<string, boolean>;
  refreshErrors: Record<string, string | null>;
  deleting: Record<string, boolean>;
  deleteErrors: Record<string, string | null>;
}

const initialState: SourcesState = {
  sources: [],
  loading: false,
  error: null,
  refreshing: {},
  refreshErrors: {},
  deleting: {},
  deleteErrors: {},
};

export const fetchSources = createAsyncThunk(
  'sources/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_ENDPOINTS.sources);
      return response.data as Source[];
    } catch (error: unknown) {
      console.error('Error fetching sources:', error);
      if (axios.isAxiosError(error)) {
        return rejectWithValue(`API Error: ${error.response?.status} - ${error.response?.statusText || error.message}`);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch sources');
    }
  }
);

export const refreshSource = createAsyncThunk(
  'sources/refresh',
  async ({ sourceId, maxArticles = 20 }: { sourceId: string; maxArticles?: number }, { rejectWithValue }) => {
    try {
      console.log(`Refreshing source ${sourceId} with max ${maxArticles} articles`);
      
      const response = await axios.post(API_ENDPOINTS.sourceRefresh(sourceId), {
        max_articles: maxArticles
      });
      
      console.log(`Refresh response for source ${sourceId}:`, response.data);
      
      return {
        sourceId,
        result: response.data as RefreshResponse
      };
    } catch (error: unknown) {
      console.error('Error refreshing source:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url
        });
        return rejectWithValue(`API Error: ${error.response?.status} - ${error.response?.statusText || error.message}`);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to refresh source');
    }
  }
);

export const deleteSource = createAsyncThunk(
  'sources/delete',
  async ({ sourceId }: { sourceId: string }, { rejectWithValue }) => {
    try {
      console.log(`Deleting source ${sourceId}`);
      
      const response = await axios.delete(API_ENDPOINTS.sourceDelete(sourceId));
      
      console.log(`Delete response for source ${sourceId}:`, response.data);
      
      return {
        sourceId,
        result: response.data as DeleteSourceResponse
      };
    } catch (error: unknown) {
      console.error('Error deleting source:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url
        });
        return rejectWithValue(`API Error: ${error.response?.status} - ${error.response?.statusText || error.message}`);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete source');
    }
  }
);

export const sourcesSlice = createSlice({
  name: 'sources',
  initialState,
  reducers: {
    setSources(state, action: PayloadAction<Source[]>) {
      state.sources = action.payload;
    },
    clearRefreshError(state, action: PayloadAction<string>) {
      delete state.refreshErrors[action.payload];
    },
    clearDeleteError(state, action: PayloadAction<string>) {
      delete state.deleteErrors[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSources.fulfilled, (state, action) => {
        state.loading = false;
        state.sources = action.payload;
        state.error = null;
      })
      .addCase(fetchSources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshSource.pending, (state, action) => {
        const { sourceId } = action.meta.arg;
        state.refreshing[sourceId] = true;
        delete state.refreshErrors[sourceId];
      })
      .addCase(refreshSource.fulfilled, (state, action) => {
        const { sourceId } = action.payload;
        state.refreshing[sourceId] = false;
        delete state.refreshErrors[sourceId];
      })
      .addCase(refreshSource.rejected, (state, action) => {
        const { sourceId } = action.meta.arg;
        state.refreshing[sourceId] = false;
        state.refreshErrors[sourceId] = action.payload as string;
      })
      .addCase(deleteSource.pending, (state, action) => {
        const { sourceId } = action.meta.arg;
        state.deleting[sourceId] = true;
        delete state.deleteErrors[sourceId];
      })
      .addCase(deleteSource.fulfilled, (state, action) => {
        const { sourceId } = action.payload;
        state.deleting[sourceId] = false;
        delete state.deleteErrors[sourceId];
        state.sources = state.sources.filter(source => source.id !== sourceId);
      })
      .addCase(deleteSource.rejected, (state, action) => {
        const { sourceId } = action.meta.arg;
        state.deleting[sourceId] = false;
        state.deleteErrors[sourceId] = action.payload as string;
      });
  },
});

export const { setSources, clearRefreshError, clearDeleteError } = sourcesSlice.actions;

export const selectIsRefreshing = (state: { sources: SourcesState }, sourceId: string) => {
  return state.sources.refreshing[sourceId] || false;
};

export const selectRefreshError = (state: { sources: SourcesState }, sourceId: string) => {
  return state.sources.refreshErrors[sourceId] || null;
};

export const selectIsDeleting = (state: { sources: SourcesState }, sourceId: string) => {
  return state.sources.deleting[sourceId] || false;
};

export const selectDeleteError = (state: { sources: SourcesState }, sourceId: string) => {
  return state.sources.deleteErrors[sourceId] || null;
};

export const selectSourceById = (state: { sources: SourcesState }, sourceId: string) => {
  return state.sources.sources.find(source => source.id === sourceId) || null;
};

export default sourcesSlice.reducer;
