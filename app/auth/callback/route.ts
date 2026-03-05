import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/apply";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // After social OAuth, check role + progress to route correctly
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Update profile display name from OAuth metadata
        const displayName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.preferred_username;
        if (displayName) {
          await supabase
            .from("profiles")
            .update({ display_name: displayName })
            .eq("user_id", user.id)
            .is("display_name", null);
        }

        // Check admin role
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (
          profile?.role === "admin" ||
          profile?.role === "super_admin"
        ) {
          return NextResponse.redirect(`${origin}/admin`);
        }

        // Check returning user progress
        const { data: booking } = await supabase
          .from("bookings")
          .select("id")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();
        if (booking) {
          return NextResponse.redirect(`${origin}/confirmed`);
        }

        const { data: reg } = await supabase
          .from("registrations")
          .select("id")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();
        if (reg) {
          return NextResponse.redirect(`${origin}/book`);
        }
      }

      // New user — go to intake form
      return NextResponse.redirect(`${origin}/intake`);
    }
  }

  return NextResponse.redirect(`${origin}/apply?error=auth`);
}
