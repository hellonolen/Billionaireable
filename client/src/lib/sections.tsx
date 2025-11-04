import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import { COLORS } from "./constants";
import { MiniStat } from "@/components/DashboardComponents";
import { AlertTriangle } from "lucide-react";

// PREMIUM DATA - Net Worth & Asset Allocation
const assetAllocation = [
  { name: "Public Equity", value: 385, pct: 35.2, change: "+12.3%" },
  { name: "Private Equity", value: 298, pct: 27.3, change: "+8.1%" },
  { name: "Real Estate", value: 187, pct: 17.1, change: "+3.4%" },
  { name: "Fixed Income", value: 109, pct: 10.0, change: "+1.2%" },
  { name: "Alternatives", value: 76, pct: 7.0, change: "+15.7%" },
  { name: "Cash", value: 38, pct: 3.4, change: "-2.1%" },
];

const netWorthTrend = [
  { month: "Jul '24", value: 1.02 },
  { month: "Aug", value: 1.05 },
  { month: "Sep", value: 1.08 },
  { month: "Oct", value: 1.12 },
  { month: "Nov", value: 1.15 },
  { month: "Dec", value: 1.19 },
  { month: "Jan '25", value: 1.23 },
  { month: "Feb", value: 1.28 },
  { month: "Mar", value: 1.32 },
  { month: "Apr", value: 1.38 },
  { month: "May", value: 1.42 },
];

// PREMIUM DATA - Cash & Liquidity
const liquidityData = [
  { month: "May", available: 142, required: 38, buffer: 104 },
  { month: "Jun", available: 138, required: 42, buffer: 96 },
  { month: "Jul", available: 145, required: 39, buffer: 106 },
  { month: "Aug", available: 151, required: 41, buffer: 110 },
  { month: "Sep", available: 148, required: 45, buffer: 103 },
  { month: "Oct", available: 156, required: 43, buffer: 113 },
];

// PREMIUM DATA - Business KPIs
const businessKPIs = [
  { name: "HealthTechCo", revenue: "$85M", growth: "+38%", margin: "42%", employees: 287, arr: "$92M" },
  { name: "SaaS Infra", revenue: "$62M", growth: "+44%", margin: "67%", employees: 143, arr: "$71M" },
  { name: "Consumer Brand", revenue: "$41M", growth: "+31%", margin: "28%", employees: 198, arr: "—" },
];

// PREMIUM DATA - Investment Performance
const investmentPerformance = [
  { year: "2019", portfolio: 18.2, sp500: 31.5 },
  { year: "2020", portfolio: 24.7, sp500: 18.4 },
  { year: "2021", portfolio: 31.3, sp500: 28.7 },
  { year: "2022", portfolio: -8.4, sp500: -18.1 },
  { year: "2023", portfolio: 27.9, sp500: 26.3 },
  { year: "2024", portfolio: 22.1, sp500: 24.2 },
  { year: "YTD", portfolio: 14.8, sp500: 11.3 },
];

// PREMIUM DATA - Pipeline & Opportunities
const pipelineDeals = [
  { name: "AI Infrastructure Series C", stage: "Due Diligence", capital: "$45M", ownership: "12%", irr: "38%", prob: "75%" },
  { name: "Biotech Acquisition", stage: "LOI Signed", capital: "$82M", ownership: "100%", irr: "28%", prob: "85%" },
  { name: "PropTech Series B", stage: "Term Sheet", capital: "$28M", ownership: "18%", irr: "42%", prob: "60%" },
  { name: "Fintech Exit (IPO)", stage: "S-1 Filed", capital: "$125M", ownership: "22%", irr: "156%", prob: "90%" },
];

// PREMIUM DATA - Key People
const keyPeople = [
  { role: "CEO - HealthTech", name: "Sarah Chen", performance: 94, retention: "High", succession: "Ready" },
  { role: "CFO - Portfolio", name: "Michael Torres", performance: 89, retention: "Medium", succession: "In Progress" },
  { role: "CTO - SaaS", name: "David Kim", performance: 96, retention: "High", succession: "Ready" },
  { role: "COO - Consumer", name: "Lisa Anderson", performance: 87, retention: "High", succession: "Not Started" },
];

