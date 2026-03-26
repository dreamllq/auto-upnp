/**
 * IP Detector Module
 *
 * Provides utilities for detecting local network IP addresses.
 * Used to find the local IPv4 address for UPnP registration.
 */

import { networkInterfaces } from 'os';

/**
 * Gets the first non-internal IPv4 address from local network interfaces.
 *
 * Iterates through all network interfaces and returns the first
 * IPv4 address that is not a loopback or internal address.
 *
 * @returns The first valid local IPv4 address, or null if none found
 *
 * @example
 * ```typescript
 * const ip = getLocalIP();
 * if (ip) {
 *   console.log(`Local IP: ${ip}`); // e.g., "192.168.1.100"
 * } else {
 *   console.log('No valid local IP found');
 * }
 * ```
 */
export function getLocalIP(): string | null {
  const interfaces = networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    const ifaceList = interfaces[name];
    if (!ifaceList) continue;

    for (const iface of ifaceList) {
      // Skip internal addresses (loopback, etc.)
      if (iface.internal) continue;

      // Return first IPv4 address found
      if (iface.family === 'IPv4') {
        return iface.address;
      }
    }
  }

  return null;
}
