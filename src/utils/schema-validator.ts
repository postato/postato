/**
 * Schema Validator Utility
 * Validates API responses against JSON schemas using AJV
 */

import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

// Initialize AJV with formats support
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Cache compiled validators
const validatorCache = new Map<string, ValidateFunction>();

/**
 * Validate data against a JSON schema
 * @param data - Data to validate
 * @param schema - JSON schema object
 * @returns true if valid, false otherwise
 */
export const validateSchema = (data: any, schema: object): boolean => {
  const schemaKey = JSON.stringify(schema);
  
  // Check cache first
  let validator = validatorCache.get(schemaKey);
  
  if (!validator) {
    validator = ajv.compile(schema);
    validatorCache.set(schemaKey, validator);
  }
  
  const isValid = validator(data);
  
  if (!isValid) {
    console.error('Schema validation errors:', validator.errors);
  }
  
  return isValid;
};

/**
 * Get validation errors from last validation
 * @param data - Data to validate
 * @param schema - JSON schema object
 * @returns Array of validation errors or null if valid
 */
export const getValidationErrors = (data: any, schema: object): any[] | null => {
  const schemaKey = JSON.stringify(schema);
  
  let validator = validatorCache.get(schemaKey);
  
  if (!validator) {
    validator = ajv.compile(schema);
    validatorCache.set(schemaKey, validator);
  }
  
  const isValid = validator(data);
  
  return isValid ? null : (validator.errors || []);
};

/**
 * Assert that data matches schema (throws on failure)
 * Useful for test assertions
 */
export const assertSchema = (data: any, schema: object, message?: string): void => {
  const errors = getValidationErrors(data, schema);
  
  if (errors) {
    const errorMessage = message || 'Schema validation failed';
    const errorDetails = JSON.stringify(errors, null, 2);
    throw new Error(`${errorMessage}\nErrors: ${errorDetails}`);
  }
};

/**
 * Validate response structure (common patterns)
 */
export const validateResponseStructure = {
  /**
   * Validate paginated response
   */
  paginated: (data: any): boolean => {
    return (
      typeof data === 'object' &&
      Array.isArray(data.items) &&
      typeof data.total === 'number' &&
      typeof data.page === 'number' &&
      typeof data.limit === 'number'
    );
  },

  /**
   * Validate error response
   */
  error: (data: any): boolean => {
    return (
      typeof data === 'object' &&
      typeof data.error === 'string' &&
      (typeof data.message === 'string' || typeof data.error_description === 'string')
    );
  },

  /**
   * Validate success response with data field
   */
  success: (data: any): boolean => {
    return (
      typeof data === 'object' &&
      data.hasOwnProperty('data')
    );
  },
};

/**
 * Schema validator helper object
 */
export const schemaValidator = {
  validate: validateSchema,
  getErrors: getValidationErrors,
  assert: assertSchema,
  patterns: validateResponseStructure,
};
