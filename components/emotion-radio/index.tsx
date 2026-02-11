"use client";

import "./emotion-radio.css";


type Option = {
  value: number;
  image: string;
  label?: string;
};
type Props = {
  title: string;
  value: number;
  onChange: (value: number) => void;
  options: Option[];
};




export default function EmotionRadio({
  title,
  value,
  onChange,
  options,
}: Props) {
  return (
    <fieldset className="emotion-group">
      <span>{title}</span>

      <div className="options">
        {options.map((opt) => (
          <label key={opt.value} className="emotion-option">
            <input
              type="radio"
              name={title}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="emotion-radio"
            />

            <img
              src={opt.image}
              alt={opt.label ?? `${title} ${opt.value}`}
              className={`emotion-image ${
                value === opt.value ? "selected" : ""
              }`}
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
