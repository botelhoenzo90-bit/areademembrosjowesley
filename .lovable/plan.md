# Plano de Reestruturação: 18 Princípios para Você Evoluir

O objetivo é garantir que a jornada interativa do módulo **Treinamento Premium** esteja 100% funcional, corrigindo problemas de navegação, visualização de vídeos e adicionando banners visuais para cada princípio.

## Alterações Tecnológicas

### Banco de Dados (Supabase)
- Criar uma migração para atualizar a tabela `public.principles` adicionando uma coluna `banner_url` se necessário, ou garantir que as imagens dos banners sejam integradas no frontend.
- Garantir que todos os 18 princípios tenham seus nomes e URLs de vídeo corretos (iniciando com o Princípio 1).

### Servidor (Server Functions)
- Refinar `src/lib/principles.functions.ts` para garantir que a lógica de desbloqueio sequencial e geração de diagnóstico (2700+ caracteres) esteja robusta.
- Adicionar suporte para retornar a `banner_url` de cada princípio.

### Frontend (React/TanStack Router)
- **Painel Principal (`treinamento-premium.tsx`):**
    - Adicionar o vídeo de introdução no topo com um player de destaque.
    - Melhorar o visual dos cards dos princípios, incluindo um banner de fundo (imagem) para cada um, conforme solicitado.
    - Garantir que o status (Bloqueado/Disponível/Concluído) esteja visualmente claro.
- **Página do Princípio (`treinamento-premium.principio.$index.tsx`):**
    - Corrigir a extração do ID do YouTube para suportar diversos formatos de URL.
    - Implementar a transição suave entre as etapas: **Aula -> Quiz -> Diagnóstico -> Protocolo -> Conclusão**.
    - Adicionar o efeito de celebração (`canvas-confetti`) e o banner "PARABÉNS!" ao concluir.
    - Personalizar a experiência com o nome do usuário.

## Detalhes Técnicos
- Utilizar `framer-motion` para animações de transição entre etapas.
- Garantir que o diagnóstico gerado tenha o volume de texto solicitado (2700 caracteres).
- Validar a navegação sequencial: Princípio N só abre após Princípio N-1 ser marcado como `completed`.

## Esquema Visual dos Banners
Vou utilizar imagens temáticas de alta qualidade para cada princípio, garantindo uma estética "Premium Dark".
1. Responsabilidade: Montanha/Escalada
2. Propósito: Bússola/Estrelas
... e assim por diante para os 18.
