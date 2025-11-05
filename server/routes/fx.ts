import { Router } from "express";

const router = Router();

router.post('/api/fx', async (req, res) => {
  try {
    const { base = 'USD', symbols = ['EUR', 'GBP', 'JPY', 'AUD', 'CAD'] } = req.body;
    const url = `https://api.exchangerate.host/latest?base=${base}&symbols=${symbols.join(',')}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      return res.json({ base, rates: {}, ts: Date.now() });
    }
    
    const data = await response.json();
    res.json({ base, rates: data.rates ?? {}, ts: Date.now() });
  } catch (error) {
    console.error('[FX API] Error:', error);
    res.status(500).json({ base: 'USD', rates: {}, ts: Date.now(), error: 'Failed to fetch FX rates' });
  }
});

export default router;
