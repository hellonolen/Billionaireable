import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { coinbaseProvider } from "@/lib/market-data/provider-crypto-coinbase";
import type { Quote, AssetFilter, QuoteUpdate } from "@/lib/market-data/types";
import { TickerCard } from "@/components/markets/TickerCard";
import { COLORS } from "@/lib/constants";
import { DashboardHeader } from "@/components/DashboardHeader";
import { trpc } from "@/lib/trpc";

const ASSET_FILTERS: { value: AssetFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "stocks", label: "Stocks" },
  { value: "indexes", label: "Indexes" },
  { value: "crypto", label: "Crypto" },
  { value: "forex", label: "Forex" },
  { value: "futures", label: "Futures" },
];

const CRYPTO_SYMBOLS = ['BTCUSD', 'ETHUSD', 'SOLUSD'];

export default function Markets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [assetFilter, setAssetFilter] = useState<AssetFilter>("all");
  const [cryptoQuotes, setCryptoQuotes] = useState<Quote[]>([]);

  // Fetch stocks, indexes, futures, forex from backend
  const { data: backendData, isLoading } = trpc.marketsV2.getAllQuotes.useQuery(undefined, {
    refetchInterval: 15000, // Refresh every 15s
  });

  // Subscribe to live crypto via WebSocket
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    CRYPTO_SYMBOLS.forEach((symbol) => {
      const unsub = coinbaseProvider.subscribe(symbol, (update: QuoteUpdate) => {
        setCryptoQuotes((prev) => {
          const existing = prev.find((q) => q.symbol === symbol);
          if (existing) {
            const change = update.price - existing.price;
            const changePercent = (change / existing.price) * 100;

            return prev.map((q) =>
              q.symbol === symbol
                ? {
                    ...q,
                    price: update.price,
                    change,
                    changePercent,
                    volume: update.volume,
                    lastUpdate: update.timestamp,
                  }
                : q
            );
          } else {
            return [
              ...prev,
              {
                symbol,
                name: symbol.replace('USD', '/USD'),
                price: update.price,
                change: 0,
                changePercent: 0,
                volume: update.volume,
                lastUpdate: update.timestamp,
                assetType: 'crypto' as const,
              },
            ];
          }
        });
      });

      unsubscribers.push(unsub);
    });

    return () => unsubscribers.forEach((u) => u());
  }, []);

  // Combine backend data with live crypto
  const allQuotes = useMemo(() => {
    const quotes: Quote[] = [];

    if (backendData) {
      quotes.push(...(backendData.stocks || []));
      quotes.push(...(backendData.indexes || []));
      quotes.push(...(backendData.futures || []));
      quotes.push(...(backendData.forex || []));
    }

    quotes.push(...cryptoQuotes);

    return quotes;
  }, [backendData, cryptoQuotes]);

  const filteredQuotes = useMemo(() => {
    let result = allQuotes;

    // Apply asset filter
    if (assetFilter !== "all") {
      result = result.filter((q) => {
        switch (assetFilter) {
          case "stocks":
            return q.assetType === "stock";
          case "indexes":
            return q.assetType === "index";
          case "crypto":
            return q.assetType === "crypto";
          case "forex":
            return q.assetType === "forex";
          case "futures":
            return q.assetType === "future";
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (q) =>
          q.symbol.toLowerCase().includes(lowerQuery) ||
          q.name.toLowerCase().includes(lowerQuery)
      );
    }

    return result;
  }, [allQuotes, assetFilter, searchQuery]);

  return (
    <div className="min-h-screen" style={{ background: COLORS.bg }}>
      <DashboardHeader />

      <div className="container py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold" style={{ color: COLORS.text }}>
              Markets
            </h1>
            <span
              className="text-xs px-2 py-1 rounded"
              style={{
                background: '#fff',
                color: COLORS.subt,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              Free data (delayed for equities/futures)
            </span>
          </div>
          <p className="text-sm" style={{ color: COLORS.subt }}>
            Real-time market data and indexes
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: COLORS.subt }}
            />
            <input
              type="text"
              placeholder="Search symbol (e.g., AAPL, TSLA, BTCUSD, ^GSPC)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg"
              style={{
                background: '#fff',
                border: `1px solid ${COLORS.border}`,
                color: COLORS.text,
              }}
            />
          </div>
        </div>

        {/* Asset Filters */}
        <div className="mb-6 flex gap-4">
          {ASSET_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setAssetFilter(filter.value)}
              className="px-2 py-2 font-medium transition-all relative"
              style={{
                color:
                  assetFilter === filter.value ? COLORS.primary : COLORS.text,
                background: 'transparent',
              }}
            >
              {filter.label}
              {assetFilter === filter.value && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 transition-all"
                  style={{ background: COLORS.primary }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading && filteredQuotes.length === 0 ? (
          <div
            className="text-center py-12 rounded-lg"
            style={{
              background: '#fff',
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <p style={{ color: COLORS.subt }}>Loading market data...</p>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div
            className="text-center py-12 rounded-lg"
            style={{
              background: '#fff',
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <p style={{ color: COLORS.subt }}>
              {searchQuery ? "No results found" : "No data available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuotes.map((quote) => (
              <TickerCard key={quote.symbol} quote={quote} />
            ))}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-8 text-center text-xs" style={{ color: COLORS.subt }}>
          Live for crypto; delayed 15min for stocks/indexes/futures. FX sampled every 30s.
        </div>
      </div>
    </div>
  );
}
