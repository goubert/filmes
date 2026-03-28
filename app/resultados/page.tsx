import "./resultados.css";
import { Cardmovie } from "@/components/cardmovie";
import { discoverMoviesByEmotions, getStreamingProvidersBR } from "@/lib/tmdb";
import { ResultadosFilterBar } from "@/components/resultados-filter-bar";

type SearchParams = {
  laugh?: string;
  cry?: string;
  tense?: string;
  scary?: string;
  romance?: string;
  action?: string;
  adventure?: string;
  animation?: string;
  family?: string;
  feelgood?: string;
  melancholic?: string;
  nostalgic?: string;
  psychological?: string;
  yearStart?: string;
  yearEnd?: string;
  duration?: string;
  providers?: string;
};

export default async function ResultadosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const emotions = {
    laugh:     Number(searchParams.laugh     ?? 1),
    cry:       Number(searchParams.cry       ?? 1),
    tense:     Number(searchParams.tense     ?? 1),
    scary:     Number(searchParams.scary     ?? 1),
    romance:   Number(searchParams.romance   ?? 1),
    action:    Number(searchParams.action    ?? 1),
    adventure: Number(searchParams.adventure ?? 1),
    animation: Number(searchParams.animation ?? 1),
    family:    Number(searchParams.family    ?? 1),
  };

  const yearRange = {
    start: Number(searchParams.yearStart ?? 1900),
    end:   Number(searchParams.yearEnd   ?? 2026),
  };

  const duration = searchParams.duration ?? null;

  const providerIds = searchParams.providers
    ? searchParams.providers.split(",").map(Number).filter(Boolean)
    : [];

  const [[movies], streamingProviders] = await Promise.all([
    Promise.all([
      discoverMoviesByEmotions(emotions, yearRange, [], duration, providerIds),
      new Promise((r) => setTimeout(r, 1000)),
    ]),
    getStreamingProvidersBR(),
  ]);

  return (
    <main className="resultados">
      <ResultadosFilterBar
        emotions={emotions}
        yearStart={yearRange.start}
        yearEnd={yearRange.end}
        duration={duration}
        selectedProviders={providerIds}
        streamingProviders={streamingProviders}
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
