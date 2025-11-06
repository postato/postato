/**
 * Create Product Test Suite
 * Generated from Postman collection: Products > Create Product
 */

import { authHelper } from '../../utils/auth-helper';
import { createProduct } from '../../requests/products/create-product.request';
import { validateSchema } from '../../utils/schema-validator';
import createProductRequestFixture from '../../fixtures/products/create-product-request.json';
import createProductResponseSchema from '../../schemas/products/create-product-response.schema.json';

describe('Products - Create Product', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await authHelper.getToken();
  });

  it('should successfully create a new product', async () => {
    const response = await createProduct(authToken, createProductRequestFixture);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('price');
    expect(response.body).toHaveProperty('createdAt');

    // Validate response schema
    expect(validateSchema(response.body, createProductResponseSchema)).toBe(true);

    // Validate created product data matches request
    expect(response.body.name).toBe(createProductRequestFixture.name);
    expect(response.body.price).toBe(createProductRequestFixture.price);
    expect(response.body.category).toBe(createProductRequestFixture.category);
    expect(response.body.inStock).toBe(createProductRequestFixture.inStock);
  });

  it('should return 400 for invalid product data', async () => {
    const invalidProduct = {
      name: '', // Empty name should fail validation
      price: -10, // Negative price should fail
    };

    const response = await createProduct(authToken, invalidProduct);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('message');
  });

  it('should return 400 for missing required fields', async () => {
    const incompleteProduct = {
      description: 'Missing name and price',
    };

    const response = await createProduct(authToken, incompleteProduct);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 401 for unauthenticated requests', async () => {
    const response = await createProduct('invalid_token', createProductRequestFixture);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should create product with minimal required fields', async () => {
    const minimalProduct = {
      name: 'Minimal Product',
      price: 99.99,
      inStock: true,
    };

    const response = await createProduct(authToken, minimalProduct);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(minimalProduct.name);
    expect(response.body.price).toBe(minimalProduct.price);
  });
});
