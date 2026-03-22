"use client";

import "./page.css";
import { useEffect, useState } from "react";
import { Cardmovie } from "../components/cardmovie";
import { FiltersSection } from "../components/filters";
import { MoodsSection } from "../components/moods-section";
import { discoverMoviesByEmotions } from "@/lib/tmdb";
import { COUNTRIES } from "@/lib/countries"


export default function Home() {
  // 1️⃣ Estados
  const [emotions, setEmotions] = useState({
    laugh: 1,
    cry: 1,
    tense: 1,
    scary: 1,
    romance: 1
  });

  const [movies, setMovies] = useState<any[]>([]);
  const [sortedMovies, setSortedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateOrder, setDateOrder] = useState<"desc" | "asc">("desc");
  const [ratingOrder, setRatingOrder] = useState<"desc" | "asc">("desc");
  const [hasSearched, setHasSearched] = useState(false);

  const [yearRange, setYearRange] = useState({ start: 1900, end: 2026 })
  const [duration, setDuration] = useState<string | null>(null)

  
 




  function updateEmotion(key: keyof typeof emotions, value: number) {
    setEmotions((prev) => ({ ...prev, [key]: value }));
  }



  function sortMovies(
    list: any[],
    dateOrder: "asc" | "desc",
    ratingOrder: "asc" | "desc"
  ) {
    return [...list].sort((a, b) => {
      const dateA = new Date(a.release_date).getTime();
      const dateB = new Date(b.release_date).getTime();
  
      if (dateA !== dateB) {
        return dateOrder === "desc" ? dateB - dateA : dateA - dateB;
      }
  
      const ratingDiff = a.vote_average - b.vote_average;
      return ratingOrder === "desc" ? -ratingDiff : ratingDiff;
    });
  }
    /* pais */
    const [country, setCountry] = useState<string>("ALL")

  useEffect(() => {
    setSortedMovies(sortMovies(movies, dateOrder, ratingOrder));
  }, [movies, dateOrder, ratingOrder]);
  
  useEffect(() => {
    setHasSearched(false)
  }, [emotions, yearRange, country, duration])

  const RIR = [
    { value: 1, image: "/rir1.png" },
    { value: 2, image: "/rir2.png" },
    { value: 3, image: "/rir3.png" },
  ];

  const CHORAR = [
    { value: 1, image: "/chorar1.png" },
    { value: 2, image: "/chorar2.png" },
    { value: 3, image: "/chorar3.png" },
  ];

  const TERROR = [
    { value: 1, image: "/terror1.png" },
    { value: 2, image: "/terror2.png" },
    { value: 3, image: "/terror3.png" },
  ];

  const TENSE = [
    { value: 1, image: "/tense1.png" },
    { value: 2, image: "/tense2.png" },
    { value: 3, image: "/tense3.png" },
  ];

  const ROMANCE = [
    { value: 1, image: "/romance1.png" },
    { value: 2, image: "/romance2.png" },
    { value: 3, image: "/romance3.png" },
  ];
  

  const handleSearch = async () => {
    setLoading(true)
  
    const countries =
      country === "ALL" ? [] : [country]
  
    const results = await discoverMoviesByEmotions(
      emotions,
      yearRange,
      countries,
      duration
    )
  
    setMovies(results)
    setHasSearched(true)
    setLoading(false)
  }
  
 
  
  return (
    <>
      <FiltersSection
        yearStart={yearRange.start}
        yearEnd={yearRange.end}
        onYearChange={(start, end) => setYearRange({ start, end })}
        duration={duration}
        onDurationChange={setDuration}
      />

      <MoodsSection
        emotions={emotions}
        onChange={updateEmotion}
        rir={RIR}
        chorar={CHORAR}
        tense={TENSE}
        terror={TERROR}
        romance={ROMANCE}
      />

      <div className="wrap-options">
        <div className="select-button">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            {COUNTRIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <button className="btn-verfilmes" onClick={handleSearch}>
            Ver filmes
          </button>
        </div>
      </div>
        
            {hasSearched && (
              <div className="sort-controls">
                <div>
                  <select
                    value={dateOrder}
                    onChange={(e) => setDateOrder(e.target.value as "asc" | "desc")}
                  >
                    <option value="desc">Mais recente</option>
                    <option value="asc">Mais antigo</option>
                  </select>
                </div>

                <div>
                  <select
                    value={ratingOrder}
                    onChange={(e) => setRatingOrder(e.target.value as "asc" | "desc")}
                  >
                    <option value="desc">Maior nota</option>
                    <option value="asc">Menor nota</option>
                  </select>
                </div>
              </div>

            )}
              

        
        <section className="list-movies">
          {loading && <p>Carregando...</p>}
              
          {sortedMovies.map((movie) => (
            
            <Cardmovie key={movie.id} movie={movie} />
          ))}
        </section>

      
    </>
  );
}