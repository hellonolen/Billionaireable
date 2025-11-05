import { CRYPTO, FOREX, DEFAULT_BY_TAB } from './universe';

export type Quote = {
  symbol: string;
  name?: string;
  assetClass: 'crypto' | 'forex';
  price: number;
  change: number;
  changePct: number;
  time: number;
};

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const POLL_FX_MS = 30_000;

async function fetchFX(pairs: string[]): Promise<Quote[]> {
  const r = await fetch('/api/fx', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pairs })
  });
  const j = await r.json();
  return j.quotes ?? [];
}

export async function loadInitial(tab: 'all' | 'crypto' | 'forex') {
  const base = DEFAULT_BY_TAB[tab];
  const fxPairs = base.filter((s: string) => s.length === 6);
  const [fx] = await Promise.all([
    fxPairs.length ? fetchFX(fxPairs) : Promise.resolve([])
  ]);
  return [...fx];
}

function startCoinbase(onTick: (q: Quote) => void, symbols: string[]) {
  let ws: WebSocket | null = null;
  let backoff = 1000;
  
  const connect = () => {
    ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');
    ws.onopen = () => {
      backoff = 1000;
      ws!.send(JSON.stringify({
        type: 'subscribe',
        channels: [{ name: 'ticker', product_ids: symbols }]
      }));
    };
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.type === 'ticker' && m.product_id && m.price) {
        onTick({
          symbol: m.product_id,
          name: m.product_id,
          assetClass: 'crypto',
          price: parseFloat(m.price),
          change: 0,
          changePct: 0,
          time: Date.now()
        });
      }
    };
    ws.onclose = () => setTimeout(connect, Math.min(10_000, backoff *= 2));
    ws.onerror = () => ws?.close();
  };
  
  connect();
  return () => ws?.close();
}

export function startLive(tab: 'all' | 'crypto' | 'forex', onBatch: (q: Quote[]) => void) {
  let alive = true;

  const cryptoSyms = (tab === 'crypto' || tab === 'all') ? CRYPTO : [];
  const stopWS = cryptoSyms.length ? startCoinbase(q => onBatch([q]), cryptoSyms) : () => {};

  const fxPairs = (tab === 'forex' || tab === 'all') ? FOREX : [];
  const loopFX = async () => {
    if (!fxPairs.length) return;
    while (alive) {
      try {
        const fx = await fetchFX(fxPairs);
        onBatch(fx);
      } catch { }
      await sleep(POLL_FX_MS);
    }
  };
  loopFX();

  return () => {
    alive = false;
    stopWS();
  };
}
