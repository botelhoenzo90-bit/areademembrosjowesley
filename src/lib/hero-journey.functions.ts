import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const getJourneyStats = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from('hero_journey_stats' as any)
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) {
      const { data: newStats, error: createError } = await supabase
        .from('hero_journey_stats' as any)
        .insert({ user_id: user.id })
        .select()
        .single();
      if (createError) throw createError;
      return newStats;
    }

    return data;
  });

export const getArchetypes = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from('hero_journey_archetypes' as any)
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    return data;
  });

export const updateArchetypeProgress = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    archetype: z.enum(['inocente', 'orfao', 'guerreiro', 'altruista', 'nomade', 'mago']),
    status: z.enum(['locked', 'available', 'in_progress', 'completed']).optional(),
    progress: z.number().optional(),
    reflection_text: z.string().optional(),
    mission_completed: z.boolean().optional(),
    protocol_steps_completed: z.array(z.number()).optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
      .from('hero_journey_archetypes' as any)
      .upsert({
        user_id: user.id,
        ...data,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
    return { success: true };
  });

export const getDiagnosis = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from('hero_journey_diagnosis' as any)
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  });

export const saveDiagnosis = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    predominant_archetype: z.string(),
    details: z.any(),
  }).parse(data))
  .handler(async ({ data }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
      .from('hero_journey_diagnosis' as any)
      .upsert({
        user_id: user.id,
        predominant: data.predominant_archetype,
        results: data.details,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Diagnosis Save Error:", error);
      throw error;
    }
    return { success: true };
  });

export const resetJourney = createServerFn({ method: "POST" })
  .handler(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error: archError } = await supabase
      .from('hero_journey_archetypes' as any)
      .delete()
      .eq('user_id', user.id);

    const { error: statsError } = await supabase
      .from('hero_journey_stats' as any)
      .delete()
      .eq('user_id', user.id);

    const { error: diagError } = await supabase
      .from('hero_journey_diagnosis' as any)
      .delete()
      .eq('user_id', user.id);

    if (archError || statsError || diagError) throw new Error("Reset failed");
    return { success: true };
  });
