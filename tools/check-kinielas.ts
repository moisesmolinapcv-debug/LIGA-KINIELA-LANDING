// Verificación del normalizador, tiempo y capa manual. Uso: npx tsx tools/check-kinielas.ts
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { normalizePools, stripEmojis } from '../src/lib/kinielas/normalize';
import { applyManual } from '../src/lib/kinielas/manual';
import { computeClosesAt, getKinielaStatus, getRemaining, formatDateTimeVE } from '../src/lib/kinielas/time';

let passed = 0;
const t = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log('  ok  ' + name);
};

type Row = Record<string, unknown>;
const row = (pool: number, team: number, side: 'home' | 'away', extra: Row = {}): Row => ({
  id: pool,
  team_id: team,
  homeaway: side,
  name: 'T' + team,
  short_name: 'T' + team,
  code: '🏆Kiniela X' + pool + '🏆',
  sales_start: '2026-10-20T20:00:00.000000Z',
  sales_finish: '2026-11-03T20:00:00.000000Z',
  ticket_price: '1000.00',
  prize_base_amount: '2500000.00',
  total_matches: 1,
  info: '{"title":"x","rules":["no exponer"]}',
  image_home: 'https://ligakiniela.com/team/' + team + '/image',
  image_away: 'https://ligakiniela.com/team/' + team + '/image',
  ...extra,
});
const NOW = new Date('2026-10-28T12:00:00Z');

