-- Update order_index for requested sequence
UPDATE public.modules SET order_index = 1 WHERE slug = 'seja-bem-vindos';
UPDATE public.modules SET order_index = 4 WHERE slug = 'reprogramacao-mental';
UPDATE public.modules SET order_index = 5 WHERE slug = 'treinamento-premium';
UPDATE public.modules SET order_index = 6 WHERE slug = 'bonus-exclusivos';

-- Remove "ferramentas de evolução" (and "centro-operacional")
DELETE FROM public.modules WHERE slug = 'ferramentas-de-evolucao' OR name ILIKE '%ferramentas%' OR slug = 'centro-operacional';
