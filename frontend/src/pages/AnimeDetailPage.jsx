import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FiStar, FiCalendar, FiClock, FiHeart, FiBookmark,
  FiExternalLink, FiFilm, FiTv, FiChevronDown, FiChevronUp
} from 'react-icons/fi'
import YouTube from 'react-youtube'
import {
  getAnimeById, getAnimeCharacters, getAnimeRecommendations
} from '../services/jikanApi'
import { useAnime } from '../context/AnimeContext'
import AnimeRow from '../components/anime/AnimeRow'

export default function AnimeDetailPage() {
  const { id } = useParams()
  const { isFavorited, toggleFavorite, isInWatchlist, toggleWatchlist, recordView } = useAnime()

  const [anime, setAnime] = useState(null)
  const [characters, setCharacters] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [synopsisExpanded, setSynopsisExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('overview') // overview | characters | recommendations

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    setAnime(null)
    setCharacters([])
    setRecommendations([])

    getAnimeById(id)
      .then(({ data }) => {
        setAnime(data.data)
        recordView(data.data)
      })
      .catch((e) => setError(e.message || 'Failed to load anime'))
      .finally(() => setLoading(false))

    // Load supplementary data slightly after
    setTimeout(() => {
      getAnimeCharacters(id).then(({ data }) => setCharacters(data.data?.slice(0, 12) || []))
    }, 500)

    setTimeout(() => {
      getAnimeRecommendations(id).then(({ data }) => {
        const recs = data.data?.slice(0, 12).map((r) => r.entry) || []
        setRecommendations(recs)
      })
    }, 1000)
  }, [id])

  if (loading) return <AnimeDetailSkeleton />
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl mb-2">😵</p>
        <p className="text-rose mb-4">{error}</p>
        <Link to="/" className="btn-ghost">Go Home</Link>
      </div>
    </div>
  )
  if (!anime) return null

  const title = anime.title_english || anime.title
  const banner = anime.images?.jpg?.large_image_url
  const trailer = anime.trailer?.youtube_id
  const synopsis = anime.synopsis?.replace(/\[Written by MAL Rewrite\]/g, '').trim()
  const favorited = isFavorited(anime.mal_id)
  const inWatchlist = isInWatchlist(anime.mal_id)

  const TABS = ['overview', 'characters', 'recommendations']

  return (
    <div className="min-h-screen pb-24">
      {/* Banner */}
      <div className="relative h-80 sm:h-[50vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner})`, filter: 'blur(2px)', transform: 'scale(1.05)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/80 to-transparent" />
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster */}
          <div className="shrink-0 w-44 sm:w-52 mx-auto md:mx-0">
            <img
              src={banner}
              alt={title}
              className="w-full rounded-2xl shadow-2xl shadow-void border border-border/50"
            />
            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => toggleFavorite(anime)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border font-semibold text-sm transition-all ${
                  favorited
                    ? 'bg-rose/20 border-rose text-rose'
                    : 'border-border text-muted hover:border-rose/50 hover:text-rose'
                }`}
              >
                <FiHeart className={favorited ? 'fill-rose' : ''} /> {favorited ? 'Saved' : 'Favorite'}
              </button>
              <button
                onClick={() => toggleWatchlist(anime)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border font-semibold text-sm transition-all ${
                  inWatchlist
                    ? 'bg-cyan/20 border-cyan text-cyanBright'
                    : 'border-border text-muted hover:border-cyan/50 hover:text-cyanBright'
                }`}
              >
                <FiBookmark className={inWatchlist ? 'fill-cyanBright' : ''} /> {inWatchlist ? 'Listed' : 'Watchlist'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-4 md:pt-12">
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-3">
              {anime.genres?.map((g) => (
                <Link key={g.mal_id} to={`/search?genre=${g.mal_id}`}
                  className="badge bg-neon/15 text-neonGlow border border-neon/25 hover:bg-neon/25 transition-colors">
                  {g.name}
                </Link>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl sm:text-6xl text-white tracking-wide leading-none mb-2">
              {title}
            </h1>
            {title !== anime.title && (
              <p className="text-muted text-sm mb-4">{anime.title}</p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-5 text-sm">
              {anime.score && (
                <StatBadge icon={<FiStar className="text-gold fill-gold" />} value={anime.score.toFixed(1)} label="Score" gold />
              )}
              {anime.rank && <StatBadge value={`#${anime.rank}`} label="Rank" />}
              {anime.members && <StatBadge value={anime.members.toLocaleString()} label="Members" />}
              <StatBadge icon={<FiCalendar className="w-3.5 h-3.5" />} value={anime.aired?.string || '—'} label="Aired" />
              {anime.duration && <StatBadge icon={<FiClock className="w-3.5 h-3.5" />} value={anime.duration} label="Duration" />}
              {anime.episodes && <StatBadge icon={<FiTv className="w-3.5 h-3.5" />} value={anime.episodes} label="Episodes" />}
              <StatBadge icon={<FiFilm className="w-3.5 h-3.5" />} value={anime.type} label="Type" />
              {anime.status && (
                <span className={`badge border ${
                  anime.status === 'Currently Airing' ? 'bg-green-500/20 border-green-500/40 text-green-400' :
                  anime.status === 'Finished Airing' ? 'bg-subtle/30 border-subtle/50 text-muted' :
                  'bg-gold/20 border-gold/40 text-gold'
                }`}>{anime.status}</span>
              )}
            </div>

            {/* Studios */}
            {anime.studios?.length > 0 && (
              <p className="text-sm text-muted mb-4">
                <span className="text-subtle">Studio:</span>{' '}
                {anime.studios.map((s, i) => (
                  <span key={s.mal_id}>{s.name}{i < anime.studios.length - 1 ? ', ' : ''}</span>
                ))}
              </p>
            )}

            {/* Synopsis */}
            {synopsis && (
              <div className="glass rounded-xl p-4 mb-4">
                <p className={`text-muted text-sm leading-relaxed ${!synopsisExpanded ? 'line-clamp-4' : ''}`}>
                  {synopsis}
                </p>
                {synopsis.length > 300 && (
                  <button
                    onClick={() => setSynopsisExpanded((v) => !v)}
                    className="flex items-center gap-1 text-neonGlow text-xs font-medium mt-2 hover:text-neonBright transition-colors"
                  >
                    {synopsisExpanded ? <><FiChevronUp /> Show less</> : <><FiChevronDown /> Read more</>}
                  </button>
                )}
              </div>
            )}

            {/* MAL Link */}
            {anime.url && (
              <a href={anime.url} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted hover:text-neonGlow transition-colors">
                <FiExternalLink className="w-3.5 h-3.5" /> View on MyAnimeList
              </a>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex gap-1 border-b border-border mb-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold capitalize transition-all relative ${
                  activeTab === tab ? 'text-neonGlow' : 'text-muted hover:text-text'
                }`}
              >
                {tab}
                {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon rounded-full" />}
              </button>
            ))}
          </div>

          {/* Tab: Overview — Trailer */}
          {activeTab === 'overview' && (
            <div>
              {trailer && (
                <div className="mb-10">
                  <h3 className="font-display text-2xl text-white tracking-wide mb-4">Trailer</h3>
                  <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ paddingTop: '56.25%' }}>
                    <div className="absolute inset-0">
                      <YouTube
                        videoId={trailer}
                        opts={{ width: '100%', height: '100%', playerVars: { autoplay: 0 } }}
                        className="w-full h-full"
                        iframeClassName="w-full h-full rounded-2xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Relations */}
              {anime.relations?.length > 0 && (
                <div>
                  <h3 className="font-display text-2xl text-white tracking-wide mb-4">Related Anime</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {anime.relations.slice(0, 6).map((rel) =>
                      rel.entry?.map((entry) => (
                        <Link
                          key={entry.mal_id}
                          to={entry.type === 'anime' ? `/anime/${entry.mal_id}` : '#'}
                          className="glass rounded-xl px-4 py-3 hover:border-neon/40 transition-all group flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs text-neonGlow font-semibold mb-0.5">{rel.relation}</p>
                            <p className="text-sm text-text group-hover:text-white transition-colors line-clamp-1">{entry.name}</p>
                          </div>
                          <span className="badge bg-subtle/20 text-subtle text-[10px] shrink-0 ml-2">{entry.type}</span>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Characters */}
          {activeTab === 'characters' && (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {characters.length === 0 && (
                  <p className="col-span-full text-muted text-sm">Loading characters...</p>
                )}
                {characters.map((c) => (
                  <div key={c.character.mal_id} className="group text-center">
                    <div className="relative overflow-hidden rounded-xl aspect-square bg-panel mx-auto mb-2">
                      <img
                        src={c.character.images?.jpg?.image_url}
                        alt={c.character.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <span className="text-xs text-neonGlow font-semibold">{c.role}</span>
                      </div>
                    </div>
                    <p className="text-xs text-text font-medium line-clamp-2">{c.character.name}</p>
                    {c.voice_actors?.[0] && (
                      <p className="text-[10px] text-subtle mt-0.5">{c.voice_actors[0].person.name}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Recommendations */}
          {activeTab === 'recommendations' && (
            <AnimeRow
              title=""
              anime={recommendations}
              loading={recommendations.length === 0}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function StatBadge({ icon, value, label, gold }) {
  return (
    <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg">
      {icon}
      <span className={`font-semibold ${gold ? 'text-gold' : 'text-text'}`}>{value}</span>
      <span className="text-subtle text-xs">{label}</span>
    </div>
  )
}

function AnimeDetailSkeleton() {
  return (
    <div className="min-h-screen pb-24">
      <div className="h-80 sm:h-[50vh] skeleton" style={{ borderRadius: 0 }} />
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="skeleton w-52 rounded-2xl" style={{ aspectRatio: '2/3' }} />
          <div className="flex-1 pt-12 space-y-4">
            <div className="skeleton h-4 w-48 rounded" />
            <div className="skeleton h-14 w-96 rounded" />
            <div className="flex gap-3">
              {[1,2,3,4].map(i => <div key={i} className="skeleton h-8 w-24 rounded-lg" />)}
            </div>
            <div className="skeleton h-24 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
