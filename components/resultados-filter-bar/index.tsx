"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FilterCard, FilterPopup } from "../filter-ui";
import "./resultados-filter-bar.css";

const THIS_YEAR = new Date().getFullYear();

const YEAR_PRESETS = [
  { label: "Todos os tempos",      start: 1900,            end: THIS_YEAR },
  { label: "Últimos 5 anos",       start: THIS_YEAR - 5,   end: THIS_YEAR },
  { label: "Últimos 10 anos",      start: THIS_YEAR - 10,  end: THIS_YEAR },
  { label: "Últimos 20 anos",      start: THIS_YEAR - 20,  end: THIS_YEAR },
  { label: "Clássicos (até 2000)", start: 1900,            end: 2000      },
];

const DURATION_OPTIONS = [
  { popupLabel: "Até 1h 30",    cardLabel: "Até 1h30",    value: "short"  },
  { popupLabel: "1h30 até 2h",  cardLabel: "Até 2h",      value: "medium" },
  { popupLabel: "2h+",          cardLabel: "Mais de 2h",  value: "long"   },
];

const POPULAR_IDS = [8, 119, 337, 1899, 307, 531, 350, 283, 11, 227, 188, 167, 2302];

const TMDB_IMG = "https://image.tmdb.org/t/p/original";

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
  selectedCountries: string[];
};

function getYearLabel(start: number, end: number) {
  return YEAR_PRESETS.find(p => p.start === start && p.end === end)?.label ?? `${start} – ${end}`;
}

function getDurationLabel(duration: string | null) {
  return DURATION_OPTIONS.find(d => d.value === duration)?.cardLabel ?? "Qualquer";
}

export function ResultadosFilterBar({
  emotions, yearStart, yearEnd, duration, selectedProviders, streamingProviders, selectedCountries,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState<"year" | "duration" | "moods" | "services" | null>(null);
  const [pendingEmotions, setPendingEmotions] = useState<Emotions | null>(null);
  const [pendingProviders, setPendingProviders] = useState<number[] | null>(null);

  const popularProviders = streamingProviders.filter(p => POPULAR_IDS.includes(p.provider_id))
    .sort((a, b) => POPULAR_IDS.indexOf(a.provider_id) - POPULAR_IDS.indexOf(b.provider_id));

  const activeMoods = Object.entries(emotions)
    .filter(([, v]) => v > 0)
    .map(([key]) => key);

  const visibleMoods = activeMoods.slice(0, 3);
  const extraMoods   = activeMoods.length - visibleMoods.length;

  const currentYear = { start: yearStart, end: yearEnd };

  function navigate(year: { start: number; end: number }, dur: string | null, providers: number[], emo: Emotions = emotions, countries: string[] = selectedCountries) {
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
    if (countries.length) p.set("countries", countries.join(","));
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

  function openServicesPopup() {
    if (open === "services") return;
    setPendingProviders([...selectedProviders]);
    setOpen("services");
  }

  function toggleProvider(id: number) {
    setPendingProviders(prev => {
      if (!prev) return prev;
      return prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id];
    });
  }

  function closeServicesPopup() {
    if (pendingProviders !== null) {
      navigate(currentYear, duration, pendingProviders);
    }
    setPendingProviders(null);
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
            <FilterCard label="MOODS" className="rfb__card--moods" active={open === "moods"} onClick={openMoodsPopup}>
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
              active={open === "year"}
              onClick={() => setOpen(prev => prev === "year" ? null : "year")}
            >
              <span className="rfb__card-value">{getYearLabel(yearStart, yearEnd)}</span>
            </FilterCard>

            <FilterCard
              label="DURAÇÃO"
              className="rfb__card--duration"
              active={open === "duration"}
              onClick={() => setOpen(prev => prev === "duration" ? null : "duration")}
            >
              <span className="rfb__card-value">{getDurationLabel(duration)}</span>
            </FilterCard>

            <FilterCard label="SERVIÇOS" className="rfb__card--services" active={open === "services"} onClick={openServicesPopup}>
              <div className="rfb__provider-icons">
                {selectedProviders.slice(0, 3).map(id => {
                  const p = popularProviders.find(p => p.provider_id === id);
                  return p ? (
                    <img key={id} src={`${TMDB_IMG}${p.logo_path}`} alt={p.provider_name} className="rfb__provider-icon" />
                  ) : null;
                })}
                {selectedProviders.length > 3 && (
                  <span className="rfb__mood-extra">+{selectedProviders.length - 3}</span>
                )}
                {selectedProviders.length === 0 && (
                  <span className="rfb__card-value">Todos</span>
                )}
              </div>
            </FilterCard>
          </div>
        </div>
      </div>

      {open === "year" && (
        <FilterPopup onClose={() => setOpen(null)}>
          <span className="rfb__period-title">FILTRAR FILMES NO PERÍODO:</span>
          <div className="rfb__period-list">
            {YEAR_PRESETS.map(p => (
              <label key={p.label} className="rfb__period-row">
                <input
                  type="radio"
                  name="year-preset"
                  className="rfb__period-radio"
                  checked={p.start === yearStart && p.end === yearEnd}
                  onChange={() => navigate({ start: p.start, end: p.end }, duration, selectedProviders)}
                />
                <span className="rfb__period-row-label">{p.label}</span>
              </label>
            ))}
          </div>
        </FilterPopup>
      )}

      {open === "duration" && (
        <FilterPopup onClose={() => setOpen(null)}>
          <span className="rfb__period-title">FILTRAR FILMES DURAÇÃO</span>
          <div className="rfb__period-list">
            {DURATION_OPTIONS.map(opt => (
              <label key={opt.value} className="rfb__period-row">
                <input
                  type="radio"
                  name="duration-preset"
                  className="rfb__period-radio"
                  checked={opt.value === duration}
                  onChange={() => navigate(currentYear, opt.value, selectedProviders)}
                />
                <span className="rfb__period-row-label">{opt.popupLabel}</span>
              </label>
            ))}
          </div>
        </FilterPopup>
      )}

      {open === "services" && pendingProviders !== null && (
        <FilterPopup onClose={closeServicesPopup}>
          <span className="rfb__moods-title">STREAMINGS SELECIONADOS</span>
          <div className="rfb__services-grid">
            {popularProviders.map(p => {
              const active = pendingProviders.includes(p.provider_id);
              return (
                <button
                  key={p.provider_id}
                  className={`rfb__service-item${active ? " rfb__service-item--active" : ""}`}
                  onClick={() => toggleProvider(p.provider_id)}
                  title={p.provider_name}
                >
                  <img
                    src={`${TMDB_IMG}${p.logo_path}`}
                    alt={p.provider_name}
                    className="rfb__service-logo"
                  />
                </button>
              );
            })}
          </div>
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
