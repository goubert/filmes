import "./resultados.css";
import { Cardmovie } from "@/components/cardmovie";
import { discoverMoviesByEmotions } from "@/lib/tmdb";
import { ResultadosFilterBar } from "@/components/resultados-filter-bar";

type SearchParams = {
  laugh?: string;
  cry?: string;
  tense?: string;
  scary?: string;
  romance?: string;
  yearStart?: string;
  yearEnd?: string;
  duration?: string;
};

export default async function ResultadosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const emotions = {
    laugh:   Number(searchParams.laugh   ?? 1),
    cry:     Number(searchParams.cry     ?? 1),
    tense:   Number(searchParams.tense   ?? 1),
    scary:   Number(searchParams.scary   ?? 1),
    romance: Number(searchParams.romance ?? 1),
  };

  const yearRange = {
    start: Number(searchParams.yearStart ?? 1900),
    end:   Number(searchParams.yearEnd   ?? 2026),
  };

  const duration = searchParams.duration ?? null;

  const [movies] = await Promise.all([
    discoverMoviesByEmotions(emotions, yearRange, [], duration),
    new Promise((r) => setTimeout(r,1000)),
  ]);

  return (
    <main className="resultados">
      <ResultadosFilterBar
        emotions={emotions}
        yearStart={yearRange.start}
        yearEnd={yearRange.end}
        duration={duration}
      />

      {movies.length === 0 ? (
        <p className="resultados__empty">Nenhum filme encontrado. Tente ajustar os filtros.</p>
      ) : (
        <section className="list-movies">
          {movies.map((movie: any) => (
            <Cardmovie key={movie.id} movie={movie} />
          ))}
        </section>
      )}
    </main>
  );
}
