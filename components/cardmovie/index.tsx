
import "./cardmovie.css";

type Movie = {
    id: number
    title: string
    poster_path: string
    release_date: string
    runtime: number
    vote_average: number
  }

  type RatingCircleProps = {
  rating: number // 0–10
}

export default function RatingCircle({ rating }: RatingCircleProps) {
  const percent = Math.round(rating * 10)

  return (
    <div
      className="rating-tmdb"
      style={{ ['--percent' as any]: `${percent}%` }}
    >
      <span>{percent}</span>
    </div>
  )
}

  

export function Cardmovie({ movie }: { movie: Movie }){
    return(
        <div className="card-movie">
            <div className="image-rate">
                <RatingCircle rating={movie.vote_average} />
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
            </div>
            <div className="info-movie">
                <div className="name-movie">{movie.title}</div>
                <div className="subinfo-container">
                    <div className="subinfo">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.9375 1.75L3.9375 3.0625M10.0625 1.75L10.0625 3.0625M1.75 10.9375L1.75 4.375C1.75 4.0269 1.88828 3.69306 2.13442 3.44692C2.38056 3.20078 2.7144 3.0625 3.0625 3.0625L10.9375 3.0625C11.2856 3.0625 11.6194 3.20078 11.8656 3.44692C12.1117 3.69306 12.25 4.0269 12.25 4.375L12.25 10.9375M1.75 10.9375C1.75 11.2856 1.88828 11.6194 2.13442 11.8656C2.38056 12.1117 2.7144 12.25 3.0625 12.25L10.9375 12.25C11.2856 12.25 11.6194 12.1117 11.8656 11.8656C12.1117 11.6194 12.25 11.2856 12.25 10.9375M1.75 10.9375L1.75 6.5625C1.75 6.2144 1.88828 5.88056 2.13442 5.63442C2.38056 5.38828 2.7144 5.25 3.0625 5.25L10.9375 5.25C11.2856 5.25 11.6194 5.38828 11.8656 5.63442C12.1117 5.88056 12.25 6.2144 12.25 6.5625L12.25 10.9375" stroke="#545454" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {movie.release_date?.split('-')[0]}
                    </div>
                </div>
            </div>
        </div>
        
    )
}