-- =====================================================================
-- LIGA KINIELA: capa manual de Kinielas (match_meta y pool_overrides)
-- Migración idempotente. Ejecutar manualmente en el SQL Editor de Supabase.
--
-- !! RIESGO ACEPTADO POR EL CLIENTE (D7) !!
-- Las políticas de escritura son ABIERTAS (USING true / WITH CHECK true),
-- igual que en supabase/schema.sql. Cualquiera con la anon key puede
-- modificar estas tablas. No se endurece la seguridad del admin por decisión
-- del cliente; queda registrado como riesgo en PLAN_DE_TRABAJO.md §8.
-- =====================================================================

-- 1. Datos manuales por partido. Se enlazan por IDs de equipo (nunca por posición).
CREATE TABLE IF NOT EXISTS public.match_meta (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pool_id       INTEGER NOT NULL,
    home_team_id  INTEGER NOT NULL,
    away_team_id  INTEGER NOT NULL,
    kickoff       TIMESTAMPTZ,
    league        TEXT,
    status        TEXT,
    home_score    INTEGER,
    away_score    INTEGER,
    minute        TEXT,
    final_result  TEXT CHECK (final_result IN ('L', 'E', 'V')),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT match_meta_unique_match UNIQUE (pool_id, home_team_id, away_team_id)
);

CREATE INDEX IF NOT EXISTS idx_match_meta_pool ON public.match_meta (pool_id);

-- 2. Overrides por Kiniela. Un valor no nulo gana sobre el endpoint.
CREATE TABLE IF NOT EXISTS public.pool_overrides (
    pool_id          INTEGER PRIMARY KEY,
    title            TEXT,
    prize_bs         NUMERIC,
    ticket_price_bs  NUMERIC,
    notes            TEXT,
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. RLS: lectura pública y escritura abierta (mismo estilo que schema.sql).
ALTER TABLE public.match_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pool_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica en match_meta" ON public.match_meta;
DROP POLICY IF EXISTS "Permitir modificacion en match_meta" ON public.match_meta;
DROP POLICY IF EXISTS "Permitir lectura publica en pool_overrides" ON public.pool_overrides;
DROP POLICY IF EXISTS "Permitir modificacion en pool_overrides" ON public.pool_overrides;

CREATE POLICY "Permitir lectura publica en match_meta"
    ON public.match_meta FOR SELECT
    USING (true);

CREATE POLICY "Permitir modificacion en match_meta"
    ON public.match_meta FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir lectura publica en pool_overrides"
    ON public.pool_overrides FOR SELECT
    USING (true);

CREATE POLICY "Permitir modificacion en pool_overrides"
    ON public.pool_overrides FOR ALL
    USING (true)
    WITH CHECK (true);
