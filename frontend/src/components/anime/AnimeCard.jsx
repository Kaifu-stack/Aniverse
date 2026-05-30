import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiBookmark, FiStar, FiPlay } from 'react-icons/fi'
import { useAnime } from '../../context/AnimeContext'
import { useAuth } from '../../context/AuthContext'

/**
 * Reusable anime card component.
 * Shows poster, title, score, genre tags, and action buttons.
 */
export default function AnimeCard({ anime, size = 'md', showActions = true }) {
  const { isFavorited, toggleFavorite, isInWatchlist, toggleWatchlist } = useAnime()
  const { isLoggedIn } = useAuth()
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered] = useState(false)

  if (!anime) return null

  const malId = anime.mal_id || anime.malId
  const title = anime.title_english || anime.title
  const image = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || anime.image
  const score = anime.score
  const year = anime.aired?.prop?.from?.year || anime.year
  const genres = anime.genres?.slice(0, 2) || []

  const favorited = isFavorited(malId)
  const inWatchlist = isInWatchlist(malId)

  const cardSizes = {
    sm: 'w-36',
    md: 'w-44 sm:w-48',
    lg: 'w-52 sm:w-56',
  }

  return (
    <div
      className={`${cardSizes[size]} shrink-0 group relative`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Poster container */}
      <Link to={`/anime/${malId}`} className="block">
        <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-panel card-shine">
          {/* Image */}
          {!imgError ? (
            <img
              src={image}
              alt={title}
              loading="lazy"
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? 'scale-105' : 'scale-100'}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface text-subtle text-xs text-center p-2">
              {title}
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 card-overlay" />

          {/* Score badge */}
          {score && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-void/80 backdrop-blur-sm rounded-md px-2 py-0.5">
              <FiStar className="w-3 h-3 text-gold fill-gold" />
              <span className="text-xs font-semibold text-gold">{score.toFixed(1)}</span>
            </div>
          )}

          {/* Type badge */}
          {anime.type && (
            <div className="absolute top-2 right-2 bg-neon/90 text-white text-xs font-bold px-2 py-0.5 rounded-md">
              {anime.type}
            </div>
          )}

          {/* Play button on hover */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-12 h-12 rounded-full bg-neon/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-neon/40">
              <FiPlay className="w-5 h-5 text-white fill-white translate-x-0.5" />
            </div>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1.5">
                {genres.map((g) => (
                  <span key={g.mal_id} className="badge bg-neon/20 text-neonGlow border border-neon/20 text-[10px]">
                    {g.name}
                  </span>
                ))}
              </div>
            )}
            {year && <p className="text-subtle text-[10px]">{year}</p>}
          </div>
        </div>
      </Link>

      {/* Title */}
      <div className="mt-2 px-1">
        <Link to={`/anime/${malId}`}>
          <h3 className="text-sm font-semibold text-text leading-snug line-clamp-2 hover:text-neonGlow transition-colors">
            {title}
          </h3>
        </Link>
      </div>

      {/* Action buttons — shown on hover */}
      {showActions && (
        <div className={`absolute top-10 right-2 flex flex-col gap-1.5 transition-all duration-300 ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          <button
            onClick={(e) => { e.preventDefault(); toggleFavorite(anime) }}
            title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-1.5 rounded-lg backdrop-blur-sm border transition-all ${
              favorited
                ? 'bg-rose/90 border-rose/50 text-white'
                : 'bg-void/80 border-border/50 text-muted hover:text-rose hover:border-rose/50'
            }`}
          >
            <FiHeart className={`w-3.5 h-3.5 ${favorited ? 'fill-white' : ''}`} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); toggleWatchlist(anime) }}
            title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            className={`p-1.5 rounded-lg backdrop-blur-sm border transition-all ${
              inWatchlist
                ? 'bg-cyan/90 border-cyan/50 text-white'
                : 'bg-void/80 border-border/50 text-muted hover:text-cyanBright hover:border-cyan/50'
            }`}
          >
            <FiBookmark className={`w-3.5 h-3.5 ${inWatchlist ? 'fill-white' : ''}`} />
          </button>
        </div>
      )}
    </div>
  )
}
