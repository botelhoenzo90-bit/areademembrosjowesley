-- Create future_letters table
CREATE TABLE public.future_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Minha Carta para o Futuro',
    reality_today TEXT,
    future_identity TEXT,
    content TEXT,
    unlock_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_opened BOOLEAN DEFAULT FALSE NOT NULL,
    open_message_viewed BOOLEAN DEFAULT FALSE NOT NULL,
    password_hash TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create future_letter_responses table for post-opening reflection
CREATE TABLE public.future_letter_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    letter_id UUID NOT NULL REFERENCES public.future_letters(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    response_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.future_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.future_letter_responses ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.future_letters TO authenticated;
GRANT ALL ON public.future_letters TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.future_letter_responses TO authenticated;
GRANT ALL ON public.future_letter_responses TO service_role;

-- Policies
CREATE POLICY "Users can manage their own letters" ON public.future_letters
    FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own responses" ON public.future_letter_responses
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Update updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_future_letters_updated_at
    BEFORE UPDATE ON public.future_letters
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER update_future_letter_responses_updated_at
    BEFORE UPDATE ON public.future_letter_responses
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
