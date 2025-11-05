const BASE = 'https://api.exchangerate.host/latest';

interface FXResponse {
  success: boolean;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface FXQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  assetType: 'forex';
}

const previousRates: Record<string, number> = {};

export async function getPairs(
  base = 'USD',
  symbols = ['EUR', 'GBP', 'JPY', 'AUD', 'CAD']
): Promise<FXQuote[]> {
  try {
    const response: FXResponse = await fetch(
      `${BASE}?base=${base}&symbols=${symbols.join(',')}`
    ).then((r) => r.json());

    if (!response.success || !response.rates) {
      return [];
    }

    const quotes: FXQuote[] = [];
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
        assetType: 'forex',
      });
    }

    return quotes;
  } catch (error) {
    console.error('[FX] Fetch error:', error);
    return [];
  }
}
