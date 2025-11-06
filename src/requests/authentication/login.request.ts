/**
 * Login Request Wrapper
 * Generated from Postman collection: Authentication > Login
 */

import request from 'supertest';
import { getConfig } from '../../config/environments';
import { LoginRequest, LoginResponse } from '../../types';

/**
 * Login to the API and get authentication token
 * @param credentials - Username and password
 * @returns SuperTest response
 */
export const login = async (credentials: LoginRequest) => {
  const config = getConfig();
  
  return request(config.baseUrl)
    .post('/api/auth/login')
    .send(credentials)
    .set('Content-Type', 'application/json');
};
