-- Simple insert without ON CONFLICT since I don't know the unique constraint
INSERT INTO public.premium_workshops (
    level_id, 
    order_index, 
    title, 
    duration_minutes, 
    video_url
)
VALUES (
    '42772341-96cb-4fe4-aa1a-249664d76f03', 
    0, 
    'CÓDIGO DA MENTE EXTRAORDINÁRIA', 
    10, 
    'https://youtu.be/6cRiSIzY6P4?is=7_vfdTDnpT3dtaaS'
);

-- Push existing workshops for this level forward if they conflict with index 0
UPDATE public.premium_workshops 
SET order_index = order_index + 1 
WHERE level_id = '42772341-96cb-4fe4-aa1a-249664d76f03' 
AND title != 'CÓDIGO DA MENTE EXTRAORDINÁRIA'
AND order_index = 0;

-- Verify the result
SELECT id, title, level_id, order_index 
FROM public.premium_workshops 
WHERE level_id = '42772341-96cb-4fe4-aa1a-249664d76f03' 
ORDER BY order_index ASC;