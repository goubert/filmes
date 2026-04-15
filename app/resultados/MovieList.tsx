"use client"

import { useEffect, useRef, useState } from "react"
import { Cardmovie } from "@/components/cardmovie"
import { MovieModal } from "@/components/modal-movie"

type Props = {
  initialMovies: any[]
  searchParams: Record<string, string>
}




export function MovieList({ initialMovies, searchParams }: Props) {
  const [movies, setMovies] = useState(initialMovies)
  const [page, setPage] = useState(2)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const openMovie = (id: number) => {
    console.log("clicou filme:", id);
    setSelectedMovieId(id);
  };

  const closeMovie = () => setSelectedMovieId(null);

  useEffect(() => {
    setMovies(initialMovies)
    setPage(2)
    setHasMore(true)
  }, [initialMovies])

  useEffect(() => {
    if (!hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMore()
        }
      },
      { rootMargin: "400px" }
    )

    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [page, loading, hasMore])

  async function loadMore() {
    setLoading(true)
    const params = new URLSearchParams({ ...searchParams, page: String(page) })
    const res = await fetch(`/api/movies?${params.toString()}`)
    const newMovies = await res.json()

    if (!newMovies.length) {
      setHasMore(false)
    } else {
      setMovies((prev) => {
        const existingIds = new Set(prev.map((m: any) => m.id))
        return [...prev, ...newMovies.filter((m: any) => !existingIds.has(m.id))]
      })
      setPage((p) => p + 1)
    }
    setLoading(false)
  }

  if (movies.length === 0) {
    return <p className="resultados__empty">Nenhum filme encontrado. Tente ajustar os filtros.</p>
  }

  return (
    <>
      <section className="list-movies">
        {movies.map((movie: any) => (
          <Cardmovie key={movie.id} movie={movie} onOpen={openMovie}/>
        ))}
      </section>
      
      {selectedMovieId && (
        <MovieModal
          movieId={selectedMovieId}
          onClose={closeMovie}
        />
      )}

      {hasMore && (
        <div ref={sentinelRef} style={{ height: 1 }} />
      )}

      {loading && (
        <p className="resultados__empty">Carregando mais filmes...</p>
      )}
    </>
  )
}
