// Orden de las Kinielas en la web (decisión del cliente, 5-nov-2026):
// con varias Kinielas a la vez, la primera opción es la que está MÁS PRÓXIMA A JUGARSE.
//
// "Próxima a jugarse" = la que cierra su venta antes (el cierre es 1 minuto antes del primer
// partido), entre las que todavía no han empezado. Después van las que ya empezaron o terminaron,
// de la más reciente a la más antigua. Las Kinielas sin fecha válida quedan al final.

import type { Kiniela, KinielaStatus } from '../../types/kinielas';

function momento(k: Kiniela): number | null {
  const t = Date.parse(k.closesAt);
  return Number.isFinite(t) ? t : null;
}

/** Devuelve una copia ordenada: la más próxima a jugarse primero. No modifica la lista original. */
export function ordenarPorProximidad(
  lista: Kiniela[],
  estadoDe: (k: Kiniela) => KinielaStatus = (k) => k.status,
): Kiniela[] {
  const grupo = (k: Kiniela): number => {
    if (momento(k) === null) return 2; // sin fecha válida: al final
    return estadoDe(k) === 'cerrada' ? 1 : 0; // 0 = aún no empieza (abierta o próxima)
  };

  return [...lista].sort((a, b) => {
    const ga = grupo(a);
    const gb = grupo(b);
    if (ga !== gb) return ga - gb;

    const ta = momento(a);
    const tb = momento(b);
    if (ta !== null && tb !== null && ta !== tb) {
      // Las que aún no empiezan: la que cierra antes va primero. Las ya empezadas: la más reciente primero.
      return ga === 1 ? tb - ta : ta - tb;
    }
    return a.id - b.id; // desempate estable
  });
}
