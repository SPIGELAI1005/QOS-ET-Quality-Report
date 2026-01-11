/**
 * Input validation and normalization for I AM Q questions
 */

export interface ValidationResult {
  valid: boolean;
  normalized?: string;
  error?: string;
}

const MAX_QUESTION_LENGTH = parseInt(
  process.env.IAMQ_MAX_QUESTION_LENGTH || '2000',
  10
);

/**
 * Validate and normalize question input
 */
export function validateQuestion(input: unknown): ValidationResult {
  // Check if input is a string
  if (typeof input !== 'string') {
    return {
      valid: false,
      error: 'Question must be a string',
    };
  }

  // Trim whitespace
  let normalized = input.trim();

  // Check if empty after trimming
  if (normalized.length === 0) {
    return {
      valid: false,
      error: 'Question cannot be empty',
    };
  }

  // Check length
  if (normalized.length > MAX_QUESTION_LENGTH) {
    return {
      valid: false,
      error: `Question is too long. Maximum length is ${MAX_QUESTION_LENGTH} characters. Your question has ${normalized.length} characters.`,
    };
  }

  // Normalize: remove excessive whitespace (multiple spaces/newlines)
  normalized = normalized.replace(/\s+/g, ' ').trim();

  // Check again after normalization (in case normalization made it empty)
  if (normalized.length === 0) {
    return {
      valid: false,
      error: 'Question cannot be empty',
    };
  }

  return {
    valid: true,
    normalized,
  };
}

