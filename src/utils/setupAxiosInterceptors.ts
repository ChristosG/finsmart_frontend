import axios from 'axios';
import { store } from '@/redux/store';
import { refreshAccessToken, clearAuth } from '@/redux/slices/authSlice';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  
  failedQueue = [];
};

export const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (originalRequest.url?.includes('/auth/refresh')) {
          const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
          store.dispatch(clearAuth(currentPath));
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axios(originalRequest);
          }).catch((err) => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const result = await store.dispatch(refreshAccessToken()).unwrap();
          const newToken = result.access_token;
          
          processQueue(null, newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
          return axios(originalRequest);
        } catch (refreshError: any) {
          processQueue(refreshError as Error, null);
          
          const errorMessage = refreshError?.message || '';
          if (errorMessage.includes('No refresh token available')) {
            console.debug('No refresh token available, user needs to login');
          } else {
            console.warn('Token refresh failed:', errorMessage);
          }
          

          setTimeout(() => {
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
            store.dispatch(clearAuth(currentPath));
          }, 50);
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};