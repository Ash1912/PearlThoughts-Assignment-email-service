export async function retry<T>(fn: () => Promise<T>, retries = 3, delay = 200): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      await new Promise((res) => setTimeout(res, delay * 2 ** i));
    }
  }
  throw new Error('Retry attempts failed');
}