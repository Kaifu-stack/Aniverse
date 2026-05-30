import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  getFavorites, addFavorite, removeFavorite,
  getWatchlist, addToWatchlist, removeFromWatchlist, updateWatchStatus,
  getHistory, addToHistory,
} from '../services/api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const AnimeContext = createContext(null)

export function AnimeProvider({ children }) {
  const { isLoggedIn } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [history, setHistory] = useState([])
  const [loadingFav, setLoadingFav] = useState(false)

  // Load user data when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchFavorites()
      fetchWatchlist()
      fetchHistory()
    } else {
      setFavorites([])
      setWatchlist([])
      setHistory([])
    }
  }, [isLoggedIn])

  const fetchFavorites = async () => {
    try {
      const { data } = await getFavorites()
      setFavorites(data.favorites || [])
    } catch (_) {}
  }

  const fetchWatchlist = async () => {
    try {
      const { data } = await getWatchlist()
      setWatchlist(data.watchlist || [])
    } catch (_) {}
  }

  const fetchHistory = async () => {
    try {
      const { data } = await getHistory()
      setHistory(data.history || [])
    } catch (_) {}
  }

  // ─── Favorites ──────────────────────────────────────────────────────────────
  const isFavorited = useCallback(
    (malId) => favorites.some((f) => f.malId === malId),
    [favorites]
  )

  const toggleFavorite = useCallback(
    async (anime) => {
      if (!isLoggedIn) {
        toast.error('Please login to save favorites')
        return
      }
      const malId = anime.mal_id
      if (isFavorited(malId)) {
        setFavorites((prev) => prev.filter((f) => f.malId !== malId))
        try {
          await removeFavorite(malId)
          toast.success('Removed from favorites')
        } catch (_) {
          setFavorites((prev) => [...prev, buildAnimeRef(anime)])
          toast.error('Failed to remove')
        }
      } else {
        const ref = buildAnimeRef(anime)
        setFavorites((prev) => [ref, ...prev])
        try {
          await addFavorite(ref)
          toast.success('Added to favorites!')
        } catch (_) {
          setFavorites((prev) => prev.filter((f) => f.malId !== malId))
          toast.error('Failed to add')
        }
      }
    },
    [isLoggedIn, isFavorited]
  )

  // ─── Watchlist ───────────────────────────────────────────────────────────────
  const isInWatchlist = useCallback(
    (malId) => watchlist.some((w) => w.malId === malId),
    [watchlist]
  )

  const toggleWatchlist = useCallback(
    async (anime) => {
      if (!isLoggedIn) {
        toast.error('Please login to use watchlist')
        return
      }
      const malId = anime.mal_id
      if (isInWatchlist(malId)) {
        setWatchlist((prev) => prev.filter((w) => w.malId !== malId))
        try {
          await removeFromWatchlist(malId)
          toast.success('Removed from watchlist')
        } catch (_) {
          fetchWatchlist()
        }
      } else {
        const ref = buildAnimeRef(anime)
        setWatchlist((prev) => [ref, ...prev])
        try {
          await addToWatchlist(ref)
          toast.success('Added to watchlist!')
        } catch (_) {
          fetchWatchlist()
        }
      }
    },
    [isLoggedIn, isInWatchlist]
  )

  // ─── History ─────────────────────────────────────────────────────────────────
  const recordView = useCallback(
    async (anime) => {
      if (!isLoggedIn) return
      const ref = buildAnimeRef(anime)
      // Optimistic update — deduplicate
      setHistory((prev) => [ref, ...prev.filter((h) => h.malId !== ref.malId)].slice(0, 50))
      try {
        await addToHistory(ref)
      } catch (_) {}
    },
    [isLoggedIn]
  )

  return (
    <AnimeContext.Provider
      value={{
        favorites, watchlist, history,
        isFavorited, toggleFavorite,
        isInWatchlist, toggleWatchlist,
        recordView, fetchFavorites, fetchWatchlist,
      }}
    >
      {children}
    </AnimeContext.Provider>
  )
}

export const useAnime = () => {
  const ctx = useContext(AnimeContext)
  if (!ctx) throw new Error('useAnime must be used within AnimeProvider')
  return ctx
}

// Build a lightweight anime reference object for storage
function buildAnimeRef(anime) {
  return {
    malId: anime.mal_id,
    title: anime.title_english || anime.title,
    titleJapanese: anime.title,
    image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
    score: anime.score,
    type: anime.type,
    episodes: anime.episodes,
    status: anime.status,
    addedAt: new Date().toISOString(),
  }
}
