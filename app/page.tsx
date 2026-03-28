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
    laugh: 1, cry: 1, tense: 1, scary: 1, romance: 1,
    action: 1, adventure: 1, animation: 1, family: 1,
    feelgood: 1, melancholic: 1, nostalgic: 1, psychological: 1,
  });

  const [yearRange, setYearRange] = useState({ start: 1900, end: 2026 });
  const [duration, setDuration] = useState<string | null>(null);
  const [selectedProviders, setSelectedProviders] = useState<number[]>([]);

  function updateEmotion(key: keyof typeof emotions, value: number) {
    setEmotions((prev) => ({ ...prev, [key]: value }));
  }

  const RIR       = [{ value: 1, image: "/rir1.png" },     { value: 2, image: "/rir2.png" },     { value: 3, image: "/rir3.png" }];
  const CHORAR    = [{ value: 1, image: "/chorar1.png" },  { value: 2, image: "/chorar2.png" },  { value: 3, image: "/chorar3.png" }];
  const TERROR    = [{ value: 1, image: "/terror1.png" },  { value: 2, image: "/terror2.png" },  { value: 3, image: "/terror3.png" }];
  const TENSE     = [{ value: 1, image: "/tense1.png" },   { value: 2, image: "/tense2.png" },   { value: 3, image: "/tense3.png" }];
  const ROMANCE   = [{ value: 1, image: "/romance1.png" }, { value: 2, image: "/romance2.png" }, { value: 3, image: "/romance3.png" }];
  const ACTION       = [{ value: 1, image: "/action1.png" },       { value: 2, image: "/action2.png" },       { value: 3, image: "/action3.png" }];
  const ADVENTURE    = [{ value: 1, image: "/adventure1.png" },    { value: 2, image: "/adventure2.png" },    { value: 3, image: "/adventure3.png" }];
  const ANIMATION    = [{ value: 1, image: "/animation1.png" },    { value: 2, image: "/animation2.png" },    { value: 3, image: "/animation3.png" }];
  const FAMILY       = [{ value: 1, image: "/family1.png" },       { value: 2, image: "/family2.png" },       { value: 3, image: "/family3.png" }];
  const FEELGOOD     = [{ value: 1, image: "/feelgood1.png" },     { value: 2, image: "/feelgood2.png" },     { value: 3, image: "/feelgood3.png" }];
  const MELANCHOLIC  = [{ value: 1, image: "/melancholic1.png" },  { value: 2, image: "/melancholic2.png" },  { value: 3, image: "/melancholic3.png" }];
  const NOSTALGIC    = [{ value: 1, image: "/nostalgic1.png" },    { value: 2, image: "/nostalgic2.png" },    { value: 3, image: "/nostalgic3.png" }];
  const PSYCHOLOGICAL = [{ value: 1, image: "/psychological1.png" }, { value: 2, image: "/psychological2.png" }, { value: 3, image: "/psychological3.png" }];

  function handleSearch() {
    const params = new URLSearchParams({
      laugh:     String(emotions.laugh),
      cry:       String(emotions.cry),
      tense:     String(emotions.tense),
      scary:     String(emotions.scary),
      romance:   String(emotions.romance),
      action:        String(emotions.action),
      adventure:     String(emotions.adventure),
      animation:     String(emotions.animation),
      family:        String(emotions.family),
      feelgood:      String(emotions.feelgood),
      melancholic:   String(emotions.melancholic),
      nostalgic:     String(emotions.nostalgic),
      psychological: String(emotions.psychological),
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
        action={ACTION}
        adventure={ADVENTURE}
        animation={ANIMATION}
        family={FAMILY}
        feelgood={FEELGOOD}
        melancholic={MELANCHOLIC}
        nostalgic={NOSTALGIC}
        psychological={PSYCHOLOGICAL}
      />

      <div className="wrap-options">
        <button className="btn-buscar" onClick={handleSearch}>
          Buscar filmes
        </button>
      </div>
    </>
  );
}
