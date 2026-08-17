
-- Corrigir tipos de coluna nas tabelas da Jornada do Herói para evitar erros de cast
-- hero_journey_reflections já é TEXT na criação, mas vamos garantir as outras

DO $$ 
BEGIN
    -- Alterar hero_journey_missions se existir
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'hero_journey_missions') THEN
        ALTER TABLE public.hero_journey_missions ALTER COLUMN archetype TYPE TEXT;
    END IF;

    -- Alterar hero_journey_protocols se existir
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'hero_journey_protocols') THEN
        ALTER TABLE public.hero_journey_protocols ALTER COLUMN archetype TYPE TEXT;
    END IF;

    -- Alterar hero_journey_reflections se existir (já deve ser text, mas por segurança)
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'hero_journey_reflections') THEN
        ALTER TABLE public.hero_journey_reflections ALTER COLUMN archetype TYPE TEXT;
    END IF;

    -- Alterar hero_journey_quiz_responses se existir
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'hero_journey_quiz_responses') THEN
        ALTER TABLE public.hero_journey_quiz_responses ALTER COLUMN archetype TYPE TEXT;
    END IF;
END $$;
