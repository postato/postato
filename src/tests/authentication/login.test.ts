/**
 * Login Test Suite
 * Generated from Postman collection: Authentication > Login
 */

import { login } from '../../requests/authentication/login.request';
import { validateSchema } from '../../utils/schema-validator';
import loginRequestFixture from '../../fixtures/authentication/login-request.json';
import loginResponseSchema from '../../schemas/authentication/login-response.schema.json';

describe('Authentication - Login', () => {
  it('should successfully login with valid credentials', async () => {
    const response = await login(loginRequestFixture);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('expiresIn');
    expect(response.body).toHaveProperty('user');

    // Validate response schema
    expect(validateSchema(response.body, loginResponseSchema)).toBe(true);

    // Validate user object
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('email');
    expect(response.body.user).toHaveProperty('name');
  });

  it('should return 401 for invalid credentials', async () => {
    const invalidCredentials = {
      username: 'invalid@example.com',
      password: 'wrongpassword',
    };

    const response = await login(invalidCredentials);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for missing credentials', async () => {
    const missingPassword = {
      username: 'test@example.com',
      password: '',
    };

    const response = await login(missingPassword);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
