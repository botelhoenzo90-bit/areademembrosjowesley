# Plano de Implementação: Jornada do Herói Interior (Reprogramação Mental)

Este plano visa reestruturar o módulo "Reprogramação Mental" para funcionar como o aplicativo interativo "Jornada do Herói Interior", conforme solicitado, garantindo que a experiência seja cinematográfica, interativa e focada em autoconhecimento.

## 1. Infraestrutura de Dados (Supabase)
*   **Tabelas Existentes**: `hero_journey_archetypes`, `hero_journey_stats`, `hero_journey_diagnosis`, `hero_journey_quiz_responses`.
*   **Novas Tabelas/Campos**:
    *   `hero_journey_reflections`: Para armazenar as reflexões de texto livre por arquétipo (atualmente está no JSON da tabela de arquétipos, mas pode ser melhorado).
    *   `hero_journey_missions`: Para registrar o status detalhado das missões práticas.
    *   `hero_journey_protocols`: Para registrar o progresso nos protocolos de 5 etapas.
*   **Grants**: Garantir que `authenticated` e `service_role` tenham permissões totais.

## 2. Experiência do Usuário (UX/UI)
*   **Splash Screen**: Implementar a tela cinematográfica "SUA JORNADA COMEÇA AQUI" com o texto de introdução e o nome do usuário.
*   **Dashboard (Home do App)**:
    *   Seção de progresso (%, explorados, missões, protocolos, nível de consciência).
    *   Mapa Visual do Herói: 3 Fases (Segurança, Desenvolvimento, Integração) com as 6 estações interativas.
*   **Cards de Arquétipos**: Implementar estados visuais (Bloqueado, Disponível, Em Jornada, Concluído) e símbolos.
*   **Navegação de Arquétipo**: Sequência interativa de 6 etapas:
    1.  **Descobrir**: Essência, objetivo, força, etc.
    2.  **Entender**: Exemplos interativos (Pensamentos, Emoções, etc.).
    3.  **Observar**: Perguntas de autopercepção ("Você se reconhece?").
    4.  **Experimentar**: Reflexão escrita ("Olhe para Dentro").
    5.  **Implementar**: Missão prática e Protocolo de 5 etapas.
    6.  **Concluir**: Animação de conclusão e desbloqueio do próximo arquétipo.

## 3. Lógica de Negócio e Gamificação
*   **Desbloqueio Sequencial**: Inocente -> Órfão -> Guerreiro -> Altruísta -> Nômade -> Mago.
*   **Sistema de Níveis**: Níveis 1 a 6 (Despertar até Integração).
*   **Diagnóstico Final**:
    *   Liberação após os 6 arquétipos.
    *   Cálculo de predominância baseado em todas as respostas da jornada.
    *   Geração do "Mapa do Herói" personalizado (Predominante, Secundário, Emergente).
    *   Recomendação personalizada de "Próximo Passo".
*   **Gamificação**: Badge System (Primeiro Passo, Primeiro Espelho, etc.).

## 4. Detalhes Técnicos
*   **Funções de Servidor (`hero-journey.functions.ts`)**:
    *   `completeMission`: Registrar conclusão de missão.
    *   `updateProtocolStep`: Registrar passos do protocolo.
    *   `calculateFinalDiagnosis`: Função para processar todos os dados e gerar o resultado final.
*   **Componentes**:
    *   `ArchetypeJourney`: Componente principal para a sequência interativa.
    *   `HeroMap`: Componente visual para a dashboard.
*   **Persistência**: Manter o estado individual do usuário no Supabase para permitir continuidade cross-device.

## 5. Validação
*   Verificar o fluxo completo desde o Splash até o Diagnóstico Final.
*   Garantir que os textos de gamificação (2.700 caracteres) sejam exibidos adequadamente.
*   Testar o reset da jornada.
