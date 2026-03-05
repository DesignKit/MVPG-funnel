"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@supabase/supabase-js";

function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createBrowserClient(url, serviceKey);
}

type Role = "user" | "admin" | "super_admin";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();



  if (!user) redirect("/");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();


  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    redirect("/");
  }

  return { user, role: profile.role as Role };
}

export async function getAdminInfo() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, display_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile || !["admin", "super_admin"].includes(profile.role)) return null;
  return {
    email: user.email ?? "",
    role: profile.role as Role,
    displayName: (profile.display_name as string) ?? "",
  };
}

export async function getAdminDashboardStats() {
  const supabase = await createClient();

  const [registrations, bookings, sessions, outlines] = await Promise.all([
    supabase.from("registrations").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("id", { count: "exact", head: true }),
    supabase.from("chat_sessions").select("id", { count: "exact", head: true }),
    supabase
      .from("project_outlines")
      .select("id", { count: "exact", head: true }),
  ]);

  return {
    registrations: registrations.count ?? 0,
    bookings: bookings.count ?? 0,
    sessions: sessions.count ?? 0,
    outlines: outlines.count ?? 0,
  };
}

export async function getRegistrations(
  page = 1,
  perPage = 20,
  filters?: { search?: string; status?: string; source?: string; lead_status?: string }
) {
  const supabase = await createClient();
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("registrations")
    .select("*", { count: "exact" });

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.source) {
    query = query.eq("source", filters.source);
  }
  if (filters?.lead_status) {
    query = query.eq("lead_status", filters.lead_status);
  }

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  return { data: data ?? [], count: count ?? 0 };
}

export async function getBookings(
  page = 1,
  perPage = 20,
  filters?: { search?: string; status?: string }
) {
  const supabase = await createClient();
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("bookings")
    .select("*, registrations(name, email)", { count: "exact" });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  let filtered = data ?? [];
  // Client-side search for joined registration name/email
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((row) => {
      const reg = row.registrations as { name?: string; email?: string } | null;
      return (
        reg?.name?.toLowerCase().includes(q) ||
        reg?.email?.toLowerCase().includes(q)
      );
    });
  }

  return { data: filtered, count: count ?? 0 };
}

export async function getChatSessions(
  page = 1,
  perPage = 20,
  filters?: { search?: string; status?: string }
) {
  const supabase = await createClient();
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("chat_sessions")
    .select("*, chat_responses(*)", { count: "exact" });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  return { data: data ?? [], count: count ?? 0 };
}

export async function getProjectOutlines(
  page = 1,
  perPage = 20,
  filters?: { search?: string; status?: string }
) {
  const supabase = await createClient();
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("project_outlines")
    .select("*", { count: "exact" });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  return { data: data ?? [], count: count ?? 0 };
}

export async function getProfiles(
  page = 1,
  perPage = 20,
  search?: string
) {
  const supabase = await createClient();
  const from = (page - 1) * perPage;

  const { data, error } = await supabase.rpc("get_admin_users", {
    search_term: search ?? "",
    page_offset: from,
    page_limit: perPage,
  });

  if (error) {
    console.error("getProfiles RPC error:", error.message);
    // Fallback to basic profiles query
    const fallback = await supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, from + perPage - 1);
    return { data: fallback.data ?? [], count: fallback.count ?? 0 };
  }

  const count = data?.[0]?.total_count ?? 0;
  return { data: data ?? [], count };
}

export async function updateRegistrationStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("registrations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function updateBookingStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function updateProjectOutlineStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_outlines")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

async function requireSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.role !== "super_admin") {
    throw new Error("Only super admins can perform this action");
  }
  return { supabase, user };
}

export async function updateUserRole(userId: string, role: Role) {
  await requireSuperAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}

