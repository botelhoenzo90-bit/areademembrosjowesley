CREATE TABLE IF NOT EXISTS public.power_journey_state (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  state JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.power_journey_state TO authenticated;
GRANT ALL ON public.power_journey_state TO service_role;
ALTER TABLE public.power_journey_state ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users manage own power journey" ON public.power_journey_state FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;