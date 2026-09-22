-- =====================================================================
-- ESQUEMA MAESTRO DE BASE DE DATOS - LIGA KINIELA
-- Compatible con Supabase (PostgreSQL 15+)
-- Ejecutar en el Editor SQL de Supabase (Database -> SQL Editor)
-- =====================================================================

-- Extensión para generación de UUIDs si no está habilitada
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================================
-- 1. TABLA: kiniela_editions (Configuración de Edición Actual y Pasadas)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.kiniela_editions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL DEFAULT 'KINIELA MILLONARIA',
    edition_number TEXT DEFAULT 'Edición #24',
    ticket_price_usd NUMERIC(10, 2) DEFAULT 0.00,
    ticket_price_bs NUMERIC(15, 2) DEFAULT 1000.00,
    prize_amount_usd NUMERIC(12, 2) DEFAULT 0.00,
    prize_amount_bs NUMERIC(18, 2) DEFAULT 1500000.00,
    start_date TIMESTAMPTZ DEFAULT (NOW()),
    end_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '5 days'),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 2. TABLA: matches (Cartelera de Encuentros Deportivos)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    edition_id UUID REFERENCES public.kiniela_editions(id) ON DELETE CASCADE,
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    home_logo TEXT DEFAULT '',
    away_logo TEXT DEFAULT '',
    match_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '2 days'),
    status TEXT NOT NULL CHECK (status IN ('EN ESPERA', 'EN VIVO', 'FINALIZADO')) DEFAULT 'EN ESPERA',
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    minute TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 3. TABLA: winners (Salón de Campeones / Ganadores)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.winners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    edition_title TEXT NOT NULL DEFAULT 'KINIELA MILLONARIA',
    winner_name TEXT NOT NULL,
    prize_won TEXT NOT NULL,
    winning_date TEXT NOT NULL,
    city TEXT DEFAULT 'Venezuela',
    is_recent BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 4. TABLA: banners (Publicidad y Espacio Comercial Dinámico)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL DEFAULT 'Gran Premio Millonario',
    image_url TEXT NOT NULL,
    image_url_mobile TEXT,
    button_text TEXT DEFAULT 'Ver Partidos de la Jornada →',
    target_section TEXT DEFAULT '#partidos',
    target_link TEXT DEFAULT '#',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 5. SEGURIDAD A NIVEL DE FILAS (ROW LEVEL SECURITY - RLS)
-- =====================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.kiniela_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas previas si existían
DROP POLICY IF EXISTS "Permitir lectura publica en kiniela_editions" ON public.kiniela_editions;
DROP POLICY IF EXISTS "Permitir modificacion en kiniela_editions" ON public.kiniela_editions;

DROP POLICY IF EXISTS "Permitir lectura publica en matches" ON public.matches;
DROP POLICY IF EXISTS "Permitir modificacion en matches" ON public.matches;

DROP POLICY IF EXISTS "Permitir lectura publica en winners" ON public.winners;
DROP POLICY IF EXISTS "Permitir modificacion en winners" ON public.winners;

DROP POLICY IF EXISTS "Permitir lectura publica en banners" ON public.banners;
DROP POLICY IF EXISTS "Permitir modificacion en banners" ON public.banners;

-- Políticas de Lectura Pública (Cualquier visitante anon o autenticado puede consultar)
CREATE POLICY "Permitir lectura publica en kiniela_editions"
    ON public.kiniela_editions FOR SELECT
    USING (true);

CREATE POLICY "Permitir modificacion en kiniela_editions"
    ON public.kiniela_editions FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir lectura publica en matches"
    ON public.matches FOR SELECT
    USING (true);

CREATE POLICY "Permitir modificacion en matches"
    ON public.matches FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir lectura publica en winners"
    ON public.winners FOR SELECT
    USING (true);

CREATE POLICY "Permitir modificacion en winners"
    ON public.winners FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir lectura publica en banners"
    ON public.banners FOR SELECT
    USING (true);

CREATE POLICY "Permitir modificacion en banners"
    ON public.banners FOR ALL
    USING (true)
    WITH CHECK (true);

-- Habilitar Realtime para reflejar cambios automáticamente si se suscribe por websockets
ALTER PUBLICATION supabase_realtime ADD TABLE public.kiniela_editions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.winners;
ALTER PUBLICATION supabase_realtime ADD TABLE public.banners;

-- =====================================================================
-- 6. DATOS INICIALES (SEED DATA - REALISMO VENEZUELA Y FÚTBOL INTERNACIONAL)
-- =====================================================================

DO $$
DECLARE
    v_edition_id UUID;
