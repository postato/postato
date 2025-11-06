/**
 * Shared TypeScript Types and Interfaces
 * Common types used across the API testing framework
 */

/**
 * API Response wrapper type
 */
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
  error?: string;
  statusCode?: number;
}

/**
 * Paginated response type
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore?: boolean;
  totalPages?: number;
}

/**
 * Error response type
 */
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp?: string;
  path?: string;
}

/**
 * Common query parameters
 */
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  [key: string]: any;
}

/**
 * Test context type (shared across tests)
 */
export interface TestContext {
  authToken?: string;
  userId?: number;
  testData?: Record<string, any>;
}

/**
 * HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Request options
 */
export interface RequestOptions {
  headers?: Record<string, string>;
  queryParams?: QueryParams;
  timeout?: number;
  retries?: number;
}

/**
 * Example domain types - Update based on your API
 * These are placeholders for demonstration
 */

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  inStock: boolean;
  createdAt: string;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

/**
 * Auth types
 */
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}
