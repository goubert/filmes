const API_URL = 'https://api.themoviedb.org/3'

const EMOTION_LEVELS = {
  1: { voteCount: 200,  voteAverage: 5.5, sortBy: "popularity.desc" },
  2: { voteCount: 800,  voteAverage: 6.2, sortBy: "popularity.desc" },
  3: { voteCount: 2000, voteAverage: 6.8, sortBy: "popularity.desc" },
}

import { EMOTIONS } from "./emotions";

export async function getStreamingProvidersBR() {
  const res = await fetch(
    `${API_URL}/watch/providers/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR&watch_region=BR`,
    { next: { revalidate: 86400 } }
  )
  const data = await res.json()

  return (data.results as any[])
    .sort((a, b) => a.display_priority - b.display_priority)
}

export async function discoverMoviesByEmotions(
  emotions: Record<string, number>,
  yearRange: { start: number; end: number },
  countries: string[],
  duration: string | null = null,
  providerIds: number[] = []
) {
  const sorted = Object.entries(emotions).sort((a, b) => b[1] - a[1])
  const secondary = sorted[1]
  const [mainEmotion, mainLevel] = sorted[0]
  const emotionKey = mainEmotion as keyof typeof EMOTIONS
  const genres = EMOTIONS[emotionKey].genres
  const levelConfig = EMOTION_LEVELS[mainLevel as 1 | 2 | 3]

  const params = new URLSearchParams({
    api_key: process.env.NEXT_PUBLIC_TMDB_KEY!,
    with_genres: genres.join(","),
    sort_by: levelConfig.sortBy,
    "vote_count.gte": String(levelConfig.voteCount),
    "vote_average.gte": String(levelConfig.voteAverage),
    "primary_release_date.gte": `${yearRange.start}-01-01`,
    "primary_release_date.lte": `${yearRange.end}-12-31`,
  })

  if (countries.length) {
    params.append("with_origin_country", countries.join("|"))
  }

  if (duration === "short")  params.set("with_runtime.lte", "90")
  if (duration === "medium") { params.set("with_runtime.gte", "91"); params.set("with_runtime.lte", "120") }
  if (duration === "long")   params.set("with_runtime.gte", "121")

  if (secondary && secondary[1] >= 2) {
    const secondaryGenres = EMOTIONS[secondary[0] as keyof typeof EMOTIONS].genres
    params.set("with_genres", [...new Set([...genres, ...secondaryGenres])].join(","))
  }

  if (providerIds.length) {
    params.set("with_watch_providers", providerIds.join("|"))
    params.set("watch_region", "BR")
    params.set("with_watch_monetization_types", "flatrate")
  }

  const res = await fetch(
    `${API_URL}/discover/movie?${params.toString()}`,
    { cache: "no-store" }
  )

  const data = await res.json()
  const movies = data.results.slice(0, 30)

  const moviesWithDetails = await Promise.all(
    movies.map(async (movie: any) => {
      const detailRes = await fetch(
        `${API_URL}/movie/${movie.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR&append_to_response=watch/providers`,
        { next: { revalidate: 86400 } }
      )
      const detail = await detailRes.json()
      const streaming = detail['watch/providers']?.results?.BR?.flatrate ?? []
      return { ...movie, runtime: detail.runtime ?? null, streaming }
    })
  )

  return moviesWithDetails.sort((a, b) => b.vote_average - a.vote_average)
}
