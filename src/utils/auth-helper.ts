/**
 * Authentication Helper
 * Manages authentication tokens and credentials for API testing
 *
 * Behavior automatically adapts based on src/config/template.config.ts
 */

import request from 'supertest';
import { getConfig } from '../config/environments';
import { authConfig } from '../config/auth.config';
import {
  TEMPLATE_CONFIG,
  AUTH_PATTERN,
  TokenType,
} from '../config/template.config';

// =================================
// Token Cache Storage
// =================================
// Structure adapts based on TEMPLATE_CONFIG.authPattern

interface SingleTokenCache {
  token: string | null;
  expiry: number | null;
}

interface MultiTokenCache {
  [key: string]: {
    token: string | null;
    expiry: number | null;
  };
}

// Initialize cache based on pattern
const tokenCache: SingleTokenCache | MultiTokenCache =
  TEMPLATE_CONFIG.authPattern === AUTH_PATTERN.MULTIPLE
    ? Object.keys(TEMPLATE_CONFIG.tokenTypes).reduce((acc, key) => {
        acc[
          TEMPLATE_CONFIG.tokenTypes[
            key as keyof typeof TEMPLATE_CONFIG.tokenTypes
          ]
        ] = {
          token: null,
          expiry: null,
        };
        return acc;
      }, {} as MultiTokenCache)
    : { token: null, expiry: null };

/**
 * Get authentication token
 *
 * For SINGLE auth pattern: getAuthToken()
 * For MULTIPLE auth pattern: getAuthToken(TEMPLATE_CONFIG.tokenTypes.ADMIN)
 *
 * @param tokenType - Required if authPattern is AUTH_PATTERN.MULTIPLE
 * @returns Authentication token string
 */
export const getAuthToken = async (tokenType?: TokenType): Promise<string> => {
  // =================================
  // SINGLE AUTH PATTERN
  // =================================
  if (TEMPLATE_CONFIG.authPattern === AUTH_PATTERN.SINGLE) {
    const cache = tokenCache as SingleTokenCache;

    // Return cached token if still valid
    if (cache.token && cache.expiry && Date.now() < cache.expiry) {
      return cache.token;
    }

    // Fetch new token based on auth type
    switch (authConfig.type) {
      case 'bearer':
        cache.token = await getBearerToken();
        break;
      case 'apikey':
        cache.token = authConfig.apiKeyValue || '';
        break;
      case 'oauth2':
        cache.token = await getOAuth2Token();
        break;
      default:
        throw new Error(`Unsupported auth type: ${authConfig.type}`);
    }

    // Cache token for 55 minutes (assuming 1 hour expiry)
    cache.expiry = Date.now() + 55 * 60 * 1000;

    return cache.token!;
  }

  // =================================
  // MULTIPLE AUTH PATTERN
  // =================================
  if (TEMPLATE_CONFIG.authPattern === AUTH_PATTERN.MULTIPLE) {
    if (!tokenType) {
      const availableTypes = Object.values(TEMPLATE_CONFIG.tokenTypes).join(
        ', '
      );
      throw new Error(
        `Token type required for MULTIPLE auth pattern. Available types: ${availableTypes}\n` +
          `Example: getAuthToken(TEMPLATE_CONFIG.tokenTypes.ADMIN)`
      );
    }

    const cache = tokenCache as MultiTokenCache;
    const typeCache = cache[tokenType];

    if (!typeCache) {
      throw new Error(`Unknown token type: ${tokenType}`);
    }

    // Return cached token if still valid
    if (typeCache.token && typeCache.expiry && Date.now() < typeCache.expiry) {
      return typeCache.token;
    }

    // Fetch new token for specific type
    const config = getConfig();

    if (!config.auth || !(config.auth as any)[tokenType]) {
      throw new Error(`Token configuration not found for type: ${tokenType}`);
    }

    // Fetch token (implement based on your API's requirements)
    const response = await request(config.baseUrl)
      .post('/auth/token')
      .send({
        grant_type: 'client_credentials',
        token_type: tokenType,
      })
      .expect(200);

    typeCache.token = response.body.access_token;
    typeCache.expiry =
      Date.now() + ((response.body.expires_in || 3600) - 300) * 1000;

    return typeCache.token!;
  }

  throw new Error(`Invalid auth pattern: ${TEMPLATE_CONFIG.authPattern}`);
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

  const token = response.body.token || response.body.access_token;
  return token;
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

  return response.body.access_token;
};

/**
 * Clear cached token (useful for testing auth failures)
 *
 * @param tokenType - Required if authPattern is AUTH_PATTERN.MULTIPLE
 */
export const clearAuthToken = (tokenType?: TokenType): void => {
  if (TEMPLATE_CONFIG.authPattern === AUTH_PATTERN.SINGLE) {
    const cache = tokenCache as SingleTokenCache;
    cache.token = null;
    cache.expiry = null;
  } else {
    const cache = tokenCache as MultiTokenCache;
    if (tokenType) {
      if (cache[tokenType]) {
        cache[tokenType].token = null;
        cache[tokenType].expiry = null;
      }
    } else {
      // Clear all tokens
      Object.keys(cache).forEach((key) => {
        cache[key].token = null;
        cache[key].expiry = null;
      });
    }
  }
};

/**
 * Check if token is cached and valid
 *
 * @param tokenType - Required if authPattern is AUTH_PATTERN.MULTIPLE
 */
export const hasValidToken = (tokenType?: TokenType): boolean => {
  if (TEMPLATE_CONFIG.authPattern === AUTH_PATTERN.SINGLE) {
    const cache = tokenCache as SingleTokenCache;
    return !!(cache.token && cache.expiry && Date.now() < cache.expiry);
  } else {
    const cache = tokenCache as MultiTokenCache;
    if (!tokenType) return false;
    const typeCache = cache[tokenType];
    return !!(
      typeCache &&
      typeCache.token &&
      typeCache.expiry &&
      Date.now() < typeCache.expiry
    );
  }
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
