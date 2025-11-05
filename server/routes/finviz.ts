import { Router } from "express";
import * as cheerio from "cheerio";

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
    const $ = cheerio.load(html);
    const quotes: FinvizQuote[] = [];
    const now = Date.now();

    // Parse each futures table row
    $('table.table-light tr').each((_: any, row: any) => {
      const $row = $(row);
      const cells = $row.find('td');
      
      if (cells.length < 6) return;
      
      const nameCell = $(cells[0]).text().trim();
      const priceText = $(cells[1]).text().trim();
      const changeText = $(cells[4]).text().trim();
      const changePctText = $(cells[5]).text().trim();
      
      if (!nameCell || !priceText) return;
      
      const price = parseFloat(priceText.replace(/,/g, ''));
      const change = parseFloat(changeText.replace(/,/g, ''));
      const changePct = parseFloat(changePctText.replace(/%/g, ''));
      
      if (isNaN(price)) return;
      
      // Determine asset class from name
      let assetClass = 'futures';
      if (nameCell.includes('Year') || nameCell.includes('Bond')) assetClass = 'bonds';
      else if (['Gold', 'Silver', 'Platinum', 'Copper', 'Palladium'].some(m => nameCell.includes(m))) assetClass = 'metals';
      else if (['Crude', 'Gasoline', 'Heating', 'Natural Gas', 'Ethanol'].some(e => nameCell.includes(e))) assetClass = 'energy';
      else if (['Cocoa', 'Cotton', 'Orange', 'Coffee', 'Lumber', 'Sugar'].some(s => nameCell.includes(s))) assetClass = 'softs';
      else if (['Cattle', 'Hogs'].some(m => nameCell.includes(m))) assetClass = 'meats';
      else if (['Soybean', 'Corn', 'Wheat', 'Rice', 'Oats', 'Canola'].some(g => nameCell.includes(g))) assetClass = 'grains';
      else if (['DJIA', 'S&P', 'Nasdaq', 'Russell', 'Nikkei', 'Stoxx', 'DAX', 'VIX'].some(i => nameCell.includes(i))) assetClass = 'indexes';
      else if (['USD', 'EUR', 'JPY', 'GBP', 'CAD', 'CHF', 'AUD', 'NZD'].some(c => nameCell.includes(c))) assetClass = 'forex';
      else if (nameCell.includes('Bitcoin')) assetClass = 'crypto';
      
      quotes.push({
        symbol: nameCell.replace(/\s+/g, '_').toUpperCase(),
        name: nameCell,
        assetClass,
        price,
        change: isNaN(change) ? 0 : change,
        changePct: isNaN(changePct) ? 0 : changePct,
        time: now
      });
    });

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
