const API_URL = 'https://api.themoviedb.org/3'

const EMOTION_LEVELS = {
  1: { voteCount: 200,  voteAverage: 5.5, sortBy: "popularity.desc" },
  2: { voteCount: 800,  voteAverage: 6.2, sortBy: "popularity.desc" },
  3: { voteCount: 2000, voteAverage: 6.8, sortBy: "popularity.desc" },
}

import { EMOTIONS } from "./emotions";

export async function getCountriesBR() {
  const res = await fetch(
    `${API_URL}/configuration/countries?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR`,
    { next: { revalidate: 86400 } }
  )
  const data = await res.json()
  return (data as any[]).map(c => ({
    iso: c.iso_3166_1 as string,
    name: (c.native_name || c.english_name) as string,
  }))
}

export async function searchActors(query: string) {
  if (!query) return []
  const res = await fetch(
    `${API_URL}/search/person?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`,
    { cache: "no-store" }
  )
  const data = await res.json()
  return ((data.results ?? []) as any[])
    .filter((p: any) => p.known_for_department === "Acting")
    .map((p: any) => ({
      id: p.id as number,
      name: p.name as string,
      profile_path: (p.profile_path ?? null) as string | null,
    }))
}

export async function getPersonsByIds(ids: number[]) {
  if (!ids.length) return []
  return Promise.all(
    ids.map(id =>
      fetch(
        `${API_URL}/person/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR`,
        { next: { revalidate: 86400 } }
      )
        .then(r => r.json())
        .then(d => ({ id: d.id as number, name: d.name as string, profile_path: (d.profile_path ?? null) as string | null }))
    )
  )
}

export async function getStreamingProvidersBR() {
  const res = await fetch(
    `${API_URL}/watch/providers/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR&watch_region=BR`,
    { next: { revalidate: 86400 } }
  )
  const data = await res.json()

  return (data.results as any[])
    .sort((a, b) => a.display_priority - b.display_priority)
}

// ── Shared emotion → genre/keyword resolver ─────────────

function resolveEmotionParams(emotions: Record<string, number>) {
  const sorted = Object.entries(emotions).sort((a, b) => b[1] - a[1])
  const [mainEmotion, mainLevel] = sorted[0]

  const hasKeywords = (key: string) =>
    (EMOTIONS[key as keyof typeof EMOTIONS].keywords?.length ?? 0) > 0

  const atMax = sorted.filter(([, level]) => level === 3)
  const genreModsAtMax = atMax.filter(([key]) => !hasKeywords(key))

  const withGenres: number[] = (() => {
    if (genreModsAtMax.length >= 2) {
      return [...new Set(genreModsAtMax.flatMap(([key]) => EMOTIONS[key as keyof typeof EMOTIONS].genres))]
    }
    const primary = EMOTIONS[mainEmotion as keyof typeof EMOTIONS].genres
    const secondary = sorted.find(([key, level]) => key !== mainEmotion && level >= 2 && !hasKeywords(key))
    if (secondary) {
      return [...new Set([...primary, ...EMOTIONS[secondary[0] as keyof typeof EMOTIONS].genres])]
    }
    return primary
  })()

  const activeKeywordMoods = sorted.filter(([key, level]) => level >= 2 && hasKeywords(key))
  const keywordExtraGenres = activeKeywordMoods.flatMap(([key]) => EMOTIONS[key as keyof typeof EMOTIONS].genres)
  const finalGenres = [...new Set([...withGenres, ...keywordExtraGenres])]
  const withKeywords = activeKeywordMoods
    .map(([key]) => EMOTIONS[key as keyof typeof EMOTIONS].keywords!.join("|"))
    .join(",")
  const levelConfig = EMOTION_LEVELS[mainLevel as 1 | 2 | 3] ?? EMOTION_LEVELS[1]

  return { finalGenres, withKeywords, levelConfig }
}

// ── Actor path: filmography intersection + client-side filters ─

