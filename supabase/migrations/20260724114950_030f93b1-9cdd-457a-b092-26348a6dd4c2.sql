
-- Lessons per module
CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  order_index integer NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 0,
  video_url text,
  thumbnail_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (module_id, order_index)
);
GRANT SELECT ON public.lessons TO authenticated;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated view lessons" ON public.lessons FOR SELECT TO authenticated USING (true);
CREATE TRIGGER lessons_set_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- User lesson progress
CREATE TABLE public.user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_started', -- not_started | in_progress | completed
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_lesson_progress TO authenticated;
GRANT ALL ON public.user_lesson_progress TO service_role;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own lesson progress" ON public.user_lesson_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER ulp_set_updated_at BEFORE UPDATE ON public.user_lesson_progress FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- AI Conversations
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Nova conversa',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversations TO authenticated;
GRANT ALL ON public.conversations TO service_role;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own conversations" ON public.conversations FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER conv_set_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Chat messages
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL, -- user | assistant | system
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own messages" ON public.chat_messages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX chat_messages_conv_created ON public.chat_messages(conversation_id, created_at);

-- Missions
CREATE TABLE public.missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period text NOT NULL, -- daily | weekly | monthly
  objective text NOT NULL,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  deadline text,
  checklist jsonb NOT NULL DEFAULT '[]'::jsonb,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.missions TO authenticated;
GRANT ALL ON public.missions TO service_role;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own missions" ON public.missions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER missions_set_updated_at BEFORE UPDATE ON public.missions FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Exercises
CREATE TABLE public.exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exercises TO authenticated;
GRANT ALL ON public.exercises TO service_role;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own exercises" ON public.exercises FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Action plans
CREATE TABLE public.action_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  objective text NOT NULL,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  timeline text,
  indicators jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.action_plans TO authenticated;
GRANT ALL ON public.action_plans TO service_role;
ALTER TABLE public.action_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own plans" ON public.action_plans FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER plans_set_updated_at BEFORE UPDATE ON public.action_plans FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Seed Welcome module lessons
INSERT INTO public.lessons (module_id, order_index, title, description, duration_minutes) VALUES
  ((SELECT id FROM public.modules WHERE slug='seja-bem-vindos'), 1, 'COMECE AQUI', 'Apresentação da plataforma e explicação sobre como aproveitar todos os recursos disponíveis.', 8),
  ((SELECT id FROM public.modules WHERE slug='seja-bem-vindos'), 2, 'QUEM SOU EU?', 'Conheça a história, a missão e os princípios que motivaram a criação do Instituto NeuroConsciência.', 10),
  ((SELECT id FROM public.modules WHERE slug='seja-bem-vindos'), 3, 'MANIFESTO NEUROCONSCIÊNCIA', 'Conheça os valores, a filosofia e os princípios fundamentais que orientam toda a metodologia do Instituto.', 12),
  ((SELECT id FROM public.modules WHERE slug='seja-bem-vindos'), 4, 'MAPA DA VIDA', 'Receba um GPS estratégico para organizar sua jornada de desenvolvimento pessoal e acompanhar sua evolução.', 15),
  ((SELECT id FROM public.modules WHERE slug='seja-bem-vindos'), 5, 'COMUNIDADE NEUROCONSCIÊNCIA', 'Participe da comunidade exclusiva do Instituto: lives semanais, workshops, inteligência emocional, indicações de livros e filmes, networking e muito mais.', 9);

-- Update lessons_count on modules
UPDATE public.modules SET lessons_count = 5 WHERE slug='seja-bem-vindos';
