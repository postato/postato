/**
 * Assertion Helpers
 * Custom assertion utilities for API testing
 */

import { Response } from 'supertest';

/**
 * Assert response has expected status code
 */
export const assertStatusCode = (response: Response, expectedCode: number): void => {
  if (response.status !== expectedCode) {
    throw new Error(
      `Expected status ${expectedCode}, got ${response.status}. Body: ${JSON.stringify(response.body)}`
    );
  }
};

/**
 * Assert response body has required fields
 */
export const assertHasFields = (data: any, fields: string[]): void => {
  const missingFields = fields.filter(field => !(field in data));
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
};

/**
 * Assert response body matches expected structure
 */
export const assertResponseStructure = (data: any, structure: object): void => {
  const errors: string[] = [];
  
  const checkStructure = (obj: any, expected: any, path: string = ''): void => {
    for (const key in expected) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (!(key in obj)) {
        errors.push(`Missing field: ${currentPath}`);
        continue;
      }
      
      const expectedType = typeof expected[key];
      const actualType = typeof obj[key];
      
      if (expectedType === 'object' && expected[key] !== null && !Array.isArray(expected[key])) {
        checkStructure(obj[key], expected[key], currentPath);
      } else if (expectedType !== actualType) {
        errors.push(`Type mismatch at ${currentPath}: expected ${expectedType}, got ${actualType}`);
      }
    }
  };
  
  checkStructure(data, structure);
  
  if (errors.length > 0) {
    throw new Error(`Structure validation failed:\n${errors.join('\n')}`);
  }
};

/**
 * Assert array response is not empty
 */
export const assertNotEmpty = (data: any[]): void => {
  if (!Array.isArray(data)) {
    throw new Error('Expected an array');
  }
  
  if (data.length === 0) {
    throw new Error('Expected non-empty array');
  }
};

/**
 * Assert response contains expected values
 */
export const assertContains = (data: any, expected: Partial<any>): void => {
  for (const key in expected) {
    if (data[key] !== expected[key]) {
      throw new Error(
        `Expected ${key} to be ${JSON.stringify(expected[key])}, got ${JSON.stringify(data[key])}`
      );
    }
  }
};

/**
 * Assert pagination metadata is valid
 */
export const assertValidPagination = (data: any): void => {
  assertHasFields(data, ['items', 'total', 'page', 'limit']);
  
  if (!Array.isArray(data.items)) {
    throw new Error('items must be an array');
  }
  
  if (typeof data.total !== 'number' || data.total < 0) {
    throw new Error('total must be a non-negative number');
  }
  
  if (typeof data.page !== 'number' || data.page < 1) {
    throw new Error('page must be a positive number');
  }
  
  if (typeof data.limit !== 'number' || data.limit < 1) {
    throw new Error('limit must be a positive number');
  }
};

/**
 * Assert error response has correct structure
 */
export const assertErrorResponse = (data: any, expectedMessage?: string): void => {
  assertHasFields(data, ['error']);
  
  if (expectedMessage && data.message !== expectedMessage) {
    throw new Error(
      `Expected error message "${expectedMessage}", got "${data.message}"`
    );
  }
};

/**
 * Assert response header exists and has expected value
 */
export const assertHeader = (response: Response, headerName: string, expectedValue?: string): void => {
  const headerValue = response.headers[headerName.toLowerCase()];
  
  if (!headerValue) {
    throw new Error(`Expected header "${headerName}" not found`);
  }
  
  if (expectedValue && headerValue !== expectedValue) {
    throw new Error(
      `Expected header "${headerName}" to be "${expectedValue}", got "${headerValue}"`
    );
  }
};

/**
 * Assert response time is within acceptable range
 */
export const assertResponseTime = (startTime: number, maxMs: number): void => {
  const responseTime = Date.now() - startTime;
  
  if (responseTime > maxMs) {
    throw new Error(`Response time ${responseTime}ms exceeded maximum ${maxMs}ms`);
  }
};

/**
 * Assertion helpers object for easy import
 */
export const assertionHelpers = {
  statusCode: assertStatusCode,
  hasFields: assertHasFields,
  structure: assertResponseStructure,
  notEmpty: assertNotEmpty,
  contains: assertContains,
  validPagination: assertValidPagination,
  errorResponse: assertErrorResponse,
  header: assertHeader,
  responseTime: assertResponseTime,
};
