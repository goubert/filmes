"use client"

import "./moods-section.css"

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
  {
    key: "adventure",
    title: "Aventura",
    image: "../emoji-adventure.png",
    activeImage: "../emoji-adventure.png",
    effectImage: "../bg-adventure.png",
    normalBg: "rgba(250, 250, 250, 0.1)",
    activeBg: "#96DFFF",
  },
  {
    key: "family",
    title: "Família",
    image: "../emoji-family.png",
    activeImage: "../emoji-family.png",
    effectImage: "../bg-family.png",
    normalBg: "rgba(250, 250, 250, 0.1)",
    activeBg: "#16DC90",
  },
  {
    key: "animation",
    title: "Animação",
    image: "../emoji-animation.png",
    activeImage: "../emoji-animation.png",
    effectImage: "../bg-animation.png",
    normalBg: "rgba(250, 250, 250, 0.1)",
    activeBg: "#9BFF6D",
  },
  {
    key: "feelgood",
    title: "Feel Good",
    image: "../emoji-scary.png",
    activeImage: "../emoji-scary.png",
    effectImage: "../bg-scary.png",
    normalBg: "rgba(250, 250, 250, 0.1)",
    activeBg: "#FF8A3C",
  },
  {
    key: "nostalgic",
    title: "Nostalgia",
    image: "../emoji-scary.png",
    activeImage: "../emoji-scary.png",
    effectImage: "../bg-scary.png",
    normalBg: "rgba(250, 250, 250, 0.1)",
    activeBg: "#DFCABB",
  },
  {
    key: "psychological",
    title: "Psicológico",
    image: "../emoji-psichological.png",
    activeImage: "../emoji-psichological.png",
    effectImage: "../bg-psichological.png",
    normalBg: "rgba(250, 250, 250, 0.1)",
    activeBg: "#FFFFFF",
  },
  {
    key: "tense",
    title: "Tensão",
    image: "../emoji-tense.png",
    activeImage: "../emoji-tense.png",
    effectImage: "../bg-tense.png",
    normalBg: "rgba(250, 250, 250, 0.1)",
    activeBg: "#FFEB91",
  }
  
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
