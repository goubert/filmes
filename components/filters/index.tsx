"use client"

import { useEffect, useState } from "react"
import "./filters.css"

const MIN_YEAR = 1900
const MAX_YEAR = 2026
const TICK_YEARS = [1900, 1920, 1940, 1960, 1980, 2000, 2020, 2026]
const DURATION_PILLS = [
  { label: "Até 1h 30m", value: "short" },
  { label: "1h 30m até 2h", value: "medium" },
  { label: "2h +", value: "long" },
]
const POPULAR_IDS = [8, 119, 337, 1899, 307, 531, 350, 283, 11, 227, 188, 167]

type Provider = { provider_id: number; provider_name: string; logo_path: string }

type FiltersProps = {
  yearStart: number
  yearEnd: number
  onYearChange: (start: number, end: number) => void
  duration: string | null
  onDurationChange: (value: string | null) => void
  selectedProviders: number[]
  onProvidersChange: (ids: number[]) => void
}

export function FiltersSection({
  yearStart, yearEnd, onYearChange,
  duration, onDurationChange,
  selectedProviders, onProvidersChange,
}: FiltersProps) {
  const [providers, setProviders] = useState<Provider[]>([])

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/watch/providers/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR&watch_region=BR`
    )
      .then(r => r.json())
      .then(data => {
        const popular = (data.results as Provider[])
          .filter(p => POPULAR_IDS.includes(p.provider_id))
          .sort((a, b) => POPULAR_IDS.indexOf(a.provider_id) - POPULAR_IDS.indexOf(b.provider_id))
        setProviders(popular)
      })
  }, [])

  const minPercent = ((yearStart - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100
  const maxPercent = ((yearEnd - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100

  function toggleProvider(id: number) {
    onProvidersChange(
      selectedProviders.includes(id)
        ? selectedProviders.filter(p => p !== id)
        : [...selectedProviders, id]
    )
  }

  return (
    <div className="filters-section">

      {/* Duração */}
      <div className="filter-block filter-block--top">
        <span className="filter-label">Duração</span>
        <div className="duration-pills">
          {DURATION_PILLS.map((pill) => (
            <button
              key={pill.value}
              className={`duration-pill${duration === pill.value ? " duration-pill--active" : ""}`}
              onClick={() => onDurationChange(duration === pill.value ? null : pill.value)}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Streaming */}
      <div className="filter-block filter-block--middle">
        <span className="filter-label">Streaming</span>
        <div className="streaming-pills">
          {providers.map(p => (
            <button
              key={p.provider_id}
              className={`streaming-pill${selectedProviders.includes(p.provider_id) ? " streaming-pill--active" : ""}`}
              onClick={() => toggleProvider(p.provider_id)}
              title={p.provider_name}
            >
              <img
                src={`https://image.tmdb.org/t/p/original${p.logo_path}`}
                alt={p.provider_name}
                width={32}
                height={32}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Ano */}
      <div className="filter-block filter-block--bottom">
        <span className="filter-label">Ano</span>
        <div className="year-slider-wrapper">
          <div className="year-slider-track-container">
            <div className="year-slider-track" />
            <div
              className="year-slider-fill"
              style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
            />
            <div className="year-thumb-label" style={{ left: `${minPercent}%` }}>{yearStart}</div>
            <div className="year-thumb-label" style={{ left: `${maxPercent}%` }}>{yearEnd}</div>
            <input
              type="range" min={MIN_YEAR} max={MAX_YEAR} value={yearStart}
              onChange={(e) => onYearChange(Math.min(Number(e.target.value), yearEnd - 1), yearEnd)}
              className="year-range-input"
            />
            <input
              type="range" min={MIN_YEAR} max={MAX_YEAR} value={yearEnd}
              onChange={(e) => onYearChange(yearStart, Math.max(Number(e.target.value), yearStart + 1))}
              className="year-range-input"
              style={{ zIndex: yearEnd <= MIN_YEAR + 10 ? 5 : undefined }}
            />
          </div>
          <div className="year-ticks">
            {TICK_YEARS.map((year) => (
              <div key={year} className="year-tick">
                <div className="year-tick-line" />
                <span>{year}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
