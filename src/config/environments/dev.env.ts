/**
 * Development Environment Configuration
 * This file contains all configuration for the development environment
 *
 * Configuration automatically adapts based on src/config/template.config.ts
 */

import * as dotenv from 'dotenv';
import {
  TEMPLATE_CONFIG,
  ARCHITECTURE,
  AUTH_PATTERN,
} from '../template.config';

dotenv.config({ path: '.env.development' });

export const devConfig = {
  // =================================
  // Base Configuration (Always Present)
  // =================================
  baseUrl: process.env.DEV_BASE_URL || 'https://api.dev.example.com',
  apiKey: process.env.DEV_API_KEY || '',

  // =================================
  // Microservices Configuration
  // =================================
  // Only included if TEMPLATE_CONFIG.architecture === ARCHITECTURE.MICROSERVICES
  ...(TEMPLATE_CONFIG.architecture === ARCHITECTURE.MICROSERVICES && {
    services: {
      [TEMPLATE_CONFIG.services.MAIN]:
        process.env.DEV_MAIN_API_URL || 'https://api.dev.example.com',
      [TEMPLATE_CONFIG.services.PAYMENTS]:
        process.env.DEV_PAYMENTS_API_URL ||
        'https://payments-api.dev.example.com',
      [TEMPLATE_CONFIG.services.NOTIFICATIONS]:
        process.env.DEV_NOTIFICATIONS_API_URL ||
        'https://notifications-api.dev.example.com',
    },
  }),

  // =================================
  // Multiple Authentication Tokens
  // =================================
  // Only included if TEMPLATE_CONFIG.authPattern === AUTH_PATTERN.MULTIPLE
  ...(TEMPLATE_CONFIG.authPattern === AUTH_PATTERN.MULTIPLE && {
    auth: {
      [TEMPLATE_CONFIG.tokenTypes.ADMIN]: process.env.DEV_ADMIN_TOKEN || '',
      [TEMPLATE_CONFIG.tokenTypes.SERVICE_ACCOUNT]:
        process.env.DEV_SERVICE_ACCOUNT_TOKEN || '',
      [TEMPLATE_CONFIG.tokenTypes.CLIENT]: process.env.DEV_CLIENT_TOKEN || '',
    },
  }),

  // =================================
  // SSL Configuration (Always Present)
  // =================================
  ssl: {
    enabled:
      TEMPLATE_CONFIG.sslEnabled && process.env.DEV_SSL_ENABLED === 'true',
    certPath: process.env.DEV_SSL_CERT_PATH || '',
  },

  // =================================
  // General Settings
  // =================================
  timeout: parseInt(process.env.DEV_TIMEOUT || '5000'),
  retryAttempts: parseInt(process.env.DEV_RETRY_ATTEMPTS || '3'),

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export type EnvironmentConfig = typeof devConfig;
