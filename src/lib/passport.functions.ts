import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const getPassportData = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const [layersRes, progressRes, badgesRes, userBadgesRes] = await Promise.all([
      supabase.from("passport_layers").select("*").order("layer_number"),
      supabase.from("user_layer_progress").select("*").eq("user_id", user.id),
      supabase.from("passport_badges").select("*"),
      supabase.from("user_passport_badges").select("*").eq("user_id", user.id)
    ]);

    return {
      layers: layersRes.data || [],
      progress: progressRes.data || [],
      badges: badgesRes.data || [],
      userBadges: userBadgesRes.data || []
    };
  });

export const updateLayerProgress = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    layerId: z.string(),
    updates: z.object({
        status: z.string().optional(),
        lesson_completed: z.boolean().optional(),
        gamification_viewed: z.boolean().optional(),
        mission_completed: z.boolean().optional(),
        protocol_completed: z.boolean().optional(),
        reflection_content: z.string().optional(),
        points_earned: z.number().optional(),
        completed_at: z.string().optional()
    })
  }).parse(data))
  .handler(async ({ data }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: result, error } = await supabase
      .from("user_layer_progress")
      .upsert({
        user_id: user.id,
        layer_id: data.layerId,
        ...data.updates,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id,layer_id" })
      .select()
      .single();

    if (error) throw error;
    return result;
  });

export const unlockNextLayer = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    currentLayerNumber: z.number()
  }).parse(data))
  .handler(async ({ data }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const nextLayerNumber = data.currentLayerNumber + 1;
    const { data: nextLayer } = await supabase
      .from("passport_layers")
      .select("id")
      .eq("layer_number", nextLayerNumber)
      .single();

    if (nextLayer) {
        await supabase
          .from("user_layer_progress")
          .upsert({
            user_id: user.id,
            layer_id: nextLayer.id,
            status: 'available'
          }, { onConflict: "user_id,layer_id" });
    }
    
    return { success: true };
  });

export const restartPassportJornada = createServerFn({ method: "POST" })
  .handler(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    await Promise.all([
        supabase.from("user_layer_progress").delete().eq("user_id", user.id),
        supabase.from("user_passport_badges").delete().eq("user_id", user.id)
    ]);

    return { success: true };
  });
