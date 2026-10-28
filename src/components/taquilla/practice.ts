'use client';

// Boleto de práctica: estado de las marcas y persistencia local por Kiniela.
// Nada de esto se envía a ningún servidor ni registra una jugada.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FinalResult, Kiniela, KinielaMatch } from '../../types/kinielas';

export type Pick = FinalResult; // 'L' | 'E' | 'V'
export type Picks = Record<string, Pick>;

const KEY_PREFIX = 'liga_kiniela_practica_v1_pool_';
const VALID: readonly string[] = ['L', 'E', 'V'];

function storageKey(poolId: number): string {
  return `${KEY_PREFIX}${poolId}`;
}

function load(poolId: number): Picks {
  try {
    const raw = window.localStorage.getItem(storageKey(poolId));
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    const out: Picks = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === 'string' && VALID.includes(v)) out[k] = v as Pick;
    }
    return out;
  } catch {
    return {};
  }
}

function save(poolId: number, picks: Picks) {
  try {
    if (Object.keys(picks).length === 0) window.localStorage.removeItem(storageKey(poolId));
    else window.localStorage.setItem(storageKey(poolId), JSON.stringify(picks));
  } catch {
    /* modo privado o almacenamiento lleno: el boleto sigue funcionando en memoria */
  }
}

/** Marcas de la Kiniela dada. Se leen tras montar (no desajusta la hidratación). */
export function usePractice(kiniela: Kiniela | undefined) {
  const poolId = kiniela?.id ?? null;
  const [state, setState] = useState<{ id: number | null; picks: Picks }>({ id: null, picks: {} });
  const ref = useRef<Picks>({});

  useEffect(() => {
    if (poolId === null) return;
    const loaded = load(poolId);
    ref.current = loaded;
    setState({ id: poolId, picks: loaded });
  }, [poolId]);

  // Solo se consideran las marcas de partidos que existen hoy en la Kiniela.
  const picks: Picks = {};
  if (kiniela && state.id === poolId) {
    for (const m of kiniela.matches) {
      const p = state.picks[m.key];
      if (p) picks[m.key] = p;
    }
  }

  /** Marca una opción; tocar la ya marcada la desmarca. Devuelve true si quedó marcada. */
  const toggle = useCallback(
    (matchKey: string, option: Pick): boolean => {
      if (poolId === null) return false;
      const next = { ...ref.current };
      let marked = true;
      if (next[matchKey] === option) {
        delete next[matchKey];
        marked = false;
      } else {
        next[matchKey] = option;
      }
      ref.current = next;
      setState({ id: poolId, picks: next });
      save(poolId, next);
      return marked;
    },
    [poolId],
  );

  const reset = useCallback(() => {
    if (poolId === null) return;
    ref.current = {};
    setState({ id: poolId, picks: {} });
    save(poolId, {});
  }, [poolId]);

  return { picks, toggle, reset };
}

/** Aciertos de práctica sobre los partidos con finalResult (los suspendidos se anulan). */
export function scorePractice(matches: KinielaMatch[], picks: Picks): { hits: number; decided: number; picked: number } {
  let hits = 0;
  let decided = 0;
  let picked = 0;
  for (const m of matches) {
    const fr = m.manual?.finalResult;
    if (!fr || m.manual?.status === 'SUSPENDIDO') continue;
    decided += 1;
    const p = picks[m.key];
    if (!p) continue;
    picked += 1;
    if (p === fr) hits += 1;
  }
  return { hits, decided, picked };
}

/** Vibración corta al sellar, si el dispositivo la soporta y no se pidió menos movimiento. */
export function buzz(ms = 14) {
  try {
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    navigator.vibrate(ms);
  } catch {
    /* sin soporte */
  }
}
