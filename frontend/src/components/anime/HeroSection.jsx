import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlay, FiInfo, FiStar, FiCalendar, FiFilm } from 'react-icons/fi'
import { getTopAnime } from '../../services/jikanApi'

export default function HeroSection() {
  const [featured, setFeatured] = useState(null)
  const [featuredList, setFeaturedList] = useState([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTopAnime('bypopularity', 'movie')
      .then(({ data }) => {
        const movies = data.data?.filter((a) => a.images?.jpg?.large_image_url) || []
        setFeaturedList(movies.slice(0, 5))
        setFeatured(movies[0])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Auto-rotate hero
  useEffect(() => {
    if (!featuredList.length) return
    const t = setInterval(() => {
      setActiveIdx((i) => {
        const next = (i + 1) % featuredList.length
        setFeatured(featuredList[next])
        return next
      })
    }, 6000)
    return () => clearInterval(t)
  }, [featuredList])

  if (loading) {
    return (
      <div className="relative h-[70vh] sm:h-[80vh] hero-bg flex items-end">
        <div className="absolute inset-0 skeleton" style={{ borderRadius: 0 }} />
      </div>
    )
  }

  if (!featured) return null

  const title = featured.title_english || featured.title
  const bgImage = featured.images?.jpg?.large_image_url

  return (
    <section className="relative h-[70vh] sm:h-[85vh] overflow-hidden">
      {/* Background image with parallax feel */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${bgImage})`, filter: 'blur(0px)', transform: 'scale(1.05)' }}
      />

      {/* Layered overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-void/30 via-transparent to-void" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end pb-16 sm:pb-24 max-w-7xl mx-auto px-6">
        <div className="max-w-2xl animate-fade-up">
          {/* Label */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-6 bg-neon rounded-full animate-pulse-neon" />
            <span className="text-neonGlow text-sm font-semibold tracking-widest uppercase">Featured Movie</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-white leading-none tracking-wide mb-4 glow-text">
            {title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
            {featured.score && (
              <span className="flex items-center gap-1.5 text-gold font-semibold">
                <FiStar className="fill-gold" /> {featured.score.toFixed(1)}
              </span>
            )}
            {featured.aired?.prop?.from?.year && (
              <span className="flex items-center gap-1.5 text-muted">
                <FiCalendar className="w-3.5 h-3.5" /> {featured.aired.prop.from.year}
              </span>
            )}
            {featured.type && (
              <span className="flex items-center gap-1.5 text-muted">
                <FiFilm className="w-3.5 h-3.5" /> {featured.type}
              </span>
            )}
            {featured.genres?.slice(0, 3).map((g) => (
              <span key={g.mal_id} className="badge bg-neon/20 text-neonGlow border border-neon/30">{g.name}</span>
            ))}
          </div>

          {/* Synopsis */}
          <p className="text-muted text-sm sm:text-base leading-relaxed line-clamp-3 mb-8 max-w-lg">
            {featured.synopsis?.replace(/\[Written by MAL Rewrite\]/g, '') || 'No synopsis available.'}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link to={`/anime/${featured.mal_id}`} className="btn-primary flex items-center gap-2 text-sm">
              <FiPlay className="fill-white w-4 h-4" /> Watch Now
            </Link>
            <Link
              to={`/anime/${featured.mal_id}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm transition-all"
            >
              <FiInfo className="w-4 h-4" /> More Info
            </Link>
          </div>
        </div>

        {/* Thumbnail row */}
        <div className="absolute right-6 bottom-16 sm:bottom-24 hidden lg:flex flex-col gap-2">
          {featuredList.map((a, i) => (
            <button
              key={a.mal_id}
              onClick={() => { setFeatured(a); setActiveIdx(i) }}
              className={`w-14 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                i === activeIdx ? 'border-neon scale-110 shadow-lg shadow-neon/40' : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img src={a.images?.jpg?.image_url} alt={a.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Dot indicators — mobile */}
        <div className="flex items-center gap-2 mt-6 lg:hidden">
          {featuredList.map((_, i) => (
            <button
              key={i}
              onClick={() => { setFeatured(featuredList[i]); setActiveIdx(i) }}
              className={`rounded-full transition-all ${i === activeIdx ? 'w-6 h-2 bg-neon' : 'w-2 h-2 bg-subtle hover:bg-muted'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
