const User = require('../models/User')

// ─── Favorites ────────────────────────────────────────────────────────────────

exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('favorites')
    res.json({ favorites: user.favorites })
  } catch (err) { next(err) }
}

exports.addFavorite = async (req, res, next) => {
  try {
    const { malId } = req.body
    if (!malId) return res.status(400).json({ message: 'malId is required' })

    // Avoid duplicates
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { favorites: req.body },
      },
      { new: true, runValidators: false }
    ).select('favorites')

    res.json({ favorites: user.favorites })
  } catch (err) { next(err) }
}

exports.removeFavorite = async (req, res, next) => {
  try {
    const malId = Number(req.params.malId)
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favorites: { malId } } },
      { new: true }
    ).select('favorites')
    res.json({ favorites: user.favorites })
  } catch (err) { next(err) }
}

// ─── Watchlist ────────────────────────────────────────────────────────────────

exports.getWatchlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('watchlist')
    res.json({ watchlist: user.watchlist })
  } catch (err) { next(err) }
}

exports.addToWatchlist = async (req, res, next) => {
  try {
    const { malId } = req.body
    if (!malId) return res.status(400).json({ message: 'malId is required' })

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { watchlist: req.body } },
      { new: true, runValidators: false }
    ).select('watchlist')

    res.json({ watchlist: user.watchlist })
  } catch (err) { next(err) }
}

exports.removeFromWatchlist = async (req, res, next) => {
  try {
    const malId = Number(req.params.malId)
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { watchlist: { malId } } },
      { new: true }
    ).select('watchlist')
    res.json({ watchlist: user.watchlist })
  } catch (err) { next(err) }
}

exports.updateWatchStatus = async (req, res, next) => {
  try {
    const malId = Number(req.params.malId)
    const { status } = req.body

    const validStatuses = ['plan_to_watch', 'watching', 'completed', 'on_hold', 'dropped']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user._id, 'watchlist.malId': malId },
      { $set: { 'watchlist.$.watchStatus': status } },
      { new: true }
    ).select('watchlist')

    if (!user) return res.status(404).json({ message: 'Anime not in watchlist' })
    res.json({ watchlist: user.watchlist })
  } catch (err) { next(err) }
}

// ─── History ──────────────────────────────────────────────────────────────────

exports.getHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('history')
    res.json({ history: user.history })
  } catch (err) { next(err) }
}

exports.addToHistory = async (req, res, next) => {
  try {
    const { malId } = req.body
    if (!malId) return res.status(400).json({ message: 'malId is required' })

    // Remove existing entry with same malId, then push new one at front
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { history: { malId: Number(malId) } },
    })

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          history: {
            $each: [{ ...req.body, addedAt: new Date() }],
            $position: 0,
            $slice: 50, // Keep last 50 items
          },
        },
      },
      { new: true, runValidators: false }
    ).select('history')

    res.json({ history: user.history })
  } catch (err) { next(err) }
}
