import axios from 'axios'

const JIKAN_BASE =
  import.meta.env.VITE_JIKAN_BASE_URL || 'https://api.jikan.moe/v4'

const jikanClient = axios.create({
  baseURL: JIKAN_BASE,
  timeout: 15000,
})

// Real request queue
let queue = Promise.resolve()

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms))

async function executeRequest(url, params = {}, retries = 2) {
  try {
    return await jikanClient.get(url, { params })
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      console.warn('Jikan rate limited. Retrying...')
      await delay(3000)
      return executeRequest(url, params, retries - 1)
    }
    throw error
  }
}

function rateLimitedGet(url, params = {}) {
  queue = queue.then(async () => {
    await delay(1200)
    return executeRequest(url, params)
  })

  return queue
}

// Anime endpoints

export const getTopAnime = (
  filter = 'bypopularity',
  type = '',
  page = 1
) =>
  rateLimitedGet('/top/anime', {
    filter,
    type: type || undefined,
    page,
    limit: 20,
  })

export const searchAnime = (
  q,
  page = 1,
  type = ''
) =>
  rateLimitedGet('/anime', {
    q,
    page,
    limit: 20,
    type: type || undefined,
    sfw: true,
  })

export const getAnimeMovies = (page = 1) =>
  rateLimitedGet('/anime', {
    type: 'movie',
    order_by: 'score',
    sort: 'desc',
    page,
    limit: 20,
    sfw: true,
  })

export const getAnimeById = (id) =>
  rateLimitedGet(`/anime/${id}/full`)

export const getAnimeCharacters = (id) =>
  rateLimitedGet(`/anime/${id}/characters`)

export const getAnimeRecommendations = (id) =>
  rateLimitedGet(`/anime/${id}/recommendations`)

export const getSeasonalAnime = (page = 1) =>
  rateLimitedGet('/seasons/now', {
    page,
    limit: 20,
  })

export const getUpcomingAnime = (page = 1) =>
  rateLimitedGet('/seasons/upcoming', {
    page,
    limit: 20,
  })

export const getAnimeByGenre = (
  genreId,
  page = 1
) =>
  rateLimitedGet('/anime', {
    genres: genreId,
    order_by: 'score',
    sort: 'desc',
    page,
    limit: 20,
  })

export const getAnimeStaff = (id) =>
  rateLimitedGet(`/anime/${id}/staff`)

export const getAnimeReviews = (id) =>
  rateLimitedGet(`/anime/${id}/reviews`)

export const getGenres = () =>
  rateLimitedGet('/genres/anime')

export default jikanClient