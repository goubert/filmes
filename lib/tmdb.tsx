const API_URL = 'https://api.themoviedb.org/3'

export async function getPopularMovies() {
  const res = await fetch(
    `${API_URL}/movie/top_rated?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`,
    {
      next: { revalidate: 60 } // cache + ISR
    }
  )

  if (!res.ok) {
    throw new Error('Erro ao buscar filmes')
  }

  const data = await res.json()
  return data.results
}

import { EMOTIONS } from "./emotions";

import { YearRange } from "./constants";

export async function discoverMoviesByEmotions(
  emotions: Record<string, number>,
  yearRange: YearRange,
  countries: string[]
) {
  const sorted = Object.entries(emotions).sort((a, b) => b[1] - a[1])
  const mainEmotion = sorted[0][0] as keyof typeof EMOTIONS
  const genres = EMOTIONS[mainEmotion].genres

  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie` +
      `?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}` +
      `&with_genres=${genres.join(",")}` +
      `&primary_release_date.gte=${yearRange.start}-01-01` +
      `&primary_release_date.lte=${yearRange.end}-12-31` +
      (countries.length
        ? `&with_origin_country=${countries.join("|")}`
        : "")
  )

  const data = await res.json()
  return data.results.slice(0, 20)
}








