/**
 * Create Product Request Wrapper
 * Generated from Postman collection: Products > Create Product
 */

import request from 'supertest';
import { getConfig } from '../../config/environments';

/**
 * Create a new product
 * @param authToken - Authentication token
 * @param productData - Product data to create
 * @returns SuperTest response
 */
export const createProduct = async (authToken: string, productData: any) => {
  const config = getConfig();
  
  return request(config.baseUrl)
    .post('/api/products')
    .set('Authorization', `Bearer ${authToken}`)
    .set('Content-Type', 'application/json')
    .send(productData);
};
