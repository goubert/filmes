"use client"

import "./moods-section.css"

/* 
type Option = {
  value: number
  image?: string
  emoji?: string
}

type MoodCardProps = {
  title: string
  //color: string
  textColor?: string
  options: Option[]
  value: number
  onChange: (value: number) => void
  premium?: boolean
}

function MoodCard({ title, textColor = "#ffffff", options, value, onChange, premium = true }: MoodCardProps) {
  if (!premium) return null
  return (
    <div className="mood-card">
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

// ─── Flags de disponibilidade (false = sem imagem, oculto) ──
const PREMIUM = {
  action:        true,
  adventure:     true,
  animation:     true,
  family:        true,
  feelgood:      true,
  melancholic:   true,
  nostalgic:     true,
  psychological: true,
}

const showAdvancedSection = Object.values({
  feelgood:      PREMIUM.feelgood,
  melancholic:   PREMIUM.melancholic,
  nostalgic:     PREMIUM.nostalgic,
  psychological: PREMIUM.psychological,
}).some(Boolean)


*/



/*
export function MoodsSection({ emotions, onChange, rir, chorar, tense, terror, romance, action, adventure, animation, family, feelgood, melancholic, nostalgic, psychological }: MoodsSectionProps) {
  return (
    <section className="moods-section">
      <span className="moods-section__title">Filtrar filmes pelos moods</span>
      <div className="moods-grid">
       <MoodCard title="É engraçado"  options={rir}       value={emotions.laugh}     onChange={(v) => onChange("laugh", v)} />
        <MoodCard title="Suspense"     options={tense}     value={emotions.tense}     onChange={(v) => onChange("tense", v)} />
        <MoodCard title="Faz chorar"   options={chorar} value={emotions.cry} onChange={(v) => onChange("cry", v)} />
        <MoodCard title="Dá medo"      options={terror}    value={emotions.scary}     onChange={(v) => onChange("scary", v)} />
        <MoodCard title="Romance"      options={romance}   value={emotions.romance}   onChange={(v) => onChange("romance", v)} />
        <MoodCard title="Ação"         options={action}    value={emotions.action}    onChange={(v) => onChange("action", v)}    premium={PREMIUM.action} />
        <MoodCard title="Fantasia"     options={adventure} value={emotions.adventure} onChange={(v) => onChange("adventure", v)} premium={PREMIUM.adventure} />
        <MoodCard title="Animação"     options={animation} value={emotions.animation} onChange={(v) => onChange("animation", v)} premium={PREMIUM.animation} />
        <MoodCard title="Família"      options={family}    value={emotions.family}    onChange={(v) => onChange("family", v)}    premium={PREMIUM.family} />
        <MoodCard title="Reconfortante"       options={feelgood}      value={emotions.feelgood}      onChange={(v) => onChange("feelgood", v)}      premium={PREMIUM.feelgood} />
        <MoodCard title="Melancólico"         options={melancholic}   value={emotions.melancholic}   onChange={(v) => onChange("melancholic", v)}   premium={PREMIUM.melancholic} />
        <MoodCard title="Nostálgico"          options={nostalgic}     value={emotions.nostalgic}     onChange={(v) => onChange("nostalgic", v)}     premium={PREMIUM.nostalgic} />
        <MoodCard title="Tensão psicológica"  options={psychological} value={emotions.psychological} onChange={(v) => onChange("psychological", v)} premium={PREMIUM.psychological} />
      </div>

      <div className="moods-grid">
        
      </div>


      
    </section>
  )
}

*/


type EmotionKey =
  | "laugh"
  | "cry"
  | "tense"
  | "scary"
  | "romance"
  | "action"
  | "adventure"
  | "animation"
  | "family"
  | "feelgood"
  | "melancholic"
  | "nostalgic"
  | "psychological"

type MoodItem = {
  key: EmotionKey
  title: string
  image: string
  activeImage?: string
  effectImage?: string
  normalBg: string
  activeBg: string
  textColor?: string
  premium?: boolean
}

type MoodsSectionProps = {
  emotions: Record<EmotionKey, boolean>
  onChange: (key: EmotionKey, value: boolean) => void
}

type MoodToggleCardProps = {
  title: string
  value: boolean
  onChange: (value: boolean) => void
  image: string
  activeImage?: string
  effectImage?: string
  normalBg: string
  activeBg: string
  textColor?: string
  premium?: boolean
}

function MoodToggleCard({
  title,
  value,
  onChange,
  image,
  activeImage,
  effectImage,
  normalBg,
  activeBg,
  textColor = "#fff",
  premium = true,
}: MoodToggleCardProps) {
  if (!premium) return null

  const icon = value && activeImage ? activeImage : image

  return (
    <button
      type="button"
      className={`mood-toggle-card${value ? " mood-toggle-card--active" : ""}`}
      onClick={() => onChange(!value)}
      style={{
        backgroundColor: value ? activeBg : normalBg,
        color: textColor,
      }}
      aria-pressed={value}
    >
      <span className="mood-toggle-card__title">
        {title}
      </span>
      {value && effectImage && (
        <img
          src={effectImage}
          alt=""
          className="mood-toggle-card__effect"
        />
      )}
      

      <img
        src={icon}
        alt=""
        className="mood-toggle-card__icon"
      />

      
    </button>
  )
}

const moods: MoodItem[] = [
  {
    key: "laugh",
    title: "É engraçado",
    image: "../emoji-laugh.png",
    activeImage: "../emoji-laugh.png",
    effectImage: "../bg-laugh.png",
    normalBg: "rgba(250, 250, 250, 0.1)",
    activeBg: "#FFC817",
  },
  {
    key: "action",
    title: "Ação",
    image: "../emoji-action.png",
    activeImage: "../emoji-action.png",
    effectImage: "../bg-action.png",
    normalBg: "rgba(250, 250, 250, 0.1)",
    activeBg: "#FC5252",
  },
  {
    key: "cry",
    title: "Faz chorar",
    image: "../emoji-cry.png",
    activeImage: "../emoji-cry.png",
    effectImage: "../bg-cry.png",
    normalBg: "rgba(250, 250, 250, 0.1)",
    activeBg: "#F7468E",
    textColor: "#202020",
  },
  {
    key: "romance",
    title: "Romance",
    image: "../emoji-romance.png",
    activeImage: "../emoji-romance.png",
    effectImage: "../bg-romance.png",
    normalBg: "rgba(250, 250, 250, 0.1)",
    activeBg: "#45FFF6",
  },
  {
    key: "scary",
    title: "Terror",
    image: "../emoji-scary.png",
    activeImage: "../emoji-scary.png",
    effectImage: "../bg-scary.png",
    normalBg: "rgba(250, 250, 250, 0.1)",
    activeBg: "#8D5EFF",
  },
]

export function MoodsSection({
  emotions,
  onChange,
}: MoodsSectionProps) {
  return (
    <section className="moods-section">
      <span className="moods-section__title">
        Filtrar filmes pelos moods
      </span>

      <div className="moods-grid">
        {moods.map((mood) => (
          <MoodToggleCard
            key={mood.key}
            title={mood.title}
            value={emotions[mood.key]}
            onChange={(v) => onChange(mood.key, v)}
            image={mood.image}
            activeImage={mood.activeImage}
            effectImage={mood.effectImage}
            normalBg={mood.normalBg}
            activeBg={mood.activeBg}
            textColor={mood.textColor}
            premium={mood.premium}
          />
          
        ))}
      </div>
    </section>
  )
}
