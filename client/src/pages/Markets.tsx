import React, { useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { ScreenerGrid } from '@/components/markets/ScreenerGrid';
import { COLORS } from '@/lib/constants';

type TabType = 'all' | 'stocks' | 'indexes' | 'crypto' | 'forex' | 'futures';

const TABS: { value: TabType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'stocks', label: 'Stocks' },
  { value: 'indexes', label: 'Indexes' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'forex', label: 'Forex' },
  { value: 'futures', label: 'Futures' },
];

export default function Markets() {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      <DashboardHeader />
      
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: COLORS.text }}>Markets</h1>
            <p className="text-sm mt-1" style={{ color: COLORS.subt }}>Real-time market data and indexes</p>
          </div>
          <span className="text-xs px-3 py-1 rounded border" style={{ borderColor: COLORS.border, background: COLORS.panel, color: COLORS.subt }}>
            Free data (delayed for equities/futures)
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
              style={{
                background: 'transparent',
                color: activeTab === tab.value ? COLORS.primary : COLORS.text,
                border: `2px solid ${activeTab === tab.value ? COLORS.primary : COLORS.border}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <ScreenerGrid tab={activeTab} />
      </main>
    </div>
  );
}
