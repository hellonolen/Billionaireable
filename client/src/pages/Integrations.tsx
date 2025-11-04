import { useState } from "react";
import { COLORS } from "@/lib/constants";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Check, Zap } from "lucide-react";

const INTEGRATIONS = [
  // Lab & Medical
  { id: "quest", name: "Quest Diagnostics", category: "Lab & Medical", description: "Automated bloodwork and lab results import", premium: false },
  { id: "labcorp", name: "LabCorp", category: "Lab & Medical", description: "Lab test results and biomarker tracking", premium: false },
  { id: "vital-api", name: "Vital API", category: "Lab & Medical", description: "Aggregate lab data from multiple providers", premium: true },
  { id: "any-lab", name: "Any Lab Test Now", category: "Lab & Medical", description: "Direct-to-consumer lab testing", premium: false },
  
  // Wearables & Health
  { id: "apple-health", name: "Apple Health", category: "Wearables & Health", description: "HRV, VO2 Max, sleep, workouts, and vitals", premium: false },
  { id: "whoop", name: "WHOOP", category: "Wearables & Health", description: "Strain, recovery, sleep performance, HRV", premium: false },
  { id: "oura", name: "Oura Ring", category: "Wearables & Health", description: "Sleep quality, readiness score, HRV tracking", premium: false },
  { id: "garmin", name: "Garmin Connect", category: "Wearables & Health", description: "VO2 Max, training load, fitness metrics", premium: false },
  { id: "fitbit", name: "Fitbit", category: "Wearables & Health", description: "Steps, sleep, heart rate, activity tracking", premium: false },
  { id: "google-fit", name: "Google Fit", category: "Wearables & Health", description: "Activity, heart rate, and wellness data", premium: false },
  
  // Financial
  { id: "plaid", name: "Plaid", category: "Financial", description: "Bank accounts, transactions, net worth tracking", premium: false },
  { id: "stripe", name: "Stripe", category: "Financial", description: "Payment processing and business revenue", premium: false },
  { id: "quickbooks", name: "QuickBooks", category: "Financial", description: "Business accounting and expense management", premium: false },
  { id: "coinbase", name: "Coinbase", category: "Financial", description: "Cryptocurrency portfolio tracking", premium: false },
  { id: "robinhood", name: "Robinhood", category: "Financial", description: "Stock and options portfolio", premium: true },
  { id: "interactive-brokers", name: "Interactive Brokers", category: "Financial", description: "Advanced trading and portfolio analytics", premium: true },
  
  // Business & Analytics
  { id: "google-analytics", name: "Google Analytics", category: "Business & Analytics", description: "Website traffic and user behavior insights", premium: false },
  { id: "salesforce", name: "Salesforce", category: "Business & Analytics", description: "CRM data, pipeline, and sales metrics", premium: true },
  { id: "hubspot", name: "HubSpot", category: "Business & Analytics", description: "Marketing, sales, and customer analytics", premium: false },
  { id: "shopify", name: "Shopify", category: "Business & Analytics", description: "E-commerce sales and inventory data", premium: false },
  
  // Productivity & Time
  { id: "google-calendar", name: "Google Calendar", category: "Productivity & Time", description: "Time allocation, meetings, and scheduling", premium: false },
  { id: "rescuetime", name: "RescueTime", category: "Productivity & Time", description: "Productivity tracking and focus time analysis", premium: false },
  { id: "toggl", name: "Toggl Track", category: "Productivity & Time", description: "Time tracking for projects and tasks", premium: false },
  { id: "notion", name: "Notion", category: "Productivity & Time", description: "Workspace and project management data", premium: true },
  
  // Market Data
  { id: "alpha-vantage", name: "Alpha Vantage", category: "Market Data", description: "Stock prices, forex, and crypto market data", premium: false },
  { id: "bloomberg", name: "Bloomberg Terminal", category: "Market Data", description: "Professional market data and analytics", premium: true },
  { id: "yahoo-finance", name: "Yahoo Finance", category: "Market Data", description: "Stock quotes, news, and market trends", premium: false },
];

export default function Integrations() {
  const [connected, setConnected] = useState<Set<string>>(new Set());

  const toggleConnection = (id: string) => {
    setConnected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const categories = [
    "Lab & Medical",
    "Wearables & Health", 
    "Financial", 
    "Business & Analytics", 
    "Productivity & Time",
    "Market Data"
  ];

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      {/* Header */}
      <DashboardHeader />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>
            Data Integrations
          </h1>
          <p className="text-sm" style={{ color: COLORS.subt }}>
            Connect your health labs, wearables, financial accounts, and business tools to automate data collection
          </p>
        </div>

        {/* Integration Categories */}
        {categories.map(category => {
          const items = INTEGRATIONS.filter(i => i.category === category);
          return (
            <div key={category} className="mb-8">
              <h2 className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(integration => {
                  const isConnected = connected.has(integration.id);
                  return (
                    <div
                      key={integration.id}
                      className="bg-white border rounded-xl p-5 transition-shadow hover:shadow-md relative"
                      style={{ borderColor: COLORS.border }}
                    >
                      {/* Premium Badge */}
                      {integration.premium && (
                        <div className="absolute top-3 right-3">
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                            <Zap className="h-3 w-3" />
                            <span className="text-xs font-medium">Pro</span>
                          </div>
                        </div>
                      )}

                      <h3 className="font-semibold text-base mb-2 pr-16" style={{ color: COLORS.text }}>
                        {integration.name}
                      </h3>
                      <p className="text-sm mb-4 leading-relaxed" style={{ color: COLORS.subt }}>
                        {integration.description}
                      </p>
                      
                      <button
                        onClick={() => toggleConnection(integration.id)}
                        className="relative text-sm font-medium group flex items-center gap-2"
                        style={{ color: isConnected ? '#10b981' : COLORS.text }}
                      >
                        {isConnected && <Check className="h-4 w-4" />}
                        {isConnected ? "Connected" : "Connect"}
                        <span
                          className="absolute bottom-0 left-0 w-full h-0.5 scale-x-0 group-hover:scale-x-100 transition-all"
                          style={{ background: isConnected ? '#10b981' : '#3b82f6', transformOrigin: 'left' }}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Info Section */}
        <div className="bg-white border rounded-xl p-6 mt-8" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.text }}>
            About Data Integrations
          </h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: COLORS.subt }}>
            Integrations automatically sync your data to keep your dashboard up-to-date without manual entry. 
            All connections use secure OAuth authentication and encrypted data transfer. You can disconnect any integration at any time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
              <span style={{ color: COLORS.subt }}>
                <strong style={{ color: COLORS.text }}>Lab & Medical:</strong> Automatic bloodwork import from major providers
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              <span style={{ color: COLORS.subt }}>
                <strong style={{ color: COLORS.text }}>Wearables:</strong> Real-time health metrics from fitness trackers
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
              <span style={{ color: COLORS.subt }}>
                <strong style={{ color: COLORS.text }}>Financial:</strong> Net worth, transactions, and portfolio tracking
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
              <span style={{ color: COLORS.subt }}>
                <strong style={{ color: COLORS.text }}>Business:</strong> Revenue, analytics, and CRM data
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
