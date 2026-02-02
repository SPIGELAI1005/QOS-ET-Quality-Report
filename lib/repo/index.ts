/**
 * Repository Factory
 * 
 * Chooses backend implementation based on DATA_BACKEND environment variable.
 * Defaults to "postgres" if not set.
 * Falls back to "local" if Postgres is not configured.
 */

import type { IComplaintRepository } from "./types";
import { PostgresComplaintRepository } from "./postgres/complaintRepo";
import { LocalComplaintRepository } from "./local/complaintRepo";

type BackendType = "postgres" | "local";

/**
 * Get the configured backend type from environment
 */
function getBackendType(): BackendType {
  const backend = process.env.DATA_BACKEND?.toLowerCase();
  
  if (backend === "local" || backend === "postgres") {
    return backend;
  }

  // Default to postgres if DATABASE_URL is set, otherwise local
  if (process.env.DATABASE_URL) {
    return "postgres";
  }

  return "local";
}

/**
 * Get Complaint Repository instance
 * 
 * Returns the appropriate repository based on DATA_BACKEND env var.
 * - "postgres" -> PostgresComplaintRepository (Prisma)
 * - "local" -> LocalComplaintRepository (IndexedDB)
 * 
 * @example
 * ```ts
 * const repo = getComplaintRepo();
 * const complaints = await repo.findAll();
 * ```
 */
export function getComplaintRepo(): IComplaintRepository {
  const backend = getBackendType();

  if (backend === "postgres") {
    // Verify DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.warn(
        "[Repo] DATA_BACKEND=postgres but DATABASE_URL not set. Falling back to local."
      );
      return new LocalComplaintRepository();
    }

    try {
      return new PostgresComplaintRepository();
    } catch (error) {
      console.error("[Repo] Failed to initialize Postgres repository:", error);
      console.warn("[Repo] Falling back to local repository.");
      return new LocalComplaintRepository();
    }
  }

  return new LocalComplaintRepository();
}

/**
 * Get current backend type (for debugging/logging)
 */
export function getCurrentBackend(): BackendType {
  return getBackendType();
}
