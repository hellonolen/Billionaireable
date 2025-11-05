// lib/market-data/rateLimiter.ts
export function makeLimiter({
  capacity,
  refillEveryMs,
  refillAmount,
}: {
  capacity: number;
  refillEveryMs: number;
  refillAmount: number;
}) {
  let tokens = capacity;
  let last = Date.now();

  return async function schedule<T>(fn: () => Promise<T>): Promise<T> {
    while (true) {
      const now = Date.now();
      const cycles = Math.floor((now - last) / refillEveryMs);
      if (cycles > 0) {
        tokens = Math.min(capacity, tokens + cycles * refillAmount);
        last = now;
      }
      if (tokens > 0) {
        tokens--;
        return fn();
      }
      await new Promise((r) => setTimeout(r, Math.max(50, refillEveryMs / 10)));
    }
  };
}

// Yahoo: ≤2 req/sec, poll ≥15s
export const yahooLimiter = makeLimiter({
  capacity: 2,
  refillEveryMs: 1000,
  refillAmount: 2,
});

// FX: ≤10 req/min
export const fxLimiter = makeLimiter({
  capacity: 10,
  refillEveryMs: 60_000,
  refillAmount: 10,
});

// Finnhub (if key): ≤60 req/min
export const finnhubLimiter = makeLimiter({
  capacity: 60,
  refillEveryMs: 60_000,
  refillAmount: 60,
});

// TwelveData (if key): ≤8 req/min
export const twelveLimiter = makeLimiter({
  capacity: 8,
  refillEveryMs: 60_000,
  refillAmount: 8,
});
