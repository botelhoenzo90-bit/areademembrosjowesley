-- Passaporte das 9 Camadas Infrastructure

-- Create Layers table
CREATE TABLE public.passport_layers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    layer_number int NOT NULL UNIQUE,
    name text NOT NULL,
    subtitle text NOT NULL,
    essence text NOT NULL,
    description text NOT NULL,
    video_url text,
    image_url text,
    order_index int NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Grant Access
GRANT SELECT ON public.passport_layers TO authenticated;
GRANT ALL ON public.passport_layers TO service_role;
ALTER TABLE public.passport_layers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Layers are readable by all authenticated users" ON public.passport_layers FOR SELECT TO authenticated USING (true);

-- User Progress for Layers
CREATE TABLE public.user_layer_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    layer_id uuid REFERENCES public.passport_layers(id) ON DELETE CASCADE NOT NULL,
    status text NOT NULL DEFAULT 'locked',
    lesson_completed boolean NOT NULL DEFAULT false,
    gamification_viewed boolean NOT NULL DEFAULT false,
    mission_completed boolean NOT NULL DEFAULT false,
    protocol_completed boolean NOT NULL DEFAULT false,
    reflection_content text,
    points_earned int NOT NULL DEFAULT 0,
    completed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(user_id, layer_id)
);

-- Grant Access
GRANT SELECT, INSERT, UPDATE ON public.user_layer_progress TO authenticated;
GRANT ALL ON public.user_layer_progress TO service_role;
ALTER TABLE public.user_layer_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own layer progress" ON public.user_layer_progress 
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Badges
CREATE TABLE public.passport_badges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text NOT NULL,
    icon_name text NOT NULL,
    requirement_type text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.passport_badges TO authenticated;
GRANT ALL ON public.passport_badges TO service_role;
ALTER TABLE public.passport_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges are readable by all" ON public.passport_badges FOR SELECT TO authenticated USING (true);

-- User Badges
CREATE TABLE public.user_passport_badges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    badge_id uuid REFERENCES public.passport_badges(id) ON DELETE CASCADE NOT NULL,
    unlocked_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(user_id, badge_id)
);

GRANT SELECT, INSERT ON public.user_passport_badges TO authenticated;
GRANT ALL ON public.user_passport_badges TO service_role;
ALTER TABLE public.user_passport_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own badges" ON public.user_passport_badges FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Seed Initial Data for Layers
INSERT INTO public.passport_layers (layer_number, name, subtitle, essence, description, order_index) VALUES
(0, 'COMECE AQUI', 'Apresentação — A Jornada das 9 Camadas', 'O início da sua grande transformação.', 'Nesta aula, você entenderá o mapa completo da jornada e como as 9 camadas funcionarão na sua vida.', 0),
(1, 'CAMADA 1 — O DESPERTAR', 'O que está acontecendo dentro da minha mente?', 'O primeiro passo não é mudar. É começar a perceber.', 'Nesta camada, exploramos a consciência inicial e a percepção do ambiente interno.', 1),
(2, 'CAMADA 2 — O ESPELHO', 'Como eu respondo ao que acontece dentro de mim?', 'Reflexão e autoconsciência.', 'Entenda como suas reações internas moldam sua realidade e como começar a observá-las sem julgamento.', 2),
(3, 'CAMADA 3 — O FILTRO', 'E se aquilo que penso sobre a realidade estiver condicionado?', 'Percepção e lentes da realidade.', 'Descubra os filtros mentais que distorcem sua visão de mundo e aprenda a limpá-los.', 3),
(4, 'CAMADA 4 — A IDENTIDADE', 'Então, quem realmente sou?', 'Essência e autoconhecimento.', 'Uma mergulho profundo na construção do seu "eu" e na descoberta da sua verdadeira essência.', 4),
(5, 'CAMADA 5 — O PADRÃO', 'Por que continuo repetindo aquilo que não quero viver?', 'Ciclos e repetição comportamental.', 'Identifique os padrões repetitivos que travam seu crescimento e entenda sua origem.', 5),
(6, 'CAMADA 6 — A ESCOLHA', 'Posso escolher uma resposta diferente?', 'Caminhos e decisões.', 'Aprenda que entre o estímulo e a resposta existe um espaço, e nesse espaço reside sua liberdade.', 6),
(7, 'CAMADA 7 — A REPROGRAMAÇÃO', 'Como construir novas possibilidades dentro de mim?', 'Neuroplasticidade e transformação.', 'Ferramentas práticas para construir novos caminhos neurais e novas formas de agir.', 7),
(8, 'CAMADA 8 — A INTEGRAÇÃO', 'Como transformar consciência em uma nova maneira de viver?', 'Mente, emoção e comportamento unidos.', 'Integre todo o aprendizado em uma prática diária consistente e harmoniosa.', 8),
(9, 'CAMADA 9 — O NOVO OLHAR', 'Quem eu posso me tornar a partir daqui?', 'Expansão e futuro.', 'A camada final da consciência que abre as portas para uma vida de infinitas possibilidades.', 9);

-- Seed Badges
INSERT INTO public.passport_badges (name, description, icon_name, requirement_type) VALUES
('PRIMEIRO DESPERTAR', 'Concluiu a apresentação.', 'Zap', 'presentation'),
('PRIMEIRA CAMADA', 'Concluiu a Camada 1.', 'Target', 'layer_1'),
('OBSERVADOR', 'Concluiu 3 camadas.', 'Eye', 'layers_3'),
('EXPLORADOR', 'Concluiu 5 camadas.', 'Compass', 'layers_5'),
('TRANSFORMADOR', 'Concluiu 7 camadas.', 'Flame', 'layers_7'),
('MESTRE DAS 9 CAMADAS', 'Concluiu as 9 camadas.', 'Crown', 'layers_9');
