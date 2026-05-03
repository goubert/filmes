"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import "./actor-search.css";

const TMDB_IMG = "https://image.tmdb.org/t/p/w45";

export type Actor = {
  id: number;
  name: string;
  profile_path: string | null;
};

// ─── List ─────────────────────────────────────────────

type ListProps = {
  selected: Actor[];
  onRemove: (id: number) => void;
};

export function ActorSearchList({ selected, onRemove }: ListProps) {
  if (!selected.length) return null;
  return (
    <div className="as__list">
      {selected.map(a => (
        <div key={a.id} className="as__item">
          {a.profile_path ? (
            <img src={`${TMDB_IMG}${a.profile_path}`} alt={a.name} className="as__item-photo" />
          ) : (
            <div className="as__item-photo as__item-photo--placeholder">{a.name[0]}</div>
          )}
          <span className="as__item-name">{a.name}</span>
          <button className="as__item-remove" onClick={() => onRemove(a.id)}>
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
  selected: Actor[];
  onAdd: (actor: Actor) => void;
};

export function ActorSearchInput({ selected, onAdd }: InputProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Actor[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties | null>(null);

  useLayoutEffect(() => {
    if (!suggestions.length || !wrapperRef.current) { setDropdownStyle(null); return; }
    const rect = wrapperRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      left: rect.left,
      width: rect.width,
      bottom: window.innerHeight - rect.top + 6,
      zIndex: 200,
    });
  }, [suggestions]);

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/tmdb/search-person?query=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        const results: Actor[] = (data.results ?? [])
          .filter((p: any) => p.known_for_department === "Acting")
          .slice(0, 6)
          .map((p: any) => ({ id: p.id as number, name: p.name as string, profile_path: (p.profile_path ?? null) as string | null }));
        setSuggestions(results.filter(a => !selected.some(s => s.id === a.id)));
      } catch {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, selected]);

  return (
    <div className="as__search" ref={wrapperRef}>
      {suggestions.length > 0 && dropdownStyle && (
        <div className="as__dropdown" style={dropdownStyle}>
          {suggestions.map(a => (
            <button
              key={a.id}
              className="as__dropdown-item"
              onMouseDown={() => { onAdd(a); setQuery(""); setSuggestions([]); }}
            >
              {a.profile_path ? (
                <img src={`${TMDB_IMG}${a.profile_path}`} alt={a.name} className="as__dropdown-photo" />
              ) : (
                <div className="as__dropdown-photo as__dropdown-photo--placeholder">{a.name[0]}</div>
              )}
              {a.name}
            </button>
          ))}
        </div>
      )}
      <div className="as__input-row">
        <input
          className="as__input"
          type="text"
          placeholder="Buscar por pessoa"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="as__add-btn">+</button>
      </div>
    </div>
  );
}

// ─── Composite (usado na home page) ───────────────────

type Props = {
  selected: Actor[];
  onAdd: (actor: Actor) => void;
  onRemove: (id: number) => void;
};

export function ActorSearch({ selected, onAdd, onRemove }: Props) {
  return (
    <div className="as">
      <ActorSearchList selected={selected} onRemove={onRemove} />
      <ActorSearchInput selected={selected} onAdd={onAdd} />
    </div>
  );
}
