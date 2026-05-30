const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const {
  getFavorites, addFavorite, removeFavorite,
  getWatchlist, addToWatchlist, removeFromWatchlist, updateWatchStatus,
  getHistory, addToHistory,
} = require('../controllers/userController')

// All user routes are protected
router.use(protect)

// ─── Favorites ────────────────────────────────────────────────────────────────
router.get('/favorites', getFavorites)
router.post('/favorites', addFavorite)
router.delete('/favorites/:malId', removeFavorite)

// ─── Watchlist ────────────────────────────────────────────────────────────────
router.get('/watchlist', getWatchlist)
router.post('/watchlist', addToWatchlist)
router.delete('/watchlist/:malId', removeFromWatchlist)
router.patch('/watchlist/:malId', updateWatchStatus)

// ─── History ─────────────────────────────────────────────────────────────────
router.get('/history', getHistory)
router.post('/history', addToHistory)

module.exports = router
