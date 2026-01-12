/**
 * Custom events for data updates
 * Used to notify components when localStorage data changes
 */

export const KPI_DATA_UPDATED_EVENT = "qos-et-kpi-data-updated";

/**
 * Dispatch event when KPI data is updated in localStorage
 */
export function dispatchKpiDataUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(KPI_DATA_UPDATED_EVENT));
  }
}

