"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
class RateLimiter {
    constructor(maxRequests, windowMs) {
        this.timestamps = [];
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
    }
    allow() {
        const now = Date.now();
        this.timestamps = this.timestamps.filter(t => now - t < this.windowMs);
        if (this.timestamps.length < this.maxRequests) {
            this.timestamps.push(now);
            return true;
        }
        return false;
    }
}
exports.RateLimiter = RateLimiter;
