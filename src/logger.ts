function getTimestamp(): string {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

export const logger = {
  info(message: string): void {
    console.log(`[${getTimestamp()}] [INFO] ${message}`);
  },

  error(message: string): void {
    console.error(`[${getTimestamp()}] [ERROR] ${message}`);
  },

  success(message: string): void {
    console.log(`[${getTimestamp()}] [SUCCESS] ${message}`);
  }
};
