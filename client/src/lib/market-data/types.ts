export interface Quote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  lastUpdate: number;
  assetType: 'stock' | 'index' | 'crypto' | 'forex' | 'future';
  sparkline?: number[];
}

export interface QuoteUpdate {
  symbol: string;
  price: number;
  volume?: number;
  timestamp: number;
}

export type AssetFilter = 'all' | 'stocks' | 'indexes' | 'crypto' | 'forex' | 'futures';
