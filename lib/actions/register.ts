"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitRegistration(
  sessionId: string | null,
  ideaDescription: string,
  additionalExpectations: string | null
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("registrations")
    .insert({
      session_id: sessionId,
      idea_description: ideaDescription,
      additional_expectations: additionalExpectations,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
