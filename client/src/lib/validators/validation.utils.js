/**
 * Validation utility helper for form validation
 * Provides methods to validate data against schemas and format errors
 */

import { ZodError } from "zod";

/**
 * Validate data against a Zod schema
 * @param {Object} schema - Zod schema to validate against
 * @param {Object} data - Data to validate
 * @returns {Object} { success: boolean, data?: Object, errors?: Object }
 */
export const validateSchema = (schema, data) => {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return {
        success: false,
        errors,
      };
    }
    return {
      success: false,
      errors: { form: "Validation failed" },
    };
  }
};

/**
 * Validate data safely against a Zod schema (doesn't throw)
 * @param {Object} schema - Zod schema to validate against
 * @param {Object} data - Data to validate
 * @returns {Object} { success: boolean, data?: Object, errors?: Object }
 */
export const validateSchemaSafe = (schema, data) => {
  const result = schema.safeParse(data);
  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  const errors = {};
  result.error.errors.forEach((err) => {
    const path = err.path.join(".");
    errors[path] = err.message;
  });

  return {
    success: false,
    errors,
  };
};

/**
 * Get error message for a specific field
 * @param {Object} errors - Errors object from validation
 * @param {string} fieldName - Field name to get error for
 * @returns {string|null} Error message or null if no error
 */
export const getFieldError = (errors, fieldName) => {
  return errors?.[fieldName] || null;
};

/**
 * Check if a field has an error
 * @param {Object} errors - Errors object from validation
 * @param {string} fieldName - Field name to check
 * @returns {boolean} True if field has error
 */
export const hasFieldError = (errors, fieldName) => {
  return !!errors?.[fieldName];
};

/**
 * Clear errors for a specific field
 * @param {Object} errors - Errors object from validation
 * @param {string} fieldName - Field name to clear errors for
 * @returns {Object} New errors object with field cleared
 */
export const clearFieldError = (errors, fieldName) => {
  const newErrors = { ...errors };
  delete newErrors[fieldName];
  return newErrors;
};

/**
 * Clear all errors
 * @returns {Object} Empty errors object
 */
export const clearAllErrors = () => {
  return {};
};
