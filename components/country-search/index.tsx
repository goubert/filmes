"use client";

import { useState } from "react";
import "./country-search.css";

export type Country = {
  iso: string;
  name: string;
};

export const ALL_COUNTRIES: Country[] = [
  { iso: "AR", name: "Argentina" },
  { iso: "AU", name: "Austrália" },
  { iso: "BR", name: "Brasil" },
  { iso: "CA", name: "Canadá" },
  { iso: "CN", name: "China" },
  { iso: "KR", name: "Coreia do Sul" },
  { iso: "DK", name: "Dinamarca" },
  { iso: "ES", name: "Espanha" },
  { iso: "US", name: "Estados Unidos" },
  { iso: "FR", name: "França" },
  { iso: "IN", name: "Índia" },
  { iso: "IE", name: "Irlanda" },
  { iso: "IT", name: "Itália" },
  { iso: "JP", name: "Japão" },
  { iso: "MX", name: "México" },
  { iso: "NO", name: "Noruega" },
  { iso: "PT", name: "Portugal" },
  { iso: "GB", name: "Reino Unido" },
  { iso: "RU", name: "Rússia" },
  { iso: "SE", name: "Suécia" },
  { iso: "TR", name: "Turquia" },
];

export function isoToFlag(iso: string) {
  return Array.from(iso.toUpperCase())
    .map(c => String.fromCodePoint(c.charCodeAt(0) + 127397))
    .join("");
}

// ─── List ─────────────────────────────────────────────

type ListProps = {
  selected: Country[];
  onRemove: (iso: string) => void;
};

export function CountrySearchList({ selected, onRemove }: ListProps) {
  if (!selected.length) return null;
  return (
    <div className="cs__list">
      {selected.map(c => (
        <div key={c.iso} className="cs__item">
          <span className="cs__item-flag">{isoToFlag(c.iso)}</span>
          <span className="cs__item-name">{c.name}</span>
          <button className="cs__item-remove" onClick={() => onRemove(c.iso)}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 3L9 9M9 3L3 9" stroke="#FAF0EC" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Input ────────────────────────────────────────────

type InputProps = {
  selected: Country[];
  onAdd: (country: Country) => void;
};

export function CountrySearchInput({ selected, onAdd }: InputProps) {
  const [query, setQuery] = useState("");

  const suggestions = query.length >= 1
    ? ALL_COUNTRIES.filter(c =>
        !selected.some(s => s.iso === c.iso) &&
        c.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  function handleAdd(country: Country) {
    onAdd(country);
    setQuery("");
  }

  return (
    <div className="cs__search">
      {suggestions.length > 0 && (
        <div className="cs__dropdown">
          {suggestions.map(c => (
            <button key={c.iso} className="cs__dropdown-item" onMouseDown={() => handleAdd(c)}>
              <span className="cs__item-flag">{isoToFlag(c.iso)}</span>
              {c.name}
            </button>
          ))}
        </div>
      )}
      <div className="cs__input-row">
        <input
          className="cs__input"
          type="text"
          placeholder="Buscar por país"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button
          className="cs__add-btn"
          onMouseDown={() => { if (suggestions[0]) handleAdd(suggestions[0]); }}
        >
          +
        </button>
      </div>
    </div>
  );
}

// ─── Composite (usado na home page) ───────────────────

type Props = {
  selected: Country[];
  onAdd: (country: Country) => void;
  onRemove: (iso: string) => void;
};

export function CountrySearch({ selected, onAdd, onRemove }: Props) {
  return (
    <div className="cs">
      <CountrySearchList selected={selected} onRemove={onRemove} />
      <CountrySearchInput selected={selected} onAdd={onAdd} />
    </div>
  );
}
