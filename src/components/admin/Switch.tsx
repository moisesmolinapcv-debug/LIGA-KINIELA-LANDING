'use client';

import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** Texto accesible del interruptor. */
  label: string;
  disabled?: boolean;
  /** Muestra el texto "Activo / Pausado" junto al interruptor. */
  showText?: boolean;
  onText?: string;
  offText?: string;
}

/** Interruptor con área táctil de 44 px y foco visible. */
export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  showText = false,
  onText = 'Activo',
  offText = 'Pausado',
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={(e) => {
      e.stopPropagation();
      onChange(!checked);
    }}
    className="inline-flex items-center gap-2 min-h-[44px] min-w-[44px] px-1 rounded-xl disabled:opacity-50"
  >
    <span
      aria-hidden="true"
      className={`relative inline-block h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-emerald-600' : 'bg-slate-600'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </span>
    {showText && (
      <span className={`text-xs font-bold ${checked ? 'text-emerald-300' : 'text-slate-300'}`}>
        {checked ? onText : offText}
      </span>
    )}
  </button>
);
