import { EmailService } from '../src/EmailService';
import { EmailPayload } from '../src/types';

describe('EmailService', () => {
  const service = new EmailService();
  const email: EmailPayload = {
    id: '1',
    to: 'test@example.com',
    subject: 'Test',
    body: 'Hello',
  };

  it('should send email successfully', async () => {
    const result = await service.sendEmail(email);
    expect(result).toBeDefined();
  });

  it('should prevent duplicate sends (idempotency)', async () => {
    const first = await service.sendEmail(email);
    const second = await service.sendEmail(email);
    expect(second).toBe(first);
  });

  it('should track status correctly', async () => {
    await service.sendEmail(email);
    const status = service.getStatus(email.id);
    expect(status).toBeDefined();
  });
});
