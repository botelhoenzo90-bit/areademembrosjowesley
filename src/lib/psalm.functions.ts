import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";

const StudySchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  psalm_text: z.string(),
  decoding: z.string(),
  application: z.string(),
  reflection: z.array(z.string()),
  exercises: z.array(z.string()),
  mission: z.string(),
  affirmation: z.string(),
  prayer: z.string(),
  theme: z.string(),
});

type Study = z.infer<typeof StudySchema>;

function todayISO() {
  // Brazil timezone reference for the daily cycle
  const now = new Date();
  const br = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  return br.toISOString().slice(0, 10);
}

function shuffledPick(used: number[]): number {
  const all = Array.from({ length: 150 }, (_, i) => i + 1).filter((n) => !used.includes(n));
  return all[Math.floor(Math.random() * all.length)];
}

export const getTodayPsalmStudy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const date = todayISO();

    const { data: existing } = await supabase
      .from("psalm_studies")
      .select("*")
      .eq("user_id", userId)
      .eq("study_date", date)
      .maybeSingle();

    if (existing) return existing;

    // determine current cycle + used psalms
    const { data: rows } = await supabase
      .from("psalm_studies")
      .select("cycle, psalm_number")
      .eq("user_id", userId);

    const all = rows ?? [];
    let cycle = all.reduce((m, r) => Math.max(m, r.cycle), 1);
    let used = all.filter((r) => r.cycle === cycle).map((r) => r.psalm_number);
    if (used.length >= 150) {
      cycle += 1;
      used = [];
    }

    const psalm = shuffledPick(used);
    const totalDone = all.length;

    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);

    const prompt = `Crie um estudo diário TOTALMENTE INÉDITO sobre o Salmo ${psalm}.
Data do estudo: ${date}. Identificador de unicidade: ciclo ${cycle}, geração #${totalDone + 1}, semente ${Math.random().toString(36).slice(2)}.
Nunca reutilize explicações prontas: escreva com abordagem, exemplos e estrutura diferentes de qualquer versão anterior.

Requisitos:
- Português do Brasil, linguagem simples, profunda, acolhedora e inspiradora. Evite linguagem religiosa pesada; foque em desenvolvimento humano usando os princípios do Salmo.
- title: "Salmo ${psalm}".
- subtitle: frase-tema curta e impactante (ex.: "O Pastor que elimina a ansiedade").
- psalm_text: o texto do Salmo ${psalm} integral ou uma seleção representativa dos versículos principais, em domínio público (base Almeida), com quebras de linha entre versículos.
- decoding: contexto, significado, ensinamentos, princípios e lições, sempre conectando com neurociência, inteligência emocional, psicologia cognitiva, resiliência, controle emocional, autoconhecimento, hábitos, propósito, identidade, esperança, relacionamentos, liderança, disciplina, sabedoria e tomada de decisão. Use parágrafos.
- application: como aplicar hoje, o que muda na forma de pensar, impacto nas emoções, nos relacionamentos e que decisão tomar hoje.
- reflection: 4 perguntas profundas de reflexão.
- exercises: entre 3 e 5 exercícios práticos do dia.
- mission: uma missão prática do dia, em uma frase começando com "Hoje você irá...".
- affirmation: uma afirmação poderosa em primeira pessoa.
- prayer: oração final breve, entre 120 e 180 palavras, conectando fé, esperança, transformação e ação prática.
- theme: uma palavra-tema (ex.: "Confiança", "Gratidão", "Coragem").
Somando decoding + application + reflection, o conteúdo deve ter aproximadamente 2700 caracteres.`;

    let study: Study;
    try {
      const { output } = await generateText({
        model: gateway("google/gemini-3.6-flash"),
        output: Output.object({ schema: StudySchema }),
        prompt,
      });
      study = output as Study;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error) && error.text) {
        const cleaned = error.text.replace(/```json|```/g, "").trim();
        study = StudySchema.parse(JSON.parse(cleaned));
      } else {
        throw error;
      }
    }

    const { data: inserted, error: insertError } = await supabase
      .from("psalm_studies")
      .insert({
        user_id: userId,
        study_date: date,
        cycle,
        psalm_number: psalm,
        title: study.title || `Salmo ${psalm}`,
        subtitle: study.subtitle ?? "",
        psalm_text: study.psalm_text ?? "",
        decoding: study.decoding ?? "",
        application: study.application ?? "",
        reflection: study.reflection ?? [],
        exercises: study.exercises ?? [],
        mission: study.mission ?? "",
        affirmation: study.affirmation ?? "",
        prayer: study.prayer ?? "",
        theme: study.theme ?? "",
      })
      .select("*")
      .single();

    if (insertError) {
      // race: another request created today's study
      const { data: retry } = await supabase
        .from("psalm_studies")
        .select("*")
        .eq("user_id", userId)
        .eq("study_date", date)
        .maybeSingle();
      if (retry) return retry;
      throw insertError;
    }

    return inserted;
  });
