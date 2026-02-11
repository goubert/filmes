"use client";

import {EmotionKey} from "@/lib/emotions"
type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};
const labels = {
    1: "Não me faz rir",
    2: "Dou uma leve risada",
    3: "Dou muita risada",
  };

export default function EmotionSlide({ label, value, onChange }: Props) {
  return (
    
    <div>
      <p>{label}</p>

      <input
        type="range"
        min={1}
        max={3}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        />

      <span>Intensidade: {value}</span>
    </div>
  );
}
