import { configureStore } from '@reduxjs/toolkit';
import sourcesReducer from './slices/sourcesSlice';
import articlesReducer from './slices/articlesSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    sources: sourcesReducer,
    articles: articlesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
