-- Types
CREATE TYPE public.hero_archetype_status AS ENUM ('locked', 'available', 'in_progress', 'completed');
CREATE TYPE public.hero_archetype_name AS ENUM ('inocente', 'orfao', 'guerreiro', 'altruista', 'nomade', 'mago');

-- Journey Progress
CREATE TABLE public.hero_journey_archetypes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    archetype hero_archetype_name NOT NULL,
    status hero_archetype_status DEFAULT 'locked' NOT NULL,
    progress INTEGER DEFAULT 0 NOT NULL, -- 0 to 100
    reflection_text TEXT,
    mission_completed BOOLEAN DEFAULT FALSE,
    protocol_steps_completed JSONB DEFAULT '[]', -- Array of completed step indices
    unlocked_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, archetype)
);

-- User Stats & Gamification
CREATE TABLE public.hero_journey_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_progress INTEGER DEFAULT 0,
    archetypes_explored INTEGER DEFAULT 0,
    missions_completed INTEGER DEFAULT 0,
    protocols_realized INTEGER DEFAULT 0,
    consciousness_level INTEGER DEFAULT 1,
    current_archetype hero_archetype_name,
    secondary_archetype hero_archetype_name,
    badges JSONB DEFAULT '[]',
    last_interaction TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Diagnosis History
CREATE TABLE public.hero_journey_diagnosis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    results JSONB NOT NULL, -- Detailed scores for each archetype
    predominant hero_archetype_name NOT NULL,
    secondary hero_archetype_name,
    recommendation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Grants
GRANT SELECT, INSERT, UPDATE ON public.hero_journey_archetypes TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.hero_journey_stats TO authenticated;
GRANT SELECT, INSERT ON public.hero_journey_diagnosis TO authenticated;
GRANT ALL ON public.hero_journey_archetypes TO service_role;
GRANT ALL ON public.hero_journey_stats TO service_role;
GRANT ALL ON public.hero_journey_diagnosis TO service_role;

-- RLS
ALTER TABLE public.hero_journey_archetypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_journey_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_journey_diagnosis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own archetype progress" ON public.hero_journey_archetypes
    FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own journey stats" ON public.hero_journey_stats
    FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own diagnosis" ON public.hero_journey_diagnosis
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diagnosis" ON public.hero_journey_diagnosis
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