console.log('Fixture real');
const sample = JSON.parse(readFileSync(join(__dirname, '../docs/endpoint-sample-2026-10-28.json'), 'utf8'));
const real = normalizePools(sample, NOW);
t('1 kiniela, id 32, 10 partidos, sin warnings', () => {
  assert.equal(real.length, 1);
  assert.equal(real[0].id, 32);
  assert.equal(real[0].matches.length, 10);
  assert.deepEqual(real[0].warnings, []);
});
t('montos numericos y no gratuita', () => {
  assert.equal(real[0].ticketPriceBs, 1000);
  assert.equal(real[0].prizeBs, 2500000);
  assert.equal(real[0].isFree, false);
});
t('nombre sin emojis, original conservado', () => {
  assert.equal(real[0].name, 'Kiniela Champions IV');
  assert.equal(real[0].code, '🏆Kiniela Champions IV🏆');
});
t('primer partido: fila0 away(66) + fila1 home(4) => local 4, visitante 66', () => {
  assert.equal(real[0].matches[0].homeTeam.id, 4);
  assert.equal(real[0].matches[0].awayTeam.id, 66);
  assert.equal(real[0].matches[0].key, '4-66');
  assert.equal(real[0].matches[0].homeTeam.logoUrl, 'https://ligakiniela.com/team/4/image');
});
t('orden del feed preservado (index 1..10)', () => {
  assert.deepEqual(real[0].matches.map((m) => m.index), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});
t('cierre = sales_finish - 60 s y estado abierta', () => {
  assert.equal(real[0].closesAt, '2026-11-03T19:59:00.000Z');
  assert.equal(real[0].status, 'abierta');
});
t('no expone reglas del info (D3)', () => {
  assert.equal(JSON.stringify(real[0]).includes('pitazo'), false);
});

console.log('Sinteticos');
t('2 kinielas simultaneas agrupadas por id', () => {
  const r = normalizePools({ pools: [row(1, 10, 'home'), row(2, 30, 'away'), row(1, 11, 'away'), row(2, 31, 'home')] }, NOW);
  assert.equal(r.length, 2);
  assert.equal(r[0].id, 1);
  assert.equal(r[1].id, 2);
  assert.equal(r[0].matches[0].key, '10-11');
  assert.equal(r[1].matches[0].key, '31-30');
});
t('par invalido (dos home): warning y no rompe el resto', () => {
  const tm = { total_matches: 2 };
  const r = normalizePools({ pools: [row(1, 10, 'home', tm), row(1, 11, 'home', tm), row(1, 12, 'home', tm), row(1, 13, 'away', tm)] }, NOW);
  assert.equal(r[0].matches.length, 1);
  assert.equal(r[0].matches[0].key, '12-13');
  assert.equal(r[0].matches[0].index, 2);
  assert.ok(r[0].warnings.some((w) => w.includes('partido 1')));
  assert.ok(r[0].warnings.some((w) => w.includes('total_matches')));
});
t('fila suelta: warning', () => {
  const r = normalizePools({ pools: [row(1, 10, 'home'), row(1, 11, 'away'), row(1, 12, 'home')] }, NOW);
  assert.equal(r[0].matches.length, 1);
  assert.ok(r[0].warnings.some((w) => w.includes('suelta')));
});
t('info invalido: warning, resto intacto', () => {
  const r = normalizePools({ pools: [row(1, 10, 'home', { info: '{roto' }), row(1, 11, 'away')] }, NOW);
  assert.equal(r[0].matches.length, 1);
  assert.ok(r[0].warnings.some((w) => w.includes('info')));
});
t('ticket 0 => gratuita; ticket null => no gratuita + warning', () => {
  const a = normalizePools({ pools: [row(1, 10, 'home', { ticket_price: '0.00' }), row(1, 11, 'away', { ticket_price: '0.00' })] }, NOW);
  assert.equal(a[0].isFree, true);
  const b = normalizePools({ pools: [row(1, 10, 'home', { ticket_price: null }), row(1, 11, 'away', { ticket_price: null })] }, NOW);
  assert.equal(b[0].isFree, false);
  assert.ok(b[0].warnings.some((w) => w.includes('ticket_price')));
});
t('orden invertido (home primero) valido', () => {
  const r = normalizePools({ pools: [row(1, 10, 'home'), row(1, 11, 'away')] }, NOW);
  assert.equal(r[0].matches[0].key, '10-11');
});
t('payload invalido lanza; filas basura se ignoran', () => {
  assert.throws(() => normalizePools({}, NOW));
  assert.doesNotThrow(() => normalizePools({ pools: [null, 5, {}, row(1, 10, 'home'), row(1, 11, 'away')] }, NOW));
});
t('stripEmojis', () => assert.equal(stripEmojis('🏆Kiniela  Champions IV🏆'), 'Kiniela Champions IV'));

console.log('Tiempo');
t('estados proxima / abierta / cerrada', () => {
  const s = '2026-10-20T20:00:00Z';
  const c = computeClosesAt('2026-11-03T20:00:00Z');
  assert.equal(getKinielaStatus(s, c, new Date('2026-10-19T00:00:00Z')), 'proxima');
  assert.equal(getKinielaStatus(s, c, new Date('2026-11-03T19:58:59Z')), 'abierta');
  assert.equal(getKinielaStatus(s, c, new Date('2026-11-03T19:59:00Z')), 'cerrada');
  assert.equal(getKinielaStatus('', c, NOW), 'cerrada');
});
t('cuenta regresiva', () => {
  const r = getRemaining('2026-10-29T13:02:03Z', NOW);
  assert.deepEqual([r.days, r.hours, r.minutes, r.seconds, r.expired], [1, 1, 2, 3, false]);
  assert.equal(getRemaining('2026-10-01T00:00:00Z', NOW).expired, true);
});
t('formato en hora de Venezuela (UTC-4)', () => {
  const f = formatDateTimeVE('2026-11-03T19:59:00Z');
  console.log('      ->', f);
  assert.ok(f.includes('3:59'));
});

console.log('Capa manual');
t('override solo si no es null; meta por IDs de equipo, no por posicion', () => {
  const base = normalizePools(sample, NOW);
  const out = applyManual(base, {
    poolOverrides: [{ poolId: 32, prizeBs: 3000000 }],
    matchMeta: [{ poolId: 32, homeTeamId: 4, awayTeamId: 66, manual: { league: 'Champions', homeScore: 2 } }],
  });
  assert.equal(out[0].prizeBs, 3000000);
  assert.equal(out[0].ticketPriceBs, 1000);
  assert.deepEqual(out[0].overrides, { prizeBs: true });
  assert.equal(out[0].matches[0].manual?.league, 'Champions');
  assert.equal(out[0].matches[1].manual, undefined);
  assert.equal(base[0].prizeBs, 2500000);
  const inv = applyManual(base, {
    poolOverrides: [],
    matchMeta: [{ poolId: 32, homeTeamId: 66, awayTeamId: 4, manual: { league: 'X' } }],
  });
  assert.equal(inv[0].matches[0].manual, undefined);
});

console.log(`\n${passed} verificaciones OK`);
