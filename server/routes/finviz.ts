import { Router } from "express";

const router = Router();

const FINVIZ_FUTURES_URL = 'https://finviz.com/futures.ashx';

interface FinvizQuote {
  symbol: string;
  name: string;
  assetClass: string;
  price: number;
  change: number;
  changePct: number;
  time: number;
}

async function scrapeFinviz(): Promise<FinvizQuote[]> {
  try {
    const response = await fetch(FINVIZ_FUTURES_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) return [];
    
    const html = await response.text();
    
    // Extract the tiles JSON object from the JavaScript
    const tilesMatch = html.match(/var tiles = (\{[\s\S]+?\});/);
    if (!tilesMatch) return [];
    
    const tilesData = JSON.parse(tilesMatch[1]);
    const quotes: FinvizQuote[] = [];
    const now = Date.now();

    // Process each ticker
    for (const [ticker, data] of Object.entries(tilesData)) {
      const item = data as any;
      
      const name = item.label || ticker;
      const price = item.last || 0;
      const change = item.change || 0;
      const prevClose = item.prevClose || price;
      const changePct = prevClose > 0 ? (change / prevClose) * 100 : 0;
      
      // Determine asset class from ticker or name
      let assetClass = 'futures';
      if (['ZB', 'ZN', 'ZF', 'ZT'].includes(ticker)) assetClass = 'bonds';
      else if (['GC', 'SI', 'PL', 'HG', 'PA'].includes(ticker)) assetClass = 'metals';
      else if (['CL', 'QA', 'RB', 'HO', 'NG', 'ZK'].includes(ticker)) assetClass = 'energy';
      else if (['CC', 'CT', 'JO', 'KC', 'LB', 'SB'].includes(ticker)) assetClass = 'softs';
      else if (['LC', 'FC', 'LH'].includes(ticker)) assetClass = 'meats';
      else if (['ZS', 'ZM', 'ZL', 'ZC', 'ZW', 'ZR', 'ZO', 'RS'].includes(ticker)) assetClass = 'grains';
      else if (['YM', 'ES', 'NQ', 'RTY', 'NKD', 'FESX', 'FDAX', 'VX'].includes(ticker)) assetClass = 'indexes';
      else if (['DX', '6E', '6J', '6B', '6C', '6S', '6A', '6N'].includes(ticker)) assetClass = 'forex';
      else if (name.includes('Bitcoin')) assetClass = 'crypto';
      
      quotes.push({
        symbol: ticker,
        name,
        assetClass,
        price,
        change,
        changePct,
        time: now
      });
    }

    return quotes;
  } catch (error) {
    console.error('[Finviz Scraper] Error:', error);
    return [];
  }
}

router.get('/api/finviz', async (req, res) => {
  const quotes = await scrapeFinviz();
  res.json({ quotes });
});

export default router;
