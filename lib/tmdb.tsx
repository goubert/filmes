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


