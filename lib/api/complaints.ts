/**
 * Client API for Complaints
 * 
 * Fetch wrappers for complaints API endpoints.
 * Handles authentication headers and error responses.
 */

import type { Complaint } from "@/lib/domain/types";
import type { CreateComplaintInput } from "@/lib/repo/types";

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ListComplaintsFilters {
  plant?: string;
  siteCode?: string;
  notificationType?: string;
  category?: string;
  startDate?: string; // ISO datetime string
  endDate?: string; // ISO datetime string
}

/**
 * Get user ID from localStorage or default
 */
function getUserId(): string {
  if (typeof window === "undefined") return "demo-user";
  // In production, this would read from auth context/session
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
  const data: ApiResponse<T> = await response.json();

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
 * List complaints with optional filters
 */
export async function listComplaints(filters?: ListComplaintsFilters): Promise<Complaint[]> {
  const params = new URLSearchParams();
  if (filters?.plant) params.append("plant", filters.plant);
  if (filters?.siteCode) params.append("siteCode", filters.siteCode);
  if (filters?.notificationType) params.append("notificationType", filters.notificationType);
  if (filters?.category) params.append("category", filters.category);
  if (filters?.startDate) params.append("startDate", filters.startDate);
  if (filters?.endDate) params.append("endDate", filters.endDate);

  const url = `/api/complaints${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(),
  });

  return handleResponse<Complaint[]>(response);
}

/**
 * Get a single complaint by ID
 */
export async function getComplaint(id: string): Promise<Complaint> {
  const response = await fetch(`/api/complaints/${id}`, {
    method: "GET",
    headers: getHeaders(),
  });

  return handleResponse<Complaint>(response);
}

/**
 * Create a single complaint
 */
export async function createComplaint(data: CreateComplaintInput): Promise<Complaint> {
  const response = await fetch("/api/complaints", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<Complaint>(response);
}

/**
 * Create multiple complaints
 */
export async function createComplaints(data: CreateComplaintInput[]): Promise<{ count: number; created: number }> {
  const response = await fetch("/api/complaints", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<{ count: number; created: number }>(response);
}

/**
 * Update a complaint
 */
export async function updateComplaint(
  id: string,
  data: Partial<CreateComplaintInput>
): Promise<Complaint> {
  const response = await fetch(`/api/complaints/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<Complaint>(response);
}

/**
 * Delete a complaint
 */
export async function deleteComplaint(id: string): Promise<{ id: string; deleted: boolean }> {
  const response = await fetch(`/api/complaints/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  return handleResponse<{ id: string; deleted: boolean }>(response);
}

/**
 * Check if API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch("/api/complaints", {
      method: "GET",
      headers: getHeaders(),
      // Short timeout for health check
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
