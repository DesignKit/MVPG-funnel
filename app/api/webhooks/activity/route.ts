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

interface ActivityPayload {
  email: string;
  event_type: string;
  description: string;
  metadata?: Record<string, unknown>;
}

export async function POST(request: Request) {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ActivityPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.email || !body.event_type || !body.description) {
    return NextResponse.json(
      { error: "email, event_type, and description are required" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  // Find registration by email
  const { data: reg } = await supabase
    .from("registrations")
    .select("id")
    .eq("email", body.email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!reg) {
    return NextResponse.json(
      { error: "No registration found for this email" },
      { status: 404 }
    );
  }

  const { error } = await supabase.from("lead_activity_log").insert({
    registration_id: reg.id,
    event_type: body.event_type,
    event_source: "make.com",
    description: body.description,
    metadata: body.metadata ?? {},
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
