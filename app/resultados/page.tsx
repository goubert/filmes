import "./resultados.css";
import "./resultados-layout.css";
import { discoverMoviesByEmotions, getStreamingProvidersBR } from "@/lib/tmdb";
import { ResultadosFilterBar } from "@/components/resultados-filter-bar";
import { MovieList } from "./MovieList";


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
  countries?: string;
};


export default async function ResultadosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const toLevel = (v: string | undefined) =>
    v === "true" ? 2 : v === "false" ? 0 : Number(v ?? 1);

  const emotions = {
    laugh:         toLevel(searchParams.laugh),
    cry:           toLevel(searchParams.cry),
    tense:         toLevel(searchParams.tense),
    scary:         toLevel(searchParams.scary),
    romance:       toLevel(searchParams.romance),
    action:        toLevel(searchParams.action),
    adventure:     toLevel(searchParams.adventure),
    animation:     toLevel(searchParams.animation),
    family:        toLevel(searchParams.family),
    feelgood:      toLevel(searchParams.feelgood),
    melancholic:   toLevel(searchParams.melancholic),
    nostalgic:     toLevel(searchParams.nostalgic),
    psychological: toLevel(searchParams.psychological),
  };

  const yearRange = {
    start: Number(searchParams.yearStart ?? 1900),
    end:   Number(searchParams.yearEnd   ?? 2026),
  };

  const duration = searchParams.duration ?? null;

  const providerIds = searchParams.providers
    ? searchParams.providers.split(",").map(Number).filter(Boolean)
    : [];

  const countries = searchParams.countries
    ? searchParams.countries.split(",").filter(Boolean)
    : [];

  const [[movies], streamingProviders] = await Promise.all([
    Promise.all([
      discoverMoviesByEmotions(emotions, yearRange, countries, duration, providerIds, 1),
      new Promise((r) => setTimeout(r, 1000)),
    ]),
    getStreamingProvidersBR(),
  ]);

  return (
    <>
    <div className="resultados-found-wrapper">
      <p className="resultados-found-label">Filmes encontrados:</p>
    </div>
    <div className="resultados-separator" />
    <main className="resultados">
      <MovieList
        initialMovies={movies}
        searchParams={searchParams as Record<string, string>}
      />
    </main>
    <ResultadosFilterBar
      emotions={emotions}
      yearStart={yearRange.start}
      yearEnd={yearRange.end}
      duration={duration}
      selectedProviders={providerIds}
      streamingProviders={streamingProviders}
      selectedCountries={countries}
    />
    </>
  );
}
