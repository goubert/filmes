"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import "./resultados-filter-bar.css";

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
  const [open, setOpen] = useState<"year" | "duration" | null>(null);
  const [popupPos, setPopupPos] = useState<{ bottom: number; left: number }>({ bottom: 0, left: 0 });

  const yearRef     = useRef<HTMLButtonElement>(null);
  const durationRef = useRef<HTMLButtonElement>(null);

  const activeMoods = Object.entries(emotions)
    .filter(([, v]) => v > 0)
    .map(([key]) => key);

  const visibleMoods = activeMoods.slice(0, 3);
  const extraMoods   = activeMoods.length - visibleMoods.length;

  function openPopup(type: "year" | "duration", ref: React.RefObject<HTMLButtonElement>) {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const popupWidth = 177;
      const margin = 12;
      const vw = window.innerWidth;

      let left = rect.left;
      if (left + popupWidth > vw - margin) left = rect.right - popupWidth;
      left = Math.max(margin, Math.min(left, vw - popupWidth - margin));

      setPopupPos({ bottom: window.innerHeight - rect.top + 8, left });
    }
    setOpen(prev => prev === type ? null : type);
  }

  function navigate(year: { start: number; end: number }, dur: string | null, providers: number[]) {
    const p = new URLSearchParams({
      laugh:         String(emotions.laugh),
      cry:           String(emotions.cry),
      tense:         String(emotions.tense),
      scary:         String(emotions.scary),
      romance:       String(emotions.romance),
      action:        String(emotions.action),
      adventure:     String(emotions.adventure),
      animation:     String(emotions.animation),
      family:        String(emotions.family),
      feelgood:      String(emotions.feelgood),
      melancholic:   String(emotions.melancholic),
      nostalgic:     String(emotions.nostalgic),
      psychological: String(emotions.psychological),
      yearStart:     String(year.start),
      yearEnd:       String(year.end),
    });
    if (dur) p.set("duration", dur);
    if (providers.length) p.set("providers", providers.join(","));
    setOpen(null);
    router.push(`/resultados?${p.toString()}`);
  }

  const currentYear = { start: yearStart, end: yearEnd };

  return (
    <>
      {open && <div className="rfb__overlay" onClick={() => setOpen(null)} />}

      <div className="rfb-bar">
        <button className="rfb__back" onClick={() => router.push("/")}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M9 14L4 9L9 4" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 9H15C17.761 9 20 11.239 20 14C20 16.761 17.761 19 15 19H12" stroke="#000" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="rfb-scroll">
          <div className="rfb">
            {/* MOODS */}
            <button className="rfb__card">
              <div className="rfb__card-header">
                <span className="rfb__card-label">MOODS</span>
                <ChevronUp />
              </div>
              <div className="rfb__mood-icons">
                {visibleMoods.map(key => (
                  MOOD_IMAGES[key] && (
                    <img
                      key={key}
                      src={MOOD_IMAGES[key]}
                      alt={key}
                      className="rfb__mood-icon"
                    />
                  )
                ))}
                {extraMoods > 0 && (
                  <span className="rfb__mood-extra">+{extraMoods}</span>
                )}
                {activeMoods.length === 0 && (
                  <span className="rfb__card-value">Todos</span>
                )}
              </div>
            </button>

            {/* PERÍODO */}
            <button ref={yearRef} className="rfb__card rfb__card--period" onClick={() => openPopup("year", yearRef)}>
              <div className="rfb__card-header">
                <span className="rfb__card-label">PERÍODO</span>
                <ChevronUp />
              </div>
              <span className="rfb__card-value">{getYearLabel(yearStart, yearEnd)}</span>
            </button>

            {/* DURAÇÃO */}
            <button ref={durationRef} className="rfb__card rfb__card--duration" onClick={() => openPopup("duration", durationRef)}>
              <div className="rfb__card-header">
                <span className="rfb__card-label">DURAÇÃO</span>
                <ChevronUp />
              </div>
              <span className="rfb__card-value">{getDurationLabel(duration)}</span>
            </button>

            {/* SERVIÇOS */}
            <button className="rfb__card">
              <div className="rfb__card-header">
                <span className="rfb__card-label">SERVIÇOS</span>
                <ChevronUp />
              </div>
              <span className="rfb__card-value">
                {selectedProviders.length > 0 ? `${selectedProviders.length} ativo${selectedProviders.length > 1 ? "s" : ""}` : "Todos"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {open === "year" && (
        <div className="rfb__popup" style={{ bottom: popupPos.bottom, left: popupPos.left }}>
          {YEAR_PRESETS.map(p => (
            <button
              key={p.label}
              className={`rfb__option${p.start === yearStart && p.end === yearEnd ? " rfb__option--active" : ""}`}
              onClick={() => navigate({ start: p.start, end: p.end }, duration, selectedProviders)}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {open === "duration" && (
        <div className="rfb__popup" style={{ bottom: popupPos.bottom, left: popupPos.left }}>
          {DURATION_OPTIONS.map(opt => (
            <button
              key={String(opt.value)}
              className={`rfb__option${opt.value === duration ? " rfb__option--active" : ""}`}
              onClick={() => navigate(currentYear, opt.value, selectedProviders)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function ChevronUp() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 8L6 4L10 8" stroke="#686868" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
