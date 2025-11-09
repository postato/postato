/**
 * Template Configuration - SINGLE SOURCE OF TRUTH
 *
 * This file controls the entire template's architecture and feature set.
 * AI agents modify this file based on Postman collection analysis.
 * Template users can manually override if needed.
 *
 * Change these constants to enable/disable features across the entire project.
 */

// ================================
// ARCHITECTURE PATTERNS
// ================================
export const ARCHITECTURE = {
  SINGLE: 'single',
  MICROSERVICES: 'microservices',
} as const;

export const AUTH_PATTERN = {
  SINGLE: 'single',
  MULTIPLE: 'multiple',
} as const;

// ================================
// ACTIVE CONFIGURATION
// ================================
export const TEMPLATE_CONFIG = {
  /**
   * Architecture Pattern
   * - ARCHITECTURE.SINGLE: One API, one base URL (default)
   * - ARCHITECTURE.MICROSERVICES: Multiple APIs with different base URLs
   *
   * Agent modifies this based on Postman environment file analysis
   */
  architecture: ARCHITECTURE.SINGLE as ArchitectureType,

  /**
   * Authentication Pattern
   * - AUTH_PATTERN.SINGLE: One token for all requests (default)
   * - AUTH_PATTERN.MULTIPLE: Different tokens for different operations
   *
   * Agent modifies this based on Postman environment file analysis
   */
  authPattern: AUTH_PATTERN.SINGLE as AuthPatternType,

  /**
   * SSL Certificate Support
   * - true: Load custom certificates from certs/ folder
   * - false: Use system default certificates (default)
   *
   * Agent modifies this based on certs/ folder detection
   */
  sslEnabled: false,

  /**
   * Service Names (only used if architecture = ARCHITECTURE.MICROSERVICES)
   * Define your service names here - used in createRequest(TEMPLATE_CONFIG.services.PAYMENTS)
   *
   * Agent populates this from Postman environment variables ending with 'ApiUrl' or 'Url'
   */
  services: {
    MAIN: 'main',
    PAYMENTS: 'payments',
    NOTIFICATIONS: 'notifications',
  } as const,

  /**
   * Token Types (only used if authPattern = AUTH_PATTERN.MULTIPLE)
   * Define your token types here - used in getAuthToken(TEMPLATE_CONFIG.tokenTypes.ADMIN)
   *
   * Agent populates this from Postman environment variables containing 'token' or 'auth'
   */
  tokenTypes: {
    ADMIN: 'admin',
    SERVICE_ACCOUNT: 'serviceAccount',
    CLIENT: 'client',
  } as const,
};

// ================================
// DERIVED TYPES
// ================================
export type ArchitectureType = (typeof ARCHITECTURE)[keyof typeof ARCHITECTURE];
export type AuthPatternType = (typeof AUTH_PATTERN)[keyof typeof AUTH_PATTERN];
export type ServiceName = (typeof TEMPLATE_CONFIG.services)[keyof typeof TEMPLATE_CONFIG.services];
export type TokenType = (typeof TEMPLATE_CONFIG.tokenTypes)[keyof typeof TEMPLATE_CONFIG.tokenTypes];

// ================================
// VALIDATION
// ================================
// Runtime validation to ensure configuration is valid
const validArchitectures: ArchitectureType[] = [
  ARCHITECTURE.SINGLE,
  ARCHITECTURE.MICROSERVICES,
];
const validAuthPatterns: AuthPatternType[] = [
  AUTH_PATTERN.SINGLE,
  AUTH_PATTERN.MULTIPLE,
];

if (!validArchitectures.includes(TEMPLATE_CONFIG.architecture)) {
  throw new Error(
    `Invalid architecture: ${TEMPLATE_CONFIG.architecture}. Must be ARCHITECTURE.SINGLE or ARCHITECTURE.MICROSERVICES`
  );
}

if (!validAuthPatterns.includes(TEMPLATE_CONFIG.authPattern)) {
  throw new Error(
    `Invalid auth pattern: ${TEMPLATE_CONFIG.authPattern}. Must be AUTH_PATTERN.SINGLE or AUTH_PATTERN.MULTIPLE`
  );
}
