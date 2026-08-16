-- Hero Journey Extension Migration - Idempotent
-- Missions
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'hero_journey_missions') THEN
        CREATE TABLE public.hero_journey_missions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            archetype TEXT NOT NULL,
            status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
            completed_at TIMESTAMP WITH TIME ZONE,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
            UNIQUE(user_id, archetype)
        );
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_journey_missions TO authenticated;
        GRANT ALL ON public.hero_journey_missions TO service_role;
        ALTER TABLE public.hero_journey_missions ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users can manage their own missions" ON public.hero_journey_missions FOR ALL TO authenticated USING (auth.uid() = user_id);
    END IF;
END $$;

-- Protocols
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'hero_journey_protocols') THEN
        CREATE TABLE public.hero_journey_protocols (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            archetype TEXT NOT NULL,
            steps_completed INTEGER[] DEFAULT '{}',
            is_completed BOOLEAN DEFAULT false,
            completed_at TIMESTAMP WITH TIME ZONE,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
            UNIQUE(user_id, archetype)
        );
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_journey_protocols TO authenticated;
        GRANT ALL ON public.hero_journey_protocols TO service_role;
        ALTER TABLE public.hero_journey_protocols ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users can manage their own protocols" ON public.hero_journey_protocols FOR ALL TO authenticated USING (auth.uid() = user_id);
    END IF;
END $$;

-- Reflections
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'hero_journey_reflections') THEN
        CREATE TABLE public.hero_journey_reflections (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            archetype TEXT NOT NULL,
            reflection_text TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
            UNIQUE(user_id, archetype)
        );
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_journey_reflections TO authenticated;
        GRANT ALL ON public.hero_journey_reflections TO service_role;
        ALTER TABLE public.hero_journey_reflections ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users can manage their own reflections" ON public.hero_journey_reflections FOR ALL TO authenticated USING (auth.uid() = user_id);
    END IF;
END $$;

-- Achievements
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'hero_journey_achievements') THEN
        CREATE TABLE public.hero_journey_achievements (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            achievement_key TEXT NOT NULL,
            earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
            UNIQUE(user_id, achievement_key)
        );
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_journey_achievements TO authenticated;
        GRANT ALL ON public.hero_journey_achievements TO service_role;
        ALTER TABLE public.hero_journey_achievements ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users can manage their own achievements" ON public.hero_journey_achievements FOR ALL TO authenticated USING (auth.uid() = user_id);
    END IF;
END $$;