async function discoverByActors(
  actorIds: number[],
  emotions: Record<string, number>,
  yearRange: { start: number; end: number },
  countries: string[],
  duration: string | null,
  providerIds: number[],
  page: number
) {
  const { finalGenres, withKeywords, levelConfig } = resolveEmotionParams(emotions)

  // 1. Busca filmografias em paralelo
  const filmographies = await Promise.all(
    actorIds.map(id =>
      fetch(
        `${API_URL}/person/${id}/movie_credits?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR`,
        { cache: "no-store" }
      ).then(r => r.json())
    )
  )

  // 2. Interseção de IDs (filmes em comum entre todos os atores)
  const idSets = filmographies.map(f => new Set<number>((f.cast ?? []).map((m: any) => m.id as number)))
  const intersectionIds = [...idSets[0]].filter(id => idSets.every(s => s.has(id)))

  // 3. Mapa de dados base (genre_ids, release_date, vote_average, vote_count já vêm no credits)
  const movieMap = new Map<number, any>()
  filmographies.forEach(f => (f.cast ?? []).forEach((m: any) => movieMap.set(m.id, m)))
  const candidates = intersectionIds.map(id => movieMap.get(id)).filter(Boolean)

  // 4. Filtros baratos (sem chamada extra à API)
  const preFiltered = candidates.filter(m => {
    const year = m.release_date ? new Date(m.release_date).getFullYear() : 0
    if (year < yearRange.start || year > yearRange.end) return false
    if ((m.vote_count ?? 0) < levelConfig.voteCount) return false
    if ((m.vote_average ?? 0) < levelConfig.voteAverage) return false
    if (finalGenres.length > 0 && !finalGenres.every(g => (m.genre_ids ?? []).includes(g))) return false
    return true
  })

  // 5. Busca detalhes completos (runtime, providers, keywords) só dos pré-filtrados
  const detailed = await Promise.all(
    preFiltered.map(m =>
      fetch(
        `${API_URL}/movie/${m.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR&append_to_response=watch/providers,keywords`,
        { cache: "no-store" }
      ).then(r => r.json())
    )
  )

  // 6. Filtros completos
  const fullyFiltered = detailed.filter(m => {
    if (duration === "short"  && (m.runtime ?? 0) > 90) return false
    if (duration === "medium" && ((m.runtime ?? 0) < 91 || (m.runtime ?? 0) > 120)) return false
    if (duration === "long"   && (m.runtime ?? 0) < 121) return false

    if (countries.length > 0) {
      const mc = (m.production_countries ?? []).map((c: any) => c.iso_3166_1)
      if (!countries.some(c => mc.includes(c))) return false
    }

    if (providerIds.length > 0) {
      const flat = (m["watch/providers"]?.results?.BR?.flatrate ?? []).map((p: any) => p.provider_id)
      if (!providerIds.some(pid => flat.includes(pid))) return false
    }

    if (withKeywords) {
      const movieKwIds = (m.keywords?.keywords ?? []).map((k: any) => k.id)
      const andGroups = withKeywords.split(",")
      if (!andGroups.every(group => group.split("|").map(Number).some(id => movieKwIds.includes(id)))) return false
    }

    return true
  })

  // 7. Ordena, pagina e formata igual ao path normal
  const PAGE_SIZE = 20
  const sorted_result = fullyFiltered.sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0))
  const pageData = sorted_result.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return pageData.map(m => ({
    ...m,
    streaming: m["watch/providers"]?.results?.BR?.flatrate ?? [],
  }))
}

// ── Main discover function ───────────────────────────────

export async function discoverMoviesByEmotions(
  emotions: Record<string, number>,
  yearRange: { start: number; end: number },
  countries: string[],
  duration: string | null = null,
  providerIds: number[] = [],
  page: number = 1,
  actorIds: number[] = []
) {
  if (actorIds.length > 0) {
    return discoverByActors(actorIds, emotions, yearRange, countries, duration, providerIds, page)
  }

  const { finalGenres, withKeywords, levelConfig } = resolveEmotionParams(emotions)

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

  const url = `${API_URL}/discover/movie?${params.toString()}`
  const data = await fetch(`${url}&page=${page}`, { cache: "no-store" }).then(r => r.json())
  const movies = data.results ?? []

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
