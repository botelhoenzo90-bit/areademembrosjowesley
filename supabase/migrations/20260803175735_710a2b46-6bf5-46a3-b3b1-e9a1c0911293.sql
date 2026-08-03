-- Update the lesson to ensure it has the correct URL and is assigned to the "TREINAMENTO PREMIUM" module
UPDATE public.lessons 
SET 
  module_id = 'c3f1623f-9a20-4664-b11f-159412f14300', 
  video_url = 'https://youtu.be/6cRiSIzY6P4?is=7_vfdTDnpT3dtaaS',
  description = 'Aula de abertura: Seja bem-vindo ao CÓDIGO DA MENTE EXTRAORDINÁRIA.',
  order_index = 0
WHERE id = 'ec2ffadc-9cea-45fd-95d3-fae2aaf9b5f4';