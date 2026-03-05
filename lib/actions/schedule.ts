"use server";

import { createClient } from "@/lib/supabase/server";

export async function createBooking(
  registrationId: string | null,
  bookingDate: string,
  bookingTime?: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      registration_id: registrationId,
      user_id: user?.id ?? null,
      booking_date: bookingDate,
      booking_time: bookingTime ?? null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
