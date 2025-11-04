import { SectionKey } from "@/pages/Dashboard";

export interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "textarea";
  options?: string[];
  placeholder?: string;
  unit?: string;
}

export interface SectionForm {
  title: string;
  fields: FormField[];
}

// Define forms for each section
export const SECTION_FORMS: Record<SectionKey, SectionForm[]> = {
  "Net Worth & Asset Allocation": [
    {
      title: "Net Worth Overview",
      fields: [
        { id: "totalNetWorth", label: "Total Net Worth", type: "number", unit: "$" },
        { id: "liquidAssets", label: "Liquid Assets", type: "number", unit: "$" },
        { id: "realEstate", label: "Real Estate", type: "number", unit: "$" },
        { id: "privateEquity", label: "Private Equity", type: "number", unit: "$" },
      ],
    },
    {
      title: "Asset Allocation",
      fields: [
        { id: "stocks", label: "Stocks %", type: "number", unit: "%" },
        { id: "bonds", label: "Bonds %", type: "number", unit: "%" },
        { id: "realEstatePercent", label: "Real Estate %", type: "number", unit: "%" },
        { id: "crypto", label: "Crypto %", type: "number", unit: "%" },
      ],
    },
  ],
  
  "Cash & Liquidity Runway": [
    {
      title: "Cash Position",
      fields: [
        { id: "cashOnHand", label: "Cash on Hand", type: "number", unit: "$" },
        { id: "monthlyBurn", label: "Monthly Burn Rate", type: "number", unit: "$" },
        { id: "runwayMonths", label: "Runway (Months)", type: "number" },
      ],
    },
  ],

  "Business KPIs": [
    {
      title: "Company Metrics",
      fields: [
        { id: "company1Name", label: "Company 1 Name", type: "text" },
        { id: "company1Revenue", label: "Revenue", type: "number", unit: "$" },
        { id: "company1Margin", label: "Margin", type: "number", unit: "%" },
      ],
    },
    {
      title: "Company 2",
      fields: [
        { id: "company2Name", label: "Company 2 Name", type: "text" },
        { id: "company2Revenue", label: "Revenue", type: "number", unit: "$" },
        { id: "company2Margin", label: "Margin", type: "number", unit: "%" },
      ],
    },
  ],

  "Investment Performance": [
    {
      title: "Portfolio Returns",
      fields: [
        { id: "ytdReturn", label: "YTD Return", type: "number", unit: "%" },
        { id: "oneYearReturn", label: "1-Year Return", type: "number", unit: "%" },
        { id: "threeYearReturn", label: "3-Year Return", type: "number", unit: "%" },
        { id: "fiveYearReturn", label: "5-Year Return", type: "number", unit: "%" },
      ],
    },
  ],

  "Pipeline of Opportunities & Exits": [
    {
      title: "Active Deals",
      fields: [
        { id: "dealsInPipeline", label: "Deals in Pipeline", type: "number" },
        { id: "totalCapital", label: "Total Capital", type: "number", unit: "$" },
        { id: "expectedReturn", label: "Expected Return", type: "number", unit: "x" },
      ],
    },
  ],

  "Key People / Talent": [
    {
      title: "Leadership Team",
      fields: [
        { id: "totalLeadership", label: "Total Leadership", type: "number" },
        { id: "openRoles", label: "Open Roles", type: "number" },
        { id: "retentionRate", label: "Retention Rate", type: "number", unit: "%" },
      ],
    },
  ],

  "Time Allocation & Productivity": [
    {
      title: "Time Tracking",
      fields: [
        { id: "deepWorkHours", label: "Deep Work Hours/Week", type: "number" },
        { id: "meetingsHours", label: "Meetings Hours/Week", type: "number" },
        { id: "adminHours", label: "Admin Hours/Week", type: "number" },
      ],
    },
  ],

  "Personal Health & Cognitive Performance": [
    {
      title: "Health Metrics",
      fields: [
        { id: "avgHRV", label: "Average HRV", type: "number" },
        { id: "avgSleep", label: "Average Sleep (hours)", type: "number" },
        { id: "workoutDays", label: "Workout Days/Week", type: "number" },
      ],
    },
  ],

  "Reputation, Brand & Legal/Regulatory": [
    {
      title: "Brand Metrics",
      fields: [
        { id: "sentimentScore", label: "Sentiment Score", type: "number", unit: "/10" },
        { id: "mediaHits", label: "Media Hits", type: "number" },
        { id: "legalIssues", label: "Legal Issues", type: "number" },
      ],
    },
  ],

  "Macroeconomic & Market": [
    {
      title: "Market Indicators",
      fields: [
        { id: "fedFunds", label: "Fed Funds Rate", type: "number", unit: "%" },
        { id: "tenYearTreasury", label: "10Y Treasury", type: "number", unit: "%" },
        { id: "sp500", label: "S&P 500", type: "number" },
      ],
    },
  ],

  "Network & Deal Flow Quality": [
    {
      title: "Network Stats",
      fields: [
        { id: "introsYTD", label: "Intros YTD", type: "number" },
        { id: "activeCoInvestors", label: "Active Co-investors", type: "number" },
        { id: "qualityScore", label: "Quality Score", type: "select", options: ["Low", "Medium", "High"] },
      ],
    },
  ],

  "Risk Exposures & Hedging": [
    {
      title: "Risk Management",
      fields: [
        { id: "concentrationRisk", label: "Concentration Risk", type: "select", options: ["Low", "Medium", "High"] },
        { id: "counterpartyRisk", label: "Counterparty Risk", type: "select", options: ["Low", "Medium", "High"] },
        { id: "liquidityRisk", label: "Liquidity Risk", type: "select", options: ["Low", "Medium", "High"] },
      ],
    },
  ],

  "Philanthropy, ESG & Impact": [
    {
      title: "Impact Metrics",
      fields: [
        { id: "deployedCapital", label: "Deployed Capital", type: "number", unit: "$" },
        { id: "activeProjects", label: "Active Projects", type: "number" },
        { id: "beneficiaries", label: "Beneficiaries", type: "number" },
      ],
    },
  ],

  "News & Market Intelligence": [
    {
      title: "News Preferences",
      fields: [
        { id: "categories", label: "Tracked Categories", type: "text" },
        { id: "sources", label: "Preferred Sources", type: "text" },
        { id: "keywords", label: "Alert Keywords", type: "text" },
        { id: "frequency", label: "Update Frequency", type: "number", unit: "per day" },
      ],
    },
  ],
  "Personal Goals & Legacy": [
    {
      title: "Goals Tracking",
      fields: [
        { id: "activeProjects", label: "Active Projects", type: "number" },
        { id: "progressPercent", label: "Progress", type: "number", unit: "%" },
        { id: "alignment", label: "Alignment Score", type: "number", unit: "/10" },
      ],
    },
  ],
};
