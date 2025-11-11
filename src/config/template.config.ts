/**
 * Template Configuration
 * 
 * This file defines the architecture patterns and settings for the API testing template.
 * It is automatically updated by the CLI tool based on your Postman collection analysis.
 */

export const ARCHITECTURE = {
  SINGLE: 'single',
  MICROSERVICES: 'microservices',
} as const;

export const AUTH_PATTERN = {
  SINGLE: 'single',
  MULTIPLE: 'multiple',
} as const;

export type ArchitectureType = typeof ARCHITECTURE[keyof typeof ARCHITECTURE];
export type AuthPatternType = typeof AUTH_PATTERN[keyof typeof AUTH_PATTERN];
export type ServiceName = typeof TEMPLATE_CONFIG.services[keyof typeof TEMPLATE_CONFIG.services];
export type TokenType = typeof TEMPLATE_CONFIG.tokenTypes[keyof typeof TEMPLATE_CONFIG.tokenTypes];

/**
 * Template Configuration
 * 
 * These values are automatically detected and updated by the CLI tool.
 * Manual changes may be overwritten on regeneration.
 */
export const TEMPLATE_CONFIG = {
  /**
   * Architecture pattern: SINGLE (one base URL) or MICROSERVICES (multiple service URLs)
   */
  architecture: ARCHITECTURE.SINGLE as ArchitectureType,

  /**
   * Authentication pattern: SINGLE (one auth token) or MULTIPLE (multiple token types)
   */
  authPattern: AUTH_PATTERN.SINGLE as AuthPatternType,

  /**
   * SSL certificate support
   */
  sslEnabled: false,

  /**
   * Service URLs (for MICROSERVICES architecture)
   * Maps service names to their URL environment variable keys
   * This will be populated by the CLI when you run generation
   */
  services: {} as Record<string, string>,

  /**
   * Token types (for MULTIPLE auth pattern)
   * Maps token type names to their environment variable keys
   * This will be populated by the CLI when you run generation
   */
  tokenTypes: {} as Record<string, string>,
};
