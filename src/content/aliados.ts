/**
 * Plataformas aliadas: Anexo A de la GUÍA LIGA KINIELA v2.0 (9, en ese orden).
 * La guía manda (D3, D5): el dominio se conserva tal como aparece en la guía,
 * aunque difiera de otro nombre (p. ej. READHAIRBET.COM vs redhairbet.com del pool de logos).
 * Sin URL directa a la taquilla: los botones abren el sitio oficial del aliado.
 * Nota (Anexo A): la lista puede ampliarse; la vigente es la de los canales oficiales.
 */

export interface Aliado {
  /** Número en el Anexo A (1 a 9). */
  id: number;
  nombre: string;
  /** Dominio exactamente como aparece en la guía. */
  dominioGuia: string;
  /** https://dominio en minúsculas. */
  url: string;
  /**
   * Logo servible por Next (ruta dentro de /public) o null si no hay.
   * Solo se llena con archivos que ya existen en public/allies.
   */
  logo: string | null;
  /**
   * Logo ya descargado pero NO servible aún (carpeta downloaded_logos, fuera de /public).
   * Informativo: pendiente de mover a public/allies por quien corresponda.
   */
  logoDescargado?: string;
  /** URL remota del logo (pool de logos / lista anterior), solo como respaldo mientras no haya archivo local. */
  logoRemoto?: string;
  /** Observación sobre diferencias con otras fuentes. */
  nota?: string;
}

export const ALIADOS: Aliado[] = [
  {
    id: 1,
    nombre: 'Parley',
    dominioGuia: 'PARLEY.COM.VE',
    url: 'https://parley.com.ve',
    logo: '/allies/parley-com-ve.png',
  },
  {
    id: 2,
    nombre: 'Mi Casino',
    dominioGuia: 'MICASINO.COM',
    url: 'https://micasino.com',
    logo: '/allies/micasino.png',
    logoRemoto:
      'https://storage.googleapis.com/micasino-sites/micasino/commons/logo-navidad-03-21733168513.png',
  },
  {
    id: 3,
    nombre: 'Triples',
    dominioGuia: 'TRIPLES.BET',
    url: 'https://triples.bet',
    logo: '/allies/triples.png',
    logoRemoto: 'https://triples.bet/assets/img/logo-regular.png',
  },
  {
    id: 4,
    nombre: 'Sella Tu Parley',
    dominioGuia: 'SELLATUPARLEY.COM',
    url: 'https://sellatuparley.com',
    logo: '/allies/sellatuparley.png',
    logoRemoto:
      'https://sellatuparley.com/_next/image?url=https%3A%2F%2Fcdn.sellatuparley.com%2Fs4pwa%2FPWA%2FPWA-1780400070.png&w=1920&q=75',
  },
  {
    id: 5,
    nombre: 'Juega En Línea',
    dominioGuia: 'JUEGAENLINEA.NET',
    url: 'https://juegaenlinea.net',
    logo: '/allies/juegaenlinea.png',
    nota: 'El sitio anterior apuntaba a juegaenlinea.com; la guía dice .NET.',
  },
  {
    id: 6,
    nombre: 'Redhairbet',
    dominioGuia: 'READHAIRBET.COM',
    url: 'https://redhairbet.com',
    logo: '/allies/redhairbet.png',
    logoRemoto: 'https://redhairbet.com/storage/images/1733337657.png',
    nota: 'Cliente confirmó (28-oct-2026): el dominio correcto es redhairbet.com. La guía v2.0 escribe READHAIRBET.COM, error tipográfico por corregir en la próxima versión de la guía.',
  },
  {
    id: 7,
    nombre: 'Meridiano Bet',
    dominioGuia: 'MERIDIANOBET.NET',
    url: 'https://meridianobet.net',
    logo: '/allies/meridianobet.png',
    logoRemoto:
      'https://imagedelivery.net/nryTb-R0OMynkGTJ9JP7Sg/79792d66-fbbd-4a9c-dd78-134a4fc24100/public',
  },
  {
    id: 8,
    nombre: 'Cordialito',
    dominioGuia: 'CORDIALITO.LA',
    url: 'https://cordialito.la',
    logo: '/allies/cordialito.png',
    logoRemoto:
      'https://imagedelivery.net/nryTb-R0OMynkGTJ9JP7Sg/4bcabedb-5769-4429-ca33-9084a3e88f00/public',
  },
  {
    id: 9,
    nombre: 'Caman',
    dominioGuia: 'CAMAN.VIP',
    url: 'https://caman.vip',
    logo: '/allies/caman.png',
    logoRemoto: 'https://images.virtualsoft.tech/m/msj0212T1754400564.png',
    nota: 'La guía escribe CAMAN.VIP; el pool de logos usa camanbet. Se sigue la guía.',
  },
];

export const NOTA_ALIADOS =
  'Necesitas un usuario y saldo en la plataforma que elijas. La lista puede ampliarse; la vigente es la que se muestre en los canales oficiales de Liga Kiniela.';
