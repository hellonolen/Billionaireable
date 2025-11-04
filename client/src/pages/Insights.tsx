import React, { useState } from "react";
import { COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Link } from "wouter";
import { TrendingUp, TrendingDown, AlertTriangle, Brain, Send, Share2 } from "lucide-react";
import { toast } from "sonner";
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ComposedChart
} from "recharts";

const INSIGHTS = [
  {
    type: "trend",
    color: "#10b981",
    title: "Net Worth Accelerating",
    description: "Your net worth growth rate increased 23% this quarter compared to last quarter.",
    confidence: 92,
    category: "Financial",
  },
  {
    type: "correlation",
    color: COLORS.primary,
    title: "Sleep Quality Impacts Performance",
    description: "Your HRV is 18% higher on days following 7+ hours of sleep. Consider prioritizing sleep for better recovery.",
    confidence: 87,
    category: "Health",
  },
  {
    type: "anomaly",
    color: "#f59e0b",
    title: "Unusual Expense Pattern Detected",
    description: "Business expenses increased 45% in the last 30 days. Review recent transactions.",
    confidence: 78,
    category: "Financial",
  },
  {
    type: "prediction",
    color: "#8b5cf6",
    title: "Projected to Hit $1.5B by Q4",
    description: "Based on current growth trajectory and market conditions, net worth forecast shows strong upward trend.",
    confidence: 81,
    category: "Forecast",
  },
  {
    type: "trend",
    color: "#ef4444",
    title: "Workout Frequency Declining",
    description: "Exercise sessions down 30% this month. Consider scheduling dedicated workout time.",
    confidence: 95,
    category: "Health",
  },
  {
    type: "correlation",
    color: COLORS.primary,
    title: "Deal Flow Quality Peaks on Tuesdays",
    description: "Your highest-quality introductions happen on Tuesdays between 10am-2pm. Optimize calendar accordingly.",
    confidence: 73,
    category: "Business",
  },
];

const SECTOR_EXPOSURE = [
  { sector: "Technology", allocation: 28.5, benchmark: 22.0, performance: "+18.2%" },
  { sector: "Healthcare", allocation: 15.2, benchmark: 14.5, performance: "+12.4%" },
  { sector: "Finance", allocation: 12.8, benchmark: 15.2, performance: "+8.9%" },
  { sector: "Real Estate", allocation: 18.3, benchmark: 12.0, performance: "+14.7%" },
  { sector: "Consumer", allocation: 10.5, benchmark: 13.5, performance: "+6.3%" },
  { sector: "Energy", allocation: 8.2, benchmark: 10.8, performance: "+22.1%" },
  { sector: "Other", allocation: 6.5, benchmark: 12.0, performance: "+4.2%" },
];

const RISK_METRICS = [
  { metric: "Portfolio Beta", value: "0.92", benchmark: "1.00", status: "Lower Risk" },
  { metric: "Sharpe Ratio", value: "1.85", benchmark: "1.20", status: "Outperforming" },
  { metric: "Max Drawdown", value: "-8.2%", benchmark: "-12.5%", status: "Better" },
  { metric: "Volatility (30d)", value: "12.4%", benchmark: "15.8%", status: "Lower" },
  { metric: "Correlation to S&P", value: "0.78", benchmark: "1.00", status: "Diversified" },
];

