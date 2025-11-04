import React from "react";
import { COLORS } from "./constants";
import { TrendingUp, DollarSign, Globe, Briefcase } from "lucide-react";

const NEWS_ITEMS = [
  {
    category: "Markets",
    icon: TrendingUp,
    color: "#10b981",
    headline: "S&P 500 hits new record high",
    time: "2h ago",
  },
  {
    category: "Finance",
    icon: DollarSign,
    color: COLORS.primary,
    headline: "Fed signals rate cuts in Q4",
    time: "4h ago",
  },
  {
    category: "Tech",
    icon: Briefcase,
    color: "#8b5cf6",
    headline: "AI startup valuations surge 40%",
    time: "6h ago",
  },
  {
    category: "Global",
    icon: Globe,
    color: "#f59e0b",
    headline: "Emerging markets show strength",
    time: "8h ago",
  },
];

export function NewsFeedPreview() {
  return (
    <div className="space-y-3">
      {NEWS_ITEMS.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-b-0" style={{ borderColor: COLORS.border }}>
            <div className="p-2 rounded-lg flex-shrink-0" style={{ background: `${item.color}20` }}>
              <Icon className="h-4 w-4" style={{ color: item.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium mb-1" style={{ color: item.color }}>
                {item.category}
              </div>
              <div className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>
                {item.headline}
              </div>
              <div className="text-xs" style={{ color: COLORS.subt }}>
                {item.time}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const NewsFeedDetail = () => {
  const FULL_NEWS = [
    {
      category: "Markets",
      icon: TrendingUp,
      color: "#10b981",
      headline: "S&P 500 hits new record high amid tech rally",
      summary: "Major indices surge as tech stocks lead broad market gains. Nasdaq up 2.1%, driven by AI sector momentum.",
      time: "2 hours ago",
      source: "Bloomberg",
      relevance: "High - Your tech portfolio exposure",
    },
    {
      category: "Finance",
      icon: DollarSign,
      color: COLORS.primary,
      headline: "Federal Reserve signals potential rate cuts in Q4 2024",
      summary: "Fed Chair indicates data-dependent approach with bias toward easing. Market prices in 75bps of cuts by year-end.",
      time: "4 hours ago",
      source: "WSJ",
      relevance: "Critical - Fixed income positioning",
    },
    {
      category: "Tech",
      icon: Briefcase,
      color: "#8b5cf6",
      headline: "AI startup valuations surge 40% year-over-year",
      summary: "Enterprise AI companies see record funding rounds. Late-stage valuations reach new highs as adoption accelerates.",
      time: "6 hours ago",
      source: "TechCrunch",
      relevance: "High - Deal flow opportunities",
    },
    {
      category: "Global",
      icon: Globe,
      color: "#f59e0b",
      headline: "Emerging markets show unexpected strength in Q2",
      summary: "MSCI EM index outperforms developed markets. India and Brazil lead gains amid strong domestic demand.",
      time: "8 hours ago",
      source: "Financial Times",
      relevance: "Medium - Diversification strategy",
    },
    {
      category: "Real Estate",
      icon: Briefcase,
      color: "#ef4444",
      headline: "Commercial real estate faces headwinds from remote work",
      summary: "Office vacancy rates hit 20% in major metros. Conversion to residential gaining traction as solution.",
      time: "10 hours ago",
      source: "CNBC",
      relevance: "High - CRE holdings review needed",
    },
    {
      category: "Crypto",
      icon: DollarSign,
      color: "#f59e0b",
      headline: "Bitcoin ETF inflows reach $2B in single week",
      summary: "Institutional adoption accelerates as spot ETFs gain traction. BlackRock leads with $800M in weekly flows.",
      time: "12 hours ago",
      source: "CoinDesk",
      relevance: "Medium - Alternative assets",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {FULL_NEWS.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow" style={{ borderColor: COLORS.border }}>
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-lg flex-shrink-0" style={{ background: `${item.color}20` }}>
                <Icon className="h-5 w-5" style={{ color: item.color }} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium mb-1" style={{ color: item.color }}>
                  {item.category}
                </div>
                <h3 className="font-semibold text-base mb-2" style={{ color: COLORS.text }}>
                  {item.headline}
                </h3>
              </div>
            </div>
            <p className="text-sm mb-3" style={{ color: COLORS.subt }}>
              {item.summary}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: COLORS.subt }}>{item.source} • {item.time}</span>
            </div>
            <div className="mt-3 pt-3 border-t" style={{ borderColor: COLORS.border }}>
              <div className="text-xs font-medium" style={{ color: COLORS.text }}>
                Relevance: <span style={{ color: item.relevance.startsWith("Critical") || item.relevance.startsWith("High") ? "#ef4444" : "#f59e0b" }}>
                  {item.relevance}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