export async function inviteUser(email: string, displayName: string, role: Role) {
  await requireSuperAdmin();
  const service = createServiceClient();

  // Create auth user (sends invite email automatically)
  const { data, error } = await service.auth.admin.inviteUserByEmail(email);
  if (error) throw new Error(error.message);

  // Upsert profile with chosen role and name
  const { error: profileErr } = await service
    .from("profiles")
    .upsert(
      { user_id: data.user.id, display_name: displayName || null, role },
      { onConflict: "user_id" }
    );
  if (profileErr) throw new Error(profileErr.message);

  return { userId: data.user.id };
}

export async function updateUserProfile(userId: string, displayName: string) {
  await requireSuperAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName, updated_at: new Date().toISOString() })
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}

export async function deleteUser(userId: string) {
  await requireSuperAdmin();
  const service = createServiceClient();

  // Delete from auth.users — cascades to profiles via FK
  const { error } = await service.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
}

/* ── Dashboard Stats & Charts ── */

export async function getEnhancedDashboardStats() {
  const supabase = await createClient();

  const [regs, activeBookings, allBookings, sessions, outlines] =
    await Promise.all([
      supabase
        .from("registrations")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .in("status", ["pending", "confirmed"]),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("chat_sessions")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("project_outlines")
        .select("id", { count: "exact", head: true }),
    ]);

  const leads = regs.count ?? 0;
  const sessionsCount = sessions.count ?? 0;
  const conversionRate =
    sessionsCount > 0 ? Math.round((leads / sessionsCount) * 1000) / 10 : 0;

  return {
    leads,
    activeBookings: activeBookings.count ?? 0,
    sessions: sessionsCount,
    outlines: outlines.count ?? 0,
    conversionRate,
    totalBookings: allBookings.count ?? 0,
  };
}

export async function getChartData() {
  const supabase = await createClient();

  // Registrations per day (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const isoThirty = thirtyDaysAgo.toISOString();

  const [regsResult, bookingsResult, sessionsCount, regsCount, bookingsCount, outlinesCount] =
    await Promise.all([
      supabase
        .from("registrations")
        .select("created_at")
        .gte("created_at", isoThirty)
        .order("created_at", { ascending: true }),
      supabase.from("bookings").select("status"),
      supabase
        .from("chat_sessions")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("registrations")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("project_outlines")
        .select("id", { count: "exact", head: true }),
    ]);

  // Group registrations by day
  const dailyMap: Record<string, number> = {};
  for (const reg of regsResult.data ?? []) {
    const day = reg.created_at.slice(0, 10);
    dailyMap[day] = (dailyMap[day] ?? 0) + 1;
  }
  // Fill in missing days
  const dailyRegistrations: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dailyRegistrations.push({ date: key, count: dailyMap[key] ?? 0 });
  }

  // Booking status breakdown
  const statusMap: Record<string, number> = {};
  for (const b of bookingsResult.data ?? []) {
    statusMap[b.status] = (statusMap[b.status] ?? 0) + 1;
  }
  const bookingStatuses = Object.entries(statusMap).map(([status, count]) => ({
    status,
    count,
  }));

  // Funnel counts
  const funnelCounts = {
    sessions: sessionsCount.count ?? 0,
    registrations: regsCount.count ?? 0,
    bookings: bookingsCount.count ?? 0,
    outlines: outlinesCount.count ?? 0,
  };

  return { dailyRegistrations, bookingStatuses, funnelCounts };
}

