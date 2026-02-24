"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { BrandTicker } from "@/components/sections/brand-ticker";
import { TestimonialCard } from "@/components/sections/testimonial-card";
import { createBooking } from "@/lib/actions/schedule";
import { useFunnelProgress } from "@/lib/hooks/use-funnel-progress";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function SchedulePage() {
  const router = useRouter();
  const { registrationId, setBookingId } = useFunnelProgress();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const monthName = new Date(currentYear, currentMonth).toLocaleString(
    "default",
    { month: "long", year: "numeric" }
  );

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(null);
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null);
  }

  async function handleConfirm() {
    if (!selectedDay || submitting) return;
    setSubmitting(true);
    const bookingDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    try {
      const booking = await createBooking(registrationId, bookingDate);
      setBookingId(booking.id);
    } catch {
      // Continue even if Supabase fails
    }
    router.push("/project-outline-2");
  }

  const isPast = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    return date < todayStart;
  };

  return (
    <>
      <section className="bg-surface-light-purple py-12">
        <Container className="max-w-md">
          <div className="text-center">
            <h1 className="font-inter-tight text-3xl font-semibold leading-tight tablet:text-4xl">
              <span className="text-primary">You&apos;re approve!</span> book a
              time with us below.
            </h1>
            <p className="mt-4 text-muted-secondary">
              The call is for those serious about getting their MVP out quickly
              and efficiently.
            </p>
          </div>

          {/* Calendar */}
          <div className="mt-10 rounded-card bg-white p-6 shadow-card">
            {/* Month nav */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevMonth}
                className="h-8 w-8 rounded-full text-muted hover:bg-surface-gray"
              >
                &lt;
              </button>
              <span className="font-medium">{monthName}</span>
              <button
                onClick={nextMonth}
                className="h-8 w-8 rounded-full text-muted hover:bg-surface-gray"
              >
                &gt;
              </button>
            </div>

            {/* Day headers */}
            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-muted-secondary">
              {DAYS_OF_WEEK.map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="mt-1 grid grid-cols-7 gap-1">
              {/* Empty cells for days before first of month */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const past = isPast(day);
                const selected = selectedDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => !past && setSelectedDay(day)}
                    disabled={past}
                    className={`h-10 w-full rounded-lg text-sm transition-colors ${
                      selected
                        ? "bg-primary text-white"
                        : past
                          ? "text-border"
                          : "text-foreground hover:bg-surface-warm"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confirm */}
          <button
            onClick={handleConfirm}
            disabled={!selectedDay}
            className="mt-6 w-full rounded-pill bg-black py-4 text-white shadow-button transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {selectedDay
              ? `Schedule for ${monthName.split(" ")[0]} ${selectedDay}`
              : "Select a date"}
          </button>
        </Container>
      </section>

      <BrandTicker />

      <section className="bg-surface-warm py-16">
        <Container className="max-w-2xl">
          <TestimonialCard
            quote="My business partner and I approached MVP Guru for literally the quickest turnaround of a fencing lead-gen software. We got 3 customers in a week and the first covered the MVP costs (and then some). Thank you for taking us on."
            name="Louis W."
            role="Founder"
            image="/images/testimonial-photo.webp"
          />
        </Container>
      </section>
    </>
  );
}
