"use client";

import "./page.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiltersSection } from "../components/filters";
import { MoodsSection } from "../components/moods-section";
import { Header } from "../components/header";

export default function Home() {
  const router = useRouter();

  const [emotions, setEmotions] = useState({
    laugh: 1,
    cry: 1,
    tense: 1,
    scary: 1,
    romance: 1,
  });

  const [yearRange, setYearRange] = useState({ start: 1900, end: 2026 });
  const [duration, setDuration] = useState<string | null>(null);
  const [selectedProviders, setSelectedProviders] = useState<number[]>([]);

  function updateEmotion(key: keyof typeof emotions, value: number) {
    setEmotions((prev) => ({ ...prev, [key]: value }));
  }

  const RIR     = [{ value: 1, image: "/rir1.png" },     { value: 2, image: "/rir2.png" },     { value: 3, image: "/rir3.png" }];
  const CHORAR  = [{ value: 1, image: "/chorar1.png" },  { value: 2, image: "/chorar2.png" },  { value: 3, image: "/chorar3.png" }];
  const TERROR  = [{ value: 1, image: "/terror1.png" },  { value: 2, image: "/terror2.png" },  { value: 3, image: "/terror3.png" }];
  const TENSE   = [{ value: 1, image: "/tense1.png" },   { value: 2, image: "/tense2.png" },   { value: 3, image: "/tense3.png" }];
  const ROMANCE = [{ value: 1, image: "/romance1.png" }, { value: 2, image: "/romance2.png" }, { value: 3, image: "/romance3.png" }];

  function handleSearch() {
    const params = new URLSearchParams({
      laugh:     String(emotions.laugh),
      cry:       String(emotions.cry),
      tense:     String(emotions.tense),
      scary:     String(emotions.scary),
      romance:   String(emotions.romance),
      yearStart: String(yearRange.start),
      yearEnd:   String(yearRange.end),
    });
    if (duration) params.set("duration", duration);
    if (selectedProviders.length) params.set("providers", selectedProviders.join(","));
    router.push(`/resultados?${params.toString()}`);
  }

  return (
    <>
      <Header />
      <FiltersSection
        yearStart={yearRange.start}
        yearEnd={yearRange.end}
        onYearChange={(start, end) => setYearRange({ start, end })}
        duration={duration}
        onDurationChange={setDuration}
        selectedProviders={selectedProviders}
        onProvidersChange={setSelectedProviders}
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
        <button className="btn-buscar" onClick={handleSearch}>
          Buscar filmes
        </button>
      </div>
    </>
  );
}
