'use client';
import { useEffect, useMemo, useState } from 'react';
import { loadInitial, startLive, Quote } from '@/lib/market-data/router';
import { TickerCard } from './TickerCard';
import { COLORS } from '@/lib/constants';

interface ScreenerGridProps {
  tab: string;
}

export function ScreenerGrid({ tab }: ScreenerGridProps) {
  const [data, setData] = useState<Record<string, Quote>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    // Load first batch immediately
    loadInitial(tab).then((initial) => {
      if (!mounted) return;
      setData(Object.fromEntries(initial.map(q => [q.symbol, q])));
      setLoading(false);
    });

    // Start polling for updates
    const stop = startLive(tab, (batch: Quote[]) => {
      setData(d => {
        const newData = { ...d };
        batch.forEach((q: Quote) => {
          newData[q.symbol] = { ...(newData[q.symbol] || {} as any), ...q };
        });
        return newData;
      });
    });

    return () => {
      mounted = false;
      stop();
    };
  }, [tab]);

  const list = useMemo(() => Object.values(data), [data]);

  if (loading) {
    return (
      <div className="rounded-xl border p-16 text-center" style={{ borderColor: COLORS.border, background: COLORS.panel, color: COLORS.subt }}>
        Loading free market data…
      </div>
    );
  }

  if (!list.length) {
    return (
      <div className="rounded-xl border p-16 text-center" style={{ borderColor: COLORS.border, background: COLORS.panel, color: COLORS.subt }}>
        No data available for this tab
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {list.map(q => (
        <TickerCard key={q.symbol} quote={q} />
      ))}
    </div>
  );
}
