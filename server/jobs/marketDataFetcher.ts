import { callDataApi } from "../_core/dataApi";

// Global cache
export const marketDataCache: {
  data: any;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchQuote(symbol: string, name: string) {
  try {
    const response: any = await callDataApi("YahooFinance/get_stock_chart", {
      query: {
        symbol,
        region: "US",
        interval: "1d",
        range: "5d",
      },
    });

    if (response?.chart?.result?.[0]) {
      const result = response.chart.result[0];
      const meta = result.meta;
      const quotes = result.indicators.quote[0];
      const timestamps = result.timestamp;

      // Get latest close price
      let latestClose = null;
      for (let i = timestamps.length - 1; i >= 0; i--) {
        if (quotes.close[i] !== null) {
          latestClose = quotes.close[i];
          break;
        }
      }

      // Get previous close price
      let prevClose = null;
      for (let i = timestamps.length - 2; i >= 0; i--) {
        if (quotes.close[i] !== null) {
          prevClose = quotes.close[i];
          break;
        }
      }

      if (latestClose && prevClose) {
        const change = latestClose - prevClose;
        const changePercent = (change / prevClose) * 100;

        return {
          symbol,
          name: meta.longName || name,
          price: latestClose,
          change,
          changePercent,
        };
      }
    }
    return null;
  } catch (error) {
    console.error(`[MarketData] Error fetching ${symbol}:`, error);
    return null;
  }
}

export async function refreshMarketData() {
  const now = Date.now();
  
  // Check if cache is still valid
  if (marketDataCache.data && now - marketDataCache.timestamp < CACHE_TTL) {
    return marketDataCache.data;
  }

  console.log("[MarketData] Refreshing market data...");

  const symbols = {
    indexes: [
      { symbol: "^GSPC", name: "S&P 500" },
      { symbol: "^IXIC", name: "Nasdaq" },
      { symbol: "^DJI", name: "Dow Jones" },
      { symbol: "^RUT", name: "Russell 2000" },
    ],
    crypto: [
      { symbol: "BTC-USD", name: "Bitcoin" },
      { symbol: "ETH-USD", name: "Ethereum" },
      { symbol: "BNB-USD", name: "Binance Coin" },
      { symbol: "SOL-USD", name: "Solana" },
    ],
    forex: [
      { symbol: "EURUSD=X", name: "EUR/USD" },
      { symbol: "GBPUSD=X", name: "GBP/USD" },
      { symbol: "JPYUSD=X", name: "JPY/USD" },
      { symbol: "AUDUSD=X", name: "AUD/USD" },
    ],
    stocks: [
      { symbol: "AAPL", name: "Apple" },
      { symbol: "MSFT", name: "Microsoft" },
      { symbol: "GOOGL", name: "Google" },
      { symbol: "AMZN", name: "Amazon" },
      { symbol: "TSLA", name: "Tesla" },
      { symbol: "META", name: "Meta" },
    ],
  };

  const results: Record<string, any[]> = {
    indexes: [],
    crypto: [],
    forex: [],
    stocks: [],
  };

  // Fetch all categories
  for (const [category, items] of Object.entries(symbols)) {
    for (const item of items) {
      const quote = await fetchQuote(item.symbol, item.name);
      if (quote) {
        results[category].push(quote);
      }
      // Delay between requests to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  const data = {
    ...results,
    timestamp: new Date().toISOString(),
  };

  // Update cache
  marketDataCache.data = data;
  marketDataCache.timestamp = now;

  console.log(`[MarketData] Refreshed ${Object.values(results).flat().length} quotes`);

  return data;
}

// Start background refresh
export function startMarketDataRefresh() {
  // Initial fetch
  refreshMarketData().catch(console.error);

  // Refresh every 5 minutes
  setInterval(() => {
    refreshMarketData().catch(console.error);
  }, CACHE_TTL);

  console.log("[MarketData] Background refresh started");
}
