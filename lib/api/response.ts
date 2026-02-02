/**
 * API Response Helpers
 * 
 * Provides consistent JSON response envelope for all API routes
 */

/**
 * Success response envelope
 */
export interface SuccessResponse<T> {
  ok: true;
  data: T;
}

/**
 * Error response envelope
 */
export interface ErrorResponse {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Create success response
 */
export function success<T>(data: T): SuccessResponse<T> {
  return {
    ok: true,
    data,
  };
}

/**
 * Create error response
 */
export function error(
  code: string,
  message: string,
  details?: unknown
): ErrorResponse {
  return {
    ok: false,
    error: {
      code,
      message,
      details,
    },
  };
}

/**
 * Common error codes
 */
export const ErrorCodes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
} as const;

/**
 * Create validation error response
 */
export function validationError(message: string, details?: unknown): ErrorResponse {
  return error(ErrorCodes.VALIDATION_ERROR, message, details);
}

/**
 * Create not found error response
 */
export function notFoundError(resource: string, id?: string): ErrorResponse {
  return error(
    ErrorCodes.NOT_FOUND,
    `${resource} not found${id ? `: ${id}` : ""}`,
    { resource, id }
  );
}

/**
 * Create unauthorized error response
 */
export function unauthorizedError(message = "Unauthorized"): ErrorResponse {
  return error(ErrorCodes.UNAUTHORIZED, message);
}

/**
 * Create forbidden error response
 */
export function forbiddenError(message = "Forbidden"): ErrorResponse {
  return error(ErrorCodes.FORBIDDEN, message);
}

/**
 * Create internal error response
 */
export function internalError(message = "Internal server error", details?: unknown): ErrorResponse {
  return error(ErrorCodes.INTERNAL_ERROR, message, details);
}
