import { publicProcedure, router } from "../_core/trpc";
import { callDataApi } from "../_core/dataApi";
import { z } from "zod";
import { marketDataCache } from "../jobs/marketDataFetcher";

async function fetchQuoteWithCache(symbol: string) {
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
          name: meta.longName || symbol,
          price: latestClose,
          change,
          changePercent,
        };
      }
    }
    return null;
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return null;
  }
}

export const marketsRouter = router({
  getDefaultQuotes: publicProcedure.query(async () => {
    // Return cached data if available
    if (marketDataCache.data) {
      return marketDataCache.data;
    }

    // Fallback: return empty structure
    return {
      indexes: [],
      crypto: [],
      forex: [],
      stocks: [],
      timestamp: new Date().toISOString(),
    };
  }),

  searchSymbol: publicProcedure
    .input(z.object({ symbol: z.string() }))
    .query(async ({ input }) => {
      return await fetchQuoteWithCache(input.symbol.toUpperCase());
    }),
});
