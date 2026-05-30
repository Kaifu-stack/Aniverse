require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const connectDB = require('./config/database')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const errorHandler = require('./middleware/errorHandler')

// ─── App setup ───────────────────────────────────────────────────────────────
const app = express()
const PORT = process.env.PORT || 5000

// ─── Security middleware ──────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

// ─── Rate limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api', limiter)

// Auth routes get stricter limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many auth attempts, please wait 15 minutes.' },
})
app.use('/api/auth', authLimiter)

// ─── Body parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))

// ─── Logging ─────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'))
}

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV })
})

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

// ─── Global error handler ────────────────────────────────────────────────────
app.use(errorHandler)

// ─── Start ────────────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`🚀 AniVerse API running on http://localhost:${PORT}`)
    console.log(`   Environment: ${process.env.NODE_ENV}`)
  })
}

start()

module.exports = app
