'use client';
import { DEFAULT_BY_TAB } from './universe';
import { yahooLimiter, fxLimiter } from './rateLimiter';

export type AssetClass = 'stock' | 'index' | 'crypto' | 'forex' | 'future';

export type Quote = {
  symbol: string;
  name?: string;
  assetClass: AssetClass;
  price: number;
  change: number;
  changePct: number;
  volume?: number;
  time: number;
};

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const POLL_STOCKS_MS = 15_000;
const POLL_FX_MS = 30_000;

const inferClass = (s: string): AssetClass => {
  if (s.endsWith('=F')) return 'future';
  if (s.startsWith('^')) return 'index';
  if (s.endsWith('-USD')) return 'crypto';
  if (s.length === 6 && !s.includes('=') && !s.startsWith('^')) return 'forex';
  return 'stock';
};

export async function fetchYahoo(symbols: string[]): Promise<Quote[]> {
  if (!symbols.length) return [];
  
  try {
    const response = await yahooLimiter(() =>
      fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols }),
      })
    );
    
    const data = await response.json();
    return (data.quotes as any[]).map(q => ({
      symbol: q.symbol,
      name: q.shortName || q.longName,
      assetClass: inferClass(q.symbol),
      price: q.regularMarketPrice ?? q.ask ?? q.bid ?? 0,
      change: q.regularMarketChange ?? 0,
      changePct: q.regularMarketChangePercent ?? 0,
      volume: q.regularMarketVolume ?? q.volume,
      time: Date.now(),
    })) as Quote[];
  } catch (error) {
    console.error('[fetchYahoo] Error:', error);
    return [];
  }
}

export async function fetchFX(): Promise<Quote[]> {
  try {
    const response = await fxLimiter(() =>
      fetch('/api/fx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base: 'USD', symbols: ['EUR', 'GBP', 'JPY', 'AUD', 'CAD'] }),
      })
    );
    
    const data = await response.json();
    const rates = data.rates || {};
    const now = Date.now();
    
    const makeQuote = (sym: string, price: number): Quote => ({
      symbol: sym,
      name: sym.slice(0, 3) + '/' + sym.slice(3),
      assetClass: 'forex',
      price,
      change: 0,
      changePct: 0,
      time: now,
    });
    
    return [
      rates.EUR && makeQuote('EURUSD', 1 / rates.EUR),
      rates.GBP && makeQuote('GBPUSD', 1 / rates.GBP),
      rates.JPY && makeQuote('USDJPY', rates.JPY ? 1 / rates.JPY : 0),
      rates.AUD && makeQuote('AUDUSD', 1 / rates.AUD),
      rates.CAD && makeQuote('USDCAD', rates.CAD),
    ].filter(Boolean) as Quote[];
  } catch (error) {
    console.error('[fetchFX] Error:', error);
    return [];
  }
}

export function startCryptoWS(
  onTick: (q: Quote) => void,
  syms = ['BTC-USD', 'ETH-USD', 'SOL-USD']
) {
  let ws: WebSocket | null = null;
  let backoff = 1000;
  
  const connect = () => {
    ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');
    
    ws.onopen = () => {
      backoff = 1000;
      ws!.send(JSON.stringify({
        type: 'subscribe',
        channels: [{ name: 'ticker', product_ids: syms }],
      }));
    };
    
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === 'ticker') {
        onTick({
          symbol: msg.product_id,
          name: msg.product_id,
          assetClass: 'crypto',
          price: parseFloat(msg.price),
          change: 0,
          changePct: 0,
          time: Date.now(),
        });
      }
    };
    
    ws.onclose = () => {
      setTimeout(connect, Math.min(10_000, backoff *= 2));
    };
    
    ws.onerror = () => ws?.close();
  };
  
  connect();
  return () => ws?.close();
}

export async function loadFirst(tab: 'all' | 'stocks' | 'indexes' | 'crypto' | 'forex' | 'futures'): Promise<Quote[]> {
  const base = DEFAULT_BY_TAB[tab];
  const ySyms = base.filter(s => !s.endsWith('-USD'));
  
  const [yahooQuotes, fxQuotes] = await Promise.all([
    fetchYahoo(ySyms),
    (tab === 'forex' || tab === 'all') ? fetchFX() : Promise.resolve([]),
  ]);
  
  return [...yahooQuotes, ...fxQuotes];
}

export function startPolling(
  tab: 'all' | 'stocks' | 'indexes' | 'crypto' | 'forex' | 'futures',
  onBatch: (q: Quote[]) => void
) {
  let alive = true;
  
  // Yahoo polling loop
  (async function yahooLoop() {
    while (alive) {
      const syms = DEFAULT_BY_TAB[tab].filter(s => !s.endsWith('-USD'));
      if (syms.length) {
        try {
          onBatch(await fetchYahoo(syms));
        } catch (error) {
          console.error('[yahooLoop] Error:', error);
        }
      }
      await sleep(POLL_STOCKS_MS);
    }
  })();
  
  // FX polling loop
  (async function fxLoop() {
    if (!(tab === 'forex' || tab === 'all')) return;
    while (alive) {
      try {
        onBatch(await fetchFX());
      } catch (error) {
        console.error('[fxLoop] Error:', error);
      }
      await sleep(POLL_FX_MS);
    }
  })();
  
  // Crypto WebSocket
  let stopWS = () => {};
  if (tab === 'crypto' || tab === 'all') {
    stopWS = startCryptoWS((q) => onBatch([q]));
  }
  
  return () => {
    alive = false;
    stopWS();
  };
}
