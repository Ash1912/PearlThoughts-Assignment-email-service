"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retry = retry;
async function retry(fn, retries = 3, delay = 200) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        }
        catch (err) {
            await new Promise((res) => setTimeout(res, delay * 2 ** i));
        }
    }
    throw new Error('Retry attempts failed');
}
