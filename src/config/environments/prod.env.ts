/**
 * Production Environment Configuration
 * This file contains all configuration for the production environment
 * WARNING: Never commit sensitive production credentials to version control
 */

export const prodConfig = {
  baseUrl: process.env.PROD_BASE_URL || 'https://api.example.com',
  apiKey: process.env.PROD_API_KEY || '',
  timeout: 15000,
  retryAttempts: 1,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
