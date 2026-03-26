/**
 * Main Entry Point for auto-upnp
 * 
 * Orchestrates the UPnP port mapping process:
 * 1. Parse CLI arguments
 * 2. Detect local IP address
 * 3. Create UPnP port mappings
 */

import { parseArgs } from './cli.js';
import { getLocalIP } from './ip-detector.js';
import { mapPorts } from './upnp.js';
import { logger } from './logger.js';

async function main(): Promise<void> {
  // Parse CLI args (exits code 1 on error)
  const config = parseArgs();
  
  // Get local IP
  const localIP = getLocalIP();
  if (!localIP) {
    logger.error('No valid local IP address found');
    process.exit(2);
  }
  
  logger.info(`Detected local IP: ${localIP}`);
  
  // Map ports via UPnP
  const externalIP = await mapPorts(config.mappings, localIP);
  
  // Log success for each mapping
  for (const mapping of config.mappings) {
    logger.success(
      `Mapped ${mapping.internalPort}→${mapping.externalPort} (${mapping.protocol.toUpperCase()}) on ${localIP} -> ${externalIP}`
    );
  }
  
  process.exit(0);
}

main().catch((error) => {
  logger.error(error.message);
  process.exit(2);
});
