import type { Quote, QuoteUpdate } from './types';

const WS_URL = 'wss://ws-feed.exchange.coinbase.com';
const MAX_SUBSCRIPTIONS = 50;
const HEARTBEAT_INTERVAL = 30000;

type Callback = (update: QuoteUpdate) => void;

class CoinbaseProvider {
  private ws: WebSocket | null = null;
  private callbacks: Map<string, Callback[]> = new Map();
  private subscribed: Set<string> = new Set();
  private reconnectAttempts = 0;
  private reconnectTimeouts = [1000, 2000, 5000, 10000];
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private lastPrices: Map<string, number> = new Map();

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      console.log('[Coinbase] Connected');
      this.reconnectAttempts = 0;
      this.resubscribeAll();
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'ticker' && data.product_id) {
          const symbol = data.product_id.replace('-', '');
          const price = parseFloat(data.price);
          const volume = parseFloat(data.volume_24h);

          if (!isNaN(price)) {
            const update: QuoteUpdate = {
              symbol,
              price,
              volume: !isNaN(volume) ? volume : undefined,
              timestamp: Date.now(),
            };

            const callbacks = this.callbacks.get(symbol);
            if (callbacks) {
              callbacks.forEach((cb) => cb(update));
            }

            this.lastPrices.set(symbol, price);
          }
        }
      } catch (error) {
        console.error('[Coinbase] Message parse error:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('[Coinbase] WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('[Coinbase] Disconnected');
      this.stopHeartbeat();
      this.reconnect();
    };
  }

  private reconnect() {
    const timeout =
      this.reconnectTimeouts[
        Math.min(this.reconnectAttempts, this.reconnectTimeouts.length - 1)
      ];
    this.reconnectAttempts++;

    console.log(`[Coinbase] Reconnecting in ${timeout}ms...`);
    setTimeout(() => this.connect(), timeout);
  }

  private resubscribeAll() {
    if (this.subscribed.size === 0) return;

    const productIds = Array.from(this.subscribed).map((s) =>
      s.replace('USD', '-USD')
    );

    this.send({
      type: 'subscribe',
      product_ids: productIds,
      channels: ['ticker'],
    });
  }

  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' });
      }
    }, HEARTBEAT_INTERVAL);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  subscribe(symbol: string, callback: Callback) {
    if (this.subscribed.size >= MAX_SUBSCRIPTIONS) {
      console.warn('[Coinbase] Max subscriptions reached');
      return () => {};
    }

    if (!this.callbacks.has(symbol)) {
      this.callbacks.set(symbol, []);
    }
    this.callbacks.get(symbol)!.push(callback);

    if (!this.subscribed.has(symbol)) {
      this.subscribed.add(symbol);
      const productId = symbol.replace('USD', '-USD');

      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({
          type: 'subscribe',
          product_ids: [productId],
          channels: ['ticker'],
        });
      }
    }

    return () => this.unsubscribe(symbol, callback);
  }

  unsubscribe(symbol: string, callback: Callback) {
    const callbacks = this.callbacks.get(symbol);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }

      if (callbacks.length === 0) {
        this.callbacks.delete(symbol);
        this.subscribed.delete(symbol);

        const productId = symbol.replace('USD', '-USD');
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.send({
            type: 'unsubscribe',
            product_ids: [productId],
            channels: ['ticker'],
          });
        }
      }
    }
  }

  getLastPrice(symbol: string): number | undefined {
    return this.lastPrices.get(symbol);
  }
}

export const coinbaseProvider = new CoinbaseProvider();

// Auto-connect on import
if (typeof window !== 'undefined') {
  coinbaseProvider.connect();
}
