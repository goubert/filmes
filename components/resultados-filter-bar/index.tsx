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

const POPULAR_IDS = [8, 119, 337, 1899, 307, 531, 350];

type Provider = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
};

type Emotions = {
  laugh: number; cry: number; tense: number; scary: number; romance: number;
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

function getStreamingLabel(selected: number[], providers: Provider[]) {
  if (selected.length === 0) return "Streaming";
  if (selected.length === 1)
    return providers.find(p => p.provider_id === selected[0])?.provider_name ?? "Streaming";
  return `${providers.find(p => p.provider_id === selected[0])?.provider_name} +${selected.length - 1}`;
}

export function ResultadosFilterBar({
  emotions, yearStart, yearEnd, duration, selectedProviders, streamingProviders,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState<"year" | "duration" | "streaming" | null>(null);
  const [pendingProviders, setPendingProviders] = useState<number[]>(selectedProviders);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const yearRef     = useRef<HTMLButtonElement>(null);
  const durationRef = useRef<HTMLButtonElement>(null);
  const streamingRef = useRef<HTMLButtonElement>(null);

  function openPopup(type: "year" | "duration" | "streaming", ref: React.RefObject<HTMLButtonElement>) {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const popupWidth = type === "streaming" ? 252 : 192;
      const margin = 12;
      const vw = window.innerWidth;

      // Tenta alinhar à esquerda do botão; se vazar pela direita, alinha à direita do botão
      let left = rect.left;
      if (left + popupWidth > vw - margin) {
        left = rect.right - popupWidth;
      }
      // Clamp final: nunca sai pelos dois lados
      left = Math.max(margin, Math.min(left, vw - popupWidth - margin));

      setPopupPos({ top: rect.bottom + 8, left });
    }
    if (type === "streaming") setPendingProviders(selectedProviders);
    setOpen(prev => prev === type ? null : type);
  }

  function navigate(year: { start: number; end: number }, dur: string | null, providers: number[]) {
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
    if (providers.length) p.set("providers", providers.join(","));
    setOpen(null);
    router.push(`/resultados?${p.toString()}`);
  }

  const currentYear = { start: yearStart, end: yearEnd };

  return (
    <>
      {/* Overlay to close popup */}
      {open && <div className="rfb__overlay" onClick={() => setOpen(null)} />}

      <div className="rfb-scroll">
        <div className="rfb">
          {/* Home button */}
          <button className="rfb__home" onClick={() => router.push("/")}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1.5 7.5L9 1.5L16.5 7.5V16.5H11.5V11.5H6.5V16.5H1.5V7.5Z" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Year pill */}
          <button ref={yearRef} className="rfb__pill" onClick={() => openPopup("year", yearRef)}>
            <span className="rfb__pill-label">{getYearLabel(yearStart, yearEnd)}</span>
            <span className="rfb__pill-icon"><PencilIcon /></span>
          </button>

          {/* Duration pill */}
          <button ref={durationRef} className="rfb__pill" onClick={() => openPopup("duration", durationRef)}>
            <span className="rfb__pill-label">{getDurationLabel(duration)}</span>
            <span className="rfb__pill-icon"><PencilIcon /></span>
          </button>

          {/* Streaming pill */}
          <button
            ref={streamingRef}
            className={`rfb__pill${selectedProviders.length > 0 ? " rfb__pill--active" : ""}`}
            onClick={() => openPopup("streaming", streamingRef)}
          >
            <span className="rfb__pill-label">{getStreamingLabel(selectedProviders, streamingProviders)}</span>
            <span className="rfb__pill-icon"><PencilIcon /></span>
          </button>
        </div>
      </div>

      {/* Popups — fixed, outside scroll container */}
      {open === "year" && (
        <div className="rfb__popup" style={{ top: popupPos.top, left: popupPos.left }}>
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
        <div className="rfb__popup" style={{ top: popupPos.top, left: popupPos.left }}>
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

      {open === "streaming" && (
        <div className="rfb__popup rfb__popup--streaming" style={{ top: popupPos.top, left: popupPos.left }}>
          <StreamingPopup
            providers={streamingProviders}
            pending={pendingProviders}
            onToggle={(id) => setPendingProviders(prev =>
              prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
            )}
            onApply={() => navigate(currentYear, duration, pendingProviders)}
          />
        </div>
      )}
    </>
  );
}

function StreamingPopup({ providers, pending, onToggle, onApply }: {
  providers: Provider[];
  pending: number[];
  onToggle: (id: number) => void;
  onApply: () => void;
}) {
  const [showAll, setShowAll] = useState(false);

  const popular = providers
    .filter(p => POPULAR_IDS.includes(p.provider_id))
    .sort((a, b) => POPULAR_IDS.indexOf(a.provider_id) - POPULAR_IDS.indexOf(b.provider_id));

  const visible = showAll ? providers : popular;

  return (
    <>
      <div className="rfb__streaming-grid">
        {visible.map(provider => (
          <button
            key={provider.provider_id}
            className={`rfb__streaming-option${pending.includes(provider.provider_id) ? " rfb__streaming-option--selected" : ""}`}
            onClick={() => onToggle(provider.provider_id)}
          >
            <img
              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
              alt={provider.provider_name}
              width={40}
              height={40}
            />
          </button>
        ))}
      </div>
      {!showAll && (
        <button className="rfb__streaming-more" onClick={() => setShowAll(true)}>
          Ver mais opções
        </button>
      )}
      <button className="rfb__streaming-apply" onClick={onApply}>
        {pending.length === 0 ? "Ver todos" : "Ver filmes"}
      </button>
    </>
  );
}

function PencilIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M8.5 1.5L10.5 3.5L3.5 10.5H1.5V8.5L8.5 1.5Z" stroke="#969696" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}
