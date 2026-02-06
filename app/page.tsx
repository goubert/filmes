"use client";

import { useEffect, useState } from "react";
import { Cardmovie } from "../components/cardmovie";
import EmotionRadio from "../components/emotion-radio";
import { discoverMoviesByEmotions } from "@/lib/tmdb";
import { YEAR_RANGES, YearRange } from "@/lib/constants"
import { COUNTRIES } from "@/lib/countries"


export default function Home() {
  // 1️⃣ Estados
  const [emotions, setEmotions] = useState({
    laugh: 1,
    cry: 1,
    tense: 1,
    scary: 1,
  });

  const [movies, setMovies] = useState<any[]>([]);
  const [sortedMovies, setSortedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateOrder, setDateOrder] = useState<"desc" | "asc">("desc");
  const [ratingOrder, setRatingOrder] = useState<"desc" | "asc">("desc");
  const [hasSearched, setHasSearched] = useState(false);

  const [yearRange, setYearRange] = useState<YearRange>(
    YEAR_RANGES[YEAR_RANGES.length - 1] // default: mais recente
  )
 




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
  }, [emotions, yearRange, country])
  

  const handleSearch = async () => {
    setLoading(true)
  
    const countries =
      country === "ALL" ? [] : [country]
  
    const results = await discoverMoviesByEmotions(
      emotions,
      yearRange,
      countries
    )
  
    setMovies(results)
    setHasSearched(true)
    setLoading(false)
  }
  
  

  
  
  
  
  
  return (
    <>
      <section className="emotion-radios">
        <EmotionRadio
          title="Para rir"
          value={emotions.laugh}
          onChange={(v) => updateEmotion("laugh", v)}
        />

        <EmotionRadio
          title="Para chorar"
          value={emotions.cry}
          onChange={(v) => updateEmotion("cry", v)}
        />

        <EmotionRadio
          title="Para tensão"
          value={emotions.tense}
          onChange={(v) => updateEmotion("tense", v)}
        />

        <EmotionRadio
          title="Dá medo"
          value={emotions.scary}
          onChange={(v) => updateEmotion("scary", v)}
        />  

        <select
          value={yearRange.start}
          onChange={(e) => {
            const selectedRange = YEAR_RANGES.find(
              (range) => range.start === Number(e.target.value)
            )

            if (selectedRange) {
              setYearRange(selectedRange)
            }
          }}
        >
          {YEAR_RANGES.map((range) => (
            <option key={range.start} value={range.start}>
              {range.label}
            </option>
          ))}
        </select>


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



        <button onClick={handleSearch}>
          Ver filmes
        </button>
      </section>
     
      
          {hasSearched && (
            <div className="sort-controls">
              <div>
                <label>Data</label>
                <select
                  value={dateOrder}
                  onChange={(e) => setDateOrder(e.target.value as "asc" | "desc")}
                >
                  <option value="desc">Mais recente</option>
                  <option value="asc">Mais antigo</option>
                </select>
              </div>

              <div>
                <label>Nota</label>
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