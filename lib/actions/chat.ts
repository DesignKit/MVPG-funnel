"use server";

import { createClient } from "@/lib/supabase/server";

export async function createChatSession() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({})
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function submitChatAnswer(
  sessionId: string,
  questionKey: "problem" | "target_user" | "mvp_features" | "timeline",
  questionText: string,
  answerText: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_responses")
    .upsert(
      {
        session_id: sessionId,
        question_key: questionKey,
        question_text: questionText,
        answer_text: answerText,
      },
      { onConflict: "session_id,question_key" }
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function completeChatSession(sessionId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("chat_sessions")
    .update({ status: "completed", updated_at: new Date().toISOString() })
    .eq("id", sessionId);

  if (error) throw new Error(error.message);
}
