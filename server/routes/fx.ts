import { Router } from "express";

const router = Router();

// Free API: https://www.exchangerate-api.com/docs/free
const BASE_URL = 'https://open.er-api.com/v6/latest';

async function getRates(base: string) {
  try {
    const r = await fetch(`${BASE_URL}/${base}`);
    if (!r.ok) return { rates: {} };
    const data = await r.json();
    return { rates: data.rates || {} };
  } catch {
    return { rates: {} };
  }
}

router.post('/api/fx', async (req, res) => {
  try {
    const { pairs = [] } = req.body as { pairs: string[] };
    const clean = pairs.filter(p => typeof p === 'string' && p.length === 6);
    if (!clean.length) return res.json({ quotes: [] });

    // Get unique base currencies
    const bases = Array.from(new Set(clean.map(s => s.slice(0, 3))));
    
    // Fetch rates for each base
    const ratesData = await Promise.all(bases.map(b => getRates(b)));
    const ratesByBase: Record<string, Record<string, number>> = {};
    bases.forEach((b, i) => {
      ratesByBase[b] = ratesData[i].rates;
    });

    const now = Date.now();
    const quotes = clean.map(sym => {
      const base = sym.slice(0, 3);
      const quote = sym.slice(3);
      const rate = ratesByBase[base]?.[quote];
      
      if (typeof rate !== 'number' || rate <= 0) return null;
      
      return {
        symbol: sym,
        name: `${base}/${quote}`,
        assetClass: 'forex' as const,
        price: rate,
        change: 0,
        changePct: 0,
        time: now
      };
    }).filter(Boolean);

    res.json({ quotes });
  } catch (err) {
    console.error('[FX API] Error:', err);
    res.json({ quotes: [] });
  }
});

export default router;