export default function Insights() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([
    { role: "assistant", content: "Welcome. I'm here to help you see what matters and guide you forward. Let me analyze your data and share what I find." }
  ]);

  // Proactive AI insights - automatically send insights without user prompting
  React.useEffect(() => {
    const proactiveInsights = [
      { delay: 3000, message: "**Financial Alert**: Your net worth increased 3.2% this week, driven primarily by tech stock gains (+$38M). Consider rebalancing if concentration exceeds your 40% threshold." },
      { delay: 8000, message: "**Health Insight**: Your HRV has been consistently above 75 for 7 days straight - excellent recovery! This correlates with your 8+ hour sleep pattern. Keep it up!" },
      { delay: 13000, message: "**Market Context**: Fed rate cut probability jumped to 78% for Q4. Your fixed income allocation (22%) may benefit. Consider reviewing duration exposure with your advisor." },
      { delay: 18000, message: "**Risk Alert**: Detected unusual concentration in Tech sector (68% of public equity). Historical volatility suggests diversification opportunity. Would you like me to model scenarios?" },
      { delay: 23000, message: "**Goal Progress**: You're 94% toward your Q1 fitness goal (120 workouts). Just 7 more sessions to hit your target! Your consistency is impressive." },
    ];

    const timers = proactiveInsights.map(insight => 
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: "assistant", content: insight.message }]);
      }, insight.delay)
    );

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);
  
  const categories = ["All", "Financial", "Health", "Business", "Forecast"];

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your data, your HRV has improved by 18% over the past 30 days, with the highest readings on days following 7+ hours of sleep.",
        "I've analyzed your sleep patterns. You average 7.2 hours per night, with best quality sleep occurring when you go to bed before 10:30 PM.",
        "Your workout consistency is strong at 4.2 sessions per week. Recovery metrics show optimal performance when you take 1-2 rest days between intense sessions.",
        "Net worth growth is accelerating at 23% quarter-over-quarter. The primary drivers are investment returns (65%) and business revenue growth (35%).",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { role: "assistant", content: randomResponse }]);
    }, 1000);
  };

  const filteredInsights = selectedCategory === "All" 
    ? INSIGHTS 
    : INSIGHTS.filter(i => i.category === selectedCategory);

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      {/* Header */}
      <DashboardHeader />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>
              Insights
            </h1>
            <p className="text-sm" style={{ color: COLORS.subt }}>
              See patterns, understand trends, and navigate your path forward
            </p>
          </div>
          <button
            onClick={() => toast.success("Share link created and copied to clipboard")}
            className="relative text-sm font-medium group flex items-center gap-2"
            style={{ color: COLORS.text }}
          >
            <Share2 className="h-4 w-4" />
            Share Insights
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
          </button>
        </div>

        {/* Risk Metrics */}
        <div className="bg-white border rounded-xl p-6 mb-6" style={{ borderColor: COLORS.border }}>
          <h2 className="font-semibold text-lg mb-4" style={{ color: COLORS.text }}>Risk Analysis & Portfolio Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RISK_METRICS.map((metric, idx) => (
              <div key={idx} className="border rounded-lg p-4" style={{ borderColor: COLORS.border }}>
                <div className="text-xs mb-1" style={{ color: COLORS.subt }}>{metric.metric}</div>
                <div className="text-2xl font-bold mb-1" style={{ color: COLORS.text }}>{metric.value}</div>
                <div className="flex items-center justify-between">
                  <div className="text-xs" style={{ color: COLORS.subt }}>Benchmark: {metric.benchmark}</div>
                  <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">{metric.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
              style={{
                background: selectedCategory === cat ? COLORS.primary : "white",
                color: selectedCategory === cat ? "white" : COLORS.text,
                border: `1px solid ${selectedCategory === cat ? COLORS.primary : COLORS.border}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* AI Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {filteredInsights.map((insight, index) => {
            return (
              <div
                key={index}
                className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow"
                style={{ borderColor: COLORS.border }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-1 h-full rounded-full flex-shrink-0"
                    style={{ background: insight.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold" style={{ color: COLORS.text }}>{insight.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100" style={{ color: COLORS.subt }}>
                        {insight.confidence}% confident
                      </span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: COLORS.subt }}>{insight.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: `${insight.color}20`, color: insight.color }}>
                        {insight.category}
                      </span>
                      <button className="text-xs font-medium hover:underline" style={{ color: COLORS.primary }}>
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sector Exposure vs Benchmark - MOVED HERE */}
        <div className="bg-white border rounded-xl p-6 mb-6" style={{ borderColor: COLORS.border }}>
          <h2 className="font-semibold text-lg mb-4" style={{ color: COLORS.text }}>Sector Allocation vs Benchmark</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: COLORS.border }}>
                  <th className="text-left py-3 px-2 font-semibold" style={{ color: COLORS.text }}>Sector</th>
                  <th className="text-right py-3 px-2 font-semibold" style={{ color: COLORS.text }}>Your Allocation</th>
                  <th className="text-right py-3 px-2 font-semibold" style={{ color: COLORS.text }}>Benchmark</th>
                  <th className="text-right py-3 px-2 font-semibold" style={{ color: COLORS.text }}>Difference</th>
                  <th className="text-right py-3 px-2 font-semibold" style={{ color: COLORS.text }}>Performance YTD</th>
                </tr>
              </thead>
              <tbody>
                {SECTOR_EXPOSURE.map((row, idx) => {
                  const diff = row.allocation - row.benchmark;
                  return (
                    <tr key={idx} className="border-b" style={{ borderColor: COLORS.border }}>
                      <td className="py-3 px-2 font-medium" style={{ color: COLORS.text }}>{row.sector}</td>
                      <td className="text-right py-3 px-2" style={{ color: COLORS.text }}>{row.allocation}%</td>
                      <td className="text-right py-3 px-2" style={{ color: COLORS.subt }}>{row.benchmark}%</td>
                      <td className={`text-right py-3 px-2 font-mono ${diff > 0 ? "text-blue-600" : "text-gray-500"}`}>
                        {diff > 0 ? "+" : ""}{diff.toFixed(1)}%
                      </td>
                      <td className={`text-right py-3 px-2 font-mono ${row.performance.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                        {row.performance}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Chat Interface */}
        <div className="bg-white border rounded-xl p-6" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-6 w-6" style={{ color: COLORS.primary }} />
             <h3 className="font-semibold text-lg" style={{ color: COLORS.text }}>Ask Billionaireable</h3>
          </div>
          
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg ${msg.role === "user" ? "ml-8" : "mr-8"}`}
                style={{
                  background: msg.role === "user" ? COLORS.primary : "#f3f4f6",
                  color: msg.role === "user" ? "white" : COLORS.text,
                }}
              >
                <div className="text-xs font-medium mb-1" style={{ opacity: 0.8 }}>
                  {msg.role === "user" ? "You" : "Billionaireable"}
                </div>
                <div className="text-sm">{msg.content}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about your health trends, patterns, or correlations..."
              className="flex-1 px-4 py-2 border rounded-lg text-sm"
              style={{ borderColor: COLORS.border }}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{ background: COLORS.primary, color: "white" }}
            >
              <Send className="h-4 w-4" />
              Ask
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
