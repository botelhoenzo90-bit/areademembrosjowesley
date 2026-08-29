import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { generateText } from "ai";
import { z } from "zod";

const MODEL = "google/gemini-3.6-flash";

export const loadPowerState = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: row } = await supabase
      .from("power_journey_state")
      .select("state")
      .eq("user_id", userId)
      .maybeSingle();
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", userId)
      .maybeSingle();
    return { stateJson: JSON.stringify(row?.state ?? null), name: (profile?.display_name ?? "") as string };
  });

export const savePowerState = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ state: z.string() }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("power_journey_state")
      .upsert({ user_id: userId, state: JSON.parse(data.state), updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const resetPowerState = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await supabase.from("power_journey_state").delete().eq("user_id", userId);
    return { ok: true };
  });

async function ai(prompt: string, fallback: string) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) return fallback;
  try {
    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({ model: gateway(MODEL), prompt });
    return text?.trim() || fallback;
  } catch {
    return fallback;
  }
}

export const generateLevelDiagnosis = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        name: z.string(),
        levelId: z.number(),
        levelName: z.string(),
        levelTitle: z.string(),
        centralQuestion: z.string(),
        areas: z.array(z.string()),
        score: z.number(),
        answers: z.array(z.object({ q: z.string(), a: z.string() })),
      })
      .parse(d),
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ data }) => {
    const respostas = data.answers.map((a, i) => `${i + 1}. ${a.q} → ${a.a}`).join("\n");
    const prompt = `Você é um mentor de desenvolvimento humano do Instituto NeuroConsciência. Escreva em português do Brasil.

Usuário: ${data.name}
Nível ${data.levelId} — ${data.levelName} (${data.levelTitle})
Pergunta central do nível: "${data.centralQuestion}"
Pontuação: ${data.score}/30
Áreas avaliadas: ${data.areas.join(", ")}
Respostas escolhidas:
${respostas}

Escreva um texto de APROXIMADAMENTE 2700 caracteres, iniciando com o título "DIAGNÓSTICO DE AUTOPERCEPÇÃO E DESENVOLVIMENTO", usando o nome do usuário várias vezes, com estas seções em maiúsculas:
LEITURA DO SEU MOMENTO, PONTOS FORTES, PONTOS DE ATENÇÃO, POSSIBILIDADES DE EVOLUÇÃO.
Seja específico às respostas dadas. Nada de diagnóstico médico, psiquiátrico ou psicológico, nada de promessa de cura. Encerre com a frase: "Este conteúdo é destinado à autopercepção e ao desenvolvimento pessoal e não substitui acompanhamento profissional."
Não use markdown nem asteriscos.`;
    const fallback = `DIAGNÓSTICO DE AUTOPERCEPÇÃO E DESENVOLVIMENTO\n\n${data.name}, seu resultado no Nível ${data.levelId} — ${data.levelName} — foi ${data.score}/30. Este é um retrato educativo do momento atual, feito a partir das suas próprias respostas.\n\nLEITURA DO SEU MOMENTO\nO tema deste nível é: ${data.levelTitle}. A pergunta que orienta sua jornada é: "${data.centralQuestion}".\n\nPONTOS FORTES\nVocê já demonstra recursos em ${data.areas.slice(0, 3).join(", ")}.\n\nPONTOS DE ATENÇÃO\nEscolha um único ponto entre ${data.areas.slice(0, 3).join(", ")} e trabalhe nele antes de tentar mudar tudo.\n\nPOSSIBILIDADES DE EVOLUÇÃO\nTransforme a leitura em um experimento com data, primeiro passo e registro do resultado.\n\nEste conteúdo é destinado à autopercepção e ao desenvolvimento pessoal e não substitui acompanhamento profissional.`;
    const diagnosis = await ai(prompt, fallback);

    const mission = await ai(
      `Com base no diagnóstico abaixo, escreva UMA missão prática para ${data.name}, em no máximo 3 frases: simples, específica, realista, executável em até 7 dias e diretamente ligada ao Nível ${data.levelId} — ${data.levelName}. Sem markdown, sem título.\n\n${diagnosis.slice(0, 1500)}`,
      `Escolha uma única ação ligada a ${data.levelName.toLowerCase()}, defina o dia e o horário em que ela acontecerá e registre o resultado ao final.`,
    );

    return { diagnosis, mission };
  });

export const generateProcrastinationProtocol = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ name: z.string(), text: z.string().min(5) }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data }) => {
    const prompt = `Você é um mentor anti-procrastinação do Instituto NeuroConsciência. Português do Brasil, tom direto e acolhedor.

Usuário: ${data.name}
Relato: "${data.text}"

Escreva APROXIMADAMENTE 2800 caracteres com estas 8 seções em maiúsculas, nesta ordem:
1. COMPREENSÃO DA SITUAÇÃO
2. PADRÃO DE PROCRASTINAÇÃO
3. FATORES ENVOLVIDOS
4. MUDANÇA DE PERSPECTIVA
5. PROTOCOLO DE EXECUÇÃO
6. PRIMEIRA AÇÃO
7. ESTRATÉGIA CONTRA INTERRUPÇÕES
8. CRITÉRIO DE CONCLUSÃO
Use o nome do usuário. Sem diagnóstico clínico e sem promessas de resultado garantido. Sem markdown.
Encerre exatamente com: "Agora não pense em terminar tudo. Execute o primeiro passo."`;
    const fallback = `COMPREENSÃO DA SITUAÇÃO\n${data.name}, o que você descreveu não é falta de capacidade: é uma tarefa sem primeiro passo definido.\n\nPRIMEIRA AÇÃO\nReduza a tarefa a uma ação de 10 minutos e marque um horário hoje.\n\nAgora não pense em terminar tudo. Execute o primeiro passo.`;
    const protocol = await ai(prompt, fallback);
    return { protocol };
  });

export const generateGoalPlan = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ name: z.string(), goal: z.string().min(3), horizon: z.string() }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data }) => {
    const prompt = `Monte um plano de meta para ${data.name}. Meta: "${data.goal}". Prazo: ${data.horizon}.
Responda APENAS em JSON válido, sem markdown, no formato:
{"result":"resultado esperado","steps":["etapa1","etapa2","etapa3","etapa4"],"priorities":["p1","p2","p3"],"actions":["a1","a2","a3"],"obstacles":["o1","o2","o3"],"strategy":"estratégia","first":"primeira ação","indicator":"indicador de progresso"}
Português do Brasil, específico e executável.`;
    const fallbackObj = {
      result: `Um resultado observável para "${data.goal}" dentro de ${data.horizon}.`,
      steps: ["Definir o resultado observável", "Escolher prioridades", "Executar a primeira ação", "Revisar e ajustar"],
      priorities: ["Clareza do resultado", "Consistência semanal", "Acompanhamento"],
      actions: [`Executar uma ação inicial ligada a ${data.goal}`, "Agendar as próximas ações", "Registrar o progresso"],
      obstacles: ["Falta de tempo", "Distrações", "Mudança de prioridade"],
      strategy: "Reduzir a meta a ações pequenas, agendadas e registradas; revisar no intervalo escolhido.",
      first: `Defina agora o primeiro passo de "${data.goal}" e marque quando será feito.`,
      indicator: "Uma evidência concreta registrada a cada ciclo.",
    };
    const text = await ai(prompt, "");
    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned.slice(cleaned.indexOf("{"), cleaned.lastIndexOf("}") + 1));
      return { plan: { ...fallbackObj, ...parsed } };
    } catch {
      return { plan: fallbackObj };
    }
  });
