'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { Switch } from './Switch';
import { HELP, INPUT, LABEL } from './ui';

export interface WinnerFormValues {
  winner_name: string;
  edition_title: string;
  prize_won: string;
  city: string;
  winning_date: string;
  is_recent: boolean;
}

export const todayText = (): string =>
  new Date().toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Caracas' });

export const emptyWinnerForm = (): WinnerFormValues => ({
  winner_name: '',
  edition_title: '',
  prize_won: '',
  city: '',
  winning_date: todayText(),
  is_recent: true,
});

export type WinnerErrors = Partial<Record<'winner_name' | 'edition_title' | 'prize_won' | 'winning_date', string>>;

export function validateWinner(v: WinnerFormValues): WinnerErrors {
  const e: WinnerErrors = {};
  if (!v.winner_name.trim()) e.winner_name = 'Escribe el nombre del campeón.';
  if (!v.edition_title.trim()) e.edition_title = 'Escribe de qué Kiniela fue campeón.';
  if (!v.prize_won.trim()) e.prize_won = 'Escribe el premio que ganó, por ejemplo 300.000 Bs.';
  if (!v.winning_date.trim()) e.winning_date = 'Escribe la fecha del premio.';
  return e;
}

const CITY_PRESETS = ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay', 'San Cristóbal'];

interface WinnerFieldsProps {
  values: WinnerFormValues;
  onChange: (next: WinnerFormValues) => void;
  idPrefix: string;
  errors?: WinnerErrors;
  /** Nombres de las Kinielas activas, como atajo para el campo "Kiniela ganada". */
  suggestedTitles?: string[];
}

const FieldError: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? (
    <p role="alert" className="text-xs text-rose-300 mt-1">
      {msg}
    </p>
  ) : null;

/** Campos comunes de registrar y editar un campeón. */
export const WinnerFields: React.FC<WinnerFieldsProps> = ({ values, onChange, idPrefix, errors, suggestedTitles = [] }) => (
  <div className="space-y-4">
    <div>
      <label htmlFor={`${idPrefix}-name`} className={LABEL}>
        Nombre del campeón
      </label>
      <input
        id={`${idPrefix}-name`}
        type="text"
        value={values.winner_name}
        onChange={(e) => onChange({ ...values, winner_name: e.target.value })}
        aria-invalid={Boolean(errors?.winner_name)}
        placeholder="Nombre o seudónimo tal como se publicará"
        className={INPUT}
      />
      <FieldError msg={errors?.winner_name} />
    </div>

    <div>
      <label htmlFor={`${idPrefix}-edition`} className={LABEL}>
        Kiniela ganada
      </label>
      <input
        id={`${idPrefix}-edition`}
        type="text"
        value={values.edition_title}
        onChange={(e) => onChange({ ...values, edition_title: e.target.value })}
        aria-invalid={Boolean(errors?.edition_title)}
        placeholder="Ej: Kiniela Champions IV"
        className={INPUT}
      />
      {suggestedTitles.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {suggestedTitles.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ ...values, edition_title: t })}
              className="min-h-[44px] px-3 rounded-lg text-xs font-bold bg-[#0c186b]/70 text-slate-100 hover:bg-[#1a2785] border border-[#1a2785]"
            >
              Usar: {t}
            </button>
          ))}
        </div>
      )}
      <FieldError msg={errors?.edition_title} />
    </div>

    <div>
      <label htmlFor={`${idPrefix}-prize`} className={LABEL}>
        Premio que ganó
      </label>
      <input
        id={`${idPrefix}-prize`}
        type="text"
        value={values.prize_won}
        onChange={(e) => onChange({ ...values, prize_won: e.target.value })}
        aria-invalid={Boolean(errors?.prize_won)}
        aria-describedby={`${idPrefix}-prize-help`}
        placeholder="Ej: 300.000 Bs"
        className={`${INPUT} text-kiniela-gold font-bold`}
      />
      <p id={`${idPrefix}-prize-help`} className={`${HELP} mt-1`}>
        Se publica tal como lo escribas (con el monto en Bs).
      </p>
      <FieldError msg={errors?.prize_won} />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label htmlFor={`${idPrefix}-city`} className={`${LABEL} flex items-center gap-1.5`}>
          <MapPin className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />
          Ciudad o estado
        </label>
        <input
          id={`${idPrefix}-city`}
          type="text"
          value={values.city}
          onChange={(e) => onChange({ ...values, city: e.target.value })}
          aria-describedby={`${idPrefix}-city-help`}
          placeholder="Ej: Maracaibo, Zulia"
          className={INPUT}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {CITY_PRESETS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange({ ...values, city: c })}
              className="min-h-[44px] px-3 rounded-lg text-xs font-bold bg-[#0c186b]/70 text-slate-100 hover:bg-[#1a2785] border border-[#1a2785]"
            >
              {c}
            </button>
          ))}
        </div>
        <p id={`${idPrefix}-city-help`} className={`${HELP} mt-1`}>
          Si lo dejas vacío se publica &quot;Venezuela&quot;.
        </p>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-date`} className={LABEL}>
          Fecha del premio
        </label>
        <input
          id={`${idPrefix}-date`}
          type="text"
          value={values.winning_date}
          onChange={(e) => onChange({ ...values, winning_date: e.target.value })}
          aria-invalid={Boolean(errors?.winning_date)}
          placeholder="Ej: 21 de septiembre de 2026"
          className={INPUT}
        />
        <button
          type="button"
          onClick={() => onChange({ ...values, winning_date: todayText() })}
          className="min-h-[44px] mt-1 px-1 text-xs font-bold text-kiniela-gold hover:underline"
        >
          Poner la fecha de hoy
        </button>
        <FieldError msg={errors?.winning_date} />
      </div>
    </div>

    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#0c186b]/40 border border-[#1a2785]">
      <div>
        <p className="text-sm font-bold text-white">Destacar como campeón reciente</p>
        <p className="text-xs text-slate-300">Muestra una insignia dorada en su tarjeta.</p>
      </div>
      <Switch checked={values.is_recent} onChange={(v) => onChange({ ...values, is_recent: v })} label="Destacar como campeón reciente" showText onText="Sí" offText="No" />
    </div>
  </div>
);
