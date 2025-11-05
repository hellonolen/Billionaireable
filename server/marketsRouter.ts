import { router, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import { callDataApi } from "./_core/dataApi";

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 300000; // 5 minutes

async function fetchQuoteWithCache(symbol: string) {
  const cached = cache.get(symbol);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }

  try {
    const result = await callDataApi("YahooFinance/get_stock_chart", {
      query: {
        symbol: symbol,
        region: "US",
        interval: "1d",
        range: "1d",
      },
    });

    const typedResult = result as any;
    if (typedResult && typedResult.chart && typedResult.chart.result && typedResult.chart.result[0]) {
      const data = typedResult.chart.result[0];
      const meta = data.meta;
      
      const currentPrice = meta.regularMarketPrice;
      const previousClose = meta.chartPreviousClose;
      const change = currentPrice - previousClose;
      const changePercent = (change / previousClose) * 100;
      
      const quoteData = {
        symbol: meta.symbol,
        name: meta.shortName || meta.longName || symbol,
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        dayHigh: meta.regularMarketDayHigh,
        dayLow: meta.regularMarketDayLow,
        volume: meta.regularMarketVolume,
      };
      
      cache.set(symbol, { data: quoteData, timestamp: now });
      return quoteData;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return null;
  }
}

export const marketsRouter = router({
  getQuote: publicProcedure
    .input(z.object({ symbol: z.string() }))
    .query(async ({ input }) => {
      return await fetchQuoteWithCache(input.symbol);
    }),

  getAllQuotes: publicProcedure.query(async () => {
    const symbols = [
      { symbol: "^GSPC", name: "S&P 500" },
      { symbol: "^IXIC", name: "Nasdaq" },
      { symbol: "^DJI", name: "Dow Jones" },
      { symbol: "BTC-USD", name: "Bitcoin" },
      { symbol: "AAPL", name: "Apple" },
      { symbol: "MSFT", name: "Microsoft" },
      { symbol: "GOOGL", name: "Google" },
      { symbol: "TSLA", name: "Tesla" },
      { symbol: "AMZN", name: "Amazon" },
      { symbol: "META", name: "Meta" },
    ];

    // Fetch with delays to avoid rate limits
    const results: any[] = [];
    for (const { symbol, name } of symbols) {
      const data = await fetchQuoteWithCache(symbol);
      if (data) {
        results.push({ ...data, name });
      }
      // Delay between requests to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return {
      indexes: results.slice(0, 4),
      watchlist: results.slice(4),
      timestamp: Date.now(),
    };
  }),
});
