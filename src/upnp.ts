import { Client } from 'nat-upnp-rejetto';

/**
 * Represents a port mapping configuration for UPnP
 */
export interface PortMapping {
  /** The internal/local port on this machine */
  internalPort: number;
  /** The external/public port visible on the internet */
  externalPort: number;
  /** The protocol to use: 'tcp' or 'udp' */
  protocol: 'tcp' | 'udp';
}

/**
 * Maps ports using UPnP protocol to make local services accessible from the internet.
 * Gateway is auto-detected.
 * 
 * @param mappings - Array of port mappings to create
 * @param localIP - The local IP address to forward traffic to
 * @returns The external IP address of the gateway
 * @throws Error if no UPnP gateway is found, connection times out, or port mapping fails
 * 
 * @example
 * ```typescript
 * const externalIP = await mapPorts([
 *   { internalPort: 8080, externalPort: 80, protocol: 'tcp' }
 * ], '192.168.1.100');
 * console.log(`Accessible at ${externalIP}:80`);
 * ```
 */
export async function mapPorts(
  mappings: PortMapping[],
  localIP: string
): Promise<string> {
  const client = new Client();

  try {
    // Map each port
    for (const mapping of mappings) {
      const { internalPort, externalPort, protocol } = mapping;
      
      // Convert protocol to uppercase as required by the library
      const protocolUpper = protocol.toUpperCase();

      await client.createMapping({
        public: externalPort,
        private: {
          port: internalPort,
          host: localIP
        },
        protocol: protocolUpper,
        description: 'auto-upnp'
      });
    }

    // Get external IP
    const externalIP = await client.getPublicIp();
    
    return externalIP;
  } catch (error) {
    // Transform error into descriptive message
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Identify common failure scenarios
    if (errorMessage.includes('Service not found') || errorMessage.includes('service not found')) {
      throw new Error(`UPnP service not found: ${errorMessage}. Ensure your router supports UPnP and it is enabled in router settings.`);
    }

    if (errorMessage.includes('gateway') || errorMessage.includes('router')) {
      throw new Error(`UPnP gateway not found: ${errorMessage}. Ensure your router supports UPnP and it is enabled.`);
    }

    if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
      throw new Error(`UPnP connection timed out: ${errorMessage}. Check your network connection to the router.`);
    }

    if (errorMessage.includes('conflict') || errorMessage.includes('in use') || errorMessage.includes('occupied')) {
      throw new Error(`Port mapping conflict: ${errorMessage}. The requested external port may already be mapped.`);
    }

    if (errorMessage.includes('permission') || errorMessage.includes('denied')) {
      throw new Error(`UPnP permission denied: ${errorMessage}. Check router UPnP security settings.`);
    }

    // Generic error with original message
    throw new Error(`UPnP port mapping failed: ${errorMessage}`);
  } finally {
    // Always close the client to clean up resources
    client.close();
  }
}
