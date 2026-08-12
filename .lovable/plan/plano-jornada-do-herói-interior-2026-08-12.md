# Plano: Jornada do Herói Interior

Implementação do aplicativo interativo "Jornada do Herói Interior" dentro do módulo de Reprogramação Mental, substituindo a estrutura de aulas tradicional por uma experiência de autoconhecimento baseada em arquétipos.

## 1. Experiência de Entrada (Cinema)
- **Tela de Splash:** Título "SUA JORNADA COMEÇA AQUI" com narrativa cinematográfica sobre padrões internos.
- **Identificação:** Saudação personalizada usando o nome do usuário.
- **Botão de Ação:** "COMEÇAR JORNADA" com transição fluida.

## 2. Dashboard "Minha Jornada"
- **Indicadores:** Progresso (%), Arquetipos (0/6), Missões, Protocolos e Nível de Consciência (1-6).
- **Mapa Visual:** 6 estações divididas em 3 fases (Segurança, Desenvolvimento, Integração).
- **Cards Interativos:** Status (Bloqueado, Disponível, Em Jornada, Concluído) com artes simbólicas exclusivas.

## 3. Fluxo do Arquétipo (Sequência de 6 Etapas)
Para cada arquétipo (Inocente, Órfão, Guerreiro, Altruísta, Nômade, Mago):
- **Descobrir:** Essência, força, sombra e pergunta central.
- **Entender:** Categorias tocáveis (Pensamentos, Emoções, etc.).
- **Percepção:** Perguntas interativas "Você se reconhece?".
- **Reflexão:** Campo de escrita "Olhe para dentro".
- **Missão:** Desafio prático para a vida real.
- **Protocolo:** Guia de implementação em 5 passos (Perceber, Nomear, Questionar, Escolher, Praticar).

## 4. Gamificação e Recompensa
- **Badges:** Medalhas por marcos específicos (Primeira Missão, O Guerreiro Desperta, etc.).
- **Conclusão:** Animação premium e texto reflexivo longo (~2.700 chars) específico por arquétipo.
- **Desbloqueio:** Liberação sequencial conforme avanço.

## 5. Diagnóstico e Mapa do Herói
- **Sistema Inteligente:** Cálculo de predominância baseado nas respostas da jornada.
- **Tela de Resultado:** Exibição do Arquétipo Predominante, Força, Sombra e Próximo Movimento.
- **Mapa Personalizado:** Representação visual da composição arquetípica do usuário.
- **Histórico:** Seção "Minhas Reflexões" para revisitar respostas e protocolos.

## Detalhes Técnicos
- **Persistência:** Supabase para estados, reflexões e diagnósticos.
- **UI:** Tailwind CSS v4, Framer Motion para animações, estética Dark Premium.
- **IA:** Integração com Gemini (via functions) para gerar textos de gamificação e recomendações personalizadas.