// PREMIUM DATA - Time Allocation
const timeAllocation = [
  { category: "Deal Sourcing", hours: 18, roi: "$4.2M/hr", optimal: 22 },
  { category: "Portfolio Management", hours: 14, roi: "$1.8M/hr", optimal: 16 },
  { category: "Strategic Planning", hours: 8, roi: "$2.1M/hr", optimal: 12 },
  { category: "Networking", hours: 12, roi: "$3.5M/hr", optimal: 14 },
  { category: "Operations", hours: 6, roi: "$0.4M/hr", optimal: 4 },
  { category: "Admin", hours: 4, roi: "$0.1M/hr", optimal: 2 },
];

// PREMIUM DATA - Health & Performance
const healthMetrics = [
  { date: "Mon", hrv: 78, sleep: 7.8, recovery: 92 },
  { date: "Tue", hrv: 82, sleep: 8.2, recovery: 95 },
  { date: "Wed", hrv: 74, sleep: 6.9, recovery: 85 },
  { date: "Thu", hrv: 79, sleep: 7.5, recovery: 89 },
  { date: "Fri", hrv: 85, sleep: 8.4, recovery: 97 },
  { date: "Sat", hrv: 88, sleep: 8.7, recovery: 98 },
  { date: "Sun", hrv: 81, sleep: 7.9, recovery: 91 },
];

// PREMIUM DATA - Reputation & Media
const mediaMetrics = [
  { outlet: "WSJ", mentions: 3, sentiment: "+92%", reach: "2.1M" },
  { outlet: "Bloomberg", mentions: 5, sentiment: "+88%", reach: "3.4M" },
  { outlet: "Forbes", mentions: 2, sentiment: "+95%", reach: "1.8M" },
  { outlet: "TechCrunch", mentions: 4, sentiment: "+91%", reach: "2.7M" },
];

// PREMIUM DATA - Macro & Market
const macroIndicators = [
  { indicator: "Fed Funds Rate", current: "5.25-5.50%", impact: "Neutral", action: "Monitor" },
  { indicator: "10Y UST", current: "4.38%", impact: "Positive", action: "Duration ↑" },
  { indicator: "USD Index", current: "103.2", impact: "Negative", action: "Hedge FX" },
  { indicator: "VIX", current: "14.2", impact: "Positive", action: "Deploy Cash" },
];

// PREMIUM DATA - Network & Deal Flow
const networkMetrics = [
  { source: "Tier 1 VCs", intros: 24, quality: "High", converted: 8 },
  { source: "Investment Banks", intros: 18, quality: "High", converted: 6 },
  { source: "Family Offices", intros: 31, quality: "Medium", converted: 7 },
  { source: "Founders", intros: 42, quality: "Medium", converted: 12 },
];

// PREMIUM DATA - Risk Exposures
const riskExposures = [
  { risk: "Concentration (Tech)", exposure: "68%", limit: "40%", status: "Over" },
  { risk: "Geographic (US)", exposure: "82%", limit: "70%", status: "Over" },
  { risk: "Liquidity", exposure: "12%", limit: "15%", status: "OK" },
  { risk: "Currency (USD)", exposure: "76%", limit: "60%", status: "Over" },
];

// PREMIUM DATA - Philanthropy
const philanthropyMetrics = [
  { initiative: "Education Fund", deployed: "$7.3M", beneficiaries: "3,200+", impact: "High", taxSavings: "$2.9M" },
  { initiative: "Climate Tech", deployed: "$4.1M", beneficiaries: "—", impact: "Medium", taxSavings: "$1.6M" },
  { initiative: "Healthcare Access", deployed: "$2.8M", beneficiaries: "1,800+", impact: "High", taxSavings: "$1.1M" },
];

