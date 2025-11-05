import { fxLimiter } from './rateLimiter';
import type { Quote } from './types';

const BASE = 'https://api.exchangerate.host/latest';

interface FXResponse {
  success: boolean;
  base: string;
  date: string;
  rates: Record<string, number>;
}

const previousRates: Record<string, number> = {};

export async function getPairs(
  base = 'USD',
  symbols = ['EUR', 'GBP', 'JPY', 'AUD', 'CAD']
): Promise<Quote[]> {
  try {
    const response: FXResponse = await fxLimiter(() =>
      fetch(`${BASE}?base=${base}&symbols=${symbols.join(',')}`).then((r) =>
        r.json()
      )
    );

    if (!response.success || !response.rates) {
      return [];
    }

    const quotes: Quote[] = [];
    for (const [currency, rate] of Object.entries(response.rates)) {
      const symbol = `${base}${currency}`;
      const prevRate = previousRates[symbol] || rate;
      const change = rate - prevRate;
      const changePercent = prevRate > 0 ? (change / prevRate) * 100 : 0;

      previousRates[symbol] = rate;

      quotes.push({
        symbol,
        name: `${base}/${currency}`,
        price: rate,
        change,
        changePercent,
        lastUpdate: Date.now(),
        assetType: 'forex',
      });
    }

    return quotes;
  } catch (error) {
    console.error('FX fetch error:', error);
    return [];
  }
}
