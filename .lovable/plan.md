# Plano de Implementação: Módulo Carta para o Eu do Futuro

Este plano detalha a implementação completa da jornada interativa "Carta para o Eu do Futuro", expandindo a estrutura base já criada com a nova identidade visual.

## Objetivos
- Transformar a página estática em uma jornada imersiva de 4 etapas.
- Implementar a "Cápsula do Tempo" com sistema de bloqueio temporal e senha.
- Garantir a persistência correta dos dados no backend.

## Etapas de Desenvolvimento

### 1. Componentes de Interface (UI)
- Criar `LetterStage.tsx`: Componente base para cada etapa da jornada.
- Criar `RealityToday.tsx`: Etapa 1 - Reflexão profunda sobre o presente.
- Criar `FutureIdentity.tsx`: Etapa 2 - Visualização da identidade futura.
- Criar `TimeCapsule.tsx`: Etapa 3 - Configuração de data de desbloqueio e senha opcional.
- Criar `EvolutionComparison.tsx`: Etapa 4 - Reflexão e comparação de evolução pós-abertura.

### 2. Fluxo de Navegação e Estado
- Refatorar `src/routes/_authenticated/carta-futuro.tsx` para gerenciar o estado da jornada (etapa atual, dados da carta).
- Implementar animações suaves de transição entre as etapas.

### 3. Integração com Backend
- Vincular os inputs das etapas às funções de servidor em `src/lib/future-letter.functions.ts`.
- Implementar verificação de `unlock_date` no servidor para garantir a integridade da "Cápsula do Tempo".

## Detalhes Técnicos
- **Banco de Dados:** Utiliza as tabelas `future_letters` e `future_letter_responses`.
- **Identidade Visual:** Aplicada a nova capa oficial do módulo e estilo dark premium condizente com o Instituto Neuroconsciência.
- **Segurança:** Cartas protegidas por RLS.
