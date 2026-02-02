/**
 * Complaints Import Client API
 * 
 * Client-side functions for importing complaints from local storage
 */

import type { CreateComplaintInput } from "@/lib/repo/types";
import type { Complaint } from "@/lib/domain/types";

export interface ImportResult {
  total: number;
  imported: number;
  updated: number;
  skipped: number;
  errors: Array<{
    index: number;
    id?: string;
    error: string;
  }>;
  dryRun?: boolean;
  message?: string;
}

/**
 * Get user ID from localStorage or default
 */
function getUserId(): string {
  if (typeof window === "undefined") return "demo-user";
  return localStorage.getItem("qos-et-user-id") || "demo-user";
}

/**
 * Get tenant ID from localStorage (optional)
 */
function getTenantId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("qos-et-tenant-id") || undefined;
}

/**
 * Get request headers with auth context
 */
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const userId = getUserId();
  const tenantId = getTenantId();

  headers["x-demo-user"] = userId;
  if (tenantId) {
    headers["x-tenant-id"] = tenantId;
  }

  return headers;
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!data.ok || !response.ok) {
    const error = data.error || {
      code: "UNKNOWN_ERROR",
      message: `HTTP ${response.status}: ${response.statusText}`,
    };
    throw new Error(error.message);
  }

  return data.data as T;
}

/**
 * Import complaints to server database
 * 
 * @param complaints Array of complaints to import
 * @param dryRun If true, only validates and returns what would happen
 */
export async function importComplaints(
  complaints: CreateComplaintInput[],
  dryRun = false
): Promise<ImportResult> {
  const url = `/api/complaints/import${dryRun ? "?dryRun=true" : ""}`;
  const response = await fetch(url, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ complaints }),
  });

  return handleResponse<ImportResult>(response);
}
