"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitRegistration(
  sessionId: string | null,
  name: string,
  email: string,
  ideaDescription: string,
  additionalExpectations: string | null
) {
  const supabase = await createClient();

  // Attach authenticated user if available
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("registrations")
    .insert({
      session_id: sessionId,
      user_id: user?.id ?? null,
      name,
      email,
      idea_description: ideaDescription,
      additional_expectations: additionalExpectations,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
