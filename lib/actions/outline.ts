"use server";

import { createClient } from "@/lib/supabase/server";

export async function getProjectOutline(registrationId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_outlines")
    .select()
    .eq("registration_id", registrationId)
    .order("version", { ascending: false })
    .limit(1)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
