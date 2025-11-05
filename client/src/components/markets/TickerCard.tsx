import type { Quote } from "@/lib/market-data/types";
import { ArrowUp, ArrowDown } from "lucide-react";

interface TickerCardProps {
  quote: Quote;
}

export function TickerCard({ quote }: TickerCardProps) {
  const isPositive = quote.changePercent >= 0;
  const changeColor = isPositive ? "text-green-600" : "text-red-600";
  const bgColor = isPositive ? "bg-green-50" : "bg-red-50";

  const formatPrice = (price: number) => {
    if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 1) return price.toFixed(2);
    return price.toFixed(4);
  };

  const formatVolume = (vol: number) => {
    if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B`;
    if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M`;
    if (vol >= 1e3) return `${(vol / 1e3).toFixed(2)}K`;
    return vol.toString();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-semibold text-gray-900">{quote.symbol}</div>
          <div className="text-sm text-gray-500 truncate">{quote.name}</div>
        </div>
        <span className="text-xs text-gray-400 uppercase">{quote.assetType}</span>
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold text-gray-900">
          ${formatPrice(quote.price)}
        </div>

        <div className={`flex items-center gap-1 mt-1 ${changeColor}`}>
          {isPositive ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
          <span className="font-medium">
            {isPositive ? '+' : ''}
            {quote.change.toFixed(2)} ({isPositive ? '+' : ''}
            {quote.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      {quote.volume && (
        <div className="mt-3 text-xs text-gray-500">
          Vol: {formatVolume(quote.volume)}
        </div>
      )}

      <div className="mt-2 text-xs text-gray-400">
        {quote.assetType === 'crypto' ? 'Live' : 'Delayed 15min'}
      </div>
    </div>
  );
}
