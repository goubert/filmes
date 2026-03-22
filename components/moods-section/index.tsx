"use client"

import "./moods-section.css"

type Option = {
  value: number
  image: string
}

type MoodCardProps = {
  title: string
  color: string
  textColor?: string
  options: Option[]
  value: number
  onChange: (value: number) => void
}

function MoodCard({ title, color, textColor = "#ffffff", options, value, onChange }: MoodCardProps) {
  return (
    <div className="mood-card" style={{ background: color }}>
      <span className="mood-card__title" style={{ color: textColor }}>{title}</span>
      <div className="mood-card__emojis">
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`mood-emoji-btn${value === opt.value ? " mood-emoji-btn--selected" : ""}`}
            onClick={() => onChange(opt.value)}
            aria-label={`${title} nível ${opt.value}`}
          >
            <img src={opt.image} alt="" width={40} height={40} />
          </button>
        ))}
      </div>
    </div>
  )
}

type EmotionKey = "laugh" | "cry" | "tense" | "scary" | "romance"

type MoodsSectionProps = {
  emotions: Record<EmotionKey, number>
  onChange: (key: EmotionKey, value: number) => void
  rir: Option[]
  chorar: Option[]
  tense: Option[]
  terror: Option[]
  romance: Option[]
}

export function MoodsSection({ emotions, onChange, rir, chorar, tense, terror, romance }: MoodsSectionProps) {
  return (
    <section className="moods-section">
      <span className="moods-section__title">Filtrar filmes pelos moods</span>
      <div className="moods-grid">
        <MoodCard
          title="É engraçado"
          color="#0098F2"
          options={rir}
          value={emotions.laugh}
          onChange={(v) => onChange("laugh" as EmotionKey, v)}
        />
        <MoodCard
          title="Suspense"
          color="#761DA6"
          options={tense}
          value={emotions.tense}
          onChange={(v) => onChange("tense" as EmotionKey, v)}
        />
        <MoodCard
          title="Faz chorar"
          color="#FFD035"
          textColor="#202020"
          options={chorar}
          value={emotions.cry}
          onChange={(v) => onChange("cry" as EmotionKey, v)}
        />
        <MoodCard
          title="Dá medo"
          color="#E1395E"
          options={terror}
          value={emotions.scary}
          onChange={(v) => onChange("scary" as EmotionKey, v)}
        />
        <MoodCard
          title="Romance"
          color="#FF6034"
          options={romance}
          value={emotions.romance}
          onChange={(v) => onChange("romance" as EmotionKey, v)}
        />
      </div>
    </section>
  )
}
