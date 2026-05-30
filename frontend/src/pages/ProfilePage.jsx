import { Link } from 'react-router-dom'
import { FiHeart, FiBookmark, FiClock, FiSettings, FiUser } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useAnime } from '../context/AnimeContext'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { favorites, watchlist, history } = useAnime()

  const stats = [
    { label: 'Favorites', value: favorites.length, icon: <FiHeart className="text-rose" />, link: '/favorites' },
    { label: 'Watchlist', value: watchlist.length, icon: <FiBookmark className="text-cyanBright" />, link: '/watchlist' },
    { label: 'Viewed', value: history.length, icon: <FiClock className="text-neonGlow" />, link: '#' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Profile header */}
      <div className="glass rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-neon/10 via-transparent to-transparent" />
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon to-cyan flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-neon/30 font-display">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="font-display text-4xl text-white tracking-wide">{user?.username}</h1>
            <p className="text-muted text-sm mt-1">{user?.email}</p>
            <p className="text-subtle text-xs mt-1">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} to={s.link} className="glass rounded-xl p-5 text-center hover:border-neon/40 transition-all group">
            <div className="flex justify-center mb-2 text-xl">{s.icon}</div>
            <p className="font-display text-4xl text-white group-hover:text-neonGlow transition-colors">{s.value}</p>
            <p className="text-muted text-xs mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Recently viewed */}
      {history.length > 0 && (
        <div className="glass rounded-2xl p-6 mb-6">
          <h2 className="font-semibold text-text mb-4 flex items-center gap-2">
            <FiClock className="text-neonGlow" /> Recently Viewed
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {history.slice(0, 8).map((a) => (
              <Link key={a.malId} to={`/anime/${a.malId}`} className="shrink-0 group">
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-16 h-22 object-cover rounded-lg border-2 border-transparent group-hover:border-neon transition-all"
                  style={{ height: '88px' }}
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold text-text mb-4 flex items-center gap-2">
          <FiSettings /> Account
        </h2>
        <div className="space-y-2">
          <Link to="/favorites" className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-neon/10 transition-colors">
            <span className="flex items-center gap-3 text-sm text-text"><FiHeart className="text-rose" /> My Favorites</span>
            <span className="text-muted text-xs">{favorites.length} saved →</span>
          </Link>
          <Link to="/watchlist" className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-neon/10 transition-colors">
            <span className="flex items-center gap-3 text-sm text-text"><FiBookmark className="text-cyanBright" /> My Watchlist</span>
            <span className="text-muted text-xs">{watchlist.length} anime →</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-rose/10 transition-colors text-sm text-rose text-left"
          >
            Logout from AniVerse
          </button>
        </div>
      </div>
    </div>
  )
}