// PREMIUM DATA - Market Tickers (Real-time)
const marketTickers = [
  { symbol: "SPX", name: "S&P 500", price: 5847.25, change: +47.82, changePct: +0.82, trend: [5799, 5812, 5825, 5838, 5847] },
  { symbol: "NDX", name: "Nasdaq", price: 20534.18, change: +245.67, changePct: +1.21, trend: [20288, 20345, 20412, 20489, 20534] },
  { symbol: "DJI", name: "Dow Jones", price: 43729.93, change: +259.65, changePct: +0.60, trend: [43470, 43521, 43598, 43672, 43730] },
  { symbol: "BTC", name: "Bitcoin", price: 69420.00, change: +1842.50, changePct: +2.73, trend: [67577, 68123, 68789, 69234, 69420] },
];

const marketNews = [
  { title: "S&P 500 breaks 5,850 resistance on tech rally", time: "2m", impact: "Portfolio +$8.2M", category: "MARKETS" },
  { title: "Fed Chair Powell signals dovish stance, rate cut likely Q4", time: "8m", impact: "Duration opportunity", category: "MACRO" },
  { title: "AI infrastructure valuations surge 40% YoY", time: "12m", impact: "Your deal +$12M gain", category: "TECH" },
  { title: "Emerging markets outperform developed on USD weakness", time: "18m", impact: "Diversification signal", category: "GLOBAL" },
];

// PREMIUM DATA - Personal Goals
const personalGoals = [
  { goal: "Net Worth $1.5B by EOY", current: "$1.42B", target: "$1.5B", progress: 95, status: "On Track" },
  { goal: "120 Workouts This Quarter", current: 113, target: 120, progress: 94, status: "On Track" },
  { goal: "Exit 2 Portfolio Companies", current: 1, target: 2, progress: 50, status: "At Risk" },
];

