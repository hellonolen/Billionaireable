import { quotesYahoo } from './provider-yahoo';
import { getPairs } from './provider-fx';
import { coinbaseProvider } from './provider-crypto-coinbase';
import type { Quote, QuoteUpdate, AssetFilter } from './types';

// Starter universe
const STOCKS = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN'];
const INDEXES = ['^GSPC', '^NDX', '^DJI', '^RUT', '^VIX'];
const FUTURES = ['ES=F', 'NQ=F', 'CL=F', 'GC=F'];
const CRYPTO = ['BTCUSD', 'ETHUSD', 'SOLUSD'];
const FX_PAIRS = ['EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

class MarketDataRouter {
  private quotes: Map<string, Quote> = new Map();
  private pollingInterval: NodeJS.Timeout | null = null;
  private fxInterval: NodeJS.Timeout | null = null;
  private subscribers: Map<string, ((quotes: Quote[]) => void)[]> = new Map();

  async initialize() {
    // Initial fetch for all assets
    await this.refreshYahooData();
    await this.refreshFXData();
    this.subscribeCrypto();

    // Start polling intervals
    this.pollingInterval = setInterval(() => {
      this.refreshYahooData();
    }, 15000); // 15s for equities/indexes/futures

    this.fxInterval = setInterval(() => {
      this.refreshFXData();
    }, 30000); // 30s for FX
  }

  private async refreshYahooData() {
    try {
      const symbols = [...STOCKS, ...INDEXES, ...FUTURES];
      const quotes = await quotesYahoo(symbols);
      quotes.forEach((q) => this.quotes.set(q.symbol, q));
      this.notifySubscribers();
    } catch (error) {
      console.error('[DataRouter] Yahoo refresh error:', error);
    }
  }

  private async refreshFXData() {
    try {
      const quotes = await getPairs('USD', FX_PAIRS);
      quotes.forEach((q) => this.quotes.set(q.symbol, q));
      this.notifySubscribers();
    } catch (error) {
      console.error('[DataRouter] FX refresh error:', error);
    }
  }

  private subscribeCrypto() {
    CRYPTO.forEach((symbol) => {
      coinbaseProvider.subscribe(symbol, (update: QuoteUpdate) => {
        const existing = this.quotes.get(symbol);
        if (existing) {
          const change = update.price - existing.price;
          const changePercent = (change / existing.price) * 100;

          this.quotes.set(symbol, {
            ...existing,
            price: update.price,
            change,
            changePercent,
            volume: update.volume,
            lastUpdate: update.timestamp,
          });
        } else {
          // Create new quote with no change data initially
          this.quotes.set(symbol, {
            symbol,
            name: symbol.replace('USD', '/USD'),
            price: update.price,
            change: 0,
            changePercent: 0,
            volume: update.volume,
            lastUpdate: update.timestamp,
            assetType: 'crypto',
          });
        }
        this.notifySubscribers();
      });
    });
  }

  private notifySubscribers() {
    const allQuotes = Array.from(this.quotes.values());
    this.subscribers.forEach((callbacks) => {
      callbacks.forEach((cb) => cb(allQuotes));
    });
  }

  subscribe(key: string, callback: (quotes: Quote[]) => void) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, []);
    }
    this.subscribers.get(key)!.push(callback);

    // Immediately call with current data
    callback(Array.from(this.quotes.values()));

    return () => this.unsubscribe(key, callback);
  }

  unsubscribe(key: string, callback: (quotes: Quote[]) => void) {
    const callbacks = this.subscribers.get(key);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  listTop(filter: AssetFilter = 'all'): Quote[] {
    const quotes = Array.from(this.quotes.values());

    if (filter === 'all') return quotes;

    return quotes.filter((q) => {
      switch (filter) {
        case 'stocks':
          return q.assetType === 'stock';
        case 'indexes':
          return q.assetType === 'index';
        case 'crypto':
          return q.assetType === 'crypto';
        case 'forex':
          return q.assetType === 'forex';
        case 'futures':
          return q.assetType === 'future';
        default:
          return true;
      }
    });
  }

  search(query: string): Quote[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.quotes.values()).filter(
      (q) =>
        q.symbol.toLowerCase().includes(lowerQuery) ||
        q.name.toLowerCase().includes(lowerQuery)
    );
  }

  getQuote(symbol: string): Quote | undefined {
    return this.quotes.get(symbol);
  }

  destroy() {
    if (this.pollingInterval) clearInterval(this.pollingInterval);
    if (this.fxInterval) clearInterval(this.fxInterval);
    this.subscribers.clear();
  }
}

export const dataRouter = new MarketDataRouter();

// Auto-initialize on import
if (typeof window !== 'undefined') {
  dataRouter.initialize();
}
