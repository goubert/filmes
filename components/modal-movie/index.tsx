"use client";

import { useEffect, useState } from "react";
import "./modal-movie.css";
import "@/components/cardmovie/cardmovie.css";

type Props = {
  movieId: number;
  onClose: () => void;
};

type Genre = {
  id: number;
  name: string;
};

type CrewMember = {
  id: number;
  name: string;
  job: string;
};

type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

type ReleaseDateItem = {
  certification: string;
};

type ReleaseCountry = {
  iso_3166_1: string;
  release_dates: ReleaseDateItem[];
};

type Movie = {
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: Genre[];
  credits: {
    crew: CrewMember[];
    cast: CastMember[];
  };
  release_dates: {
    results: ReleaseCountry[];
  };
};



export function MovieModal({ movieId, onClose }: Props) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadMovie() {
      try {
        const res = await fetch(`/api/movies/${movieId}`);

        if (!res.ok) throw new Error("Erro ao carregar");

        const data = await res.json();

        setMovie(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [movieId]);
  

  function formatRuntime(minutes: number) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("pt-BR");
  }

  function getCertification() {
    const br =
      movie?.release_dates?.results?.find(
        (item) => item.iso_3166_1 === "BR"
      ) ||
      movie?.release_dates?.results?.find(
        (item) => item.iso_3166_1 === "US"
      );

    return (
      br?.release_dates?.find((r) => r.certification)?.certification ||
      "Livre"
    );
  }

  function getCrew(job: string) {
    return movie?.credits?.crew
      ?.filter((item) => item.job === job)
      ?.map((item) => item.name)
      ?.join(", ");
  }

  if (loading) {
    return (
      <div className="movie-modal-overlay">
        <div className="movie-modal">Carregando...</div>
      </div>
    );
  }
  

  if (!movie) return null;

  return (
    <div className="movie-modal-overlay" onClick={onClose}>
        <div
            className="movie-modal"
            onClick={(e) => e.stopPropagation()}
        >
        

            <div className="header-movie">
                <button className="btn-fechar"onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 15L15 5M5 5L15 15" stroke="#FAF0EC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <img
                className="backdrop-poster"
                src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                alt={movie.title}
                />

                <div className="info-movie-poster">
                    <img
                        className="poster-movie"
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                    />
                    <div className="text-info-movie">
                        
                        <h2>{movie.title}</h2>
                        <div className="more-info-text">
                            <div className="classificacao-movie">{getCertification()}</div>
                            <div className="release-movie">{formatDate(movie.release_date)}</div>
                            <div className="movie-time">{formatRuntime(movie.runtime)}</div>
                        </div>
                        <div className="generos-movie">
                            {movie.genres.map((genre) => (
                                <span key={genre.id}>{genre.name}</span>
                            ))}
                        </div>
                    </div>
                
                </div>
            </div>
            <div className="content-modal-movie">
                <div className="sinopse-movie">
                    
                    <h4>Sinopse:</h4>
                    <p>
                        {movie.overview}
                    </p>
                </div>
                
                <div className="elenco-movie">
                    <h4>Elenco</h4>

                    <div className="movie-modal__cast-list">
                        {movie.credits.cast.slice(0, 12).map((actor) => (
                        <div
                            className="movie-modal__cast-card"
                            key={actor.id}
                        >
                            <img
                            src={
                                actor.profile_path
                                ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                : "/no-avatar.png"
                            }
                            alt={actor.name}
                            />

                            <strong>{actor.name}</strong>

                            <span>{actor.character}</span>
                        </div>
                        ))}
                    </div>

                    <div className="equipe-movie">
                        <h4>Equipe</h4>
                        <div className="list-equipe">
                            {getCrew("Director") && (
                                <p><strong>Diretor:</strong> {getCrew("Director")}</p>
                            )}

                            {getCrew("Writer") && (
                                <p><strong>Escritor:</strong> {getCrew("Writer")}</p>
                            )}

                            {getCrew("Screenplay") && (
                                <p><strong>Roteiro:</strong> {getCrew("Screenplay")}</p>
                            )}

                            {getCrew("Novel") && (
                                <p><strong>Livro:</strong> {getCrew("Novel")}</p>
                            )}
                        </div>
                    </div>

                    
                </div>
                
            </div>
        </div>
        
    </div>
  );
}