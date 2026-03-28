import "./cardmovie.css";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  runtime: number | null;
  vote_average: number;
};

function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function Cardmovie({ movie }: { movie: Movie }) {
  const percent = Math.round(movie.vote_average * 10);
  const year = movie.release_date?.split("-")[0];

  return (
    <div className="card-movie">
      <div className="card-movie__poster">
        <div className="card-movie__badge" style={{ ["--percent" as any]: `${percent}%` }}>
          <span>{percent}</span>
        </div>
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
        />
      </div>

      <div className="card-movie__info">
        <div className="card-movie__title">{movie.title}</div>
        <div className="card-movie__meta">
          {year && (
            <div className="card-movie__meta-row">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3.9375 1.75v1.3125M10.0625 1.75v1.3125M1.75 10.9375V4.375c0-.3481.13828-.68194.38442-.92808C2.38056 3.20078 2.7144 3.0625 3.0625 3.0625h7.875c.3481 0 .6819.13828.9281.38442.2461.24614.3844.57998.3844.92808v6.5625M1.75 10.9375c0 .3481.13828.6819.38442.9281.24614.2461.57998.3844.92808.3844h7.875c.3481 0 .6819-.1383.9281-.3844.2461-.2462.3844-.58.3844-.9281M1.75 10.9375V6.5625c0-.3481.13828-.68194.38442-.92808C2.38056 5.38828 2.7144 5.25 3.0625 5.25h7.875c.3481 0 .6819.13828.9281.38442.2461.24614.3844.57998.3844.92808v4.375" stroke="#545454" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{year}</span>
            </div>
          )}
          {movie.runtime ? (
            <div className="card-movie__meta-row">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.25" stroke="#545454" strokeLinecap="round"/>
                <path d="M7 4.375V7l1.75 1.75" stroke="#545454" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{formatRuntime(movie.runtime)}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
