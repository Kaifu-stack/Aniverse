import AnimeCard from './AnimeCard'
import SkeletonCard from '../ui/SkeletonCard'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'

export default function AnimeGrid({ anime, loading, hasMore, onLoadMore, title }) {
  const sentinelRef = useInfiniteScroll(onLoadMore, hasMore && !loading)

  return (
    <section>
      {title && (
        <h2 className="font-display text-2xl sm:text-3xl text-white tracking-wide mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {anime.map((a, i) => (
          <div key={`${a.mal_id}-${i}`} className="animate-fade-up" style={{ animationDelay: `${(i % 12) * 40}ms`, opacity: 0 }}>
            <AnimeCard anime={a} size="md" />
          </div>
        ))}
        {loading && Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-4 mt-4" />

      {!hasMore && anime.length > 0 && (
        <p className="text-center text-subtle text-sm py-8">You've reached the end!</p>
      )}
    </section>
  )
}
