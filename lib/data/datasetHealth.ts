/**
 * Dataset Health Utility
 * 
 * Provides consistent dataset health status across the app.
 * Each dataset can have status: "ok", "missing", or "stale".
 */

export type UploadSectionKey = "complaints" | "deliveries" | "ppap" | "deviations" | "audit" | "plants";

export type DatasetHealthStatus = "ok" | "missing" | "stale";

export interface UploadHistoryEntry {
  id: string;
  uploadedAtIso: string;
  section: UploadSectionKey;
  files: Array<{ name: string; size: number }>;
  summary?: Record<string, string | number>;
  usedIn?: string[];
  success: boolean;
  notes?: string;
}

export interface DatasetHealthInfo {
  status: DatasetHealthStatus;
  lastSuccessIso: string | null;
  lastUploadIso: string | null;
  daysSinceLastSuccess: number | null;
  isStale: boolean;
  hasData: boolean;
}

export interface DatasetHealthSummary {
  [key: string]: DatasetHealthInfo;
}

/**
 * Get dataset health status for a single section
 */
export function getDatasetHealth(
  section: UploadSectionKey,
  history: UploadHistoryEntry[],
  staleThresholdDays: number = 30
): DatasetHealthInfo {
  const sectionHistory = history.filter((h) => h.section === section && h.success);
  
  // Find the most recent successful upload
  const lastSuccess = sectionHistory.sort(
    (a, b) => new Date(b.uploadedAtIso).getTime() - new Date(a.uploadedAtIso).getTime()
  )[0];

  const lastSuccessIso = lastSuccess?.uploadedAtIso || null;
  const hasData = !!lastSuccess;

  // Find the most recent upload (successful or not)
  const allSectionHistory = history.filter((h) => h.section === section);
  const lastUpload = allSectionHistory.sort(
    (a, b) => new Date(b.uploadedAtIso).getTime() - new Date(a.uploadedAtIso).getTime()
  )[0];
  const lastUploadIso = lastUpload?.uploadedAtIso || null;

  // Calculate days since last success
  let daysSinceLastSuccess: number | null = null;
  let isStale = true;
  
  if (lastSuccessIso) {
    const now = Date.now();
    const lastSuccessTime = new Date(lastSuccessIso).getTime();
    if (Number.isFinite(lastSuccessTime)) {
      daysSinceLastSuccess = (now - lastSuccessTime) / (1000 * 60 * 60 * 24);
      isStale = daysSinceLastSuccess > staleThresholdDays;
    }
  }

  // Determine status
  let status: DatasetHealthStatus;
  if (!hasData) {
    status = "missing";
  } else if (isStale) {
    status = "stale";
  } else {
    status = "ok";
  }

  return {
    status,
    lastSuccessIso,
    lastUploadIso,
    daysSinceLastSuccess: daysSinceLastSuccess ? Math.round(daysSinceLastSuccess) : null,
    isStale,
    hasData,
  };
}

/**
 * Get health summary for all datasets
 */
export function getDatasetHealthSummary(
  history: UploadHistoryEntry[],
  staleThresholdDays: number = 30
): DatasetHealthSummary {
  const sections: UploadSectionKey[] = ["plants", "complaints", "deliveries", "ppap", "deviations", "audit"];
  const summary: DatasetHealthSummary = {};

  for (const section of sections) {
    summary[section] = getDatasetHealth(section, history, staleThresholdDays);
  }

  return summary;
}

/**
 * Get human-readable status message for a dataset
 */
export function getDatasetStatusMessage(
  section: UploadSectionKey,
  health: DatasetHealthInfo
): string {
  const sectionNames: Record<UploadSectionKey, string> = {
    complaints: "Complaints dataset",
    deliveries: "Deliveries dataset",
    ppap: "PPAP dataset",
    deviations: "Deviations dataset",
    audit: "Audit dataset",
    plants: "Plants dataset",
  };

  const sectionName = sectionNames[section];

  switch (health.status) {
    case "missing":
      return `${sectionName} is missing. No successful uploads recorded.`;
    case "stale":
      const days = health.daysSinceLastSuccess;
      return `${sectionName} is stale. Last successful upload was ${days} day${days !== 1 ? 's' : ''} ago.`;
    case "ok":
      return `${sectionName} is up to date.`;
    default:
      return `${sectionName} status unknown.`;
  }
}

/**
 * Get all datasets with issues (missing or stale)
 */
export function getDatasetsWithIssues(
  summary: DatasetHealthSummary
): Array<{ section: UploadSectionKey; health: DatasetHealthInfo; message: string }> {
  const issues: Array<{ section: UploadSectionKey; health: DatasetHealthInfo; message: string }> = [];

  for (const [section, health] of Object.entries(summary)) {
    if (health.status !== "ok") {
      issues.push({
        section: section as UploadSectionKey,
        health,
        message: getDatasetStatusMessage(section as UploadSectionKey, health),
      });
    }
  }

  return issues;
}

