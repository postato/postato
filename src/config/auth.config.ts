/**
 * Authentication Configuration
 * This file defines authentication patterns used across the API
 * Generated from Postman collection auth settings
 */

export type AuthType = 'bearer' | 'apikey' | 'basic' | 'oauth2' | 'none';

export interface AuthConfig {
  type: AuthType;
  tokenEndpoint?: string;
  credentials?: {
    username?: string;
    password?: string;
    clientId?: string;
    clientSecret?: string;
  };
  apiKeyHeader?: string;
  apiKeyValue?: string;
}

/**
 * Default authentication configuration
 * Update this based on your Postman collection's auth settings
 */
export const authConfig: AuthConfig = {
  type: 'bearer',
  tokenEndpoint: '/api/auth/login',
  credentials: {
    username: process.env.AUTH_USERNAME || '',
    password: process.env.AUTH_PASSWORD || '',
  },
};

/**
 * Example: API Key authentication configuration
 * Uncomment and modify if your API uses API Key auth
 */
// export const authConfig: AuthConfig = {
//   type: 'apikey',
//   apiKeyHeader: 'x-api-key',
//   apiKeyValue: process.env.API_KEY || '',
// };

/**
 * Example: OAuth2 authentication configuration
 * Uncomment and modify if your API uses OAuth2
 */
// export const authConfig: AuthConfig = {
//   type: 'oauth2',
//   tokenEndpoint: '/oauth/token',
//   credentials: {
//     clientId: process.env.OAUTH_CLIENT_ID || '',
//     clientSecret: process.env.OAUTH_CLIENT_SECRET || '',
//   },
// };
