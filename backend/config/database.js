const mongoose = require('mongoose')

/**
 * Connect to MongoDB.
 * Exits process on failure in production.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  }
}

module.exports = connectDB

//XpUeWJ04IP2gv3CY db passsword