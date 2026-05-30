const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Lightweight anime reference — stored in favorites/watchlist/history arrays
const animeRefSchema = new mongoose.Schema(
  {
    malId: { type: Number, required: true },
    title: { type: String, required: true },
    titleJapanese: String,
    image: String,
    score: Number,
    type: String,
    episodes: Number,
    status: String,
    watchStatus: {
      type: String,
      enum: ['plan_to_watch', 'watching', 'completed', 'on_hold', 'dropped'],
      default: 'plan_to_watch',
    },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include in queries by default
    },
    avatar: { type: String, default: '' },
    favorites: { type: [animeRefSchema], default: [] },
    watchlist: { type: [animeRefSchema], default: [] },
    history: { type: [animeRefSchema], default: [] },
  },
  { timestamps: true }
)

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare entered password with hashed
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

// Sanitize user for API response
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

module.exports = mongoose.model('User', userSchema)
