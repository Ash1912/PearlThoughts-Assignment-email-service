import { EmailPayload } from '../types';

export class ProviderA {
  async send(email: EmailPayload): Promise<boolean> {
    const success = Math.random() > 0.3;
    await new Promise((r) => setTimeout(r, 200));
    return success;
  }
}