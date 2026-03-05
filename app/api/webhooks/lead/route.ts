import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function validateAuth(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  return token === process.env.WEBHOOK_API_KEY;
}

interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: string;
  industry?: string;
  budget?: string;
  idea_description?: string;
  how_far_along?: string;
  why_building_mvp?: string;
}

export async function POST(request: Request) {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.name || !body.email || !body.source) {
    return NextResponse.json(
      { error: "name, email, and source are required" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  // Find existing registration by email (most recent)
  const { data: existing } = await supabase
    .from("registrations")
    .select("id")
    .eq("email", body.email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let id: string;
  let action: "created" | "updated";

  if (existing) {
    // Update existing registration with new CRM data
    const { error } = await supabase
      .from("registrations")
      .update({
        name: body.name,
        phone: body.phone ?? null,
        company: body.company ?? null,
        source: body.source,
        industry: body.industry ?? null,
        budget: body.budget ?? null,
        idea_description: body.idea_description ?? null,
        how_far_along: body.how_far_along ?? null,
        why_building_mvp: body.why_building_mvp ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    id = existing.id;
    action = "updated";
  } else {
    // Create new registration
    const { data, error } = await supabase
      .from("registrations")
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone ?? null,
        company: body.company ?? null,
        source: body.source,
        industry: body.industry ?? null,
        budget: body.budget ?? null,
        idea_description: body.idea_description ?? null,
        how_far_along: body.how_far_along ?? null,
        why_building_mvp: body.why_building_mvp ?? null,
        lead_status: "open",
      })
      .select("id")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? "Insert failed" },
        { status: 500 }
      );
    }
    id = data.id;
    action = "created";
  }

  // Log activity
  await supabase.from("lead_activity_log").insert({
    registration_id: id,
    event_type: "lead_received",
    event_source: "make.com",
    description: `Lead received from ${body.source}`,
    metadata: { source: body.source, action },
  });

  return NextResponse.json({ id, action });
}
