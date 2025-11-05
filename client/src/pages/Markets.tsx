import React, { useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { ScreenerGrid } from '@/components/markets/ScreenerGrid';
import { COLORS } from '@/lib/constants';

type TabType = 'all' | 'crypto' | 'forex';

const TABS: { value: TabType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'forex', label: 'Forex' },
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
            <p className="text-sm mt-1" style={{ color: COLORS.subt }}>Real-time market data • Crypto live via Coinbase • Forex updates every 30s</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-6 border-b" style={{ borderColor: COLORS.border }}>
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
                  className="absolute bottom-0 left-0 right-0 h-0.5"
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
