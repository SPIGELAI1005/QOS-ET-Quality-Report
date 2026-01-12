"use client";

import { useEffect, useState } from "react";
import type { MonthlySiteKpi } from "@/lib/domain/types";
import { KPI_DATA_UPDATED_EVENT } from "./events";

interface GlobalPpm {
  customerPpm: number | null;
  supplierPpm: number | null;
}

/**
 * Hook to load and listen for KPI data updates from localStorage
 */
export function useKpiData() {
  const [monthlySiteKpis, setMonthlySiteKpis] = useState<MonthlySiteKpi[]>([]);
  const [globalPpm, setGlobalPpm] = useState<GlobalPpm | null>(null);

  useEffect(() => {
    const loadKpiData = () => {
      if (typeof window === "undefined") return;

      const storedKpis = localStorage.getItem("qos-et-kpis");
      const storedPpm = localStorage.getItem("qos-et-global-ppm");

      if (storedKpis) {
        try {
          const parsed = JSON.parse(storedKpis);
          setMonthlySiteKpis(parsed);
        } catch (e) {
          console.error("Failed to parse stored KPIs:", e);
        }
      }

      if (storedPpm) {
        try {
          const parsed = JSON.parse(storedPpm);
          setGlobalPpm(parsed);
        } catch (e) {
          console.error("Failed to parse stored PPM:", e);
        }
      }
    };

    // Load on mount
    loadKpiData();

    // Listen for KPI data updates
    window.addEventListener(KPI_DATA_UPDATED_EVENT, loadKpiData);
    return () => {
      window.removeEventListener(KPI_DATA_UPDATED_EVENT, loadKpiData);
    };
  }, []);

  return { monthlySiteKpis, globalPpm };
}

