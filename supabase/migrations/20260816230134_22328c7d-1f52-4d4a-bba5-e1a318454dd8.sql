
-- Adicionar novas tabelas para uma gestão mais granular da Jornada do Herói

-- Tabela de Missões
CREATE TABLE IF NOT EXISTS public.hero_journey_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    archetype TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- pending, completed
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, archetype)
);

-- Tabela de Protocolos
CREATE TABLE IF NOT EXISTS public.hero_journey_protocols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    archetype TEXT NOT NULL,
    steps_completed JSONB DEFAULT '[]' NOT NULL, -- Array de índices 0-4
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, archetype)
);

-- Tabela de Conquistas (Badges)
CREATE TABLE IF NOT EXISTS public.hero_journey_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    achievement_key TEXT NOT NULL, -- 'PRIMEIRO_PASSO', 'PRIMEIRA_MISSAO', etc.
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, achievement_key)
);

-- Grants
GRANT SELECT, INSERT, UPDATE ON public.hero_journey_missions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.hero_journey_protocols TO authenticated;
GRANT SELECT, INSERT ON public.hero_journey_achievements TO authenticated;
GRANT ALL ON public.hero_journey_missions TO service_role;
GRANT ALL ON public.hero_journey_protocols TO service_role;
GRANT ALL ON public.hero_journey_achievements TO service_role;

-- RLS
ALTER TABLE public.hero_journey_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_journey_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_journey_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own missions" ON public.hero_journey_missions
    FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own protocols" ON public.hero_journey_protocols
    FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own achievements" ON public.hero_journey_achievements
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "System can award achievements" ON public.hero_journey_achievements
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
