// === COLOR SYSTEM (3 colors + neutrals) =====================================
// Primary: Royal Blue, Accent: Teal, Secondary: Slate. No dark bg, no pink/yellow/gold.
export const COLORS = {
  primary: "#1F4FD8",
  accent: "#2FB4A8",
  secondary: "#4B5563",
  bg: "#FFFFFF",
  panel: "#F7F9FC",
  border: "#E5E7EB",
  text: "#0F172A",
  subt: "#475569",
};

// === MOCK DATA ===============================================================
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const timeline = months.map((m, i) => ({
  month: m,
  netWorth: 950 + i * 22 + (i % 3 === 0 ? 18 : 0),
  cash: 120 + (i % 5) * 6,
  revenue: 38 + i * 2 + (i % 2),
  ebitda: 12 + i * 1.2,
  irr: 10 + (i % 4) * 2 + (i > 6 ? 3 : 0),
  sentiment: 55 + Math.sin(i) * 10,
}));

export const allocation = [
  { name: "Public Equity", value: 28 },
  { name: "Private Equity", value: 22 },
  { name: "VC / Growth", value: 12 },
  { name: "Real Estate", value: 18 },
  { name: "Cash & Treasuries", value: 14 },
  { name: "Other", value: 6 },
];

export const businesses = [
  { name: "HealthTechCo", revenue: 84, margin: 38, churn: 3.2, growth: 18 },
  { name: "SaaS Infra", revenue: 62, margin: 44, churn: 2.6, growth: 22 },
  { name: "Consumer Brand", revenue: 41, margin: 31, churn: 4.3, growth: 12 },
  { name: "FinServ", revenue: 55, margin: 36, churn: 2.1, growth: 16 },
];

export const pipelineDeals = [
  { deal: "Series B — AI Ops", prob: 0.6, expReturn: 3.2, ttc: "45d", capital: 15 },
  { deal: "Buyout — Specialty Mfg", prob: 0.4, expReturn: 2.1, ttc: "90d", capital: 80 },
  { deal: "Secondary — FinTech", prob: 0.7, expReturn: 1.8, ttc: "30d", capital: 25 },
  { deal: "Seed — Bio Tools", prob: 0.5, expReturn: 6.0, ttc: "60d", capital: 5 },
];

export const timeAlloc = [
  { name: "Strategy", value: 36 },
  { name: "Ops", value: 22 },
  { name: "Deals", value: 18 },
  { name: "People", value: 14 },
  { name: "Personal", value: 10 },
];

export const healthSeries = Array.from({ length: 10 }).map((_, i) => ({
  d: `W${i + 1}`,
  hrv: 58 + (i % 5) * 2 - (i % 3),
  sleep: 7 + ((i % 4) - 2) * 0.2,
}));

export const macro = [
  { k: "Fed Funds", v: "5.25–5.50%" },
  { k: "10Y UST", v: "3.95%" },
  { k: "IG Spread", v: "135bps" },
  { k: "WTI", v: "$79" },
  { k: "EUR/USD", v: "1.08" },
];

export const risk = [
  { type: "Concentration", score: 62 },
  { type: "Counterparty", score: 28 },
  { type: "Liquidity", score: 34 },
  { type: "Regulatory", score: 22 },
  { type: "FX", score: 18 },
];

export const impact = [
  { name: "Education Fund", deployed: 4.2, outcome: "3k students" },
  { name: "Health Initiative", deployed: 2.1, outcome: "12 clinics" },
  { name: "Climate Lab", deployed: 1.0, outcome: "5 pilots" },
];

export const legacy = [
  { name: "Foundation governance refresh", progress: 70 },
  { name: "Book manuscript", progress: 40 },
  { name: "Family charter update", progress: 55 },
];
