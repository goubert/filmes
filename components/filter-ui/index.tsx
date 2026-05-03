import { forwardRef } from "react";
import "./filter-ui.css";

// ─── FilterCard ───────────────────────────────────────

type FilterCardProps = {
  label: string;
  onClick?: () => void;
  className?: string;
  active?: boolean;
  children: React.ReactNode;
};

export const FilterCard = forwardRef<HTMLButtonElement, FilterCardProps>(
  function FilterCard({ label, onClick, className, active, children }, ref) {
    return (
      <button
        ref={ref}
        className={["filter-card", active && "filter-card--active", className].filter(Boolean).join(" ")}
        onClick={onClick}
      >
        <div className="filter-card__header">
          <span className="filter-card__label">{label}</span>
          <ChevronUp active={active} />
        </div>
        {children}
      </button>
    );
  }
);

// ─── FilterPopup ──────────────────────────────────────

type FilterPopupProps = {
  onCancel: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
};

export function FilterPopup({ onCancel, onConfirm, children }: FilterPopupProps) {
  return (
    <>
      <div className="filter-overlay" onClick={onCancel} />
      <div className="filter-popup">
        <div className="filter-popup__content">{children}</div>
        <div className="filter-popup__actions">
          <button className="filter-popup__btn filter-popup__btn--cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="filter-popup__btn filter-popup__btn--confirm" onClick={onConfirm}>
            Atualizar busca
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Internal ─────────────────────────────────────────

function ChevronUp({ active }: { active?: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d={active ? "M2 4L6 8L10 4" : "M2 8L6 4L10 8"}
        stroke="#686868"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
