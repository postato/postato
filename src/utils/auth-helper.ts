/**
 * Authentication Helper
 * Manages authentication tokens and credentials for API testing
 */

import request from 'supertest';
import { getConfig } from '../config/environments';
import { authConfig } from '../config/auth.config';

// Token cache to avoid re-authentication for every test
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

/**
 * Get authentication token
 * Returns cached token if still valid, otherwise fetches a new one
 */
export const getAuthToken = async (): Promise<string> => {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  // Fetch new token based on auth type
  switch (authConfig.type) {
    case 'bearer':
      return await getBearerToken();
    case 'apikey':
      return authConfig.apiKeyValue || '';
    case 'oauth2':
      return await getOAuth2Token();
    default:
      throw new Error(`Unsupported auth type: ${authConfig.type}`);
  }
};

/**
 * Get Bearer token via login endpoint
 */
const getBearerToken = async (): Promise<string> => {
  if (!authConfig.tokenEndpoint) {
    throw new Error('Token endpoint not configured');
  }

  const config = getConfig();
  const response = await request(config.baseUrl)
    .post(authConfig.tokenEndpoint)
    .send({
      username: authConfig.credentials?.username,
      password: authConfig.credentials?.password,
    })
    .expect(200);

  cachedToken = response.body.token || response.body.access_token;
  
  // Cache token for 55 minutes (assuming 1 hour expiry)
  tokenExpiry = Date.now() + (55 * 60 * 1000);
  
  return cachedToken!;
};

/**
 * Get OAuth2 token
 */
const getOAuth2Token = async (): Promise<string> => {
  if (!authConfig.tokenEndpoint) {
    throw new Error('OAuth2 token endpoint not configured');
  }

  const config = getConfig();
  const response = await request(config.baseUrl)
    .post(authConfig.tokenEndpoint)
    .send({
      grant_type: 'client_credentials',
      client_id: authConfig.credentials?.clientId,
      client_secret: authConfig.credentials?.clientSecret,
    })
    .expect(200);

  cachedToken = response.body.access_token;
  
  // Use actual expiry time from response if available
  const expiresIn = response.body.expires_in || 3600;
  tokenExpiry = Date.now() + ((expiresIn - 300) * 1000); // Refresh 5 min before expiry
  
  return cachedToken!;
};

/**
 * Clear cached token (useful for testing auth failures)
 */
export const clearAuthToken = (): void => {
  cachedToken = null;
  tokenExpiry = null;
};

/**
 * Check if token is cached and valid
 */
export const hasValidToken = (): boolean => {
  return !!(cachedToken && tokenExpiry && Date.now() < tokenExpiry);
};

/**
 * Get API key (for API key authentication)
 */
export const getApiKey = (): string => {
  if (authConfig.type !== 'apikey') {
    throw new Error('Auth type is not API key');
  }
  return authConfig.apiKeyValue || '';
};

/**
 * Authentication helper object for easy import
 */
export const authHelper = {
  getToken: getAuthToken,
  clearToken: clearAuthToken,
  hasValidToken,
  getApiKey,
};
