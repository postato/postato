/**
 * Get All Products Test Suite
 * Generated from Postman collection: Products > Get All Products
 */

import { authHelper } from '../../utils/auth-helper';
import { getAllProducts } from '../../requests/products/get-all-products.request';
import { validateSchema } from '../../utils/schema-validator';
import getAllProductsResponseSchema from '../../schemas/products/get-all-products-response.schema.json';

describe('Products - Get All Products', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await authHelper.getToken();
  });

  it('should return paginated list of products', async () => {
    const response = await getAllProducts(authToken, { page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('items');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('page');
    expect(response.body).toHaveProperty('limit');

    // Validate response schema
    expect(validateSchema(response.body, getAllProductsResponseSchema)).toBe(true);

    // Validate items array
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.items.length).toBeLessThanOrEqual(10);

    // Validate pagination metadata
    expect(response.body.page).toBe(1);
    expect(response.body.limit).toBe(10);
    expect(typeof response.body.total).toBe('number');
  });

  it('should return products with correct structure', async () => {
    const response = await getAllProducts(authToken);

    expect(response.status).toBe(200);

    if (response.body.items.length > 0) {
      const firstProduct = response.body.items[0];

      expect(firstProduct).toHaveProperty('id');
      expect(firstProduct).toHaveProperty('name');
      expect(firstProduct).toHaveProperty('price');
      expect(firstProduct).toHaveProperty('inStock');
      expect(firstProduct).toHaveProperty('createdAt');

      expect(typeof firstProduct.id).toBe('number');
      expect(typeof firstProduct.name).toBe('string');
      expect(typeof firstProduct.price).toBe('number');
      expect(typeof firstProduct.inStock).toBe('boolean');
    }
  });

  it('should handle pagination correctly', async () => {
    const page1 = await getAllProducts(authToken, { page: 1, limit: 5 });
    const page2 = await getAllProducts(authToken, { page: 2, limit: 5 });

    expect(page1.status).toBe(200);
    expect(page2.status).toBe(200);

    expect(page1.body.page).toBe(1);
    expect(page2.body.page).toBe(2);

    // Items on different pages should be different
    if (page1.body.items.length > 0 && page2.body.items.length > 0) {
      expect(page1.body.items[0].id).not.toBe(page2.body.items[0].id);
    }
  });

  it('should return 401 for unauthenticated requests', async () => {
    const response = await getAllProducts('invalid_token');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});
