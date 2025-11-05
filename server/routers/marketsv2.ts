import { router, publicProcedure } from "../_core/trpc";
import { quotesYahoo } from "../lib/market-data/provider-yahoo";
import { getPairs } from "../lib/market-data/provider-fx";

const STOCKS = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN'];
const INDEXES = ['^GSPC', '^NDX', '^DJI', '^RUT', '^VIX'];
const FUTURES = ['ES=F', 'NQ=F', 'CL=F', 'GC=F'];
const FX_PAIRS = ['EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

interface CachedData {
  stocks: any[];
  indexes: any[];
  futures: any[];
  forex: any[];
  timestamp: number;
}

let cache: CachedData | null = null;
const CACHE_TTL = 15000; // 15 seconds

async function fetchAllData(): Promise<CachedData> {
  const now = Date.now();
  
  if (cache && now - cache.timestamp < CACHE_TTL) {
    return cache;
  }

  try {
    const [stockQuotes, indexQuotes, futureQuotes, fxQuotes] = await Promise.all([
      quotesYahoo(STOCKS),
      quotesYahoo(INDEXES),
      quotesYahoo(FUTURES),
      getPairs('USD', FX_PAIRS),
    ]);

    cache = {
      stocks: stockQuotes,
      indexes: indexQuotes,
      futures: futureQuotes,
      forex: fxQuotes,
      timestamp: now,
    };

    return cache;
  } catch (error) {
    console.error('[Markets] Fetch error:', error);
    return cache || { stocks: [], indexes: [], futures: [], forex: [], timestamp: now };
  }
}

export const marketsV2Router = router({
  getAllQuotes: publicProcedure.query(async () => {
    return await fetchAllData();
  }),
});
