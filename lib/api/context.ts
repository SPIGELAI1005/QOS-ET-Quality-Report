/**
 * Request Context Helper
 * 
 * Extracts user context from request headers for lightweight authentication.
 * In production, this would integrate with proper auth (JWT, session, etc.)
 */

import { NextRequest } from "next/server";

export interface RequestContext {
  userId: string;
  tenantId?: string;
  roles: string[];
}

/**
 * Get request context from headers
 * 
 * Reads user ID from x-demo-user header (for demo/testing) or falls back to "demo-user".
 * In production, this would validate JWT tokens, session cookies, etc.
 * 
 * @param req Next.js request object
 * @returns RequestContext with userId, tenantId, and roles
 */
export function getRequestContext(req: NextRequest): RequestContext {
  // Read user ID from header (for demo/testing)
  // In production, extract from JWT token or session
  const userId = req.headers.get("x-demo-user") || "demo-user";
  
  // Read tenant ID from header (optional, for multi-tenant support)
  const tenantId = req.headers.get("x-tenant-id") || undefined;
  
  // Read roles from header (comma-separated, for demo)
  // In production, extract from JWT token claims
  const rolesHeader = req.headers.get("x-user-roles");
  const roles = rolesHeader ? rolesHeader.split(",").map((r) => r.trim()) : ["reader"];

  return {
    userId,
    tenantId,
    roles,
  };
}

/**
 * Check if user has required role
 */
export function hasRole(context: RequestContext, requiredRole: string): boolean {
  return context.roles.includes(requiredRole) || context.roles.includes("admin");
}

/**
 * Require role or throw error
 */
export function requireRole(context: RequestContext, requiredRole: string): void {
  if (!hasRole(context, requiredRole)) {
    throw new Error(`Insufficient permissions. Required role: ${requiredRole}`);
  }
}
