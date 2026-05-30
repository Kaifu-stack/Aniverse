import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await signup({ username: form.username, email: form.email, password: form.password })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(124,58,237,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/">
            <span className="font-display text-5xl tracking-widest text-white glow-text">
              ANI<span className="text-neonGlow">VERSE</span>
            </span>
          </Link>
          <p className="text-muted text-sm mt-2">Join the anime universe</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl shadow-void neon-border">
          <h2 className="text-xl font-bold text-text mb-6">Create your account</h2>

          {error && (
            <div className="bg-rose/10 border border-rose/30 text-rose text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Username</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle w-4 h-4" />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  placeholder="your_username"
                  className="input-base w-full pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="input-base w-full pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle w-4 h-4" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Min 6 characters"
                  className="input-base w-full pl-10 pr-10"
                />
                <button type="button" onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-subtle hover:text-text transition-colors">
                  {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle w-4 h-4" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Repeat password"
                  className="input-base w-full pl-10"
                />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 flex items-center gap-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-muted text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-neonGlow hover:text-neonBright font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
