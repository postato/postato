/**
 * Staging Environment Configuration
 * This file contains all configuration for the staging environment
 *
 * Configuration automatically adapts based on src/config/template.config.ts
 */

import * as dotenv from 'dotenv';
import {
  TEMPLATE_CONFIG,
  ARCHITECTURE,
  AUTH_PATTERN,
} from '../template.config';

dotenv.config({ path: '.env.staging' });

export const stagingConfig = {
  // =================================
  // Base Configuration (Always Present)
  // =================================
  baseUrl: process.env.STAGING_BASE_URL || 'https://api.staging.example.com',
  apiKey: process.env.STAGING_API_KEY || '',

  // =================================
  // Microservices Configuration
  // =================================
  // Only included if TEMPLATE_CONFIG.architecture === ARCHITECTURE.MICROSERVICES
  ...(TEMPLATE_CONFIG.architecture === ARCHITECTURE.MICROSERVICES && {
    services: {
      [TEMPLATE_CONFIG.services.MAIN]:
        process.env.STAGING_MAIN_API_URL || 'https://api.staging.example.com',
      [TEMPLATE_CONFIG.services.PAYMENTS]:
        process.env.STAGING_PAYMENTS_API_URL ||
        'https://payments-api.staging.example.com',
      [TEMPLATE_CONFIG.services.NOTIFICATIONS]:
        process.env.STAGING_NOTIFICATIONS_API_URL ||
        'https://notifications-api.staging.example.com',
    },
  }),

  // =================================
  // Multiple Authentication Tokens
  // =================================
  // Only included if TEMPLATE_CONFIG.authPattern === AUTH_PATTERN.MULTIPLE
  ...(TEMPLATE_CONFIG.authPattern === AUTH_PATTERN.MULTIPLE && {
    auth: {
      [TEMPLATE_CONFIG.tokenTypes.ADMIN]:
        process.env.STAGING_ADMIN_TOKEN || '',
      [TEMPLATE_CONFIG.tokenTypes.SERVICE_ACCOUNT]:
        process.env.STAGING_SERVICE_ACCOUNT_TOKEN || '',
      [TEMPLATE_CONFIG.tokenTypes.CLIENT]:
        process.env.STAGING_CLIENT_TOKEN || '',
    },
  }),

  // =================================
  // SSL Configuration (Always Present)
  // =================================
  ssl: {
    enabled:
      TEMPLATE_CONFIG.sslEnabled &&
      process.env.STAGING_SSL_ENABLED === 'true',
    certPath: process.env.STAGING_SSL_CERT_PATH || '',
  },

  // =================================
  // General Settings
  // =================================
  timeout: parseInt(process.env.STAGING_TIMEOUT || '10000'),
  retryAttempts: parseInt(process.env.STAGING_RETRY_ATTEMPTS || '2'),

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};
