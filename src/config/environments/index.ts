/**
 * Environment Configuration Loader
 * This file exports the appropriate environment configuration based on TEST_ENV variable
 */

import { devConfig, type EnvironmentConfig } from './dev.env';
import { stagingConfig } from './staging.env';
import { prodConfig } from './prod.env';

/**
 * Get the current environment configuration
 * @returns Environment configuration object
 * 
 * Usage in tests:
 * const config = getConfig();
 * const response = await request(config.baseUrl).get('/api/endpoint');
 */
export const getConfig = (): EnvironmentConfig => {
  const env = process.env.TEST_ENV || 'dev';
  
  switch(env.toLowerCase()) {
    case 'staging':
      return stagingConfig;
    case 'prod':
    case 'production':
      return prodConfig;
    case 'dev':
    case 'development':
    default:
      return devConfig;
  }
};

/**
 * Get current environment name
 */
export const getCurrentEnvironment = (): string => {
  return process.env.TEST_ENV || 'dev';
};

export { devConfig, stagingConfig, prodConfig };
export type { EnvironmentConfig };
