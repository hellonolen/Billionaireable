import { Router } from "express";

const router = Router();

const BASE = 'https://api.exchangerate.host/latest';

function unique<T>(a: T[]): T[] {
  return Array.from(new Set(a));
}

function pairsNeeded(list: string[]) {
  const bases = unique(list.map(s => s.slice(0, 3)));
  const quotes = unique(list.map(s => s.slice(3)));
  return { bases, quotes };
}

async function getBase(base: string, symbols: string[]) {
  const url = `${BASE}?base=${base}&symbols=${symbols.join(',')}`;
  const r = await fetch(url, {
    headers: { 'User-Agent': 'ManusFX/1.0' }
  });
  if (!r.ok) return { rates: {} as Record<string, number> };
  return r.json();
}

router.post('/api/fx', async (req, res) => {
  try {
    const { pairs = [] } = req.body as { pairs: string[] };
    const clean = pairs.filter(p => p?.length === 6);
    if (!clean.length) return res.json({ quotes: [] });

    const { bases, quotes } = pairsNeeded(clean);
    const packs = await Promise.all(bases.map(b => getBase(b, quotes)));
    const byBase: Record<string, Record<string, number>> = {};
    bases.forEach((b, i) => { byBase[b] = packs[i]?.rates || {}; });

    const now = Date.now();
    const quotesOut = clean.map(sym => {
      const b = sym.slice(0, 3), q = sym.slice(3);
      const rate = byBase[b]?.[q];
      let price = typeof rate === 'number' ? rate : 0;
      return {
        symbol: sym,
        name: `${b}/${q}`,
        assetClass: 'forex',
        price,
        change: 0,
        changePct: 0,
        time: now
      };
    }).filter(x => x.price > 0);

    res.json({ quotes: quotesOut });
  } catch {
    res.json({ quotes: [] });
  }
});

router.get('/api/fx', async (req, res) => {
  const raw = ((req.query.pairs as string) || '').split(',').filter(Boolean);
  const { pairs = raw } = { pairs: raw };
  const clean = pairs.filter(p => p?.length === 6);
  if (!clean.length) return res.json({ quotes: [] });

  const { bases, quotes } = pairsNeeded(clean);
  const packs = await Promise.all(bases.map(b => getBase(b, quotes)));
  const byBase: Record<string, Record<string, number>> = {};
  bases.forEach((b, i) => { byBase[b] = packs[i]?.rates || {}; });

  const now = Date.now();
  const quotesOut = clean.map(sym => {
    const b = sym.slice(0, 3), q = sym.slice(3);
    const rate = byBase[b]?.[q];
    let price = typeof rate === 'number' ? rate : 0;
    return {
      symbol: sym,
      name: `${b}/${q}`,
      assetClass: 'forex',
      price,
      change: 0,
      changePct: 0,
      time: now
    };
  }).filter(x => x.price > 0);

  res.json({ quotes: quotesOut });
});

export default router;
