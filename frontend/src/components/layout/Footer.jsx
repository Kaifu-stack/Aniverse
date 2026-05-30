import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-deep border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <span className="font-display text-3xl tracking-widest text-white">
              ANI<span className="text-neonGlow">VERSE</span>
            </span>
            <p className="text-muted text-sm mt-3 leading-relaxed">
              Your universe for discovering the best anime — from timeless classics to the latest hits.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="btn-icon"><FiGithub className="w-4 h-4" /></a>
              <a href="#" className="btn-icon"><FiTwitter className="w-4 h-4" /></a>
              <a href="#" className="btn-icon"><FiInstagram className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-text font-semibold mb-4 text-sm tracking-wider uppercase">Explore</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'Movies', to: '/search?type=movie' },
                { label: 'Trending', to: '/search?filter=airing' },
                { label: 'Search', to: '/search' },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-muted text-sm hover:text-neonGlow transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-text font-semibold mb-4 text-sm tracking-wider uppercase">Account</h4>
            <ul className="space-y-2">
              {[
                { label: 'Login', to: '/login' },
                { label: 'Sign Up', to: '/signup' },
                { label: 'Profile', to: '/profile' },
                { label: 'Favorites', to: '/favorites' },
                { label: 'Watchlist', to: '/watchlist' },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-muted text-sm hover:text-neonGlow transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Powered by */}
          <div>
            <h4 className="text-text font-semibold mb-4 text-sm tracking-wider uppercase">Powered By</h4>
            <ul className="space-y-2">
              <li><a href="https://jikan.moe" target="_blank" rel="noreferrer" className="text-muted text-sm hover:text-neonGlow transition-colors">Jikan API</a></li>
              <li><a href="https://myanimelist.net" target="_blank" rel="noreferrer" className="text-muted text-sm hover:text-neonGlow transition-colors">MyAnimeList</a></li>
              <li><a href="https://reactjs.org" target="_blank" rel="noreferrer" className="text-muted text-sm hover:text-neonGlow transition-colors">React</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-subtle text-sm">
            © {new Date().getFullYear()} AniVerse • Crafted by Md Kaif Alam
          </p>
          <p className="text-subtle text-xs">Data provided by <a href="https://jikan.moe" target="_blank" rel="noreferrer" className="text-muted hover:text-neonGlow">Jikan / MyAnimeList</a></p>
        </div>
      </div>
    </footer>
  )
}