BEGIN
    -- Limpiar data existente para un inicio limpio si se corre varias veces
    DELETE FROM public.matches;
    DELETE FROM public.kiniela_editions;
    DELETE FROM public.winners;
    DELETE FROM public.banners;

    -- 1. Insertar Edición Activa
    INSERT INTO public.kiniela_editions (
        title,
        edition_number,
        ticket_price_usd,
        ticket_price_bs,
        prize_amount_usd,
        prize_amount_bs,
        start_date,
        end_date,
        is_active
    ) VALUES (
        'KINIELA MILLONARIA',
        'Edición Especial #24',
        0.00,
        1000.00,
        0.00,
        1500000.00,
        NOW() - INTERVAL '1 day',
        NOW() + INTERVAL '3 days 14 hours',
        true
    ) RETURNING id INTO v_edition_id;

    -- 2. Insertar Cartelera de Partidos (10 partidos con variedad de estados)
    INSERT INTO public.matches (
        edition_id, home_team, away_team, home_logo, away_logo, match_date, status, home_score, away_score, minute, sort_order
    ) VALUES
    (
        v_edition_id,
        'Alemania',
        'Grecia',
        'https://api.iconify.design/twemoji:flag-germany.svg',
        'https://api.iconify.design/twemoji:flag-greece.svg',
        '2026-09-27T14:45:00-04:00',
        'EN ESPERA',
        0,
        0,
        '',
        1
    ),
    (
        v_edition_id,
        'Noruega',
        'Portugal',
        'https://api.iconify.design/twemoji:flag-norway.svg',
        'https://api.iconify.design/twemoji:flag-portugal.svg',
        '2026-09-27T14:45:00-04:00',
        'EN ESPERA',
        0,
        0,
        '',
        2
    ),
    (
        v_edition_id,
        'Israel',
        'Irlanda',
        'https://api.iconify.design/twemoji:flag-israel.svg',
        'https://api.iconify.design/twemoji:flag-ireland.svg',
        '2026-09-27T14:45:00-04:00',
        'EN ESPERA',
        0,
        0,
        '',
        3
    ),
    (
        v_edition_id,
        'Georgia',
        'Ucrania',
        'https://api.iconify.design/twemoji:flag-georgia.svg',
        'https://api.iconify.design/twemoji:flag-ukraine.svg',
        '2026-09-28T12:00:00-04:00',
        'EN ESPERA',
        0,
        0,
        '',
        4
    ),
    (
        v_edition_id,
        'Armenia',
        'Montenegro',
        'https://api.iconify.design/twemoji:flag-armenia.svg',
        'https://api.iconify.design/twemoji:flag-montenegro.svg',
        '2026-09-28T12:00:00-04:00',
        'EN ESPERA',
        0,
        0,
        '',
        5
    ),
    (
        v_edition_id,
        'Bélgica',
        'Francia',
        'https://api.iconify.design/twemoji:flag-belgium.svg',
        'https://api.iconify.design/twemoji:flag-france.svg',
        '2026-09-28T14:45:00-04:00',
        'EN ESPERA',
        0,
        0,
        '',
        6
    ),
    (
        v_edition_id,
        'Turquía',
        'Italia',
        'https://api.iconify.design/twemoji:flag-turkey.svg',
        'https://api.iconify.design/twemoji:flag-italy.svg',
        '2026-09-28T14:45:00-04:00',
        'EN ESPERA',
        0,
        0,
        '',
        7
    ),
    (
        v_edition_id,
        'Suecia',
        'Polonia',
        'https://api.iconify.design/twemoji:flag-sweden.svg',
        'https://api.iconify.design/twemoji:flag-poland.svg',
        '2026-09-28T14:45:00-04:00',
        'EN ESPERA',
        0,
        0,
        '',
        8
    ),
    (
        v_edition_id,
        'Rumania',
        'Bosnia',
        'https://api.iconify.design/twemoji:flag-romania.svg',
        'https://api.iconify.design/twemoji:flag-bosnia-and-herzegovina.svg',
        '2026-09-28T14:45:00-04:00',
        'EN ESPERA',
        0,
        0,
        '',
        9
    ),
    (
        v_edition_id,
        'Irlanda',
        'Hungría',
        'https://api.iconify.design/twemoji:flag-ireland.svg',
        'https://api.iconify.design/twemoji:flag-hungary.svg',
        '2026-09-28T14:45:00-04:00',
        'EN ESPERA',
        0,
        0,
        '',
        10
    );

    -- 3. Insertar Salón de Campeones (Ganadores destacados venezolanos)
    INSERT INTO public.winners (edition_title, winner_name, prize_won, winning_date, city, is_recent) VALUES
    ('Edición #23 - Champions & Vinotinto', 'Carlos Mendoza', '1.500.000 Bs (Acumulado)', '15 Septiembre 2026', 'Caracas, Dto. Capital', true),
    ('Edición #22 - Clásico de Fin de Semana', 'Yorvis Silva', '800.000 Bs (1er Lugar)', '08 Septiembre 2026', 'Maracaibo, Zulia', true),
    ('Edición #21 - Kiniela Dominguera', 'Mariela Hernández', '1.200.000 Bs (Acumulado)', '01 Septiembre 2026', 'Barquisimeto, Lara', true),
    ('Edición #20 - Copa Conmebol', 'Jesús R. Zambrano', '1.500.000 Bs (Acumulado)', '25 Agosto 2026', 'Valencia, Carabobo', false),
    ('Edición #19 - Liga Futve & Europa', 'Andrés E. Colmenárez', '650.000 Bs (1er Lugar)', '18 Agosto 2026', 'San Cristóbal, Táchira', false);

    -- 4. Insertar Vallas Publicitarias por defecto (Hero Billboard Slider)
    INSERT INTO public.banners (title, image_url, image_url_mobile, button_text, target_section, is_active, sort_order) VALUES
    (
        '¡Gran Pozo Acumulado de 1.500.000 Bs! Participa por solo 1.000 Bs',
        'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1920&h=650&q=85',
        'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1080&h=1250&q=85',
        'Ver Cartelera de Partidos →',
        '#partidos',
        true,
        1
    ),
    (
        'La Pasión del Fútbol: Vinotinto, Libertadores y Clásicos Europeos',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1920&h=650&q=85',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1080&h=1250&q=85',
        'Consultar Premios →',
        '#premios',
        true,
        2
    ),
    (
        'Salón de Campeones: Transparencia y Premios Garantizados',
        'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1920&h=650&q=85',
        'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1080&h=1250&q=85',
        'Conoce los Ganadores →',
        '#campeones',
        true,
        3
    );
END $$;
