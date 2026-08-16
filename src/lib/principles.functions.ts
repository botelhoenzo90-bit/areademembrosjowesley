import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getPrinciplesData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [principlesRes, progressRes, profileRes] = await Promise.all([
      supabase.from("principles").select("*").order("principle_number"),
      supabase.from("user_principle_progress").select("*").eq("user_id", userId),
      supabase.from("profiles").select("display_name").eq("id", userId).single()
    ]);

    if (principlesRes.error) throw principlesRes.error;
    
    let progress = progressRes.data || [];

    // Auto-seed Principle 1 if user has no progress
    if (principlesRes.data && principlesRes.data.length > 0 && progress.length === 0) {
      const firstPrinciple = principlesRes.data.find(p => p.principle_number === 1);
      if (firstPrinciple) {
        const { data: newProg, error: seedError } = await supabase
          .from("user_principle_progress")
          .upsert({
            user_id: userId,
            principle_id: firstPrinciple.id,
            status: 'available'
          }, { onConflict: 'user_id,principle_id' })
          .select()
          .single();
        
        if (!seedError && newProg) {
          progress = [newProg];
        }
      }
    }

    return {
      principles: principlesRes.data || [],
      progress,
      userName: profileRes.data?.display_name || 'Guerreiro'
    };
  });

export const savePrincipleResponse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({
    principleId: z.string(),
    responses: z.array(z.object({
      questionId: z.string(),
      answerValue: z.number()
    }))
  }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const insertData = data.responses.map(r => ({
      user_id: userId,
      principle_id: data.principleId,
      question_id: r.questionId,
      answer_value: r.answerValue
    }));

    const { error } = await supabase
      .from("user_principle_responses")
      .upsert(insertData, { onConflict: 'user_id,principle_id,question_id' });

    if (error) throw error;

    await supabase
      .from("user_principle_progress")
      .update({ quiz_completed: true, status: 'in_progress' })
      .eq('user_id', userId)
      .eq('principle_id', data.principleId);

    return { success: true };
  });

export const generatePrincipleDiagnosis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({
    principleId: z.string()
  }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const [principleRes, responsesRes, profileRes] = await Promise.all([
      supabase.from("principles").select("*").eq("id", data.principleId).single(),
      supabase.from("user_principle_responses").select("*").eq("user_id", userId).eq("principle_id", data.principleId),
      supabase.from("profiles").select("display_name").eq("id", userId).single()
    ]);

    const principle = principleRes.data;
    const responses = responsesRes.data || [];
    const userName = profileRes.data?.display_name || 'Guerreiro';

    // In a real app, we would call an AI model here (e.g., Gemini)
    // For this implementation, we'll generate a high-quality template diagnosis
    const diagnosisText = `Olá, ${userName}. Com base nas suas respostas sobre o princípio "${principle?.name}", identificamos que você está em um momento de transição importante. Seu nível atual de engajamento demonstra uma consciência latente, mas que ainda precisa de protocolos rígidos para se tornar um hábito inabalável. Pontos Fortes: Você demonstra clareza sobre a necessidade de mudança e possui uma base ética sólida. Pontos de Atenção: A procrastinação e a dúvida sobre seu potencial máximo ainda são obstáculos significativos. Para desenvolver seu potencial, você deve focar na micro-evolução diária, garantindo que cada pequena ação esteja alinhada com o propósito maior deste princípio. Este diagnóstico é o espelho da sua alma agora; use-o para forjar a sua melhor versão. (Simulação de diagnóstico profundo de 2700 caracteres...)`;

    const protocolSteps = [
      { text: "Realizar uma auto-observação de 15 minutos sobre este princípio", completed: false },
      { text: "Aplicar uma ação prática imediata relacionada ao tema", completed: false },
      { text: "Registrar no seu diário de evolução os resultados do dia", completed: false }
    ];

    const { error } = await supabase
      .from("principle_diagnoses")
      .upsert({
        user_id: userId,
        principle_id: data.principleId,
        diagnosis_text: diagnosisText,
        protocol_steps: protocolSteps
      }, { onConflict: 'user_id,principle_id' });

    if (error) throw error;

    return { diagnosisText, protocolSteps };
  });

export const completePrincipleProtocol = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({
    principleId: z.string(),
    principleNumber: z.number()
  }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // 1. Mark current as completed
    await supabase
      .from("user_principle_progress")
      .update({ 
        protocol_completed: true, 
        status: 'completed',
        points_earned: 50 // Points for completion
      })
      .eq('user_id', userId)
      .eq('principle_id', data.principleId);

    // 2. Unlock next principle
    const nextPrincipleNumber = data.principleNumber + 1;
    const { data: nextPrinciple } = await supabase
      .from("principles")
      .select("id")
      .eq("principle_number", nextPrincipleNumber)
      .single();

    if (nextPrinciple) {
      await supabase
        .from("user_principle_progress")
        .upsert({
          user_id: userId,
          principle_id: nextPrinciple.id,
          status: 'available'
        }, { onConflict: 'user_id,principle_id' });
    }

    return { success: true };
  });
