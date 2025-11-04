import { trpc } from "@/lib/trpc";

export function useDashboardData() {
  // Load all user's dashboard sections from database
  const { data: sections, isLoading } = trpc.dashboard.getAllSections.useQuery();
  
  // Load user's metrics
  const { data: netWorthData } = trpc.metrics.getByMetric.useQuery({ metric: "net_worth", limit: 12 });
  const { data: cashData } = trpc.metrics.getByMetric.useQuery({ metric: "cash", limit: 6 });
  const { data: hrvData } = trpc.metrics.getByMetric.useQuery({ metric: "hrv", limit: 30 });
  const { data: sleepData } = trpc.metrics.getByMetric.useQuery({ metric: "sleep", limit: 30 });
  const { data: revenueData } = trpc.metrics.getByMetric.useQuery({ metric: "revenue", limit: 12 });

  // Helper to get section data or return null
  const getSectionData = (sectionKey: string) => {
    const section = sections?.find(s => s.sectionKey === sectionKey);
    if (section?.data) {
      try {
        return JSON.parse(section.data);
      } catch {
        return null;
      }
    }
    return null;
  };

  // Helper to check if user has any real data
  const hasRealData = (sectionKey: string) => {
    return getSectionData(sectionKey) !== null;
  };

  return {
    sections,
    isLoading,
    getSectionData,
    hasRealData,
    metrics: {
      netWorth: netWorthData || [],
      cash: cashData || [],
      hrv: hrvData || [],
      sleep: sleepData || [],
      revenue: revenueData || [],
    },
  };
}
