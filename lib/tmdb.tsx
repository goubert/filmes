const API_URL = 'https://api.themoviedb.org/3'


const EMOTION_LEVELS = {
  1: {
    voteCount: 200,
    voteAverage: 5.5,
    sortBy: "popularity.desc",
  },
  2: {
    voteCount: 800,
    voteAverage: 6.2,
    sortBy: "popularity.desc",
  },
  3: {
    voteCount: 2000,
    voteAverage: 6.8,
    sortBy: "popularity.desc",
  },
}


export async function getPopularMovies() {
  const res = await fetch(
    `${API_URL}/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR`,
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





export async function discoverMoviesByEmotions(
  emotions: Record<string, number>,
  yearRange: { start: number; end: number },
  countries: string[],
  duration: string | null = null
) {
  // 1️⃣ Ordena emoções pela intensidade
  const sorted = Object.entries(emotions).sort((a, b) => b[1] - a[1])

  const secondary = sorted[1]




  const [mainEmotion, mainLevel] = sorted[0]
  const emotionKey = mainEmotion as keyof typeof EMOTIONS

  const genres = EMOTIONS[emotionKey].genres
  const levelConfig = EMOTION_LEVELS[mainLevel as 1 | 2 | 3]

  // 2️⃣ Monta query base
  const params = new URLSearchParams({
    api_key: process.env.NEXT_PUBLIC_TMDB_KEY!,
    with_genres: genres.join(","),
    sort_by: levelConfig.sortBy,
    "vote_count.gte": String(levelConfig.voteCount),
    "vote_average.gte": String(levelConfig.voteAverage),
    "primary_release_date.gte": `${yearRange.start}-01-01`,
    "primary_release_date.lte": `${yearRange.end}-12-31`,
  })

  // 3️⃣ País (opcional)
  if (countries.length) {
    params.append("with_origin_country", countries.join("|"))
  }

  // 4️⃣ Duração (opcional)
  if (duration === "short")  params.set("with_runtime.lte", "90")
  if (duration === "medium") { params.set("with_runtime.gte", "91"); params.set("with_runtime.lte", "120") }
  if (duration === "long")   params.set("with_runtime.gte", "121")

  if (secondary && secondary[1] >= 2) {
    const secondaryGenres = EMOTIONS[secondary[0] as keyof typeof EMOTIONS].genres
    params.set(
      "with_genres",
      [...new Set([...genres, ...secondaryGenres])].join(",")
    )
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${params.toString()}`,
    {
      cache: "no-store",
    }
  )

  const data = await res.json()

  return data.results.slice(0, 30)
}









