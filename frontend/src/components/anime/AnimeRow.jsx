import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import AnimeCard from './AnimeCard'
import SkeletonCard from '../ui/SkeletonCard'

export default function AnimeRow({ title, anime = [], loading = false, viewAllLink, cardSize = 'md' }) {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  return (
    <section className="mb-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <h2 className="font-display text-2xl sm:text-3xl text-white tracking-wide">{title}</h2>
          <span className="section-line max-w-20 hidden sm:block" />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} className="btn-icon hidden sm:flex" aria-label="Scroll left">
            <FiChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll(1)} className="btn-icon hidden sm:flex" aria-label="Scroll right">
            <FiChevronRight className="w-4 h-4" />
          </button>
          {viewAllLink && (
            <Link to={viewAllLink} className="text-sm text-neonGlow hover:text-neonBright font-medium transition-colors ml-1">
              View All →
            </Link>
          )}
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none' }}
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : anime.map((a, i) => (
              <div
                key={`${a.mal_id}-${i}`}
                className="animate-fade-up shrink-0"
                style={{ animationDelay: `${i * 50}ms`, opacity: 0 }}
              >
                <AnimeCard anime={a} size={cardSize} />
              </div>
            ))}
      </div>
    </section>
  )
}
