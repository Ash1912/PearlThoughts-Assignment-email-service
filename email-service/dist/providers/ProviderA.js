"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderA = void 0;
class ProviderA {
    async send(email) {
        const success = Math.random() > 0.3;
        await new Promise((r) => setTimeout(r, 200));
        return success;
    }
}
exports.ProviderA = ProviderA;
