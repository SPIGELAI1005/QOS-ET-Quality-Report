/**
 * Simple in-memory rate limiter for I AM Q API
 * Tracks requests per IP address (or session identifier)
 * 
 * Configuration:
 * - Default: 20 requests per 10 minutes
 * - Configurable via environment variables
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // Timestamp when the window resets
}

// In-memory store: IP -> RateLimitEntry
// In production, consider using Redis or a database for distributed systems
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration (can be overridden via environment variables)
const MAX_REQUESTS = parseInt(process.env.IAMQ_RATE_LIMIT_MAX_REQUESTS || '20', 10);
const WINDOW_MS = parseInt(process.env.IAMQ_RATE_LIMIT_WINDOW_MS || '600000', 10); // 10 minutes

/**
 * Clean up expired entries periodically (every 5 minutes)
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

/**
 * Check if a request should be rate limited
 * @param identifier - IP address or session ID
 * @returns Object with `allowed` boolean and `retryAfter` seconds if rate limited
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  retryAfter?: number;
  remaining?: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || entry.resetAt < now) {
    // Create new entry or reset expired entry
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
    };
  }

  // Entry exists and is within window
  if (entry.count >= MAX_REQUESTS) {
    // Rate limited
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return {
      allowed: false,
      retryAfter,
      remaining: 0,
    };
  }

  // Increment count
  entry.count++;
  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
  };
}

/**
 * Get client identifier from request
 * Uses IP address from headers (respects X-Forwarded-For for proxies)
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from headers (for proxies/load balancers)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  // Fallback to other headers
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Last resort: use a default identifier
  // In production, you might want to use a session ID or user ID if auth exists
  return 'unknown';
}