export const SECTION_MAP = {
  "Net Worth & Asset Allocation": {
    preview: (
      <div className="h-full flex flex-col">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={assetAllocation} 
                dataKey="value" 
                nameKey="name" 
                innerRadius="50%" 
                outerRadius="80%"
                paddingAngle={2}
              >
                {assetAllocation.map((_, i) => (
                  <Cell key={i} fill={[COLORS.primary, "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#6b7280"][i]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `$${value}M`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1 text-xs">
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: COLORS.primary }}>$1.42B</div>
            <div style={{ color: COLORS.subt }}>Total NW</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-green-600">+18.2%</div>
            <div style={{ color: COLORS.subt }}>YTD</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: COLORS.accent }}>$127M</div>
            <div style={{ color: COLORS.subt }}>Δ This Mo</div>
          </div>
        </div>
      </div>
    ),
  },
  "Cash & Liquidity Runway": {
    preview: (
      <div className="h-full flex flex-col">
        <ResponsiveContainer width="100%" height="70%">
          <AreaChart data={liquidityData}>
            <defs>
              <linearGradient id="colorAvail" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke={COLORS.subt} />
            <YAxis tick={{ fontSize: 10 }} stroke={COLORS.subt} />
            <Tooltip />
            <Area type="monotone" dataKey="available" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorAvail)" />
            <Line type="monotone" dataKey="required" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-2 text-xs mt-2">
          <div>
            <div className="font-semibold" style={{ color: COLORS.text }}>$156M</div>
            <div style={{ color: COLORS.subt }}>Available</div>
          </div>
          <div>
            <div className="font-semibold text-orange-600">$43M</div>
            <div style={{ color: COLORS.subt }}>Required</div>
          </div>
          <div>
            <div className="font-semibold text-green-600">42 mo</div>
            <div style={{ color: COLORS.subt }}>Runway</div>
          </div>
        </div>
      </div>
    ),
  },
  "Business KPIs": {
    preview: (
      <div className="h-full overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left border-b" style={{ borderColor: COLORS.border, color: COLORS.subt }}>
              <th className="py-2">Company</th>
              <th className="text-right">Rev</th>
              <th className="text-right">Margin</th>
            </tr>
          </thead>
          <tbody>
            {businessKPIs.map((b, i) => (
              <tr key={i} className="border-b" style={{ borderColor: COLORS.border }}>
                <td className="py-2">
                  <div className="font-medium" style={{ color: COLORS.text }}>{b.name}</div>
                  <div className="text-xs" style={{ color: COLORS.subt }}>{b.employees} employees</div>
                </td>
                <td className="text-right">
                  <div className="font-semibold" style={{ color: COLORS.text }}>{b.revenue}</div>
                  <div className="text-green-600 text-xs">{b.growth}</div>
                </td>
                <td className="text-right font-semibold" style={{ color: COLORS.primary }}>{b.margin}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 pt-2 border-t grid grid-cols-2 gap-2" style={{ borderColor: COLORS.border }}>
          <div>
            <div className="text-xs" style={{ color: COLORS.subt }}>Total ARR</div>
            <div className="font-bold text-sm" style={{ color: COLORS.text }}>$163M</div>
          </div>
          <div>
            <div className="text-xs" style={{ color: COLORS.subt }}>Blended Growth</div>
            <div className="font-bold text-sm text-green-600">+38%</div>
          </div>
        </div>
      </div>
    ),
  },
  "Investment Performance": {
    preview: (
      <div className="h-full flex flex-col">
        <ResponsiveContainer width="100%" height="75%">
          <BarChart data={investmentPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke={COLORS.subt} />
            <YAxis tick={{ fontSize: 10 }} stroke={COLORS.subt} />
            <Tooltip />
            <Bar dataKey="portfolio" fill={COLORS.primary} radius={[4,4,0,0]} name="Your Portfolio" />
            <Bar dataKey="sp500" fill="#9ca3af" radius={[4,4,0,0]} name="S&P 500" />
          </BarChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-2 text-xs mt-2">
          <div>
            <div className="font-semibold text-green-600">+22.1%</div>
            <div style={{ color: COLORS.subt }}>2024</div>
          </div>
          <div>
            <div className="font-semibold text-green-600">+14.8%</div>
            <div style={{ color: COLORS.subt }}>YTD 2025</div>
          </div>
          <div>
            <div className="font-semibold" style={{ color: COLORS.primary }}>+3.5%</div>
            <div style={{ color: COLORS.subt }}>vs S&P</div>
          </div>
        </div>
      </div>
    ),
  },
  "Pipeline of Opportunities & Exits": {
    preview: (
      <div className="h-full overflow-auto text-xs space-y-2">
        {pipelineDeals.slice(0, 3).map((deal, i) => (
          <div key={i} className="p-2 rounded border" style={{ borderColor: COLORS.border, background: "#f9fafb" }}>
            <div className="font-semibold text-xs mb-1" style={{ color: COLORS.text }}>{deal.name}</div>
            <div className="grid grid-cols-3 gap-1 text-xs">
              <div>
                <div style={{ color: COLORS.subt }}>Capital</div>
                <div className="font-semibold" style={{ color: COLORS.primary }}>{deal.capital}</div>
              </div>
              <div>
                <div style={{ color: COLORS.subt }}>IRR</div>
                <div className="font-semibold text-green-600">{deal.irr}</div>
              </div>
              <div>
                <div style={{ color: COLORS.subt }}>Prob</div>
                <div className="font-semibold">{deal.prob}</div>
              </div>
            </div>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t grid grid-cols-2 gap-2" style={{ borderColor: COLORS.border }}>
          <div>
            <div style={{ color: COLORS.subt }}>Total Pipeline</div>
            <div className="font-bold" style={{ color: COLORS.text }}>$280M</div>
          </div>
          <div>
            <div style={{ color: COLORS.subt }}>Weighted IRR</div>
            <div className="font-bold text-green-600">68%</div>
          </div>
        </div>
      </div>
    ),
  },
  "Key People / Talent": {
    preview: (
      <div className="h-full overflow-auto text-xs space-y-2">
        {keyPeople.map((person, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded border" style={{ borderColor: COLORS.border }}>
            <div className="flex-1">
              <div className="font-semibold" style={{ color: COLORS.text }}>{person.name}</div>
              <div style={{ color: COLORS.subt }}>{person.role}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="font-bold text-sm" style={{ color: person.performance >= 90 ? "#10b981" : COLORS.primary }}>{person.performance}</div>
                <div className="text-xs" style={{ color: COLORS.subt }}>Score</div>
              </div>
              <div className={`w-2 h-2 rounded-full ${person.retention === "High" ? "bg-green-500" : "bg-orange-500"}`} />
            </div>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t grid grid-cols-2 gap-2" style={{ borderColor: COLORS.border }}>
          <div>
            <div style={{ color: COLORS.subt }}>Retention</div>
            <div className="font-bold text-green-600">94%</div>
          </div>
          <div>
            <div style={{ color: COLORS.subt }}>Succession</div>
            <div className="font-bold" style={{ color: COLORS.text }}>2/4 Ready</div>
          </div>
        </div>
      </div>
    ),
  },
  "Time Allocation & Productivity": {
    preview: (
      <div className="h-full flex flex-col">
        <ResponsiveContainer width="100%" height="70%">
          <PieChart>
            <Pie 
              data={timeAllocation} 
              dataKey="hours" 
              nameKey="category" 
              innerRadius="45%" 
              outerRadius="75%"
              paddingAngle={3}
            >
              {timeAllocation.map((_, i) => (
                <Cell key={i} fill={[COLORS.primary, "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#6b7280"][i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-1 text-xs mt-2">
          <div className="text-center">
            <div className="font-bold" style={{ color: COLORS.text }}>62h</div>
            <div style={{ color: COLORS.subt }}>This Week</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-600">$4.2M/h</div>
            <div style={{ color: COLORS.subt }}>Top ROI</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-orange-600">-8h</div>
            <div style={{ color: COLORS.subt }}>Optimize</div>
          </div>
        </div>
      </div>
    ),
  },
  "Personal Health & Cognitive Performance": {
    preview: (
      <div className="h-full flex flex-col">
        <ResponsiveContainer width="100%" height="65%">
          <LineChart data={healthMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke={COLORS.subt} />
            <YAxis tick={{ fontSize: 10 }} stroke={COLORS.subt} />
            <Tooltip />
            <Line type="monotone" dataKey="hrv" stroke={COLORS.primary} strokeWidth={2} name="HRV" />
            <Line type="monotone" dataKey="recovery" stroke="#10b981" strokeWidth={2} name="Recovery" />
          </LineChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-4 gap-1 text-xs mt-2">
          <div className="text-center">
            <div className="font-bold" style={{ color: COLORS.primary }}>81</div>
            <div style={{ color: COLORS.subt }}>HRV</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-600">92%</div>
            <div style={{ color: COLORS.subt }}>Recovery</div>
          </div>
          <div className="text-center">
            <div className="font-bold" style={{ color: COLORS.text }}>7.9h</div>
            <div style={{ color: COLORS.subt }}>Sleep</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-600">98</div>
            <div style={{ color: COLORS.subt }}>Readiness</div>
          </div>
        </div>
      </div>
    ),
  },
  "Reputation, Brand & Legal/Regulatory": {
    preview: (
      <div className="h-full overflow-auto text-xs space-y-2">
        {mediaMetrics.map((media, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded border" style={{ borderColor: COLORS.border }}>
            <div>
              <div className="font-semibold" style={{ color: COLORS.text }}>{media.outlet}</div>
              <div style={{ color: COLORS.subt }}>{media.mentions} mentions</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-green-600">{media.sentiment}</div>
              <div style={{ color: COLORS.subt }}>{media.reach} reach</div>
            </div>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t grid grid-cols-3 gap-2" style={{ borderColor: COLORS.border }}>
          <div>
            <div style={{ color: COLORS.subt }}>Sentiment</div>
            <div className="font-bold text-green-600">8.4/10</div>
          </div>
          <div>
            <div style={{ color: COLORS.subt }}>Media Hits</div>
            <div className="font-bold" style={{ color: COLORS.text }}>12 hits</div>
          </div>
          <div>
            <div style={{ color: COLORS.subt }}>Legal</div>
            <div className="font-bold text-green-600">0 issues</div>
          </div>
        </div>
      </div>
    ),
  },
  "Macroeconomic & Market": {
    preview: (
      <div className="h-full overflow-auto text-xs space-y-2">
        {macroIndicators.map((ind, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded border" style={{ borderColor: COLORS.border }}>
            <div className="flex-1">
              <div className="font-semibold text-xs" style={{ color: COLORS.text }}>{ind.indicator}</div>
              <div style={{ color: COLORS.subt }}>{ind.current}</div>
            </div>
            <div className="text-right">
              <div className={`font-semibold ${ind.impact === "Positive" ? "text-green-600" : ind.impact === "Negative" ? "text-red-600" : "text-gray-600"}`}>
                {ind.impact}
              </div>
              <div className="text-xs" style={{ color: COLORS.subt }}>{ind.action}</div>
            </div>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t text-center" style={{ borderColor: COLORS.border }}>
          <div style={{ color: COLORS.subt }}>Portfolio Impact</div>
          <div className="font-bold text-green-600">+$18M (est)</div>
        </div>
      </div>
    ),
  },
  "Network & Deal Flow Quality": {
    preview: (
      <div className="h-full overflow-auto text-xs space-y-2">
        {networkMetrics.map((net, i) => (
          <div key={i} className="p-2 rounded border" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-1">
              <div className="font-semibold" style={{ color: COLORS.text }}>{net.source}</div>
              <div className={`px-2 py-0.5 rounded text-xs ${net.quality === "High" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                {net.quality}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div style={{ color: COLORS.subt }}>Intros YTD</div>
                <div className="font-semibold" style={{ color: COLORS.text }}>{net.intros}</div>
              </div>
              <div>
                <div style={{ color: COLORS.subt }}>Converted</div>
                <div className="font-semibold text-green-600">{net.converted}</div>
              </div>
            </div>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t grid grid-cols-2 gap-2" style={{ borderColor: COLORS.border }}>
          <div>
            <div style={{ color: COLORS.subt }}>Intros YTD</div>
            <div className="font-bold" style={{ color: COLORS.text }}>68 YTD</div>
          </div>
          <div>
            <div style={{ color: COLORS.subt }}>Quality</div>
            <div className="font-bold text-green-600">High</div>
          </div>
        </div>
      </div>
    ),
  },
  "Risk Exposures & Hedging": {
    preview: (
      <div className="h-full">
        <ResponsiveContainer width="100%" height="60%">
          <BarChart layout="vertical" data={riskExposures}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis type="number" tick={{ fontSize: 10 }} stroke={COLORS.subt} />
            <YAxis type="category" dataKey="risk" tick={{ fontSize: 9 }} stroke={COLORS.subt} width={80} />
            <Tooltip />
            <Bar dataKey={(d: any) => parseFloat(d.exposure)} fill={COLORS.primary} radius={[0,4,4,0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 space-y-1 text-xs">
          {riskExposures.filter(r => r.status === "Over").map((risk, i) => (
            <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-orange-50">
              <AlertTriangle className="h-3 w-3 text-orange-600" />
              <div className="flex-1" style={{ color: COLORS.text }}>{risk.risk}</div>
              <div className="font-semibold text-orange-600">{risk.exposure}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  "Philanthropy, ESG & Impact": {
    preview: (
      <div className="h-full overflow-auto text-xs space-y-2">
        {philanthropyMetrics.map((phil, i) => (
          <div key={i} className="p-2 rounded border" style={{ borderColor: COLORS.border }}>
            <div className="font-semibold mb-1" style={{ color: COLORS.text }}>{phil.initiative}</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div style={{ color: COLORS.subt }}>Deployed</div>
                <div className="font-semibold" style={{ color: COLORS.primary }}>{phil.deployed}</div>
              </div>
              <div>
                <div style={{ color: COLORS.subt }}>Tax Savings</div>
                <div className="font-semibold text-green-600">{phil.taxSavings}</div>
              </div>
            </div>
            {phil.beneficiaries !== "—" && (
              <div className="mt-1" style={{ color: COLORS.subt }}>{phil.beneficiaries} beneficiaries</div>
            )}
          </div>
        ))}
        <div className="pt-2 mt-2 border-t grid grid-cols-2 gap-2" style={{ borderColor: COLORS.border }}>
          <div>
            <div style={{ color: COLORS.subt }}>Deployed</div>
            <div className="font-bold" style={{ color: COLORS.text }}>$7.3M</div>
          </div>
          <div>
            <div style={{ color: COLORS.subt }}>Projects</div>
            <div className="font-bold" style={{ color: COLORS.text }}>3</div>
          </div>
        </div>
      </div>
    ),
  },
  "News & Market Intelligence": {
    preview: (
      <div className="h-full flex flex-col text-xs">
        {/* Market Tickers - Bloomberg style */}
        <div className="grid grid-cols-2 gap-1 mb-2 pb-2 border-b" style={{ borderColor: COLORS.border }}>
          {marketTickers.map((ticker, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <div className="font-mono font-bold text-xs" style={{ color: COLORS.text }}>{ticker.symbol}</div>
                <div className="text-xs" style={{ color: COLORS.subt }}>{ticker.name}</div>
              </div>
              <div className="text-right">
                <div className="font-mono font-semibold" style={{ color: COLORS.text }}>{ticker.price.toLocaleString()}</div>
                <div className={`text-xs font-mono ${ticker.change > 0 ? "text-green-600" : "text-red-600"}`}>
                  {ticker.change > 0 ? "+" : ""}{ticker.changePct.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* News Feed - Professional layout */}
        <div className="flex-1 overflow-auto space-y-1.5">
          {marketNews.map((news, i) => (
            <div key={i} className="pb-1.5 border-b" style={{ borderColor: COLORS.border }}>
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <div className="flex-1 font-medium leading-tight" style={{ color: COLORS.text }}>{news.title}</div>
                <div className="text-xs font-mono whitespace-nowrap" style={{ color: COLORS.subt }}>{news.time}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold" style={{ color: COLORS.primary }}>{news.impact}</div>
                <div className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#f3f4f6", color: COLORS.subt }}>{news.category}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Live indicator */}
        <div className="mt-2 pt-1.5 border-t flex items-center justify-between" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <div className="text-xs font-medium" style={{ color: COLORS.subt }}>LIVE</div>
          </div>
          <div className="text-xs font-mono" style={{ color: COLORS.subt }}>Updated 2m ago</div>
        </div>
      </div>
    ),
  },
  "Personal Goals & Legacy": {
    preview: (
      <div className="h-full overflow-auto text-xs space-y-2">
        {personalGoals.map((goal, i) => (
          <div key={i} className="p-2 rounded border" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold flex-1" style={{ color: COLORS.text }}>{goal.goal}</div>
              <div className={`px-2 py-0.5 rounded text-xs ${goal.status === "On Track" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                {goal.status}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div 
                className={`h-2 rounded-full ${goal.progress >= 90 ? "bg-green-500" : goal.progress >= 70 ? "bg-blue-500" : "bg-orange-500"}`}
                style={{ width: `${goal.progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs" style={{ color: COLORS.subt }}>
              <div>{typeof goal.current === 'string' ? goal.current : `${goal.current} of ${goal.target}`}</div>
              <div>{goal.progress}%</div>
            </div>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t grid grid-cols-2 gap-2" style={{ borderColor: COLORS.border }}>
          <div>
            <div style={{ color: COLORS.subt }}>Projects</div>
            <div className="font-bold" style={{ color: COLORS.text }}>3</div>
          </div>
          <div>
            <div style={{ color: COLORS.subt }}>Progress</div>
            <div className="font-bold text-green-600">55%</div>
          </div>
        </div>
      </div>
    ),
  },
};
