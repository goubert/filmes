"use client";

import "./page.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Header } from "../components/header";
import { FiltersSection } from "../components/filters";
import { MoodsSection } from "../components/moods-section";

type EmotionKey =
  | "laugh"
  | "cry"
  | "tense"
  | "scary"
  | "romance"
  | "action"
  | "adventure"
  | "animation"
  | "family"
  | "feelgood"
  | "melancholic"
  | "nostalgic"
  | "psychological";

export default function Home() {
  const router = useRouter();

  const [emotions, setEmotions] = useState<Record<EmotionKey, boolean>>({
    laugh: false,
    cry: false,
    tense: false,
    scary: false,
    romance: false,
    action: false,
    adventure: false,
    animation: false,
    family: false,
    feelgood: false,
    melancholic: false,
    nostalgic: false,
    psychological: false,
  });

  const [yearRange, setYearRange] = useState({
    start: 1900,
    end: 2026,
  });

  const [duration, setDuration] = useState<string | null>(null);
  const [selectedProviders, setSelectedProviders] = useState<number[]>([]);

  function handleMoodChange(key: EmotionKey, value: boolean) {
    setEmotions((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSearch() {
    const params = new URLSearchParams();

    Object.entries(emotions).forEach(([key, value]) => {
      params.set(key, String(value));
    });

    params.set("yearStart", String(yearRange.start));
    params.set("yearEnd", String(yearRange.end));

    if (duration) params.set("duration", duration);

    if (selectedProviders.length) {
      params.set("providers", selectedProviders.join(","));
    }

    router.push(`/resultados?${params.toString()}`);
  }

  return (
    <>
      <div className="home-wrapper">
        <Header />

        <MoodsSection
          emotions={emotions}
          onChange={handleMoodChange}
        />

        <FiltersSection
          yearStart={yearRange.start}
          yearEnd={yearRange.end}
          onYearChange={(start, end) =>
            setYearRange({ start, end })
          }
          duration={duration}
          onDurationChange={setDuration}
          selectedProviders={selectedProviders}
          onProvidersChange={setSelectedProviders}
        />
      </div>

      <div className="wrap-options">
        <button
          className="btn-buscar"
          onClick={handleSearch}
        >
          Buscar filmes
        </button>
      </div>
    </>
  );
}