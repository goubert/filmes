"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./resultados-filter-bar.css";

const YEAR_PRESETS = [
  { label: "Últimos 5 anos",          start: 2021, end: 2026 },
  { label: "Últimos 10 anos",         start: 2016, end: 2026 },
  { label: "Últimos 20 anos",         start: 2006, end: 2026 },
  { label: "Clássicos (até 2000)",    start: 1900, end: 2000 },
  { label: "Todos os anos",           start: 1900, end: 2026 },
];

const DURATION_OPTIONS = [
  { label: "Até 1h 30m",     value: "short"  },
  { label: "1h 30m até 2h",  value: "medium" },
  { label: "2h +",           value: "long"   },
  { label: "Qualquer",       value: null     },
];

type Emotions = {
  laugh: number; cry: number; tense: number; scary: number; romance: number;
};

type Props = {
  emotions: Emotions;
  yearStart: number;
  yearEnd: number;
  duration: string | null;
};

function getYearLabel(start: number, end: number) {
  return YEAR_PRESETS.find(p => p.start === start && p.end === end)?.label ?? `${start} – ${end}`;
}

function getDurationLabel(duration: string | null) {
  return DURATION_OPTIONS.find(d => d.value === duration)?.label ?? "Qualquer";
}

export function ResultadosFilterBar({ emotions, yearStart, yearEnd, duration }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState<"year" | "duration" | null>(null);

  function navigate(year: { start: number; end: number }, dur: string | null) {
    const p = new URLSearchParams({
      laugh:     String(emotions.laugh),
      cry:       String(emotions.cry),
      tense:     String(emotions.tense),
      scary:     String(emotions.scary),
      romance:   String(emotions.romance),
      yearStart: String(year.start),
      yearEnd:   String(year.end),
    });
    if (dur) p.set("duration", dur);
    setOpen(null);
    router.push(`/resultados?${p.toString()}`);
  }

  const currentYear = { start: yearStart, end: yearEnd };

  return (
    <div className="rfb">
      {/* Home button */}
      <button className="rfb__home" onClick={() => router.push("/")}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M1.5 7.5L9 1.5L16.5 7.5V16.5H11.5V11.5H6.5V16.5H1.5V7.5Z" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Year pill */}
      <div className="rfb__pill-wrap">
        <button className="rfb__pill" onClick={() => setOpen(open === "year" ? null : "year")}>
          <span className="rfb__pill-label">{getYearLabel(yearStart, yearEnd)}</span>
          <span className="rfb__pill-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8.5 1.5L10.5 3.5L3.5 10.5H1.5V8.5L8.5 1.5Z" stroke="#969696" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"/>
            </svg>
          </span>
        </button>

        {open === "year" && (
          <>
            <div className="rfb__overlay" onClick={() => setOpen(null)} />
            <div className="rfb__popup">
              {YEAR_PRESETS.map(p => (
                <button
                  key={p.label}
                  className={`rfb__option${p.start === yearStart && p.end === yearEnd ? " rfb__option--active" : ""}`}
                  onClick={() => navigate({ start: p.start, end: p.end }, duration)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Duration pill */}
      <div className="rfb__pill-wrap">
        <button className="rfb__pill" onClick={() => setOpen(open === "duration" ? null : "duration")}>
          <span className="rfb__pill-label">{getDurationLabel(duration)}</span>
          <span className="rfb__pill-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8.5 1.5L10.5 3.5L3.5 10.5H1.5V8.5L8.5 1.5Z" stroke="#969696" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"/>
            </svg>
          </span>
        </button>

        {open === "duration" && (
          <>
            <div className="rfb__overlay" onClick={() => setOpen(null)} />
            <div className="rfb__popup">
              {DURATION_OPTIONS.map(opt => (
                <button
                  key={String(opt.value)}
                  className={`rfb__option${opt.value === duration ? " rfb__option--active" : ""}`}
                  onClick={() => navigate(currentYear, opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
