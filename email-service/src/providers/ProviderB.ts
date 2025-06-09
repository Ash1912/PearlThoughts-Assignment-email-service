import { EmailPayload } from '../types';

export class ProviderB {
  async send(email: EmailPayload): Promise<boolean> {
    const success = Math.random() > 0.5;
    await new Promise((r) => setTimeout(r, 200));
    return success;
  }
}