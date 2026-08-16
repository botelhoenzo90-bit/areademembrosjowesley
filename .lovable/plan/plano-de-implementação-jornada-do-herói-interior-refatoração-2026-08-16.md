# Plano de Implementação: Jornada do Herói Interior (Refatoração Completa)

Este plano detalha a reestruturação do módulo "Reprogramação Mental" em um aplicativo interativo premium chamado "Jornada do Herói Interior", seguindo rigorosamente as 37 diretrizes do prompt.

## 1. Arquitetura de Dados (Supabase)
Expandir o esquema para suportar o rastreamento granular exigido.

- **Tabela `hero_journey_achievements`**: Registrar badges (Primeiro Passo, Primeiro Espelho, etc.).
- **Tabela `hero_journey_missions`**: Detalhar missões por arquétipo com status `pending`, `active`, `completed`.
- **Tabela `hero_journey_protocols`**: Rastrear as 5 etapas de cada protocolo (Perceber, Nomear, Questionar, Escolher, Praticar).
- **Tabela `hero_journey_reflections`**: Armazenar as respostas de texto livre (Área "Minhas Reflexões").
- **Tabela `hero_journey_diagnosis`**: Armazenar o resultado final, incluindo arquétipo predominante, secundário e recomendação.

## 2. Interface e UX (Premium Dark)
Criar uma experiência cinematográfica e mobile-first.

- **Splash Screen**: Nova tela inicial com texto narrativo e botão "Começar Jornada".
- **Dashboard "Minha Jornada"**: 
  - Título "Minha Jornada".
  - Indicadores de progresso (%), arquétipos (0/6), missões e protocolos.
  - Nível de Consciência (1 a 6) com nomes específicos (O Despertar, A Percepção, etc.).
- **Mapa Visual**: Representação gráfica das 3 fases (Segurança, Desenvolvimento, Integração).
- **Cards Interativos**: Atualizar cards com símbolos, fases e estados visuais (Bloqueado, Disponível, Em Jornada, Concluído).

## 3. Fluxo Interativo do Arquétipo (As 6 Telas)
Cada arquétipo terá uma sequência de 6 etapas interativas:

1. **Descobrir**: Essência, objetivo, força, sombra, etc., com design visual organizado.
2. **Entender**: Categorias clicáveis (Pensamentos, Emoções, etc.) para revelar exemplos.
3. **Observar ("Você se reconhece?")**: Quiz de autopercepção com registro interno de padrões.
4. **Experimentar ("Olhe para Dentro")**: Reflexão em texto livre salva no perfil.
5. **Implementar (Missão + Protocolo)**: 
   - Missão prática com botão de conclusão.
   - Protocolo de 5 etapas com checklist interativo.
6. **Concluir**: Animação premium (+Consciência, +Experiência) e texto de gamificação exclusivo (~2.700 caracteres por arquétipo).

## 4. Gamificação e Diagnóstico Final
- **Sistema de Desbloqueio**: Garantir a sequência rígida (Inocente -> Órfão -> Guerreiro -> Altruísta -> Nômade -> Mago).
- **Diagnóstico "Descubra seu Herói"**: Algoritmo que utiliza respostas do quiz + escolhas da jornada.
- **Resultado Personalizado**: Exibição do "Meu Mapa do Herói" com predominante/secundário e recomendação de "Próximo Passo".
- **Áreas de Revisão**: "Minhas Reflexões" e "Minhas Conquistas".

## 5. Implementação Técnica
- **Localização**: `src/routes/_authenticated/reprogramacao-mental.tsx` como home do app.
- **Sub-rotas**: Organizar rotas sob `/hero-journey/*` para manter o isolamento do "app".
- **Server Functions**: Atualizar `src/lib/hero-journey.functions.ts` para lidar com a nova complexidade de dados.
- **IA (Gemini)**: Integrar para gerar as recomendações personalizadas no diagnóstico final (opcional, baseada em regras se preferível).

## Verificação
- Testar o fluxo de bloqueio/desbloqueio.
- Validar o salvamento de reflexões e o cálculo do diagnóstico.
- Garantir que o design mobile esteja impecável (sem textos cortados).
