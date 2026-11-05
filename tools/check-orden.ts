// Verificación del orden de las Kinielas (la más próxima a jugarse primero).
// Ejecutar: npx tsx tools/check-orden.ts
import { ordenarPorProximidad } from '../src/lib/kinielas/order';
import { getKinielaStatus } from '../src/lib/kinielas/time';
import type { Kiniela } from '../src/types/kinielas';

const ahora = new Date('2026-11-05T12:00:00Z');
const dias = (n: number) => new Date(ahora.getTime() + n * 86_400_000).toISOString();
const mk = (id: number, abre: number, cierra: number | null): Kiniela =>
  ({ id, salesStart: dias(abre), closesAt: cierra === null ? '' : dias(cierra), status: 'abierta', matches: [], warnings: [] } as unknown as Kiniela);
const estado = (k: Kiniela) => getKinielaStatus(k.salesStart, k.closesAt, ahora);
const orden = (l: Kiniela[]) => ordenarPorProximidad(l, estado).map((k) => k.id).join(',');

let fallos = 0;
const prueba = (nombre: string, obtenido: string, esperado: string) => {
  const ok = obtenido === esperado;
  if (!ok) fallos++;
  console.log(`${ok ? '  ok' : 'FALLA'}  ${nombre} -> ${obtenido}${ok ? '' : ` (esperado ${esperado})`}`);
};

prueba('dos abiertas: cierra antes va primero (aunque llegue segunda en la lista)', orden([mk(1, -3, 5), mk(2, -1, 2)]), '2,1');
prueba('una abierta que cierra en 5 días y una próxima que cierra en 2: gana la que se juega antes', orden([mk(1, -3, 5), mk(2, 1, 2)]), '2,1');
prueba('dos próximas', orden([mk(1, 2, 9), mk(2, 1, 4)]), '2,1');
prueba('una ya empezada y una abierta: la abierta primero', orden([mk(1, -9, -1), mk(2, -1, 3)]), '2,1');
prueba('dos ya empezadas: la más reciente primero', orden([mk(1, -9, -4), mk(2, -9, -1)]), '2,1');
prueba('fecha dañada va al final', orden([mk(1, -1, null), mk(2, -1, 7)]), '2,1');
prueba('empate de fecha: desempata por id', orden([mk(5, -1, 3), mk(4, -1, 3)]), '4,5');
prueba('una sola', orden([mk(7, -1, 3)]), '7');
prueba('lista vacía', orden([]), '');
const original = [mk(1, -3, 5), mk(2, -1, 2)];
ordenarPorProximidad(original, estado);
prueba('no modifica la lista original', original.map((k) => k.id).join(','), '1,2');
console.log(fallos ? `\n${fallos} FALLOS` : '\nTodas las verificaciones OK');
process.exit(fallos ? 1 : 0);
