import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getJourneyStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

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
  });

export const getArchetypes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data, error } = await supabase
      .from('hero_journey_archetypes' as any)
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  });

export const updateArchetypeProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data) => z.object({
    archetype: z.enum(['inocente', 'orfao', 'guerreiro', 'altruista', 'nomade', 'mago']),
    status: z.enum(['locked', 'available', 'in_progress', 'completed']).optional(),
    progress: z.number().optional(),
    reflection_text: z.string().optional(),
    mission_completed: z.boolean().optional(),
    protocol_steps_completed: z.array(z.number()).optional(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { error } = await supabase
      .from('hero_journey_archetypes' as any)
      .upsert({
        user_id: userId,
        ...data,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,archetype' });

    if (error) throw error;
    return { success: true };
  });

export const getDiagnosis = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data, error } = await supabase
      .from('hero_journey_diagnosis' as any)
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  });

export const saveDiagnosis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data) => z.object({
    predominant_archetype: z.string(),
    details: z.any(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { error } = await supabase
      .from('hero_journey_diagnosis' as any)
      .upsert({
        user_id: userId,
        predominant: data.predominant_archetype,
        results: data.details,
        created_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) {
      console.error("Diagnosis Save Error:", error);
      throw error;
    }
    return { success: true };
  });

export const resetJourney = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { error: archError } = await supabase
      .from('hero_journey_archetypes' as any)
      .delete()
      .eq('user_id', userId);

    const { error: statsError } = await supabase
      .from('hero_journey_stats' as any)
      .delete()
      .eq('user_id', userId);

    const { error: diagError } = await supabase
      .from('hero_journey_diagnosis' as any)
      .delete()
      .eq('user_id', userId);

    if (archError || statsError || diagError) throw new Error("Reset failed");
    return { success: true };
  });
