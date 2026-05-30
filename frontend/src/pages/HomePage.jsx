import { useState, useEffect } from 'react'
import HeroSection from '../components/anime/HeroSection'
import AnimeRow from '../components/anime/AnimeRow'
import AnimeGrid from '../components/anime/AnimeGrid'
import { getTopAnime, getAnimeMovies, getSeasonalAnime, getUpcomingAnime } from '../services/jikanApi'

export default function HomePage() {
  const [trending, setTrending] = useState([])
  const [topMovies, setTopMovies] = useState([])
  const [seasonal, setSeasonal] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [infiniteAnime, setInfiniteAnime] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingInfinite, setLoadingInfinite] = useState(false)

  const [loadingTrending, setLoadingTrending] = useState(true)
  const [loadingMovies, setLoadingMovies] = useState(true)
  const [loadingSeasonal, setLoadingSeasonal] = useState(true)

  useEffect(() => {
    // Stagger the initial loads to avoid Jikan rate limit
    getTopAnime('bypopularity')
      .then(({ data }) => setTrending(data.data || []))
      .finally(() => setLoadingTrending(false))

    setTimeout(() => {
      getAnimeMovies(1)
        .then(({ data }) => setTopMovies(data.data || []))
        .finally(() => setLoadingMovies(false))
    }, 500)

    setTimeout(() => {
      getSeasonalAnime(1)
        .then(({ data }) => setSeasonal(data.data || []))
        .finally(() => setLoadingSeasonal(false))
    }, 1000)

    setTimeout(() => {
      getUpcomingAnime(1)
        .then(({ data }) => setUpcoming(data.data || []))
    }, 1500)

    // Load first page of infinite grid
    setTimeout(() => {
      loadMore(1)
    }, 2500)
  }, [])

  const loadMore = async (pageNum = page) => {
    if (loadingInfinite) return
    setLoadingInfinite(true)
    try {
      const { data } = await getTopAnime('byrank', '', pageNum)
      const newItems = data.data || []
      setInfiniteAnime((prev) => [...prev, ...newItems])
      setHasMore(data.pagination?.has_next_page ?? false)
      setPage(pageNum + 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingInfinite(false)
    }
  }

  return (
    <div className="pb-20">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 space-y-2">
        <AnimeRow
          title="🔥 Trending Now"
          anime={trending}
          loading={loadingTrending}
          viewAllLink="/search?filter=airing"
        />

        <AnimeRow
          title="🎬 Top Anime Movies"
          anime={topMovies}
          loading={loadingMovies}
          viewAllLink="/search?type=movie"
        />

        <AnimeRow
          title="📺 This Season"
          anime={seasonal}
          loading={loadingSeasonal}
          viewAllLink="/search?filter=airing"
        />

        {upcoming.length > 0 && (
          <AnimeRow
            title="🚀 Coming Soon"
            anime={upcoming}
            viewAllLink="/search?filter=upcoming"
          />
        )}

        {/* Infinite scroll grid */}
        <div className="pt-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-8 bg-neon rounded-full" />
            <h2 className="font-display text-3xl text-white tracking-wide">All Anime</h2>
          </div>
          <AnimeGrid
            anime={infiniteAnime}
            loading={loadingInfinite}
            hasMore={hasMore}
            onLoadMore={() => loadMore(page)}
          />
        </div>
      </div>
    </div>
  )
}
