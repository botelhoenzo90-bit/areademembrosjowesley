CREATE TABLE public.psalm_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  study_date date NOT NULL,
  cycle integer NOT NULL DEFAULT 1,
  psalm_number integer NOT NULL,
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  psalm_text text NOT NULL DEFAULT '',
  decoding text NOT NULL DEFAULT '',
  application text NOT NULL DEFAULT '',
  reflection jsonb NOT NULL DEFAULT '[]'::jsonb,
  exercises jsonb NOT NULL DEFAULT '[]'::jsonb,
  exercises_done jsonb NOT NULL DEFAULT '[]'::jsonb,
  mission text NOT NULL DEFAULT '',
  affirmation text NOT NULL DEFAULT '',
  prayer text NOT NULL DEFAULT '',
  theme text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  favorite boolean NOT NULL DEFAULT false,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, study_date),
  UNIQUE (user_id, cycle, psalm_number)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.psalm_studies TO authenticated;
GRANT ALL ON public.psalm_studies TO service_role;

ALTER TABLE public.psalm_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own psalm studies" ON public.psalm_studies
FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER psalm_studies_updated_at BEFORE UPDATE ON public.psalm_studies
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();