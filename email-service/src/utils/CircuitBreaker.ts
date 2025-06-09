export class CircuitBreaker {
  private failureCount = 0;
  private readonly threshold: number;
  private readonly timeout: number;
  private lastFailureTime = 0;

  constructor(threshold: number = 3, timeout: number = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
  }

  canRequest(): boolean {
    if (this.failureCount < this.threshold) return true;
    return Date.now() - this.lastFailureTime > this.timeout;
  }

  recordSuccess() {
    this.failureCount = 0;
  }

  recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
  }
}