export async function getRecentActivity(limit = 10) {
  const supabase = await createClient();

  const [regs, bookings, outlines] = await Promise.all([
    supabase
      .from("registrations")
      .select("id, name, email, status, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("bookings")
      .select("id, booking_date, status, created_at, registrations(name)")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("project_outlines")
      .select("id, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  type Activity = {
    type: "registration" | "booking" | "outline";
    title: string;
    status: string;
    created_at: string;
  };

  const activities: Activity[] = [];

  for (const r of regs.data ?? []) {
    activities.push({
      type: "registration",
      title: `${r.name || r.email} registered`,
      status: r.status,
      created_at: r.created_at,
    });
  }
  for (const b of bookings.data ?? []) {
    const name =
      (b.registrations as unknown as { name: string } | null)?.name ?? "Someone";
    activities.push({
      type: "booking",
      title: `${name} booked for ${b.booking_date}`,
      status: b.status,
      created_at: b.created_at,
    });
  }
  for (const o of outlines.data ?? []) {
    activities.push({
      type: "outline",
      title: `Outline generated`,
      status: o.status,
      created_at: o.created_at,
    });
  }

  activities.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return activities.slice(0, limit);
}

/* ── Pipeline & Lead Detail ── */

interface PipelineLead {
  id: string;
  name: string;
  email: string;
  idea_description: string;
  status: string;
  created_at: string;
  stage: string;
}

export async function getPipelineData() {
  const supabase = await createClient();

  // Fetch registrations with related data to determine stage
  const { data: regs } = await supabase
    .from("registrations")
    .select(
      "id, name, email, idea_description, status, created_at, source, lead_status, assigned_to"
    )
    .order("created_at", { ascending: false });

  if (!regs) return { stages: {} as Record<string, PipelineLead[]> };

  // Get bookings, sessions, outlines for all registrations
  const regIds = regs.map((r) => r.id);

  const [bookingsRes, outlinesRes] = await Promise.all([
    supabase
      .from("bookings")
      .select("registration_id, status")
      .in("registration_id", regIds.length > 0 ? regIds : [""]),
    supabase
      .from("project_outlines")
      .select("registration_id, status")
      .in("registration_id", regIds.length > 0 ? regIds : [""]),
  ]);

  const bookingsByReg = new Map<string, string>();
  for (const b of bookingsRes.data ?? []) {
    if (b.registration_id) bookingsByReg.set(b.registration_id, b.status);
  }
  const outlinesByReg = new Map<string, string>();
  for (const o of outlinesRes.data ?? []) {
    if (o.registration_id) outlinesByReg.set(o.registration_id, o.status);
  }

  const stages: Record<string, PipelineLead[]> = {
    "New Lead": [],
    Approved: [],
    Booked: [],
    Workshop: [],
    Delivered: [],
  };

  for (const reg of regs) {
    const outlineStatus = outlinesByReg.get(reg.id);
    const bookingStatus = bookingsByReg.get(reg.id);

    let stage: string;
    if (outlineStatus && ["approved", "finalized"].includes(outlineStatus)) {
      stage = "Delivered";
    } else if (outlineStatus) {
      stage = "Workshop";
    } else if (bookingStatus) {
      stage = "Booked";
    } else if (reg.status === "approved") {
      stage = "Approved";
    } else {
      stage = "New Lead";
    }

    stages[stage].push({ ...reg, stage });
  }

  return { stages };
}

export async function getLeadDetail(registrationId: string) {
  const supabase = await createClient();

  const [regRes, bookingRes, outlineRes, activityRes] = await Promise.all([
    supabase
      .from("registrations")
      .select("*")
      .eq("id", registrationId)
      .single(),
    supabase
      .from("bookings")
      .select("*")
      .eq("registration_id", registrationId)
      .maybeSingle(),
    supabase
      .from("project_outlines")
      .select("*")
      .eq("registration_id", registrationId)
      .maybeSingle(),
    supabase
      .from("lead_activity_log")
      .select("*")
      .eq("registration_id", registrationId)
      .order("created_at", { ascending: false }),
  ]);

  // Get chat responses if there's a session linked
  let responses: { question_key: string; question_text: string; answer_text: string }[] = [];
  if (regRes.data?.session_id) {
    const { data } = await supabase
      .from("chat_responses")
      .select("question_key, question_text, answer_text")
      .eq("session_id", regRes.data.session_id)
      .order("answered_at", { ascending: true });
    responses = data ?? [];
  }

  return {
    registration: regRes.data,
    booking: bookingRes.data,
    outline: outlineRes.data,
    responses,
    activities: activityRes.data ?? [],
  };
}

/* ── Pricing Tiers ── */

export async function getPricingTiers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pricing_tiers")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPublicPricingTiers() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pricing_tiers")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function updatePricingTier(
  id: string,
  updates: {
    name?: string;
    badge?: string | null;
    duration?: string;
    price_cents?: number;
    display_price?: string;
    stripe_price_id?: string | null;
    features?: string[];
    recommended?: boolean;
    active?: boolean;
    sort_order?: number;
  }
) {
  await requireSuperAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("pricing_tiers")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

/* ── Global Search ── */

export interface SearchResult {
  type: "registration" | "booking";
  id: string;
  title: string;
  subtitle: string;
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const supabase = await createClient();
  const q = `%${query}%`;

  const [regsRes, bookingsRes] = await Promise.all([
    supabase
      .from("registrations")
      .select("id, name, email, idea_description")
      .or(`name.ilike.${q},email.ilike.${q},idea_description.ilike.${q}`)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("bookings")
      .select("id, booking_date, status, registrations(name, email)")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const results: SearchResult[] = [];

  for (const r of regsRes.data ?? []) {
    results.push({
      type: "registration",
      id: r.id,
      title: r.name || r.email,
      subtitle: r.idea_description?.slice(0, 80) || "No idea provided",
    });
  }

  // Client-side filter bookings by joined registration name/email
  const lowerQ = query.toLowerCase();
  for (const b of bookingsRes.data ?? []) {
    const reg = b.registrations as { name?: string; email?: string } | null;
    if (
      reg?.name?.toLowerCase().includes(lowerQ) ||
      reg?.email?.toLowerCase().includes(lowerQ)
    ) {
      results.push({
        type: "booking",
        id: b.id,
        title: `${reg?.name || reg?.email || "Booking"} — ${b.booking_date}`,
        subtitle: `Status: ${b.status}`,
      });
      if (results.filter((r) => r.type === "booking").length >= 3) break;
    }
  }

  return results;
}

/* ── CRM Actions ── */

export async function updateLeadCrmFields(
  id: string,
  fields: {
    assigned_to?: string | null;
    lead_status?: string;
    notes?: string | null;
    next_steps?: string | null;
    phone?: string | null;
    company?: string | null;
    industry?: string | null;
    budget?: string | null;
    how_far_along?: string | null;
    why_building_mvp?: string | null;
  }
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("registrations")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // Log what changed
  const changes = Object.entries(fields)
    .filter(([, v]) => v !== undefined)
    .map(([k]) => k)
    .join(", ");

  await supabase.from("lead_activity_log").insert({
    registration_id: id,
    event_type: fields.lead_status ? "status_changed" : fields.assigned_to !== undefined ? "assigned" : "note_added",
    event_source: "admin",
    description: `Updated: ${changes}`,
    metadata: fields,
  });
}

export async function getLeadActivityLog(registrationId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lead_activity_log")
    .select("*")
    .eq("registration_id", registrationId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function logLeadActivity(
  registrationId: string,
  eventType: string,
  description: string,
  source = "admin",
  metadata?: Record<string, unknown>
) {
  const supabase = await createClient();
  const { error } = await supabase.from("lead_activity_log").insert({
    registration_id: registrationId,
    event_type: eventType,
    event_source: source,
    description,
    metadata: metadata ?? {},
  });
  if (error) throw new Error(error.message);
}

export async function getTeamMembers() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .select("id, name, email, role")
    .eq("active", true)
    .order("name");
  return data ?? [];
}

export async function getLeadsBySource() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("registrations")
    .select("source");

  if (!data) return [];

  const counts: Record<string, number> = {};
  for (const row of data) {
    const src = row.source || "website_funnel";
    counts[src] = (counts[src] ?? 0) + 1;
  }
  return Object.entries(counts).map(([source, count]) => ({ source, count }));
}
