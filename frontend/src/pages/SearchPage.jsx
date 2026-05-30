import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'
import { searchAnime, getAnimeMovies, getTopAnime, getSeasonalAnime } from '../services/jikanApi'
import { useDebounce } from '../hooks/useDebounce'
import AnimeGrid from '../components/anime/AnimeGrid'

const TYPE_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'TV', value: 'tv' },
  { label: 'Movie', value: 'movie' },
  { label: 'OVA', value: 'ova' },
  { label: 'Special', value: 'special' },
  { label: 'ONA', value: 'ona' },
]

const FILTER_OPTIONS = [
  { label: 'Popular', value: 'bypopularity' },
  { label: 'Top Rated', value: 'favorite' },
  { label: 'Airing', value: 'airing' },
  { label: 'Upcoming', value: 'upcoming' },
]

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQ = searchParams.get('q') || ''
  const initialType = searchParams.get('type') || ''
  const initialFilter = searchParams.get('filter') || 'bypopularity'

  const [query, setQuery] = useState(initialQ)
  const [type, setType] = useState(initialType)
  const [filter, setFilter] = useState(initialFilter)
  const [results, setResults] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  const debouncedQuery = useDebounce(query, 400)

  // Fetch function
  const fetchAnime = useCallback(async (q, t, f, p, reset = false) => {
    setLoading(true)
    try {
      let res
      if (q) {
        res = await searchAnime(q, p, t)
      } else if (t === 'movie') {
        res = await getAnimeMovies(p)
      } else if (f === 'airing' || f === 'upcoming') {
        res = f === 'airing' ? await getSeasonalAnime(p) : await getTopAnime(f, t, p)
      } else {
        res = await getTopAnime(f || 'bypopularity', t, p)
      }
      const items = res.data.data || []
      const pagination = res.data.pagination
      setResults((prev) => reset ? items : [...prev, ...items])
      setHasMore(pagination?.has_next_page ?? false)
      setTotal(pagination?.items?.total ?? 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Trigger on debounced query or filter change
  useEffect(() => {
    setResults([])
    setPage(1)
    setHasMore(true)
    fetchAnime(debouncedQuery, type, filter, 1, true)

    // Update URL params
    const params = {}
    if (debouncedQuery) params.q = debouncedQuery
    if (type) params.type = type
    if (filter) params.filter = filter
    setSearchParams(params, { replace: true })
  }, [debouncedQuery, type, filter])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchAnime(debouncedQuery, type, filter, nextPage, false)
  }

  const clearSearch = () => {
    setQuery('')
    setType('')
    setFilter('bypopularity')
  }

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Search header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide mb-6">
          {query ? `Results for "${query}"` : type === 'movie' ? 'Anime Movies' : 'Explore Anime'}
        </h1>

        {/* Search input */}
        <div className="relative max-w-2xl mb-4">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle w-4 h-4" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, genre..."
            className="input-base w-full pl-11 pr-10 py-3 text-base"
          />
          {query && (
            <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-text">
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <FiFilter className="text-subtle w-4 h-4 shrink-0" />

          {/* Type filter */}
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => setType(o.value)}
                className={`px-3 py-1 text-sm rounded-full border transition-all ${
                  type === o.value
                    ? 'bg-neon border-neon text-white'
                    : 'border-border text-muted hover:border-neon/50 hover:text-text'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-border hidden sm:block" />

          {/* Filter options */}
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => setFilter(o.value)}
                className={`px-3 py-1 text-sm rounded-full border transition-all ${
                  filter === o.value
                    ? 'bg-cyan/20 border-cyan text-cyanBright'
                    : 'border-border text-muted hover:border-cyan/50 hover:text-text'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        {!loading && results.length > 0 && (
          <p className="text-muted text-sm mt-3">
            Showing {results.length}{total > 0 ? ` of ${total.toLocaleString()}` : ''} results
          </p>
        )}
      </div>

      {/* Results */}
      {!loading && results.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
          <span className="text-6xl">🔍</span>
          <h3 className="text-xl font-semibold text-text">No results found</h3>
          <p className="text-muted">Try a different search term or filter</p>
          <button onClick={clearSearch} className="btn-ghost mt-2">Clear filters</button>
        </div>
      ) : (
        <AnimeGrid
          anime={results}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      )}
    </div>
  )
}
