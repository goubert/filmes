"use client"

import "./filters.css"

const MIN_YEAR = 1900
const MAX_YEAR = 2026
const TICK_YEARS = [1900, 1920, 1940, 1960, 1980, 2000, 2020, 2026]
const DURATION_PILLS = [
  { label: "Até 1h 30m", value: "short" },
  { label: "1h 30m até 2h", value: "medium" },
  { label: "2h +", value: "long" },
]

type FiltersProps = {
  yearStart: number
  yearEnd: number
  onYearChange: (start: number, end: number) => void
  duration: string | null
  onDurationChange: (value: string | null) => void
}

export function FiltersSection({ yearStart, yearEnd, onYearChange, duration, onDurationChange }: FiltersProps) {

  const minPercent = ((yearStart - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100
  const maxPercent = ((yearEnd - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100

  return (
    <div className="filters-section">

      {/* Duração — UI only */}
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

      {/* Ano — dual range slider */}
      <div className="filter-block filter-block--bottom">
        <span className="filter-label">Ano</span>
        <div className="year-slider-wrapper">

          <div className="year-slider-track-container">
            {/* Track background */}
            <div className="year-slider-track" />

            {/* Active fill between thumbs */}
            <div
              className="year-slider-fill"
              style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
            />

            {/* Visual thumb labels (not interactive) */}
            <div className="year-thumb-label" style={{ left: `${minPercent}%` }}>
              {yearStart}
            </div>
            <div className="year-thumb-label" style={{ left: `${maxPercent}%` }}>
              {yearEnd}
            </div>

            {/* Min range input */}
            <input
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={yearStart}
              onChange={(e) => {
                const val = Math.min(Number(e.target.value), yearEnd - 1)
                onYearChange(val, yearEnd)
              }}
              className="year-range-input"
            />

            {/* Max range input — raised z-index when min is at max edge */}
            <input
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={yearEnd}
              onChange={(e) => {
                const val = Math.max(Number(e.target.value), yearStart + 1)
                onYearChange(yearStart, val)
              }}
              className="year-range-input"
              style={{ zIndex: yearEnd <= MIN_YEAR + 10 ? 5 : undefined }}
            />
          </div>

          {/* Tick marks */}
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
