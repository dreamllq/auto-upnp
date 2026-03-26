import { program } from 'commander';

export interface PortMapping {
  internalPort: number;
  externalPort: number;
  protocol: 'tcp' | 'udp';
}

export interface CliConfig {
  mappings: PortMapping[];
}

function collect(value: string, previous: string[]): string[] {
  return previous.concat([value]);
}

function parsePortMapping(mapping: string): PortMapping | null {
  const match = mapping.match(/^(\d+):(\d+)\/(tcp|udp)$/);
  if (!match) return null;
  return {
    internalPort: parseInt(match[1], 10),
    externalPort: parseInt(match[2], 10),
    protocol: match[3] as 'tcp' | 'udp'
  };
}

export function parseArgs(): CliConfig {
  program
    .option('-p, --port <mapping>', 'Port mapping (format: internal:external/protocol)', collect, [])
    .parse(process.argv);
  
  const options = program.opts();
  const portStrings: string[] = options.port || [];
  
  if (portStrings.length === 0) {
    console.error('Usage: auto-upnp -p <internal>:<external>/<protocol> [-p ...]');
    process.exit(1);
  }
  
  const mappings: PortMapping[] = [];
  for (const ps of portStrings) {
    const mapping = parsePortMapping(ps);
    if (!mapping) {
      console.error(`Invalid port mapping: ${ps}`);
      console.error('Usage: auto-upnp -p <internal>:<external>/<protocol> [-p ...]');
      process.exit(1);
    }
    mappings.push(mapping);
  }
  
  return { mappings };
}
