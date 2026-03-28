"use client"

import "./moods-section.css"

type Option = {
  value: number
  image?: string
  emoji?: string
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
            {opt.emoji
              ? <span className="mood-emoji-text">{opt.emoji}</span>
              : <img src={opt.image} alt="" width={34} height={34} />
            }
          </button>
        ))}
      </div>
    </div>
  )
}

type EmotionKey = "laugh" | "cry" | "tense" | "scary" | "romance" | "action" | "adventure" | "animation" | "family" | "feelgood" | "melancholic" | "nostalgic" | "psychological"

type MoodsSectionProps = {
  emotions: Record<EmotionKey, number>
  onChange: (key: EmotionKey, value: number) => void
  rir: Option[]
  chorar: Option[]
  tense: Option[]
  terror: Option[]
  romance: Option[]
  action: Option[]
  adventure: Option[]
  animation: Option[]
  family: Option[]
  feelgood: Option[]
  melancholic: Option[]
  nostalgic: Option[]
  psychological: Option[]
}

export function MoodsSection({ emotions, onChange, rir, chorar, tense, terror, romance, action, adventure, animation, family, feelgood, melancholic, nostalgic, psychological }: MoodsSectionProps) {
  return (
    <section className="moods-section">
      <span className="moods-section__title">Filtrar filmes pelos moods</span>
      <div className="moods-grid">
        <MoodCard title="É engraçado"   color="#0098F2" options={rir}       value={emotions.laugh}     onChange={(v) => onChange("laugh", v)} />
        <MoodCard title="Suspense"      color="#761DA6" options={tense}     value={emotions.tense}     onChange={(v) => onChange("tense", v)} />
        <MoodCard title="Faz chorar"    color="#FFD035" textColor="#202020" options={chorar} value={emotions.cry} onChange={(v) => onChange("cry", v)} />
        <MoodCard title="Dá medo"       color="#E1395E" options={terror}    value={emotions.scary}     onChange={(v) => onChange("scary", v)} />
        <MoodCard title="Romance"       color="#FF6034" options={romance}   value={emotions.romance}   onChange={(v) => onChange("romance", v)} />
        <MoodCard title="Ação"          color="#B71C1C" options={action}    value={emotions.action}    onChange={(v) => onChange("action", v)} />
        <MoodCard title="Fantasia"      color="#1565C0" options={adventure} value={emotions.adventure} onChange={(v) => onChange("adventure", v)} />
        <MoodCard title="Animação"      color="#6A1B9A" options={animation} value={emotions.animation} onChange={(v) => onChange("animation", v)} />
        <MoodCard title="Família"       color="#E65100" options={family}    value={emotions.family}    onChange={(v) => onChange("family", v)} />
      </div>

      <span className="moods-section__title moods-section__title--advanced">Moods avançados</span>
      <div className="moods-grid">
        <MoodCard title="Reconfortante"        color="#2E7D32" options={feelgood}     value={emotions.feelgood}     onChange={(v) => onChange("feelgood", v)} />
        <MoodCard title="Melancólico"          color="#37474F" options={melancholic}  value={emotions.melancholic}  onChange={(v) => onChange("melancholic", v)} />
        <MoodCard title="Nostálgico"           color="#E65100" options={nostalgic}    value={emotions.nostalgic}    onChange={(v) => onChange("nostalgic", v)} />
        <MoodCard title="Tensão psicológica"   color="#1A237E" options={psychological} value={emotions.psychological} onChange={(v) => onChange("psychological", v)} />
      </div>
    </section>
  )
}
