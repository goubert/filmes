export type EmotionKey =
  | "laugh" | "cry" | "tense" | "scary" | "romance"
  | "action" | "adventure" | "animation" | "family"
  | "feelgood" | "melancholic" | "nostalgic" | "psychological";

export type EmotionDef = {
  label: string
  genres: number[]
  keywords?: number[]   // dentro do mesmo mood → OR (pipe)
}

export const EMOTIONS: Record<EmotionKey, EmotionDef> = {
  // ─── Moods base ───────────────────────────────────────
  laugh: {
    label: "Esse filme me faz rir",
    genres: [35],
  },
  cry: {
    label: "Esse filme me faz chorar",
    genres: [18],
  },
  tense: {
    label: "Esse filme me deixa tenso",
    genres: [53],
  },
  scary: {
    label: "Esse filme me dá medo",
    genres: [27],
  },
  romance: {
    label: "Filme de romance",
    genres: [10749],
  },
  action: {
    label: "Filme de ação",
    genres: [28],
  },
  adventure: {
    label: "Aventura e fantasia",
    genres: [12],
  },
  animation: {
    label: "Animação",
    genres: [16],
  },
  family: {
    label: "Para toda a família",
    genres: [10751],
  },

  // ─── Moods avançados (keyword-based) ──────────────────
  feelgood: {
    label: "Reconfortante",
    genres: [],
    keywords: [304995],
  },
  melancholic: {
    label: "Melancólico",
    genres: [],
    keywords: [4232],
  },
  nostalgic: {
    label: "Nostálgico",
    genres: [],
    keywords: [4285, 10683],  // 4285 OR 10683
  },
  psychological: {
    label: "Tensão psicológica",
    genres: [53],
    keywords: [149430],
  },
};
