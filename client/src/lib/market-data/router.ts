// Market data router - fetches from Finviz
export type Quote = {
  symbol: string;
  name: string;
  assetClass: string;
  price: number;
  change: number;
  changePct: number;
  time: number;
};

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const POLL_MS = 60_000; // Poll Finviz every 60 seconds

async function fetchFinviz(): Promise<Quote[]> {
  try {
    const r = await fetch('/api/finviz');
    if (!r.ok) return [];
    const j = await r.json();
    return j.quotes ?? [];
  } catch (error) {
    console.error('[Market Data] Error fetching Finviz:', error);
    return [];
  }
}

export function filterByTab(quotes: Quote[], tab: string): Quote[] {
  if (tab === 'all') return quotes;
  
  // Map tab names to asset classes
  const assetClassMap: Record<string, string[]> = {
    indexes: ['indexes'],
    stocks: ['stock'],
    crypto: ['crypto'],
    forex: ['forex'],
    futures: ['futures'],
    energy: ['energy'],
    metals: ['metals'],
    softs: ['softs'],
    grains: ['grains'],
    meats: ['meats'],
    bonds: ['bonds'],
  };
  
  const allowedClasses = assetClassMap[tab] || [];
  return quotes.filter(q => allowedClasses.includes(q.assetClass));
}

export async function loadInitial(tab: string) {
  const all = await fetchFinviz();
  return filterByTab(all, tab);
}

export function startLive(tab: string, onBatch: (q: Quote[]) => void) {
  let alive = true;

  const loop = async () => {
    while (alive) {
      try {
        const all = await fetchFinviz();
        const filtered = filterByTab(all, tab);
        onBatch(filtered);
      } catch { }
      await sleep(POLL_MS);
    }
  };
  loop();

  return () => {
    alive = false;
  };
}
