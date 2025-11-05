import { useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { ScreenerGrid } from '@/components/markets/ScreenerGrid';
import { COLORS } from '@/lib/constants';

type TabType = 'all' | 'indexes' | 'energy' | 'metals' | 'softs' | 'grains' | 'meats' | 'bonds' | 'forex' | 'crypto';

const TABS: { value: TabType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'indexes', label: 'Indexes' },
  { value: 'energy', label: 'Energy' },
  { value: 'metals', label: 'Metals' },
  { value: 'softs', label: 'Softs' },
  { value: 'grains', label: 'Grains' },
  { value: 'meats', label: 'Meats' },
  { value: 'bonds', label: 'Bonds' },
  { value: 'forex', label: 'Forex' },
  { value: 'crypto', label: 'Crypto' },
];

export default function Markets() {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      <DashboardHeader />
      
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: COLORS.text }}>Markets</h1>
            <p className="text-sm mt-1" style={{ color: COLORS.subt }}>Real-time market data from Finviz • Updates every 60s</p>
          </div>
          <div className="flex-shrink-0">
            <input
              type="text"
              placeholder="Search ticker (e.g., AAPL, TSLA)"
              className="px-4 py-2 rounded-lg border text-sm w-64"
              style={{
                borderColor: COLORS.border,
                background: COLORS.panel,
                color: COLORS.text
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const ticker = (e.target as HTMLInputElement).value.trim().toUpperCase();
                  if (ticker) {
                    window.open(`https://finviz.com/quote.ashx?t=${ticker}`, '_blank');
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-6 border-b overflow-x-auto" style={{ borderColor: COLORS.border }}>
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className="px-2 py-3 text-sm font-medium whitespace-nowrap relative transition-colors"
              style={{
                color: activeTab === tab.value ? COLORS.primary : COLORS.text,
              }}
            >
              {tab.label}
              {activeTab === tab.value && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300"
                  style={{ background: COLORS.primary }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <ScreenerGrid tab={activeTab} />
      </main>
    </div>
  );
}
