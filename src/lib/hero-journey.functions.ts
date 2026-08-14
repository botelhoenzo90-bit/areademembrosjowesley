import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getJourneyStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    try {
      const { data, error } = await supabase
        .from('hero_journey_stats' as any)
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        const { data: newStats, error: createError } = await supabase
          .from('hero_journey_stats' as any)
          .insert({ user_id: userId })
          .select()
          .single();
        if (createError) throw createError;
        return newStats;
      }

      return data;
    } catch (err) {
      console.error("Server function error [getJourneyStats]:", err);
      throw err;
    }
  });

export const getArchetypes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    try {
      const { data, error } = await supabase
        .from('hero_journey_archetypes' as any)
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Server function error [getArchetypes]:", err);
      throw err;
    }
  });

export const updateArchetypeProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: any) => z.object({
    archetype: z.enum(['inocente', 'orfao', 'guerreiro', 'altruista', 'nomade', 'mago']),
    status: z.enum(['locked', 'available', 'in_progress', 'completed']).optional(),
    progress: z.number().optional(),
    reflection_text: z.string().optional(),
    mission_completed: z.boolean().optional(),
    protocol_steps_completed: z.array(z.number()).optional(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    try {
      const { error } = await supabase
        .from('hero_journey_archetypes' as any)
        .upsert({
          user_id: userId,
          ...data,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,archetype' });

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error("Server function error [updateArchetypeProgress]:", err);
      throw err;
    }
  });

export const getDiagnosis = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    try {
      const { data, error } = await supabase
        .from('hero_journey_diagnosis' as any)
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Server function error [getDiagnosis]:", err);
      throw err;
    }
  });

export const saveDiagnosis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: any) => z.object({
    predominant_archetype: z.string(),
    details: z.any(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    try {
      const { error } = await supabase
        .from('hero_journey_diagnosis' as any)
        .upsert({
          user_id: userId,
          predominant: data.predominant_archetype,
          results: data.details,
          created_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error("Server function error [saveDiagnosis]:", err);
      throw err;
    }
  });

export const saveQuizResponses = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: any) => z.object({
    archetype: z.enum(['inocente', 'orfao', 'guerreiro', 'altruista', 'nomade', 'mago']),
    responses: z.array(z.object({
      question_index: z.number(),
      answer_index: z.number(),
      score: z.number()
    }))
  }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    try {
      const { error } = await supabase
        .from('hero_journey_quiz_responses' as any)
        .upsert(
          data.responses.map(r => ({
            user_id: userId,
            archetype: data.archetype,
            ...r
          })),
          { onConflict: 'user_id,archetype,question_index' }
        );
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error("Server function error [saveQuizResponses]:", err);
      throw err;
    }
  });

export const generateCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    try {
      const { data: diagnosis } = await supabase
        .from('hero_journey_diagnosis' as any)
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!diagnosis) throw new Error("Diagnosis not found");

      const { data, error } = await supabase
        .from('hero_journey_certificates' as any)
        .upsert({
          user_id: userId,
          predominant: diagnosis.predominant,
          secondary: diagnosis.secondary,
          issue_date: new Date().toISOString()
        }, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Server function error [generateCertificate]:", err);
      throw err;
    }
  });

export const resetJourney = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    try {
      await Promise.all([
        supabase.from('hero_journey_archetypes' as any).delete().eq('user_id', userId),
        supabase.from('hero_journey_stats' as any).delete().eq('user_id', userId),
        supabase.from('hero_journey_diagnosis' as any).delete().eq('user_id', userId),
        supabase.from('hero_journey_quiz_responses' as any).delete().eq('user_id', userId),
        supabase.from('hero_journey_certificates' as any).delete().eq('user_id', userId)
      ]);

      return { success: true };
    } catch (err) {
      console.error("Server function error [resetJourney]:", err);
      throw err;
    }
  });
