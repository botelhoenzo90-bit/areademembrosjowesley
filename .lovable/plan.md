# Plano de Implementação Completa: Módulo Carta para o Eu do Futuro

Este plano detalha a implementação de todas as etapas e funcionalidades solicitadas para o módulo "Carta para o Eu do Futuro", transformando a página inicial estática em uma jornada psicológica e emocional completa.

## Objetivo
Criar uma experiência imersiva de 4 etapas conduzindo o usuário à escrita de uma carta temporal, com bloqueio inteligente, reflexão pós-abertura e segurança por senha.

## Etapas de Desenvolvimento

### 1. Reestruturação da Interface e Estado
- Refatorar `src/routes/_authenticated/carta-futuro.tsx` para gerenciar o fluxo da jornada (Etapas 1 a 4).
- Implementar animações de transição suave entre etapas.

### 2. Implementação da Jornada Guiada
- **Etapa 1 (Onde você está hoje?):** Interface de reflexão honesta com campo de texto e salvamento automático.
- **Etapa 2 (Quem você deseja se tornar?):** Interface de visualização de identidade futura (família, dinheiro, saúde, espiritualidade).
- **Etapa 3 (Linha do Tempo):** Experiência visual de viagem no tempo com seleção de data de abertura (6 meses a 5 anos).
- **Etapa 4 (Escrevendo sua Carta):** Editor de texto confortável (mobile/desktop) com sugestões inspiradoras que desaparecem ao digitar.

### 3. Sistema de Cápsula do Tempo e Bloqueio
- Criar a visualização "Minha Cápsula do Tempo".
- Implementar o **Bloqueio Inteligente**: a carta permanece ilegível e criptografada até a data de desbloqueio.
- Adicionar opção de **Proteção por Senha** para o módulo.

### 4. Experiência de Abertura e Pós-Abertura
- Animação especial de abertura na data programada.
- **Reflexão Pós-Abertura:** "Minha Resposta ao Meu Eu do Passado".
- **Comparação de Evolução:** Tela "Minha Transformação" comparando quem era vs. quem se tornou.

### 5. Backend e Persistência
- Atualizar `src/lib/future-letter.functions.ts` para suportar todos os novos campos e metadados (tempo gasto, contagem de palavras, etc.).
- Garantir salvamento em tempo real (debounce) para evitar perda de conteúdo.

## Detalhes Visuais
- Tipografia elegante, cores dark premium e tons que transmitam serenidade e propósito.
- Uso de componentes Shadcn/UI personalizados para a linha do tempo e editor.
