# Plano de Finalização da Jornada do Herói Interior

O módulo "Reprogramação Mental" foi transformado na "Jornada do Herói Interior", uma experiência interativa que guia o usuário por 6 arquétipos fundamentais com mentorias, quizzes e um diagnóstico final.

## Mudanças Realizadas

### Banco de Dados (Supabase)
- Criação das tabelas `hero_journey_stats`, `hero_journey_archetypes`, `hero_journey_quiz_responses`, `hero_journey_diagnosis` e `hero_journey_certificates`.
- Implementação de RLS (Row Level Security) e permissões para garantir a segurança dos dados de cada usuário.

### Frontend e UX/UI
- **Dashboard Principal**: Criado em `src/routes/_authenticated/reprogramacao-mental.tsx` com 3 fases (Segurança, Desenvolvimento, Integração) e sistema de desbloqueio sequencial.
- **Experiência do Arquétipo**: Implementada em `src/routes/_authenticated/hero-journey/archetype.$id.tsx` com 8 estágios:
  1. **Descoberta**: Visão geral do arquétipo.
  2. **Mentoria**: Texto profundo sobre o padrão.
  3. **Quiz**: 5 perguntas para medir a presença do arquétipo.
  4. **Compreensão**: Detalhamento de pensamentos, emoções e comportamentos.
  5. **Observação**: Auto-percepção guiada.
  6. **Experimentação**: Reflexão escrita.
  7. **Implementação**: Missão prática e protocolo de ação.
  8. **Conclusão**: Feedback de gamificação e desbloqueio do próximo nível.
- **Diagnóstico Final**: Quiz de 5 perguntas (`diagnostico.tsx`) para identificar o arquétipo predominante e secundário após concluir os 6 níveis.
- **Resultado e Certificado**: Visualização do perfil psicológico atual e emissão do certificado de conclusão (`resultado.tsx`).

### Lógica de Negócio
- `src/lib/hero-content.ts`: Contém todo o conteúdo textual das mentorias, quizzes e feedbacks para os 6 arquétipos (Inocente, Órfão, Guerreiro, Altruísta, Nômade, Mago).
- `src/lib/hero-journey.functions.ts`: Funções de servidor para persistência de progresso, cálculo de diagnóstico e geração de certificado.

## Detalhes Técnicos
- Utilização de `framer-motion` para transições cinematográficas entre os estágios.
- Sistema de cache com `TanStack Query` para performance e estados de loading.
- Proteção de rotas e funções com middleware de autenticação.

O sistema está completo e funcional, seguindo rigorosamente as 37 regras do prompt mestre.
