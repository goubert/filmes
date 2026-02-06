"use client";

type Props = {
  title: string;
  value: number;
  onChange: (value: number) => void;
};

const OPTIONS = [
  { value: 1, label: "Pouco" },
  { value: 2, label: "Médio" },
  { value: 3, label: "Muito" },
];

export default function EmotionRadio({ title, value, onChange }: Props) {
  return (
    <fieldset className="emotion-group">
      <legend>{title}</legend>

      <div className="options">
        {OPTIONS.map((opt) => (
          <label key={opt.value}>
            <input
              type="radio"
              name={title}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
