import { ProviderA } from './providers/ProviderA';
import { ProviderB } from './providers/ProviderB';
import { EmailPayload, EmailStatus } from './types';
import { RateLimiter } from './utils/RateLimiter';
import { retry } from './utils/Retry';
import { Logger } from './utils/Logger';
import { CircuitBreaker } from './utils/CircuitBreaker';

export class EmailService {
  private providerA = new ProviderA();
  private providerB = new ProviderB();
  private breakerA = new CircuitBreaker();
  private breakerB = new CircuitBreaker();
  private rateLimiter = new RateLimiter(5, 60000);
  private sentEmails = new Set<string>();
  private statusMap = new Map<string, EmailStatus>();

  async sendEmail(email: EmailPayload): Promise<EmailStatus> {
    if (this.sentEmails.has(email.id)) return EmailStatus.SUCCESS;

    if (!this.rateLimiter.allow()) {
      Logger.error('Rate limit exceeded');
      return EmailStatus.FAILED;
    }

    this.statusMap.set(email.id, EmailStatus.PENDING);

    const tryProvider = async (provider: any, breaker: CircuitBreaker): Promise<boolean> => {
      if (!breaker.canRequest()) return false;
      try {
        const result = await retry(() => provider.send(email));
        if (result) {
          breaker.recordSuccess();
          return true;
        } else {
          breaker.recordFailure();
          return false;
        }
      } catch {
        breaker.recordFailure();
        return false;
      }
    };

    let success = false;

    if (this.breakerA.canRequest()) {
      Logger.log('Trying Provider A');
      success = await tryProvider(this.providerA, this.breakerA);
    }

    if (!success && this.breakerB.canRequest()) {
      Logger.log('Falling back to Provider B');
      success = await tryProvider(this.providerB, this.breakerB);
    }

    const finalStatus = success ? EmailStatus.SUCCESS : EmailStatus.FAILED;
    if (success) this.sentEmails.add(email.id);
    this.statusMap.set(email.id, finalStatus);
    return finalStatus;
  }

  getStatus(emailId: string): EmailStatus | undefined {
    return this.statusMap.get(emailId);
  }
}