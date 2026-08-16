-- The question_id column in user_principle_responses currently references principle_quizzes(id)
-- However, the app uses hardcoded string IDs ('q1', 'q2', etc.) which causes a UUID format error
-- since principle_quizzes.id is a UUID. We will change question_id to TEXT to match the app logic.

ALTER TABLE public.user_principle_responses DROP CONSTRAINT IF EXISTS user_principle_responses_question_id_fkey;
ALTER TABLE public.user_principle_responses ALTER COLUMN question_id TYPE TEXT;

-- Ensure grants are complete (safety check)
GRANT ALL ON public.user_principle_responses TO authenticated;
GRANT ALL ON public.user_principle_responses TO service_role;

GRANT ALL ON public.principle_diagnoses TO authenticated;
GRANT ALL ON public.principle_diagnoses TO service_role;

GRANT ALL ON public.user_principle_progress TO authenticated;
GRANT ALL ON public.user_principle_progress TO service_role;

GRANT ALL ON public.principles TO authenticated;
GRANT ALL ON public.principles TO service_role;

GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT ALL ON public.modules TO authenticated;
GRANT ALL ON public.modules TO service_role;

GRANT ALL ON public.lessons TO authenticated;
GRANT ALL ON public.lessons TO service_role;
