/**
 * Production Environment Configuration
 * This file contains all configuration for the production environment
 * WARNING: Never commit sensitive production credentials to version control
 *
 * Configuration automatically adapts based on src/config/template.config.ts
 */

import * as dotenv from 'dotenv';
import {
  TEMPLATE_CONFIG,
  ARCHITECTURE,
  AUTH_PATTERN,
} from '../template.config';

dotenv.config({ path: '.env.production' });

export const prodConfig = {
  // =================================
  // Base Configuration (Always Present)
  // =================================
  baseUrl: process.env.PROD_BASE_URL || 'https://api.example.com',
  apiKey: process.env.PROD_API_KEY || '',

  // =================================
  // Microservices Configuration
  // =================================
  // Only included if TEMPLATE_CONFIG.architecture === ARCHITECTURE.MICROSERVICES
  ...(TEMPLATE_CONFIG.architecture === ARCHITECTURE.MICROSERVICES && {
    services: {
      [TEMPLATE_CONFIG.services.MAIN]:
        process.env.PROD_MAIN_API_URL || 'https://api.example.com',
      [TEMPLATE_CONFIG.services.PAYMENTS]:
        process.env.PROD_PAYMENTS_API_URL || 'https://payments-api.example.com',
      [TEMPLATE_CONFIG.services.NOTIFICATIONS]:
        process.env.PROD_NOTIFICATIONS_API_URL ||
        'https://notifications-api.example.com',
    },
  }),

  // =================================
  // Multiple Authentication Tokens
  // =================================
  // Only included if TEMPLATE_CONFIG.authPattern === AUTH_PATTERN.MULTIPLE
  ...(TEMPLATE_CONFIG.authPattern === AUTH_PATTERN.MULTIPLE && {
    auth: {
      [TEMPLATE_CONFIG.tokenTypes.ADMIN]: process.env.PROD_ADMIN_TOKEN || '',
      [TEMPLATE_CONFIG.tokenTypes.SERVICE_ACCOUNT]:
        process.env.PROD_SERVICE_ACCOUNT_TOKEN || '',
      [TEMPLATE_CONFIG.tokenTypes.CLIENT]: process.env.PROD_CLIENT_TOKEN || '',
    },
  }),

  // =================================
  // SSL Configuration (Always Present)
  // =================================
  ssl: {
    enabled:
      TEMPLATE_CONFIG.sslEnabled && process.env.PROD_SSL_ENABLED === 'true',
    certPath: process.env.PROD_SSL_CERT_PATH || '',
  },

  // =================================
  // General Settings
  // =================================
  timeout: parseInt(process.env.PROD_TIMEOUT || '15000'),
  retryAttempts: parseInt(process.env.PROD_RETRY_ATTEMPTS || '1'),

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};
