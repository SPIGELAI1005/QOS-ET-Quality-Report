/**
 * API Mode Hook
 * 
 * Manages switching between API mode and local mode with fallback.
 */

import { useState, useEffect, useCallback } from "react";
import { checkApiHealth } from "@/lib/api/complaints";

type ApiMode = "api" | "local" | "checking";

export function useApiMode() {
  const [mode, setMode] = useState<ApiMode>("checking");
  const [error, setError] = useState<string | null>(null);

  // Check API health on mount
  useEffect(() => {
    async function checkHealth() {
      try {
        const isHealthy = await checkApiHealth();
        setMode(isHealthy ? "api" : "local");
        setError(isHealthy ? null : "API unavailable, using local mode");
      } catch (err) {
        setMode("local");
        setError(err instanceof Error ? err.message : "API check failed, using local mode");
      }
    }

    checkHealth();
  }, []);

  const switchToLocal = useCallback(() => {
    setMode("local");
    setError("Switched to local mode");
  }, []);

  const retryApi = useCallback(async () => {
    setMode("checking");
    setError(null);
    try {
      const isHealthy = await checkApiHealth();
      setMode(isHealthy ? "api" : "local");
      setError(isHealthy ? null : "API still unavailable");
    } catch (err) {
      setMode("local");
      setError(err instanceof Error ? err.message : "API check failed");
    }
  }, []);

  return {
    mode,
    isApiMode: mode === "api",
    isLocalMode: mode === "local",
    isChecking: mode === "checking",
    error,
    switchToLocal,
    retryApi,
  };
}
