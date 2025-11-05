export const CRYPTO = ['BTC-USD', 'ETH-USD', 'SOL-USD'];
export const FOREX = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'EURJPY', 'USDCHF'];

export const DEFAULT_BY_TAB = {
  all: [...CRYPTO, ...FOREX],
  crypto: CRYPTO,
  forex: FOREX
} as const;
