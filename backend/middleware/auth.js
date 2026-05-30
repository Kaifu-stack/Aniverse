const jwt = require('jsonwebtoken')
const User = require('../models/User')

/**
 * Middleware to protect routes.
 * Verifies JWT from Authorization header.
 */
const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // Attach user to request (without password)
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists' })
    }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = { protect }
