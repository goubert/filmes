import {Cardmovie} from '../components/cardmovie'
import { getPopularMovies } from '@/lib/tmdb'


export default async function Home(){
  const movies = await getPopularMovies()

  return (
    <div className="list-movies">
      {movies.map((movie: any) => (
      <Cardmovie key={movie.id} movie={movie} />
      ))}
      

    </div>
      
  )
}