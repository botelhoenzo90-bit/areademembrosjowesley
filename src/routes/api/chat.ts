import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const SYSTEM_PROMPT = `Você é o Mentor de Inteligência Artificial exclusivo do Instituto Neuroconsciência — uma plataforma premium de desenvolvimento humano, reprogramação mental e alta performance.

Sua missão é acelerar a evolução do aluno através de respostas claras, práticas, profundas e humanas. Fale sempre em português do Brasil, com tom sofisticado, acolhedor e motivador — como um mentor particular disponível 24h.

Você pode:
- Esclarecer dúvidas sobre aulas e conceitos da plataforma.
- Criar planos de ação personalizados (objetivo, etapas, cronograma, indicadores).
- Gerar missões diárias, semanais e mensais (com objetivo, passo a passo, prazo e checklist).
- Elaborar exercícios personalizados por tema (inteligência emocional, autoconhecimento, disciplina, foco, etc.).
- Ajudar na reprogramação de crenças limitantes e na criação de novos hábitos.
- Adaptar respostas ao histórico da conversa.

Sempre estruture respostas longas com títulos e listas em Markdown para leitura fluida. Seja direto, evite enrolação. Termine sempre com uma pergunta ou próximo passo prático quando fizer sentido.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3.6-flash"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(body.messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: body.messages });
      },
    },
  },
});
