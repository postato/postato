/**
 * Development Environment Configuration
 * This file contains all configuration for the development environment
 */

export const devConfig = {
  baseUrl: process.env.DEV_BASE_URL || 'https://api.dev.example.com',
  apiKey: process.env.DEV_API_KEY || '',
  timeout: 5000,
  retryAttempts: 3,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export type EnvironmentConfig = typeof devConfig;
