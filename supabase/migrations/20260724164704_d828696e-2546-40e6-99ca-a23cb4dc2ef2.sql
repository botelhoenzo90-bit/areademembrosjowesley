
-- Levels (Temporadas) for Treinamento Premium
CREATE TABLE public.premium_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  order_index int NOT NULL,
  name text NOT NULL,
  theme text NOT NULL,
  objective text NOT NULL,
  final_message text,
  cover_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.premium_levels TO authenticated, anon;
GRANT ALL ON public.premium_levels TO service_role;
ALTER TABLE public.premium_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Levels are public read" ON public.premium_levels FOR SELECT USING (true);

CREATE TRIGGER premium_levels_updated BEFORE UPDATE ON public.premium_levels
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Workshops (Episodes)
CREATE TABLE public.premium_workshops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id uuid NOT NULL REFERENCES public.premium_levels(id) ON DELETE CASCADE,
  order_index int NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  duration_minutes int NOT NULL DEFAULT 25,
  video_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.premium_workshops TO authenticated, anon;
GRANT ALL ON public.premium_workshops TO service_role;
ALTER TABLE public.premium_workshops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workshops are public read" ON public.premium_workshops FOR SELECT USING (true);

CREATE TRIGGER premium_workshops_updated BEFORE UPDATE ON public.premium_workshops
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Per-user workshop progress
CREATE TABLE public.user_workshop_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workshop_id uuid NOT NULL REFERENCES public.premium_workshops(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_started',
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, workshop_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_workshop_progress TO authenticated;
GRANT ALL ON public.user_workshop_progress TO service_role;
ALTER TABLE public.user_workshop_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own workshop progress" ON public.user_workshop_progress
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER uwp_updated BEFORE UPDATE ON public.user_workshop_progress
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Per-user level progress
CREATE TABLE public.user_level_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level_id uuid NOT NULL REFERENCES public.premium_levels(id) ON DELETE CASCADE,
  percent int NOT NULL DEFAULT 0,
  workshops_completed int NOT NULL DEFAULT 0,
  last_accessed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, level_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_level_progress TO authenticated;
GRANT ALL ON public.user_level_progress TO service_role;
ALTER TABLE public.user_level_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own level progress" ON public.user_level_progress
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER ulp_updated BEFORE UPDATE ON public.user_level_progress
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- SEED LEVELS
INSERT INTO public.premium_levels (slug, order_index, name, theme, objective, final_message, cover_key) VALUES
('o-misterio-da-mente', 1, 'O Mistério da Mente', 'Descobrindo como sua mente realmente funciona.', 'Compreender como pensamentos, emoções e crenças moldam a realidade pessoal e aprender os primeiros princípios da reprogramação mental.', NULL, 'level-1'),
('a-arte-de-viver', 2, 'A Arte de Viver', 'Inteligência emocional através do Estoicismo.', 'Aprender a responder à vida com equilíbrio, desenvolvendo autocontrole emocional e força interior.', NULL, 'level-2'),
('a-mente-extraordinaria', 3, 'A Mente Extraordinária', 'Libertando-se das crenças invisíveis e construindo uma nova forma de pensar.', 'Questionar padrões herdados, romper limitações mentais e desenvolver uma mentalidade consciente, criativa e voltada para o crescimento.', 'A transformação acontece de dentro para fora. Quando mudamos nossa maneira de pensar, mudamos nossas escolhas. Quando mudamos nossas escolhas, transformamos nossa vida.', 'level-3'),
('autoconhecimento-profundo', 4, 'Autoconhecimento Profundo', 'Consciência, identidade e espiritualidade prática.', 'Modelar princípios encontrados nos ensinamentos de Jesus aplicados ao desenvolvimento pessoal, ampliando a consciência sobre si mesmo e promovendo maior coerência entre valores, pensamentos e ações.', NULL, 'level-4'),
('reprogramacao-mental-premium', 5, 'Reprogramação Mental', 'Instalando uma nova identidade.', 'Aplicar técnicas de Programação Neurolinguística (PNL) para substituir padrões limitantes por hábitos e pensamentos mais funcionais.', NULL, 'level-5'),
('mentalidade-superior', 6, 'Mentalidade Superior', 'Inteligência emocional avançada.', 'Desenvolver maturidade emocional, autocontrole e liderança pessoal inspirados em princípios de compaixão, responsabilidade e domínio próprio presentes nos ensinamentos de Jesus.', NULL, 'level-6'),
('alinhamento-de-proposito', 7, 'Alinhamento de Propósito', 'Clareza de direção e propósito.', 'Utilizar reflexões inspiradas nos Salmos para fortalecer a esperança, a disciplina, a resiliência e a clareza sobre a direção da própria vida, traduzindo esses princípios em ações concretas de desenvolvimento pessoal.', NULL, 'level-7');

-- SEED WORKSHOPS
WITH l AS (SELECT id, slug FROM public.premium_levels)
INSERT INTO public.premium_workshops (level_id, order_index, title, duration_minutes) 
SELECT l.id, x.ord, x.title, 30 FROM l JOIN (VALUES
  ('o-misterio-da-mente', 1, 'Como o cérebro cria padrões automáticos'),
  ('o-misterio-da-mente', 2, 'Origem das crenças limitantes'),
  ('o-misterio-da-mente', 3, 'O poder da atenção'),
  ('o-misterio-da-mente', 4, 'Blindagem mental contra emoções negativas'),
  ('o-misterio-da-mente', 5, 'Construindo uma mentalidade forte'),
  ('a-arte-de-viver', 1, 'Os princípios do Estoicismo moderno'),
  ('a-arte-de-viver', 2, 'O controle das emoções'),
  ('a-arte-de-viver', 3, 'Como não ser dominado pelas circunstâncias'),
  ('a-arte-de-viver', 4, 'Resiliência emocional'),
  ('a-arte-de-viver', 5, 'Paz mental em meio ao caos'),
  ('a-mente-extraordinaria', 1, 'Como as crenças são formadas na infância'),
  ('a-mente-extraordinaria', 2, 'Os filtros mentais que moldam a realidade'),
  ('a-mente-extraordinaria', 3, 'Identificando pensamentos automáticos'),
  ('a-mente-extraordinaria', 4, 'A coragem de questionar antigas verdades'),
  ('a-mente-extraordinaria', 5, 'Construindo uma nova identidade mental'),
  ('a-mente-extraordinaria', 6, 'Desenvolvendo pensamento crítico'),
  ('a-mente-extraordinaria', 7, 'Criando uma mente extraordinária'),
  ('a-mente-extraordinaria', 8, 'Transformando pensamentos em resultados'),
  ('autoconhecimento-profundo', 1, 'Quem realmente sou?'),
  ('autoconhecimento-profundo', 2, 'Consciência e identidade'),
  ('autoconhecimento-profundo', 3, 'Alinhando mente e propósito'),
  ('autoconhecimento-profundo', 4, 'Sabedoria aplicada ao cotidiano'),
  ('autoconhecimento-profundo', 5, 'Vivendo com intenção'),
  ('reprogramacao-mental-premium', 1, 'Reestruturação de crenças'),
  ('reprogramacao-mental-premium', 2, 'Linguagem interna'),
  ('reprogramacao-mental-premium', 3, 'Ressignificação'),
  ('reprogramacao-mental-premium', 4, 'Visualização estratégica'),
  ('reprogramacao-mental-premium', 5, 'Construção da nova identidade'),
  ('mentalidade-superior', 1, 'Inteligência emocional avançada'),
  ('mentalidade-superior', 2, 'Maturidade emocional'),
  ('mentalidade-superior', 3, 'Autocontrole'),
  ('mentalidade-superior', 4, 'Liderança pessoal'),
  ('mentalidade-superior', 5, 'Responsabilidade'),
  ('mentalidade-superior', 6, 'Domínio próprio'),
  ('alinhamento-de-proposito', 1, 'Decodificação prática dos Salmos'),
  ('alinhamento-de-proposito', 2, 'Propósito e identidade'),
  ('alinhamento-de-proposito', 3, 'Coragem para agir'),
  ('alinhamento-de-proposito', 4, 'Disciplina e perseverança'),
  ('alinhamento-de-proposito', 5, 'Construindo um legado'),
  ('alinhamento-de-proposito', 6, 'Plano de vida'),
  ('alinhamento-de-proposito', 7, 'A continuidade da transformação')
) AS x(level_slug, ord, title) ON l.slug = x.level_slug;
