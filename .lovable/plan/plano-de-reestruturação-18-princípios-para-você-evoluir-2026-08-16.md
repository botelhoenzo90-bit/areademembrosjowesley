# Plano de Reestruturação: 18 Princípios para Você Evoluir

Este plano reestrutura o módulo "Treinamento Premium" em uma jornada interativa de 18 princípios sequenciais, integrando aulas, quizzes, diagnósticos personalizados e protocolos práticos.

## Alterações no Banco de Dados (Lovable Cloud)

1.  **Novas Tabelas:**
    *   `principles`: Armazena os 18 princípios (nome, descrição, vídeo, ordem).
    *   `user_principle_progress`: Rastreia o progresso individual (aula, quiz, diagnóstico, protocolo).
    *   `principle_quizzes`: Armazena as 9 perguntas para cada princípio.
    *   `user_principle_responses`: Armazena as respostas do usuário para o diagnóstico.
    *   `principle_diagnoses`: Armazena os diagnósticos gerados e protocolos.

2.  **Migração Inicial:**
    *   Inserir os 18 princípios conforme a lista fornecida.
    *   Garantir que a aula de introdução existente (Layer 0 anterior) seja preservada como ponto de partida ou integrada.

## Implementação Backend (TanStack Server Functions)

*   `src/lib/principles.functions.ts`:
    *   `getPrinciplesData`: Busca a lista de princípios e o progresso do usuário.
    *   `savePrincipleResponse`: Salva respostas do quiz.
    *   `generatePrincipleDiagnosis`: Gera o diagnóstico de ~2700 caracteres (usando IA/Gemini) e o protocolo prático.
    *   `completePrincipleProtocol`: Marca o protocolo como concluído e desbloqueia o próximo princípio.

## Desenvolvimento Frontend (React + TanStack Router)

1.  **Dashboard de Princípios (`src/routes/_authenticated/treinamento-premium.tsx`):**
    *   Nova interface estilo "Jornada de Desenvolvimento Pessoal".
    *   Exibição progressiva (1/18).
    *   Cards com estados: Bloqueado, Disponível, Concluído.

2.  **Página do Princípio (`src/routes/_authenticated/treinamento-premium/principio.$index.tsx`):**
    *   **Etapa 1: Aula**: Player de vídeo e botão de conclusão.
    *   **Etapa 2: Quiz**: Interface interativa com 9 perguntas.
    *   **Etapa 3: Diagnóstico**: Exibição do texto personalizado personalizado com o nome do usuário.
    *   **Etapa 4: Protocolo**: Lista de ações práticas com checkbox de conclusão.
    *   **Feedback Visual**: Banner de "PARABÉNS, [NOME]!" com animação de faíscas e som curto ao concluir.

3.  **Lógica de Desbloqueio:**
    *   Sequencial: Aula -> Quiz -> Diagnóstico -> Protocolo -> Próximo.

## Detalhes Técnicos

*   **IA Gateway**: Utilização do Gemini para gerar diagnósticos profundos e protocolos específicos baseados nas respostas do quiz.
*   **Framer Motion**: Para animações de transição entre etapas e o banner de conclusão.
*   **Shadcn UI**: Uso de cards, buttons e progress bars personalizados.

## Segurança e Performance

*   RLS ativado em todas as novas tabelas.
*   Garantia de que um usuário não pode acessar um princípio futuro sem completar o anterior no backend.
*   Carregamento otimizado com cache do TanStack Query.
