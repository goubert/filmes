"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./resultados-filter-bar.css";
import { FilterCard, FilterPopup } from "../filter-ui";

const YEAR_PRESETS = [
  { label: "Últimos 5 anos",       start: 2021, end: 2026 },
  { label: "Últimos 10 anos",      start: 2016, end: 2026 },
  { label: "Últimos 20 anos",      start: 2006, end: 2026 },
  { label: "Clássicos (até 2000)", start: 1900, end: 2000 },
  { label: "Todos os anos",        start: 1900, end: 2026 },
];

const DURATION_OPTIONS = [
  { label: "Até 1h 30m",    value: "short"  },
  { label: "1h 30m até 2h", value: "medium" },
  { label: "2h +",          value: "long"   },
  { label: "Qualquer",      value: null     },
];

const MOOD_LABELS: Record<string, string> = {
  laugh:         "É engraçado",
  action:        "Ação",
  cry:           "Faz chorar",
  romance:       "Romance",
  scary:         "Terror",
  adventure:     "Aventura",
  family:        "Família",
  animation:     "Animação",
  feelgood:      "Feel Good",
  nostalgic:     "Nostalgia",
  psychological: "Psicológico",
  tense:         "Tensão",
  melancholic:   "Melancólico",
};

const MOOD_KEYS = Object.keys(MOOD_LABELS);

const MOOD_IMAGES: Record<string, string> = {
  laugh:         "/emoji-laugh.png",
  action:        "/emoji-action.png",
  cry:           "/emoji-cry.png",
  romance:       "/emoji-romance.png",
  scary:         "/emoji-scary.png",
  adventure:     "/emoji-adventure.png",
  family:        "/emoji-family.png",
  animation:     "/emoji-animation.png",
  feelgood:      "/emoji-feelgood.png",
  nostalgic:     "/emoji-nostalgic.png",
  psychological: "/emoji-psichological.png",
  tense:         "/emoji-tense.png",
};

type Provider = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
};

type Emotions = {
  laugh: number;
  cry: number;
  tense: number;
  scary: number;
  romance: number;
  action: number;
  adventure: number;
  animation: number;
  family: number;
  feelgood: number;
  melancholic: number;
  nostalgic: number;
  psychological: number;
};

type Props = {
  emotions: Emotions;
  yearStart: number;
  yearEnd: number;
  duration: string | null;
  selectedProviders: number[];
  streamingProviders: Provider[];
};

function getYearLabel(start: number, end: number) {
  return YEAR_PRESETS.find(p => p.start === start && p.end === end)?.label ?? `${start} – ${end}`;
}

function getDurationLabel(duration: string | null) {
  return DURATION_OPTIONS.find(d => d.value === duration)?.label ?? "Qualquer";
}

