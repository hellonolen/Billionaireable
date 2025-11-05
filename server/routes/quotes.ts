import { Router } from "express";

const router = Router();

const BASE = 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=';

function chunk<T>(arr: T[], size = 50): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

router.post('/api/quotes', async (req, res) => {
  try {
    const { symbols = [] } = req.body;
    const clean = Array.from(new Set(symbols)).filter(Boolean) as string[];
    
    if (!clean.length) {
      return res.json({ quotes: [] });
    }

    const parts = chunk(clean, 50);
    const responses = await Promise.all(parts.map(async (p) => {
      try {
        const response = await fetch(BASE + encodeURIComponent(p.join(',')));
        if (!response.ok) {
          return { quoteResponse: { result: [] } };
        }
        return await response.json();
      } catch (error) {
        console.error('[Yahoo API] Fetch error:', error);
        return { quoteResponse: { result: [] } };
      }
    }));

    const quotes = responses.flatMap((x: any) => x?.quoteResponse?.result ?? []);
    res.json({ quotes });
  } catch (error) {
    console.error('[Yahoo API] Error:', error);
    res.status(500).json({ quotes: [], error: 'Failed to fetch quotes' });
  }
});

export default router;
