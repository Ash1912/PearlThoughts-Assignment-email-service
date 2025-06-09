"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = void 0;
class CircuitBreaker {
    constructor(threshold = 3, timeout = 60000) {
        this.failureCount = 0;
        this.lastFailureTime = 0;
        this.threshold = threshold;
        this.timeout = timeout;
    }
    canRequest() {
        if (this.failureCount < this.threshold)
            return true;
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
exports.CircuitBreaker = CircuitBreaker;
