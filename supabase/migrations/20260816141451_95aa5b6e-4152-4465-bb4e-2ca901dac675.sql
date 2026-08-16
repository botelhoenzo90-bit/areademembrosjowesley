-- Create principles table
CREATE TABLE public.principles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    principle_number INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create principle progress table
CREATE TABLE public.user_principle_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    principle_id UUID REFERENCES public.principles(id) ON DELETE CASCADE NOT NULL,
    lesson_completed BOOLEAN DEFAULT FALSE,
    quiz_completed BOOLEAN DEFAULT FALSE,
    protocol_completed BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'locked', -- locked, available, in_progress, completed
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, principle_id)
);

-- Create principle quizzes table
CREATE TABLE public.principle_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    principle_id UUID REFERENCES public.principles(id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- [{label: string, value: number}, ...]
    order_index INTEGER NOT NULL
);

-- Create user responses table
CREATE TABLE public.user_principle_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    principle_id UUID REFERENCES public.principles(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES public.principle_quizzes(id) ON DELETE CASCADE NOT NULL,
    answer_value INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, principle_id, question_id)
);

-- Create diagnoses table
CREATE TABLE public.principle_diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    principle_id UUID REFERENCES public.principles(id) ON DELETE CASCADE NOT NULL,
    diagnosis_text TEXT NOT NULL,
    protocol_steps JSONB NOT NULL, -- [{text: string, completed: boolean}]
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, principle_id)
);

-- RLS and Grants
ALTER TABLE public.principles ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.principles TO authenticated;
GRANT ALL ON public.principles TO service_role;
CREATE POLICY "Principles are viewable by all authenticated users" ON public.principles FOR SELECT TO authenticated USING (true);

ALTER TABLE public.user_principle_progress ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.user_principle_progress TO authenticated;
GRANT ALL ON public.user_principle_progress TO service_role;
CREATE POLICY "Users can manage their own principle progress" ON public.user_principle_progress FOR ALL TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.principle_quizzes ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.principle_quizzes TO authenticated;
GRANT ALL ON public.principle_quizzes TO service_role;
CREATE POLICY "Quizzes are viewable by all authenticated users" ON public.principle_quizzes FOR SELECT TO authenticated USING (true);

ALTER TABLE public.user_principle_responses ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.user_principle_responses TO authenticated;
GRANT ALL ON public.user_principle_responses TO service_role;
CREATE POLICY "Users can manage their own responses" ON public.user_principle_responses FOR ALL TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.principle_diagnoses ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.principle_diagnoses TO authenticated;
GRANT ALL ON public.principle_diagnoses TO service_role;
CREATE POLICY "Users can manage their own diagnoses" ON public.principle_diagnoses FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Seeding Principles
INSERT INTO public.principles (principle_number, name) VALUES
(1, 'A responsabilidade é toda sua'),
(2, 'Siga o seu propósito'),
(3, 'Defina o que você quer para traçar o seu mapa'),
(4, 'Peça e receberás: a regra da projeção inteligente'),
(5, 'Não seja medíocre, faça tudo com excelência'),
(6, 'A leitura te levará mais longe'),
(7, 'Persiga o conhecimento diariamente'),
(8, 'Adote mentores'),
(9, 'Exercite a espiritualidade'),
(10, 'Seja generoso e mantenha sua conta com o Universo em dia'),
(11, 'Melhore um pouco todos os dias'),
(12, 'Seja seletivo com quem você anda'),
(13, 'Entenda que o dinheiro é seu amigo'),
(14, 'Sempre use o tempo a seu favor'),
(15, 'Utilize o efeito órbita e mude de patamar'),
(16, 'Seja curioso e entenda o mundo'),
(17, 'Busque a evolução'),
(18, 'Cuidado com o seu principal inimigo: o ego');
