import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { COLORS, timeline, allocation, businesses, timeAlloc, healthSeries, macro } from "./constants";
import { MiniStat } from "@/components/DashboardComponents";
import { NewsFeedPreview } from "./newsFeedSection";
import { trpc } from "./trpc";

/**
 * Data-driven section components that fetch real data from database
 * Falls back to mock data if no user data exists
 */

interface SectionPreviewProps {
  sectionKey: string;
}

export const NetWorthPreview: React.FC<SectionPreviewProps> = ({ sectionKey }) => {
  const { data: savedData } = trpc.dashboard.getSection.useQuery({ sectionKey });
  
  // Parse saved data or use mock
  const chartData = React.useMemo(() => {
    if (savedData?.data) {
      try {
        const parsed = JSON.parse(savedData.data);
        // Extract allocation data if it exists
        if (parsed.allocation) return parsed.allocation;
      } catch (e) {
        console.error("Failed to parse data", e);
      }
    }
    return allocation; // fallback to mock
  }, [savedData]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={60}>
          {chartData.map((_: any, i: number) => (
            <Cell key={i} fill={[COLORS.primary, COLORS.accent, COLORS.secondary, "#93C5FD", "#A7F3D0", "#E5E7EB"][i % 6]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const CashRunwayPreview: React.FC<SectionPreviewProps> = ({ sectionKey }) => {
  const { data: savedData } = trpc.dashboard.getSection.useQuery({ sectionKey });
  
  const chartData = React.useMemo(() => {
    if (savedData?.data) {
      try {
        const parsed = JSON.parse(savedData.data);
        if (parsed.timeline) return parsed.timeline;
      } catch (e) {
        console.error("Failed to parse data", e);
      }
    }
    return timeline;
  }, [savedData]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid stroke={COLORS.border} />
        <XAxis dataKey="month" hide />
        <YAxis hide />
        <Tooltip />
        <Line type="monotone" dataKey="cash" stroke={COLORS.accent} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const BusinessKPIsPreview: React.FC<SectionPreviewProps> = ({ sectionKey }) => {
  const { data: savedData } = trpc.dashboard.getSection.useQuery({ sectionKey });
  
  const tableData = React.useMemo(() => {
    if (savedData?.data) {
      try {
        const parsed = JSON.parse(savedData.data);
        if (parsed.businesses) return parsed.businesses;
      } catch (e) {
        console.error("Failed to parse data", e);
      }
    }
    return businesses;
  }, [savedData]);

  return (
    <div className="overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left" style={{ color: COLORS.subt }}>
            <th className="py-1">Company</th>
            <th>Rev</th>
            <th>Margin</th>
          </tr>
        </thead>
        <tbody>
          {tableData.slice(0, 3).map((b: any, i: number) => (
            <tr key={i} className="border-t" style={{ borderColor: COLORS.border }}>
              <td className="py-1 font-medium" style={{ color: COLORS.text }}>{b.name}</td>
              <td>${b.revenue}M</td>
              <td>{b.margin}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Create a map of data-driven components
export const DATA_DRIVEN_SECTIONS: Record<string, React.FC<SectionPreviewProps>> = {
  "Net Worth & Asset Allocation": NetWorthPreview,
  "Cash & Liquidity Runway": CashRunwayPreview,
  "Business KPIs": BusinessKPIsPreview,
  // Add more as we build them out
};
