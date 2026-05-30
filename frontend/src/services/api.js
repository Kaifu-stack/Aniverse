import axios from 'axios'

// Backend Express API
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

// Attach JWT token to every request if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('aniverse_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercept 401 — token expired
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('aniverse_token')
      localStorage.removeItem('aniverse_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ─── Auth ────────────────────────────────────────────────────────────────────
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials)
export const registerUser = (userData) => apiClient.post('/auth/register', userData)
export const getProfile = () => apiClient.get('/auth/profile')

// ─── Favorites ───────────────────────────────────────────────────────────────
export const getFavorites = () => apiClient.get('/users/favorites')
export const addFavorite = (animeData) => apiClient.post('/users/favorites', animeData)
export const removeFavorite = (malId) => apiClient.delete(`/users/favorites/${malId}`)

// ─── Watchlist ───────────────────────────────────────────────────────────────
export const getWatchlist = () => apiClient.get('/users/watchlist')
export const addToWatchlist = (animeData) => apiClient.post('/users/watchlist', animeData)
export const removeFromWatchlist = (malId) => apiClient.delete(`/users/watchlist/${malId}`)
export const updateWatchStatus = (malId, status) =>
  apiClient.patch(`/users/watchlist/${malId}`, { status })

// ─── History ─────────────────────────────────────────────────────────────────
export const getHistory = () => apiClient.get('/users/history')
export const addToHistory = (animeData) => apiClient.post('/users/history', animeData)

export default apiClient
