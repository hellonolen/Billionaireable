import { yahooLimiter } from './rateLimiter';
import type { Quote } from './types';

const CHUNK = 50; // symbols per call
const BASE = 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=';

interface YahooQuoteResult {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketVolume?: number;
  quoteType?: string;
}

export async function quotesYahoo(symbols: string[]): Promise<Quote[]> {
  const chunks: string[][] = [];
  for (let i = 0; i < symbols.length; i += CHUNK) {
    chunks.push(symbols.slice(i, i + CHUNK));
  }

  const results = await Promise.all(
    chunks.map((c) =>
      yahooLimiter(() =>
        fetch(BASE + encodeURIComponent(c.join(',')))
          .then((r) => r.json())
          .catch((e) => {
            console.error('Yahoo fetch error:', e);
            return { quoteResponse: { result: [] } };
          })
      )
    )
  );

  const quotes: Quote[] = [];
  for (const result of results) {
    if (result?.quoteResponse?.result) {
      for (const item of result.quoteResponse.result as YahooQuoteResult[]) {
        if (item.regularMarketPrice) {
          const assetType = determineAssetType(item.symbol, item.quoteType);
          quotes.push({
            symbol: item.symbol,
            name: item.longName || item.shortName || item.symbol,
            price: item.regularMarketPrice,
            change: item.regularMarketChange || 0,
            changePercent: item.regularMarketChangePercent || 0,
            volume: item.regularMarketVolume,
            lastUpdate: Date.now(),
            assetType,
          });
        }
      }
    }
  }

  return quotes;
}

function determineAssetType(
  symbol: string,
  quoteType?: string
): 'stock' | 'index' | 'future' {
  if (symbol.startsWith('^')) return 'index';
  if (symbol.endsWith('=F')) return 'future';
  if (quoteType === 'INDEX') return 'index';
  if (quoteType === 'FUTURE') return 'future';
  return 'stock';
}
