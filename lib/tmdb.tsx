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
  const [mainEmotion, mainLevel] = sorted[0]

  // ── Separa moods com keyword dos que só têm género ──────
  const hasKeywords = (key: string) =>
    (EMOTIONS[key as keyof typeof EMOTIONS].keywords?.length ?? 0) > 0

  const atMax = sorted.filter(([, level]) => level === 3)

  // Moods de género puros em nível 3 (sem keywords) → AND entre géneros
  const genreModsAtMax = atMax.filter(([key]) => !hasKeywords(key))

  const withGenres: number[] = (() => {
    if (genreModsAtMax.length >= 2) {
      // Vários géneros em nível 3 → AND
      return [...new Set(genreModsAtMax.flatMap(([key]) => EMOTIONS[key as keyof typeof EMOTIONS].genres))]
    }
    // Só o principal + secundária se ≥ 2 (ignorando keyword-moods nessa contagem)
    const primary = EMOTIONS[mainEmotion as keyof typeof EMOTIONS].genres
    const secondary = sorted.find(([key, level]) => key !== mainEmotion && level >= 2 && !hasKeywords(key))
    if (secondary) {
      return [...new Set([...primary, ...EMOTIONS[secondary[0] as keyof typeof EMOTIONS].genres])]
    }
    return primary
  })()

  // ── Keywords: moods avançados activos (nível ≥ 2) ───────
  const activeKeywordMoods = sorted.filter(([key, level]) => level >= 2 && hasKeywords(key))

  // Géneros extras que vêm de keyword-moods (ex: psychological → 53)
  const keywordExtraGenres = activeKeywordMoods.flatMap(
    ([key]) => EMOTIONS[key as keyof typeof EMOTIONS].genres
  )

  // with_genres final = géneros base AND géneros de keyword-moods
  const finalGenres = [...new Set([...withGenres, ...keywordExtraGenres])]

  // with_keywords: dentro de cada mood as keywords são OR (pipe), entre moods são AND (vírgula)
  const withKeywords = activeKeywordMoods
    .map(([key]) => EMOTIONS[key as keyof typeof EMOTIONS].keywords!.join("|"))
    .join(",")

  const levelConfig = EMOTION_LEVELS[mainLevel as 1 | 2 | 3]

  const params = new URLSearchParams({
    api_key: process.env.NEXT_PUBLIC_TMDB_KEY!,
    language: "pt-BR",
    sort_by: levelConfig.sortBy,
    "vote_count.gte": String(levelConfig.voteCount),
    "vote_average.gte": String(levelConfig.voteAverage),
    "primary_release_date.gte": `${yearRange.start}-01-01`,
    "primary_release_date.lte": `${yearRange.end}-12-31`,
  })

  if (finalGenres.length > 0) params.set("with_genres", finalGenres.join(","))
  if (withKeywords)            params.set("with_keywords", withKeywords)

  if (countries.length) {
    params.append("with_origin_country", countries.join("|"))
  }

  if (duration === "short")  params.set("with_runtime.lte", "90")
  if (duration === "medium") { params.set("with_runtime.gte", "91"); params.set("with_runtime.lte", "120") }
  if (duration === "long")   params.set("with_runtime.gte", "121")

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
      return { ...movie, title: detail.title ?? movie.title, runtime: detail.runtime ?? null, streaming }
    })
  )

  return moviesWithDetails.sort((a, b) => b.vote_average - a.vote_average)
}
