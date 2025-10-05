import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAuthToken } from '@/utils/axiosConfig';
import { API_ENDPOINTS } from '@/config/api';

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

interface LoginCredentials {
  email_or_username: string;
  password: string;
  remember_me?: boolean;
}

interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  expires_in: number;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  tokenExpiry: number | null;
  returnUrl: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true, 
  error: null,
  tokenExpiry: null,
  returnUrl: null,
};


export const signup = createAsyncThunk(
  'auth/signup',
  async (credentials: SignupCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_ENDPOINTS.signup, credentials);
      return response.data as AuthResponse;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        
        if (error.response?.status === 422 && errorData?.detail) {
          if (Array.isArray(errorData.detail)) {
            const fieldErrors = errorData.detail.map((err: {loc?: string[]; msg: string}) => 
              `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ');
            return rejectWithValue(fieldErrors);
          }
        }
        
        return rejectWithValue(errorData?.detail || errorData?.message || 'Signup failed');
      }
      return rejectWithValue('Signup failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_ENDPOINTS.login, credentials);
      return response.data as AuthResponse;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        
        if (error.response?.status === 422 && errorData?.detail) {
          if (Array.isArray(errorData.detail)) {
            const fieldErrors = errorData.detail.map((err: {loc?: string[]; msg: string}) => 
              `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ');
            return rejectWithValue(fieldErrors);
          }
        }
        
        return rejectWithValue(errorData?.detail || errorData?.message || 'Login failed');
      }
      return rejectWithValue('Login failed');
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refresh',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.refreshToken;
      
      if (!refreshToken) {
        return rejectWithValue('No refresh token available');
      }

      const response = await axios.post(API_ENDPOINTS.refresh, {
        refresh_token: refreshToken
      });
      return response.data as AuthResponse;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.detail || 'Token refresh failed');
      }
      return rejectWithValue('Token refresh failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_ENDPOINTS.me);
      return response.data as User;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.detail || 'Failed to get user info');
      }
      return rejectWithValue('Failed to get user info');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await axios.post(API_ENDPOINTS.logout);
      return true;
    } catch (error: unknown) {
      console.error('Logout error:', error);
      return true;
    }
  }
);

export const logoutAll = createAsyncThunk(
  'auth/logout-all',
  async () => {
    try {
      await axios.post(API_ENDPOINTS.logoutAll);
      return true;
    } catch (error: unknown) {
      console.error('Logout all error:', error);
      return true;
    }
  }
);

export const validateSession = createAsyncThunk(
  'auth/validate-session',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      
      if (state.auth.isAuthenticated && state.auth.accessToken && !state.auth.user) {
        const response = await axios.get(API_ENDPOINTS.me);
        return response.data as User;
      }
      
      return null;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        dispatch(clearAuth());
      }
      return rejectWithValue('Session validation failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload && !action.payload.includes('/login') && !action.payload.includes('/signup')) {
        state.returnUrl = action.payload;
      }
      
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.tokenExpiry = null;
      state.error = null;
      state.loading = false;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_expiry');
      }
      
      setAuthToken(null);
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    hydrateAuth: (state) => {
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const tokenExpiry = localStorage.getItem('token_expiry');
        
        if (accessToken && refreshToken && tokenExpiry) {
          const expiryTime = parseInt(tokenExpiry, 10);
          const now = Date.now();
          
          const isExpired = now >= expiryTime;
          const isExpiringSoon = now >= (expiryTime - 5 * 60 * 1000); 
          
          if (!isExpired) {
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.tokenExpiry = expiryTime;
            state.isAuthenticated = true;
            setAuthToken(accessToken);
            

          } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('token_expiry');
          }
        }
        state.loading = false;
      }
    },
    setReturnUrl: (state, action: PayloadAction<string | null>) => {
      state.returnUrl = action.payload;
    },
    clearReturnUrl: (state) => {
      state.returnUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        const { access_token, refresh_token, user, expires_in } = action.payload;
        
        state.loading = false;
        state.user = user;
        state.accessToken = access_token;
        state.refreshToken = refresh_token;
        state.isAuthenticated = true;
        state.tokenExpiry = Date.now() + (expires_in * 1000);
        state.error = null;
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('token_expiry', state.tokenExpiry.toString());
        }
        
        setAuthToken(access_token);
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { access_token, refresh_token, user, expires_in } = action.payload;
        
        state.loading = false;
        state.user = user;
        state.accessToken = access_token;
        state.refreshToken = refresh_token;
        state.isAuthenticated = true;
        state.tokenExpiry = Date.now() + (expires_in * 1000);
        state.error = null;
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('token_expiry', state.tokenExpiry.toString());
        }
        
        setAuthToken(access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('token_expiry');
        }
        setAuthToken(null);
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        const { access_token, refresh_token, user, expires_in } = action.payload;
        
        state.loading = false;
        state.user = user;
        state.accessToken = access_token;
        state.refreshToken = refresh_token;
        state.isAuthenticated = true;
        state.tokenExpiry = Date.now() + (expires_in * 1000);
        state.error = null;
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('token_expiry', state.tokenExpiry.toString());
        }
        
        setAuthToken(access_token);
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action.payload as string;
        

        if (!errorMessage.includes('No refresh token available')) {
          state.error = errorMessage;
          console.warn('Token refresh failed:', errorMessage);
        } else {
          console.debug('Token refresh skipped: No refresh token available');
        }
        
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.tokenExpiry = null;
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('token_expiry');
        }
        
        setAuthToken(null);
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.tokenExpiry = null;
        state.loading = false;
        state.error = null;
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('token_expiry');
        }
        
        setAuthToken(null);
      })
      .addCase(logoutAll.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.tokenExpiry = null;
        state.loading = false;
        state.error = null;
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('token_expiry');
        }
        
        setAuthToken(null);
      })
      .addCase(validateSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
        }
      })
      .addCase(validateSession.rejected, (state) => {

      });
  },
});

export const { clearError, clearAuth, updateUser, hydrateAuth, setReturnUrl, clearReturnUrl } = authSlice.actions;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectReturnUrl = (state: { auth: AuthState }) => state.auth.returnUrl;

export default authSlice.reducer;