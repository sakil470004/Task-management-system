"use client";

import { useAppStateContext } from "@/contexts/app-state-context";

/**
 * Provides a concise and typed accessor for the app-wide mock store.
 */
export function useAppState() {
  return useAppStateContext();
}
