import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

/**
 * Configure SSL certificates for HTTPS requests
 * 
 * @param certPath - Relative path to certificate file (e.g., 'certs/dev-ca.crt')
 * @returns void
 */
export const configureSsl = (certPath: string): void => {
  if (!certPath) {
    console.log('ℹ️  No SSL certificate configured');
    return;
  }
  
  try {
    const fullPath = path.join(process.cwd(), certPath);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  SSL certificate not found: ${fullPath}`);
      console.warn(`   Tests will proceed but may fail if server requires custom certificates`);
      return;
    }
    
    const certificate = fs.readFileSync(fullPath);
    
    // Configure Node.js HTTPS agent with custom certificate
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    https.globalAgent.options.ca = certificate;
    
    console.log(`✅ SSL certificate loaded: ${certPath}`);
  } catch (error) {
    console.error(`❌ Failed to load SSL certificate:`, error);
    throw error;
  }
};
