import { Router } from "express";

const router = Router();

const Y1 = 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=';
const Y2 = 'https://query2.finance.yahoo.com/v7/finance/quote?symbols=';

function chunk<T>(arr: T[], size = 50): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function cleanSymbols(symbols: string[]): string[] {
  return Array.from(new Set(symbols.filter(Boolean).map(s => s.trim()))).slice(0, 300);
}

async function fetchYahooBatch(symbols: string[]) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (compatible; ManusProxy/1.0; +https://billionaireable.com)',
    'Accept': 'application/json, text/plain, */*'
  };

  const chunks = chunk(symbols, 50);
  const results: any[] = [];

  for (const c of chunks) {
    const qs = encodeURIComponent(c.join(','));
    let json: any = null;

    try {
      const r = await fetch(Y1 + qs, { headers });
      if (!r.ok) throw new Error(`y1 status ${r.status}`);
      json = await r.json();
    } catch (e) {
      try {
        const r = await fetch(Y2 + qs, { headers });
        if (!r.ok) throw new Error(`y2 status ${r.status}`);
        json = await r.json();
      } catch (e2) {
        console.error('[quotes] yahoo failure', { err: String(e2), chunk: c });
        continue;
      }
    }

    const arr = json?.quoteResponse?.result ?? [];
    if (Array.isArray(arr)) results.push(...arr);
  }

  return results;
}

// GET: quick browser test
// Example: /api/quotes?symbols=AAPL,MSFT,^GSPC,ES=F
router.get('/api/quotes', async (req, res) => {
  const raw = (req.query.symbols as string) || '';
  const symbols = cleanSymbols(raw.split(','));
  
  if (!symbols.length) {
    return res.json({ quotes: [], note: 'no symbols provided' });
  }
  
  const quotes = await fetchYahooBatch(symbols);
  res.json({ quotes });
});

// POST: app code path
router.post('/api/quotes', async (req, res) => {
  const symbols = cleanSymbols(Array.isArray(req.body?.symbols) ? req.body.symbols : []);
  
  if (!symbols.length) {
    return res.json({ quotes: [], note: 'no symbols provided' });
  }
  
  const quotes = await fetchYahooBatch(symbols);
  res.json({ quotes });
});

export default router;
