import { Quote } from '@/lib/market-data/router';
import { COLORS } from '@/lib/constants';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface TickerCardProps {
  quote: Quote;
}

export function TickerCard({ quote }: TickerCardProps) {
  const isPositive = quote.changePct >= 0;
  const changeColor = isPositive ? '#16a34a' : '#dc2626';

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
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow" style={{ borderColor: COLORS.border, background: COLORS.panel }}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-semibold" style={{ color: COLORS.text }}>{quote.symbol}</div>
          {quote.name && <div className="text-sm truncate" style={{ color: COLORS.subt }}>{quote.name}</div>}
        </div>
        <span className="text-xs uppercase" style={{ color: COLORS.subt }}>{quote.assetClass}</span>
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold" style={{ color: COLORS.text }}>
          ${formatPrice(quote.price)}
        </div>

        <div className="flex items-center gap-1 mt-1" style={{ color: changeColor }}>
          {isPositive ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
          <span className="font-medium">
            {isPositive ? '+' : ''}
            {quote.change.toFixed(2)} ({isPositive ? '+' : ''}
            {quote.changePct.toFixed(2)}%)
          </span>
        </div>
      </div>



      <div className="mt-2 text-xs" style={{ color: COLORS.subt }}>
        {quote.assetClass === 'crypto' ? 'Live' : 'Delayed 15min'} • {new Date(quote.time).toLocaleTimeString()}
      </div>
    </div>
  );
}
