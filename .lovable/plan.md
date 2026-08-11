# Plano de Implementação: Módulo Carta para o Eu do Futuro

Este plano detalha a implementação completa da jornada interativa "Carta para o Eu do Futuro", expandindo a estrutura base já criada.

## Objetivos
- Transformar a página estática em uma jornada de 4 etapas.
- Implementar a "Cápsula do Tempo" com sistema de bloqueio e desbloqueio.
- Garantir a persistência correta dos dados no banco de dados.

## Etapas de Desenvolvimento

### 1. Componentes de Interface (UI)
- Criar `LetterStage.tsx`: Componente base para cada etapa da jornada.
- Criar `RealityToday.tsx`: Etapa 1 - Reflexão sobre o presente.
- Criar `FutureIdentity.tsx`: Etapa 2 - Visualização do futuro.
- Criar `TimeCapsule.tsx`: Etapa 3 - Configuração de data e senha.
- Criar `EvolutionComparison.tsx`: Etapa 4 - Reflexão pós-abertura.

### 2. Fluxo de Navegação e Estado
- Refatorar `src/routes/_authenticated/carta-futuro.tsx` para gerenciar o estado da jornada (etapa atual, dados da carta).
- Implementar animações de transição entre as etapas.

### 3. Integração com Backend
- Vincular os inputs das etapas às funções de servidor em `src/lib/future-letter.functions.ts`.
- Implementar verificação de `unlock_date` para habilitar a abertura da carta.

## Detalhes Técnicos
- **Banco de Dados:** Utiliza as tabelas `future_letters` e `future_letter_responses` já migradas.
- **Segurança:** As cartas são protegidas por RLS e podem opcionalmente ter uma senha (`password_hash`).
- **UX:** Experiência imersiva com tipografia elegante e elementos visuais que remetem a uma cápsula do tempo.
