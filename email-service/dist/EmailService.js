"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const ProviderA_1 = require("./providers/ProviderA");
const ProviderB_1 = require("./providers/ProviderB");
const types_1 = require("./types");
const RateLimiter_1 = require("./utils/RateLimiter");
const Retry_1 = require("./utils/Retry");
const Logger_1 = require("./utils/Logger");
const CircuitBreaker_1 = require("./utils/CircuitBreaker");
class EmailService {
    constructor() {
        this.providerA = new ProviderA_1.ProviderA();
        this.providerB = new ProviderB_1.ProviderB();
        this.breakerA = new CircuitBreaker_1.CircuitBreaker();
        this.breakerB = new CircuitBreaker_1.CircuitBreaker();
        this.rateLimiter = new RateLimiter_1.RateLimiter(5, 60000);
        this.sentEmails = new Set();
        this.statusMap = new Map();
    }
    async sendEmail(email) {
        if (this.sentEmails.has(email.id))
            return types_1.EmailStatus.SUCCESS;
        if (!this.rateLimiter.allow()) {
            Logger_1.Logger.error('Rate limit exceeded');
            return types_1.EmailStatus.FAILED;
        }
        this.statusMap.set(email.id, types_1.EmailStatus.PENDING);
        const tryProvider = async (provider, breaker) => {
            if (!breaker.canRequest())
                return false;
            try {
                const result = await (0, Retry_1.retry)(() => provider.send(email));
                if (result) {
                    breaker.recordSuccess();
                    return true;
                }
                else {
                    breaker.recordFailure();
                    return false;
                }
            }
            catch {
                breaker.recordFailure();
                return false;
            }
        };
        let success = false;
        if (this.breakerA.canRequest()) {
            Logger_1.Logger.log('Trying Provider A');
            success = await tryProvider(this.providerA, this.breakerA);
        }
        if (!success && this.breakerB.canRequest()) {
            Logger_1.Logger.log('Falling back to Provider B');
            success = await tryProvider(this.providerB, this.breakerB);
        }
        const finalStatus = success ? types_1.EmailStatus.SUCCESS : types_1.EmailStatus.FAILED;
        if (success)
            this.sentEmails.add(email.id);
        this.statusMap.set(email.id, finalStatus);
        return finalStatus;
    }
    getStatus(emailId) {
        return this.statusMap.get(emailId);
    }
}
exports.EmailService = EmailService;
