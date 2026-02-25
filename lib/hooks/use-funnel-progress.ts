"use client";

import { useCallback, useSyncExternalStore } from "react";

interface FunnelState {
  sessionId: string | null;
  registrationId: string | null;
  bookingId: string | null;
}

const STORAGE_KEY = "mvpg-funnel-progress";

// Stable empty-state reference — required by useSyncExternalStore so React
// doesn't detect a "new object on every call" and throw an infinite-loop error.
const EMPTY_STATE: FunnelState = {
  sessionId: null,
  registrationId: null,
  bookingId: null,
};

// Cache the last parsed state so getSnapshot returns the same reference when
// the raw localStorage string hasn't changed (prevents spurious re-renders).
let _cachedRaw: string | null = null;
let _cachedState: FunnelState = EMPTY_STATE;

function getSnapshot(): FunnelState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === _cachedRaw) return _cachedState;
    _cachedRaw = raw;
    _cachedState = raw ? (JSON.parse(raw) as FunnelState) : EMPTY_STATE;
    return _cachedState;
  } catch {
    return EMPTY_STATE;
  }
}

// getServerSnapshot must return the exact same reference on every call.
function getServerSnapshot(): FunnelState {
  return EMPTY_STATE;
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
