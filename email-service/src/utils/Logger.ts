export class Logger {
  static log(message: string) {
    console.log(`[LOG] ${new Date().toISOString()} - ${message}`);
  }

  static error(message: string) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
  }
}