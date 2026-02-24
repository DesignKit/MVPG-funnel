"use client";

import { useCallback, useSyncExternalStore } from "react";

interface FunnelState {
  sessionId: string | null;
  registrationId: string | null;
  bookingId: string | null;
}

const STORAGE_KEY = "mvpg-funnel-progress";

function getSnapshot(): FunnelState {
  if (typeof window === "undefined") {
    return { sessionId: null, registrationId: null, bookingId: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : { sessionId: null, registrationId: null, bookingId: null };
  } catch {
    return { sessionId: null, registrationId: null, bookingId: null };
  }
}

function getServerSnapshot(): FunnelState {
  return { sessionId: null, registrationId: null, bookingId: null };
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function useFunnelProgress() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setSessionId = useCallback((sessionId: string) => {
    const current = getSnapshot();
    const next = { ...current, sessionId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new StorageEvent("storage"));
  }, []);

  const setRegistrationId = useCallback((registrationId: string) => {
    const current = getSnapshot();
    const next = { ...current, registrationId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new StorageEvent("storage"));
  }, []);

  const setBookingId = useCallback((bookingId: string) => {
    const current = getSnapshot();
    const next = { ...current, bookingId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new StorageEvent("storage"));
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new StorageEvent("storage"));
  }, []);

  return {
    ...state,
    setSessionId,
    setRegistrationId,
    setBookingId,
    reset,
  };
}
