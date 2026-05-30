import { Link } from 'react-router-dom'
import { FiBookmark, FiTrash2, FiCheck } from 'react-icons/fi'
import { useAnime } from '../context/AnimeContext'
import { updateWatchStatus } from '../services/api'
import toast from 'react-hot-toast'
import AnimeCard from '../components/anime/AnimeCard'

const STATUS_OPTIONS = ['plan_to_watch', 'watching', 'completed', 'on_hold', 'dropped']
const STATUS_LABELS = {
  plan_to_watch: 'Plan to Watch',
  watching: 'Watching',
  completed: 'Completed',
  on_hold: 'On Hold',
  dropped: 'Dropped',
}
const STATUS_COLORS = {
  plan_to_watch: 'text-cyan-400 border-cyan/40 bg-cyan/10',
  watching: 'text-green-400 border-green-500/40 bg-green-500/10',
  completed: 'text-neonGlow border-neon/40 bg-neon/10',
  on_hold: 'text-gold border-gold/40 bg-gold/10',
  dropped: 'text-rose border-rose/40 bg-rose/10',
}

export default function WatchlistPage() {
  const { watchlist, toggleWatchlist } = useAnime()

  const handleStatusChange = async (malId, status) => {
    try {
      await updateWatchStatus(malId, status)
      toast.success(`Status updated to "${STATUS_LABELS[status]}"`)
    } catch {
      toast.error('Failed to update status')
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-center gap-4 mb-8">
        <FiBookmark className="w-7 h-7 text-cyanBright fill-cyanBright" />
        <div>
          <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide">My Watchlist</h1>
          <p className="text-muted text-sm mt-1">{watchlist.length} anime in list</p>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
          <FiBookmark className="w-16 h-16 text-subtle" />
          <h3 className="text-xl font-semibold text-text">Your watchlist is empty</h3>
          <p className="text-muted">Add anime to track what you plan to watch next</p>
          <Link to="/" className="btn-primary mt-2">Explore Anime</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {watchlist.map((anime) => (
            <div key={anime.malId}
              className="glass rounded-xl p-4 flex items-center gap-4 hover:border-neon/30 transition-all group">
              {/* Poster */}
              <Link to={`/anime/${anime.malId}`} className="shrink-0">
                <img
                  src={anime.image}
                  alt={anime.title}
                  className="w-14 h-20 object-cover rounded-lg"
                />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link to={`/anime/${anime.malId}`}>
                  <h3 className="font-semibold text-text hover:text-neonGlow transition-colors line-clamp-1 mb-1">
                    {anime.title}
                  </h3>
                </Link>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  {anime.type && <span className="badge bg-subtle/20 text-subtle">{anime.type}</span>}
                  {anime.episodes && <span>{anime.episodes} eps</span>}
                  {anime.score && <span className="text-gold">★ {anime.score}</span>}
                </div>
              </div>

              {/* Status selector */}
              <select
                defaultValue={anime.watchStatus || 'plan_to_watch'}
                onChange={(e) => handleStatusChange(anime.malId, e.target.value)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border bg-transparent cursor-pointer transition-all
                  ${STATUS_COLORS[anime.watchStatus || 'plan_to_watch']}`}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="bg-panel text-text">{STATUS_LABELS[s]}</option>
                ))}
              </select>

              {/* Remove */}
              <button
                onClick={() => toggleWatchlist({ mal_id: anime.malId })}
                className="btn-icon opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove from watchlist"
              >
                <FiTrash2 className="w-4 h-4 text-rose" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
