import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiSearch, FiHeart, FiBookmark, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useDebounce } from '../../hooks/useDebounce'
import { searchAnime } from '../../services/jikanApi'

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loadingSugg, setLoadingSugg] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const searchRef = useRef(null)
  const debouncedQuery = useDebounce(query, 350)

  // Scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
    setQuery('')
  }, [location.pathname])

  // Search suggestions
  useEffect(() => {
    if (debouncedQuery.length < 2) { setSuggestions([]); return }
    setLoadingSugg(true)
    searchAnime(debouncedQuery, 1)
      .then(({ data }) => setSuggestions(data.data?.slice(0, 6) || []))
      .catch(() => setSuggestions([]))
      .finally(() => setLoadingSugg(false))
  }, [debouncedQuery])

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!searchRef.current?.contains(e.target)) setSuggestions([])
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    setSuggestions([])
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-deep/95 backdrop-blur-md border-b border-border/60 shadow-xl shadow-void' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <span className="font-display text-3xl tracking-widest text-white group-hover:glow-text transition-all">
            ANI<span className="text-neonGlow">VERSE</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/search?type=movie">Movies</NavLink>
          <NavLink to="/search?filter=airing">Trending</NavLink>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div ref={searchRef} className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative">
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search anime..."
                    className="input-base w-56 sm:w-72 text-sm pr-10"
                  />
                  <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle w-4 h-4" />
                  {/* Suggestions dropdown */}
                  {suggestions.length > 0 && (
                    <div className="absolute top-full mt-2 left-0 right-0 bg-panel border border-border rounded-xl overflow-hidden shadow-2xl shadow-void z-50">
                      {loadingSugg && (
                        <div className="px-4 py-2 text-subtle text-sm">Searching...</div>
                      )}
                      {suggestions.map((anime) => (
                        <button
                          key={anime.mal_id}
                          type="button"
                          onClick={() => {
                            navigate(`/anime/${anime.mal_id}`)
                            setSuggestions([])
                            setSearchOpen(false)
                            setQuery('')
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neon/10 transition-colors text-left group"
                        >
                          <img
                            src={anime.images?.jpg?.small_image_url}
                            alt={anime.title}
                            className="w-8 h-10 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-text truncate group-hover:text-neonGlow transition-colors">
                              {anime.title_english || anime.title}
                            </p>
                            <p className="text-xs text-subtle">
                              {anime.type} • {anime.aired?.prop?.from?.year || '—'}
                            </p>
                          </div>
                          {anime.score && (
                            <span className="text-xs text-gold font-semibold shrink-0">★ {anime.score}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setQuery(''); setSuggestions([]) }}
                  className="btn-icon p-2"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="btn-icon" title="Search">
                <FiSearch className="w-4 h-4" />
              </button>
            )}
          </div>

          {isLoggedIn ? (
            <>
              <Link to="/favorites" className="btn-icon hidden sm:flex" title="Favorites">
                <FiHeart className="w-4 h-4" />
              </Link>
              <Link to="/watchlist" className="btn-icon hidden sm:flex" title="Watchlist">
                <FiBookmark className="w-4 h-4" />
              </Link>
              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:border-neon/50 bg-panel/80 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon to-cyan flex items-center justify-center text-white text-xs font-bold">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-text">{user?.username}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-panel border border-border rounded-xl overflow-hidden shadow-2xl shadow-void z-50 animate-slide-in">
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-neon/10 text-sm text-text transition-colors">
                      <FiUser className="w-4 h-4 text-neonGlow" /> Profile
                    </Link>
                    <Link to="/favorites" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-neon/10 text-sm text-text transition-colors">
                      <FiHeart className="w-4 h-4 text-rose" /> Favorites
                    </Link>
                    <Link to="/watchlist" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-neon/10 text-sm text-text transition-colors">
                      <FiBookmark className="w-4 h-4 text-cyan-400" /> Watchlist
                    </Link>
                    <div className="border-t border-border" />
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rose/10 text-sm text-rose transition-colors"
                    >
                      <FiLogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-sm py-1.5 px-4">Login</Link>
              <Link to="/signup" className="btn-primary text-sm py-1.5 px-4">Sign Up</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden btn-icon"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-deep border-t border-border px-4 py-4 flex flex-col gap-3 animate-fade-in">
          <MobileLink to="/" onClick={() => setMobileOpen(false)}>Home</MobileLink>
          <MobileLink to="/search?type=movie" onClick={() => setMobileOpen(false)}>Movies</MobileLink>
          <MobileLink to="/search?filter=airing" onClick={() => setMobileOpen(false)}>Trending</MobileLink>
          {isLoggedIn ? (
            <>
              <MobileLink to="/favorites" onClick={() => setMobileOpen(false)}>Favorites</MobileLink>
              <MobileLink to="/watchlist" onClick={() => setMobileOpen(false)}>Watchlist</MobileLink>
              <MobileLink to="/profile" onClick={() => setMobileOpen(false)}>Profile</MobileLink>
              <button onClick={() => { logout(); setMobileOpen(false) }}
                className="text-left text-rose font-medium py-2 border-t border-border mt-1">
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-3 pt-2 border-t border-border">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-ghost flex-1 text-center text-sm">Login</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 text-center text-sm">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

function NavLink({ to, children }) {
  const location = useLocation()
  const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to.split('?')[0]))
  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors relative group ${active ? 'text-neonGlow' : 'text-muted hover:text-text'}`}
    >
      {children}
      <span className={`absolute -bottom-1 left-0 h-px bg-neon transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
    </Link>
  )
}

function MobileLink({ to, children, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="text-text font-medium py-2 hover:text-neonGlow transition-colors">
      {children}
    </Link>
  )
}
