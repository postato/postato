/**
 * Staging Environment Configuration
 * This file contains all configuration for the staging environment
 */

export const stagingConfig = {
  baseUrl: process.env.STAGING_BASE_URL || 'https://api.staging.example.com',
  apiKey: process.env.STAGING_API_KEY || '',
  timeout: 10000,
  retryAttempts: 2,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
