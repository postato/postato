import { getConfig } from '../config/environments';
import { configureSsl } from '../config/ssl.config';
import { TEMPLATE_CONFIG } from '../config/template.config';

// Load environment configuration
const config = getConfig();

// Configure SSL if enabled in template config
if (TEMPLATE_CONFIG.sslEnabled && config.ssl?.enabled && config.ssl?.certPath) {
  configureSsl(config.ssl.certPath);
}

// Set global test timeout
jest.setTimeout(config.timeout || 30000);

// Optional: Add custom Jest matchers, global mocks, etc. below
