/**
 * Request Builder Utility
 * Provides helper functions for building SuperTest requests with common configurations
 */

import request, { Test, SuperTest } from 'supertest';
import { getConfig } from '../config/environments';

/**
 * Create a SuperTest request instance with base configuration
 */
export const createRequest = () => {
  const config = getConfig();
  return request(config.baseUrl);
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
 */
export const buildGetRequest = (path: string, token?: string): Test => {
  const req = createRequest().get(path);
  return token ? withAuth(req, token) : req;
};

/**
 * Helper to build a POST request with common setup
 */
export const buildPostRequest = (path: string, body: any, token?: string): Test => {
  const req = createRequest().post(path).send(body);
  return token ? withAuth(req, token) : req;
};

/**
 * Helper to build a PUT request with common setup
 */
export const buildPutRequest = (path: string, body: any, token?: string): Test => {
  const req = createRequest().put(path).send(body);
  return token ? withAuth(req, token) : req;
};

/**
 * Helper to build a PATCH request with common setup
 */
export const buildPatchRequest = (path: string, body: any, token?: string): Test => {
  const req = createRequest().patch(path).send(body);
  return token ? withAuth(req, token) : req;
};

/**
 * Helper to build a DELETE request with common setup
 */
export const buildDeleteRequest = (path: string, token?: string): Test => {
  const req = createRequest().delete(path);
  return token ? withAuth(req, token) : req;
};
