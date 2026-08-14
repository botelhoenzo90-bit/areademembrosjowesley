-- Add quiz scores and certificates to Hero Journey
CREATE TABLE public.hero_journey_quiz_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    archetype hero_archetype_name NOT NULL,
    question_index INTEGER NOT NULL,
    answer_index INTEGER NOT NULL,
    score INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, archetype, question_index)
);

CREATE TABLE public.hero_journey_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    predominant hero_archetype_name NOT NULL,
    secondary hero_archetype_name,
    issue_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    verification_code TEXT DEFAULT upper(substring(gen_random_uuid()::text from 1 for 8)),
    UNIQUE(user_id)
);

-- Grants
GRANT SELECT, INSERT, UPDATE ON public.hero_journey_quiz_responses TO authenticated;
GRANT SELECT, INSERT ON public.hero_journey_certificates TO authenticated;
GRANT ALL ON public.hero_journey_quiz_responses TO service_role;
GRANT ALL ON public.hero_journey_certificates TO service_role;

-- RLS
ALTER TABLE public.hero_journey_quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_journey_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own quiz responses" ON public.hero_journey_quiz_responses
    FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own certificates" ON public.hero_journey_certificates
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own certificates" ON public.hero_journey_certificates
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
