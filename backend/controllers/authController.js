const jwt = require('jsonwebtoken')
const User = require('../models/User')

/** Generate a signed JWT for a user */
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

// ─── Register ────────────────────────────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Check duplicates
    const existing = await User.findOne({ $or: [{ email }, { username }] })
    if (existing) {
      const field = existing.email === email ? 'Email' : 'Username'
      return res.status(400).json({ message: `${field} already in use` })
    }

    const user = await User.create({ username, email, password })
    const token = signToken(user._id)

    res.status(201).json({ token, user })
  } catch (err) {
    next(err)
  }
}

// ─── Login ───────────────────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Include password for comparison
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = signToken(user._id)
    res.json({ token, user })
  } catch (err) {
    next(err)
  }
}

// ─── Get Profile ─────────────────────────────────────────────────────────────
exports.getProfile = async (req, res, next) => {
  try {
    res.json({ user: req.user })
  } catch (err) {
    next(err)
  }
}
