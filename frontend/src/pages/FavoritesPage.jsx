import { Link } from 'react-router-dom'
import { FiHeart, FiTrash2 } from 'react-icons/fi'
import { useAnime } from '../context/AnimeContext'
import AnimeCard from '../components/anime/AnimeCard'

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useAnime()

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-center gap-4 mb-8">
        <FiHeart className="w-7 h-7 text-rose fill-rose" />
        <div>
          <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide">My Favorites</h1>
          <p className="text-muted text-sm mt-1">{favorites.length} anime saved</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
          <FiHeart className="w-16 h-16 text-subtle" />
          <h3 className="text-xl font-semibold text-text">No favorites yet</h3>
          <p className="text-muted">Browse anime and hit the heart button to save your favorites</p>
          <Link to="/" className="btn-primary mt-2">Explore Anime</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {favorites.map((anime) => (
            <div key={anime.malId} className="relative group">
              {/* Use minimal data to render card */}
              <AnimeCard
                anime={{
                  mal_id: anime.malId,
                  title: anime.title,
                  title_english: anime.title,
                  images: { jpg: { large_image_url: anime.image, image_url: anime.image } },
                  score: anime.score,
                  type: anime.type,
                  episodes: anime.episodes,
                }}
                size="md"
              />
              <button
                onClick={() => toggleFavorite({ mal_id: anime.malId })}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose/80 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-rose"
                title="Remove"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
