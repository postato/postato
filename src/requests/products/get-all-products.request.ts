/**
 * Get All Products Request Wrapper
 * Generated from Postman collection: Products > Get All Products
 */

import request from 'supertest';
import { getConfig } from '../../config/environments';
import { QueryParams } from '../../types';

/**
 * Get paginated list of products
 * @param authToken - Authentication token
 * @param params - Query parameters (page, limit, etc.)
 * @returns SuperTest response
 */
export const getAllProducts = async (authToken: string, params?: QueryParams) => {
  const config = getConfig();
  
  return request(config.baseUrl)
    .get('/api/products')
    .set('Authorization', `Bearer ${authToken}`)
    .query(params || { page: 1, limit: 10 });
};
