# Plano de Implementação: Jornada do Herói Interior

Implementação da experiência interativa baseada nos 6 arquétipos de Carol S. Pearson no módulo de Reprogramação Mental, mantendo as funcionalidades existentes.

## 1. Estrutura de Dados e Backend
- Criar a tabela `hero_journey_quizzes` para armazenar as 5 perguntas por arquétipo.
- Criar a tabela `hero_journey_scores` para rastrear a pontuação individual por arquétipo e usuário.
- Criar a tabela `hero_journey_certificates` para armazenar os dados dos certificados gerados.
- Criar funções de servidor (`.functions.ts`) para:
  - Buscar perguntas do quiz.
  - Salvar respostas e calcular pontuação.
  - Gerar o diagnóstico final baseado na maior pontuação (predominante e secundário).
  - Gerar o certificado de conclusão.

## 2. Conteúdo dos Arquétipos
- Expandir `ARCHETYPES_CONTENT` em `src/lib/hero-content.ts` com:
  - Texto de mentoria de ~2.700 caracteres para cada um dos 6 arquétipos.
  - Dados estruturados para os quizzes de 5 perguntas.
  - Scripts de diagnóstico curto para cada arquétipo.

## 3. Interface da Jornada (Frontend)
- **Refatorar `archetype.$id.tsx`**:
  - Adicionar nova etapa de "Mini Mentoria" com scroll interativo.
  - Implementar o componente de Quiz de 5 perguntas com feedback visual imediato.
  - Adicionar tela de "Arquétipo Concluído" com o banner solicitado e desbloqueio do próximo.
- **Atualizar a Home do Módulo (`reprogramacao-mental.tsx`)**:
  - Exibir o progresso consolidado (0/6 → 6/6).
  - Mostrar visualmente quais arquétipos estão bloqueados/desbloqueados.
- **Nova página de Resultado/Certificado**:
  - Criar `src/routes/_authenticated/hero-journey/certificado.tsx`.
  - Exibir o arquétipo predominante e secundário com explicações.
  - Gerar o certificado visual (mobile-first) com nome, data e arquétipo.

## Detalhes Técnicos
- **Arquétipos**: Inocente, Órfão, Guerreiro, Altruísta, Nômade, Mago.
- **Gamificação**: Pontuação acumulada visível e barras de progresso animadas.
- **UX/UI**: Uso de Framer Motion para transições entre etapas do arquétipo. Design Premium Dark seguindo a identidade visual do projeto.
- **Segurança**: Validação de desbloqueio sequencial no servidor.

## Invariantes
- A aula "Código da Mente Extraordinária" em `reprogramacao-mental.tsx` será mantida intocada.
- Nenhuma funcionalidade anterior será removida ou duplicada.
