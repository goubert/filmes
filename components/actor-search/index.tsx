"use client";

import { useState } from "react";
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

  // TODO: conectar ao TMDB /search/person com debounce

  return (
    <div className="as__search">
      {suggestions.length > 0 && (
        <div className="as__dropdown">
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
