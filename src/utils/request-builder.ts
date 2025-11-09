/**
 * Request Builder Utility
 * Provides helper functions for building SuperTest requests with common configurations
 *
 * Behavior automatically adapts based on src/config/template.config.ts
 */

import request, { Test } from 'supertest';
import { getConfig } from '../config/environments';
import {
  TEMPLATE_CONFIG,
  ARCHITECTURE,
  ServiceName,
} from '../config/template.config';

/**
 * Create a SuperTest request instance with base configuration
 *
 * For SINGLE architecture: createRequest()
 * For MICROSERVICES architecture: createRequest(TEMPLATE_CONFIG.services.PAYMENTS)
 *
 * @param serviceName - Required if architecture is ARCHITECTURE.MICROSERVICES
 * @returns SuperTest instance configured for the specified service or base URL
 *
 * @example
 * // Single API pattern
 * const api = createRequest();
 * await api.get('/users').expect(200);
 *
 * @example
 * // Microservices pattern
 * const paymentsApi = createRequest(TEMPLATE_CONFIG.services.PAYMENTS);
 * await paymentsApi.get('/transactions').expect(200);
 */
export const createRequest = (serviceName?: ServiceName) => {
  const config = getConfig();

  // =================================
  // SINGLE ARCHITECTURE
  // =================================
  if (TEMPLATE_CONFIG.architecture === ARCHITECTURE.SINGLE) {
    return request(config.baseUrl);
  }

  // =================================
  // MICROSERVICES ARCHITECTURE
  // =================================
  if (TEMPLATE_CONFIG.architecture === ARCHITECTURE.MICROSERVICES) {
    if (!serviceName) {
      serviceName = TEMPLATE_CONFIG.services.MAIN;
    }

    const services = (config as any).services;

    if (!services) {
      throw new Error(
        `Services not configured in environment file\n` +
          `Ensure your environment config includes the services object when using ARCHITECTURE.MICROSERVICES`
      );
    }

    if (!services[serviceName]) {
      const availableServices = Object.keys(services).join(', ');
      throw new Error(
        `Service "${serviceName}" not configured in environment\n` +
          `Available services: ${availableServices}\n` +
          `Add ${serviceName.toUpperCase()}_API_URL to your .env file`
      );
    }

    return request(services[serviceName]);
  }

  throw new Error(`Invalid architecture: ${TEMPLATE_CONFIG.architecture}`);
};

/**
 * Add authentication header to request
 * @param req - SuperTest request instance
 * @param token - Authentication token
 */
export const withAuth = (req: Test, token: string): Test => {
  return req.set('Authorization', `Bearer ${token}`);
};

/**
 * Add API key header to request
 * @param req - SuperTest request instance
 * @param apiKey - API key
 * @param headerName - Header name for API key (default: 'x-api-key')
 */
export const withApiKey = (req: Test, apiKey: string, headerName: string = 'x-api-key'): Test => {
  return req.set(headerName, apiKey);
};

/**
 * Add custom headers to request
 * @param req - SuperTest request instance
 * @param headers - Headers object
 */
export const withHeaders = (req: Test, headers: Record<string, string>): Test => {
  Object.entries(headers).forEach(([key, value]) => {
    req.set(key, value);
  });
  return req;
};

/**
 * Add query parameters to request
 * @param req - SuperTest request instance
 * @param params - Query parameters object
 */
export const withQueryParams = (req: Test, params: Record<string, any>): Test => {
  return req.query(params);
};

/**
 * Helper to build a GET request with common setup
 * 
 * @param path - Request path
 * @param token - Optional authentication token
 * @param serviceName - Optional service name for microservices
 */
export const buildGetRequest = (path: string, token?: string, serviceName?: ServiceName): Test => {
  const req = createRequest(serviceName).get(path);
  return token ? withAuth(req, token) : req;
};

/**
 * Helper to build a POST request with common setup
 * 
 * @param path - Request path
 * @param body - Request body
 * @param token - Optional authentication token
 * @param serviceName - Optional service name for microservices
 */
export const buildPostRequest = (path: string, body: any, token?: string, serviceName?: ServiceName): Test => {
  const req = createRequest(serviceName).post(path).send(body);
  return token ? withAuth(req, token) : req;
};

/**
 * Helper to build a PUT request with common setup
 * 
 * @param path - Request path
 * @param body - Request body
 * @param token - Optional authentication token
 * @param serviceName - Optional service name for microservices
 */
export const buildPutRequest = (path: string, body: any, token?: string, serviceName?: ServiceName): Test => {
  const req = createRequest(serviceName).put(path).send(body);
  return token ? withAuth(req, token) : req;
};

/**
 * Helper to build a PATCH request with common setup
 * 
 * @param path - Request path
 * @param body - Request body
 * @param token - Optional authentication token
 * @param serviceName - Optional service name for microservices
 */
export const buildPatchRequest = (path: string, body: any, token?: string, serviceName?: ServiceName): Test => {
  const req = createRequest(serviceName).patch(path).send(body);
  return token ? withAuth(req, token) : req;
};

/**
 * Helper to build a DELETE request with common setup
 * 
 * @param path - Request path
 * @param token - Optional authentication token
 * @param serviceName - Optional service name for microservices
 */
export const buildDeleteRequest = (path: string, token?: string, serviceName?: ServiceName): Test => {
  const req = createRequest(serviceName).delete(path);
  return token ? withAuth(req, token) : req;
};