export function ResultadosFilterBar({
  emotions, yearStart, yearEnd, duration, selectedProviders,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState<"year" | "duration" | "moods" | null>(null);
  const [pendingEmotions, setPendingEmotions] = useState<Emotions | null>(null);

  const activeMoods = Object.entries(emotions)
    .filter(([, v]) => v > 0)
    .map(([key]) => key);

  const visibleMoods = activeMoods.slice(0, 3);
  const extraMoods   = activeMoods.length - visibleMoods.length;

  const currentYear = { start: yearStart, end: yearEnd };

  function navigate(year: { start: number; end: number }, dur: string | null, providers: number[], emo: Emotions = emotions) {
    const p = new URLSearchParams({
      laugh:         String(emo.laugh),
      cry:           String(emo.cry),
      tense:         String(emo.tense),
      scary:         String(emo.scary),
      romance:       String(emo.romance),
      action:        String(emo.action),
      adventure:     String(emo.adventure),
      animation:     String(emo.animation),
      family:        String(emo.family),
      feelgood:      String(emo.feelgood),
      melancholic:   String(emo.melancholic),
      nostalgic:     String(emo.nostalgic),
      psychological: String(emo.psychological),
      yearStart:     String(year.start),
      yearEnd:       String(year.end),
    });
    if (dur) p.set("duration", dur);
    if (providers.length) p.set("providers", providers.join(","));
    setOpen(null);
    router.push(`/resultados?${p.toString()}`);
  }

  function openMoodsPopup() {
    if (open === "moods") return;
    setPendingEmotions({ ...emotions });
    setOpen("moods");
  }

  function toggleMood(key: string) {
    setPendingEmotions(prev => {
      if (!prev) return prev;
      return { ...prev, [key]: prev[key as keyof Emotions] > 0 ? 0 : 2 };
    });
  }

  function closeMoodsPopup() {
    if (pendingEmotions) {
      navigate(currentYear, duration, selectedProviders, pendingEmotions);
    }
    setPendingEmotions(null);
    setOpen(null);
  }

  return (
    <>
      <div className="rfb-bar">
        <button className="rfb__back" onClick={() => router.push("/")}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M9 14L4 9L9 4" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 9H15C17.761 9 20 11.239 20 14C20 16.761 17.761 19 15 19H12" stroke="#000" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="rfb-scroll">
          <div className="rfb">
            <FilterCard label="MOODS" onClick={openMoodsPopup}>
              <div className="rfb__mood-icons">
                {visibleMoods.map(key => (
                  MOOD_IMAGES[key] && (
                    <img key={key} src={MOOD_IMAGES[key]} alt={key} className="rfb__mood-icon" />
                  )
                ))}
                {extraMoods > 0 && (
                  <span className="rfb__mood-extra">+{extraMoods}</span>
                )}
                {activeMoods.length === 0 && (
                  <span className="rfb__card-value">Todos</span>
                )}
              </div>
            </FilterCard>

            <FilterCard
              label="PERÍODO"
              className="rfb__card--period"
              onClick={() => setOpen(prev => prev === "year" ? null : "year")}
            >
              <span className="rfb__card-value">{getYearLabel(yearStart, yearEnd)}</span>
            </FilterCard>

            <FilterCard
              label="DURAÇÃO"
              className="rfb__card--duration"
              onClick={() => setOpen(prev => prev === "duration" ? null : "duration")}
            >
              <span className="rfb__card-value">{getDurationLabel(duration)}</span>
            </FilterCard>

            <FilterCard label="SERVIÇOS">
              <span className="rfb__card-value">
                {selectedProviders.length > 0
                  ? `${selectedProviders.length} ativo${selectedProviders.length > 1 ? "s" : ""}`
                  : "Todos"}
              </span>
            </FilterCard>
          </div>
        </div>
      </div>

      {open === "year" && (
        <FilterPopup onClose={() => setOpen(null)}>
          {YEAR_PRESETS.map(p => (
            <button
              key={p.label}
              className={`rfb__option${p.start === yearStart && p.end === yearEnd ? " rfb__option--active" : ""}`}
              onClick={() => navigate({ start: p.start, end: p.end }, duration, selectedProviders)}
            >
              {p.label}
            </button>
          ))}
        </FilterPopup>
      )}

      {open === "duration" && (
        <FilterPopup onClose={() => setOpen(null)}>
          {DURATION_OPTIONS.map(opt => (
            <button
              key={String(opt.value)}
              className={`rfb__option${opt.value === duration ? " rfb__option--active" : ""}`}
              onClick={() => navigate(currentYear, opt.value, selectedProviders)}
            >
              {opt.label}
            </button>
          ))}
        </FilterPopup>
      )}

      {open === "moods" && pendingEmotions && (
        <FilterPopup onClose={closeMoodsPopup}>
          {MOOD_KEYS.some(k => pendingEmotions[k as keyof Emotions] > 0) && (
            <span className="rfb__moods-title">MOODS SELECIONADOS</span>
          )}
          <div className="rfb__moods-list">
            {MOOD_KEYS.map(key => {
              const active = pendingEmotions[key as keyof Emotions] > 0;
              return (
                <label key={key} className="rfb__mood-row">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleMood(key)}
                    className="rfb__mood-checkbox"
                  />
                  <span className="rfb__mood-row-label">{MOOD_LABELS[key]}</span>
                </label>
              );
            })}
          </div>
        </FilterPopup>
      )}
    </>
  );
}
