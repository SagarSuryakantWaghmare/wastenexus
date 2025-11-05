/**
 * Input validation utilities for API routes
 * Provides reusable validation functions to ensure data integrity
 */

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength
 * Minimum 8 characters, at least one letter and one number
 */
export function isValidPassword(password: string): boolean {
  if (password.length < 8) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasLetter && hasNumber;
}

/**
 * Validates user role
 */
export function isValidRole(role: string): role is 'client' | 'champion' | 'admin' | 'worker' {
  return ['client', 'champion', 'admin', 'worker'].includes(role);
}

/**
 * Validates waste type
 */
export function isValidWasteType(type: string): boolean {
  const validTypes = ['plastic', 'cardboard', 'e-waste', 'metal', 'glass', 'organic', 'paper'];
  return validTypes.includes(type.toLowerCase());
}

/**
 * Validates weight value
 */
export function isValidWeight(weight: number): boolean {
  return typeof weight === 'number' && weight >= 0.1 && weight <= 10000;
}

/**
 * Validates MongoDB ObjectId format
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Validates coordinates
 */
export function isValidCoordinates(latitude: number, longitude: number): boolean {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

/**
 * Sanitizes string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
}

/**
 * Validates and sanitizes user input for reports
 */
export interface ReportValidationResult {
  valid: boolean;
  errors: string[];
  sanitized?: {
    type: string;
    weightKg: number;
  };
}

export function validateReportInput(
  type: string,
  weightKg: number
): ReportValidationResult {
  const errors: string[] = [];

  if (!type || typeof type !== 'string') {
    errors.push('Type is required and must be a string');
  } else if (!isValidWasteType(type)) {
    errors.push('Invalid waste type');
  }

  if (weightKg === undefined || weightKg === null) {
    errors.push('Weight is required');
  } else if (!isValidWeight(weightKg)) {
    errors.push('Weight must be between 0.1 and 10000 kg');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    sanitized: {
      type: type.toLowerCase(),
      weightKg: parseFloat(weightKg.toString()),
    },
  };
}
