
-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  onboarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- MODULES
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT,
  order_index INT NOT NULL,
  cover_url TEXT,
  accent_from TEXT,
  accent_to TEXT,
  lessons_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.modules TO authenticated;
GRANT ALL ON public.modules TO service_role;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated view modules" ON public.modules
  FOR SELECT TO authenticated USING (true);

-- PROGRESS
CREATE TABLE public.user_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  percent INT NOT NULL DEFAULT 0,
  lessons_completed INT NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_module_progress TO authenticated;
GRANT ALL ON public.user_module_progress TO service_role;
ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own progress" ON public.user_module_progress
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger for profiles
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Seed modules
INSERT INTO public.modules (slug, name, short_description, long_description, order_index, accent_from, accent_to, lessons_count) VALUES
  ('seja-bem-vindos', 'SEJA BEM-VINDOS', 'Sua chegada ao ecossistema de transformação.', 'Boas-vindas ao Instituto Neuroconsciência. Entenda a jornada, os pilares e como aproveitar cada recurso da plataforma.', 1, '#5B21B6', '#0D1B2A', 4),
  ('centro-operacional', 'CENTRO OPERACIONAL', 'A base estratégica da sua evolução diária.', 'O centro de comando da sua jornada — rituais, metas, indicadores e disciplinas para operar em alto nível.', 2, '#0D1B2A', '#D4AF37', 8),
  ('treinamento-premium', 'TREINAMENTO PREMIUM', 'Formação profunda em consciência e mentalidade.', 'O treinamento principal do Instituto. Aulas cinematográficas para expandir consciência, foco e propósito.', 3, '#5B21B6', '#D4AF37', 12),
  ('reprogramacao-mental', 'REPROGRAMAÇÃO MENTAL', 'Recodifique crenças, padrões e emoções.', 'Técnicas avançadas de reprogramação mental para dissolver bloqueios e instalar novas identidades.', 4, '#0D1B2A', '#5B21B6', 10),
  ('ferramentas-de-crescimento', 'FERRAMENTAS DE CRESCIMENTO', 'Práticas, meditações e protocolos aplicáveis.', 'Ferramentas práticas — meditações guiadas, journaling, protocolos e frameworks para aplicar diariamente.', 5, '#080808', '#5B21B6', 9),
  ('bonus-exclusivos', 'BÔNUS EXCLUSIVOS', 'Conteúdos raros liberados apenas aqui.', 'Workshops, masterclasses e conversas com especialistas convidados — material exclusivo do Instituto.', 6, '#D4AF37', '#0D1B2A', 6);
