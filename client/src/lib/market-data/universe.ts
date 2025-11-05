export const STOCKS = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'META', 'GOOGL', 'NFLX', 'AMD', 'INTC'];
export const INDEXES = ['^GSPC', '^NDX', '^DJI', '^RUT', '^VIX'];
export const FUTURES = ['ES=F', 'NQ=F', 'YM=F', 'RTY=F', 'CL=F', 'GC=F', 'SI=F'];
export const CRYPTO = ['BTC-USD', 'ETH-USD', 'SOL-USD'];
export const FOREX = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD'];

export const DEFAULT_BY_TAB: Record<string, string[]> = {
  all: [...CRYPTO, ...STOCKS.slice(0, 5), ...INDEXES.slice(0, 3)],
  stocks: STOCKS,
  indexes: INDEXES,
  crypto: CRYPTO,
  forex: FOREX,
  futures: FUTURES,
};
