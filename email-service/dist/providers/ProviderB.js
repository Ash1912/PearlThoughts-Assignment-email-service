"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderB = void 0;
class ProviderB {
    async send(email) {
        const success = Math.random() > 0.5;
        await new Promise((r) => setTimeout(r, 200));
        return success;
    }
}
exports.ProviderB = ProviderB;
