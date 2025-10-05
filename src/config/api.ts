export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7000';

export const API_ENDPOINTS = {
  // Auth endpoints
  signup: `${API_BASE_URL}/api/auth/signup`,
  login: `${API_BASE_URL}/api/auth/login`,
  refresh: `${API_BASE_URL}/api/auth/refresh`,
  me: `${API_BASE_URL}/api/auth/me`,
  logout: `${API_BASE_URL}/api/auth/logout`,
  logoutAll: `${API_BASE_URL}/api/auth/logout-all`,
  
  // Articles endpoints
  articles: `${API_BASE_URL}/api/articles`,
  articleAudio: (id: string) => `${API_BASE_URL}/api/articles/${id}/audio`,
  articleSummary: (id: string) => `${API_BASE_URL}/api/articles/${id}/summary`,
  articleAnalysis: (id: string) => `${API_BASE_URL}/api/articles/${id}/analysis`,
  
  // Sources endpoints
  sources: `${API_BASE_URL}/api/sources`,
  sourceRefresh: (id: string) => `${API_BASE_URL}/api/sources/${id}/refresh`,
  sourceDelete: (id: string) => `${API_BASE_URL}/api/sources/${id}`,
  
  // Scraping endpoint
  scrape: `${API_BASE_URL}/api/scrape`,
};