# Plano: Jornada do Herói Interior (Reprogramação Mental)

Este plano detalha a reestruturação completa do módulo "Reprogramação Mental" para se tornar a "Jornada do Herói Interior", um aplicativo interativo de autoconhecimento baseado nos 6 arquétipos de Carol S. Pearson.

## Alterações de Infraestrutura (Banco de Dados)

*   **Tabelas Existentes**: `hero_journey_stats`, `hero_journey_archetypes`, `hero_journey_reflections`, `hero_journey_missions`, `hero_journey_protocols`, `hero_journey_quiz_responses`, `hero_journey_diagnosis`.
*   **Ações**: Verificar e garantir que as tabelas possuem as políticas de RLS e GRANTs corretos para acesso via API.

## Alterações de Frontend (UX/UI e Lógica)

### 1. Reestruturação da Página de Arquétipo (`src/routes/_authenticated/hero-journey/archetype.$id.tsx`)
*   Implementar o fluxo interativo completo de 8 etapas:
    1.  **DESCOBRIR**: Informações básicas (Essência, Objetivo, Força, etc.) com cards interativos.
    2.  **MENTORIA**: Texto de aprofundamento (Mini Mentoria).
    3.  **ENTENDER**: Categorias clicáveis (Pensamentos, Emoções, etc.).
    4.  **QUIZ**: Perguntas dinâmicas com registro de pontuação.
    5.  **OBSERVAR**: Perguntas de autopercepção ("Você se reconhece?").
    6.  **REFLEXÃO**: Campo de texto para o usuário escrever e salvar reflexões.
    7.  **MISSÃO/PROTOCOLO**: Apresentação da missão prática e checklist do protocolo de 5 etapas.
    8.  **CONCLUIR**: Animação de sucesso, exibição de recompensas (+Consciência, +EXP) e texto de gamificação.
*   Adicionar validações para garantir que o usuário interaja antes de avançar (ex: checklist do protocolo completo).
*   Garantir a persistência em tempo real no banco de dados para cada etapa.

### 2. Aprimoramento da Home da Jornada (`src/routes/_authenticated/reprogramacao-mental.tsx`)
*   Dashboard com progresso (0-100%), nível de consciência e contadores de missões/protocolos.
*   Mapa visual com 6 estações divididas em 3 fases (Segurança, Desenvolvimento, Integração).
*   Lógica de desbloqueio sequencial real (próximo arquétipo só abre após conclusão do anterior).

### 3. Diagnóstico e Resultado Final
*   **Diagnóstico**: Quiz final para calcular a predominância.
*   **Resultado**: Exibição do arquétipo predominante, forças, sombras e recomendação personalizada baseada nos dados coletados.

## Detalhes Técnicos

*   Uso de `framer-motion` para transições cinematográficas entre etapas.
*   Integração com `TanStack Start` (Server Functions) para lógica de backend protegida.
*   Design mobile-first com estética "Premium Dark" (Deep Black, Gold).
