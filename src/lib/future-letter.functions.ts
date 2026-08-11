import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getFutureLetters = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data, error } = await supabase
      .from("future_letters" as any)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  });

export const saveFutureLetter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    reality_today: z.string().optional(),
    future_identity: z.string().optional(),
    content: z.string().optional(),
    unlock_date: z.string().optional(),
    is_opened: z.boolean().optional(),
    password_hash: z.string().optional(),
    metadata: z.any().optional(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: result, error } = await supabase
      .from("future_letters" as any)
      .upsert({
        ...data,
        user_id: userId,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  });

export const getLetterResponse = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ letterId: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: result, error } = await supabase
      .from("future_letter_responses" as any)
      .select("*")
      .eq("letter_id", data.letterId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return result;
  });

export const saveLetterResponse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({
    letter_id: z.string(),
    response_text: z.string(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: result, error } = await supabase
      .from("future_letter_responses" as any)
      .upsert({
        ...data,
        user_id: userId,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  });
