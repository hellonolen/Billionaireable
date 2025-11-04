import { useState } from "react";
import { COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Download, Mail, Calendar, FileText, Clock, TrendingUp, BarChart3, Share2 } from "lucide-react";
import { toast } from "sonner";

const REPORT_TEMPLATES = [
  {
    id: "weekly-summary",
    name: "Weekly Executive Summary",
    description: "High-level overview of all key metrics with trends and insights",
    frequency: "Weekly",
    sections: ["Financial", "Health", "Business", "Goals"],
    icon: FileText,
    color: COLORS.primary,
  },
  {
    id: "financial-deep-dive",
    name: "Financial Deep Dive",
    description: "Detailed analysis of net worth, investments, and cash flow",
    frequency: "Monthly",
    sections: ["Net Worth", "Investments", "Cash Flow", "Expenses"],
    icon: TrendingUp,
    color: "#10b981",
  },
  {
    id: "health-wellness",
    name: "Health & Wellness Report",
    description: "Comprehensive health metrics, sleep quality, and fitness tracking",
    frequency: "Weekly",
    sections: ["HRV", "Sleep", "Workouts", "Nutrition"],
    icon: BarChart3,
    color: "#f59e0b",
  },
  {
    id: "business-performance",
    name: "Business Performance",
    description: "KPIs, revenue, team metrics, and growth indicators",
    frequency: "Monthly",
    sections: ["Revenue", "KPIs", "Team", "Pipeline"],
    icon: BarChart3,
    color: "#8b5cf6",
  },
];

const PAST_REPORTS = [
  { date: "2024-05-20", type: "Weekly Executive Summary", status: "Sent", downloads: 3 },
  { date: "2024-05-13", type: "Weekly Executive Summary", status: "Sent", downloads: 5 },
  { date: "2024-05-01", type: "Financial Deep Dive", status: "Sent", downloads: 8 },
  { date: "2024-04-29", type: "Health & Wellness Report", status: "Sent", downloads: 2 },
  { date: "2024-04-22", type: "Business Performance", status: "Sent", downloads: 6 },
];

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const generateReport = (templateId: string) => {
    toast.success("Generating report... This may take a moment.");
    setTimeout(() => {
      toast.success("Report generated! Download started.");
    }, 2000);
  };

  const scheduleReport = (templateId: string) => {
    toast.success("Report scheduled successfully. You'll receive it via email.");
  };

  const periods = ["Daily", "Weekly", "Bi-weekly", "Monthly", "Quarterly", "Annual"];

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      {/* Header */}
      <DashboardHeader />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Page Header with Time Period Selector */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.text }}>Reports & Analytics</h1>
            <p className="text-sm" style={{ color: COLORS.subt }}>Generate comprehensive reports and schedule automated delivery</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: COLORS.subt }}>Period:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50 cursor-pointer"
              style={{ borderColor: COLORS.border, color: COLORS.text, background: COLORS.bg }}
            >
              {periods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Report Templates Grid - matching Insights page style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {REPORT_TEMPLATES.map(template => {
            const Icon = template.icon;
            return (
              <div
                key={template.id}
                className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
                style={{ borderColor: COLORS.border }}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-xl flex-shrink-0"
                    style={{ background: `${template.color}20` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: template.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold" style={{ color: COLORS.text }}>{template.name}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 flex items-center gap-1" style={{ color: COLORS.subt }}>
                        <Clock className="h-3 w-3" />
                        {template.frequency}
                      </span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: COLORS.subt }}>{template.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.sections.map(section => (
                        <span
                          key={section}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ background: `${template.color}20`, color: template.color }}
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          generateReport(template.id);
                        }}
                        className="relative text-sm font-medium group"
                        style={{ color: template.color }}
                      >
                        Generate
                        <span className="absolute bottom-0 left-0 w-full h-0.5 scale-x-0 group-hover:scale-x-100 transition-all" style={{ background: template.color, transformOrigin: 'left' }} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          scheduleReport(template.id);
                        }}
                        className="relative text-sm font-medium group"
                        style={{ color: COLORS.text }}
                      >
                        Schedule
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-400 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success("Share link generated!");
                        }}
                        className="relative text-sm font-medium group"
                        style={{ color: COLORS.text }}
                      >
                        Share
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-400 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Past Reports - matching Insights page card style */}
        <div className="bg-white border rounded-xl p-6" style={{ borderColor: COLORS.border }}>
          <h2 className="font-semibold text-lg mb-4" style={{ color: COLORS.text }}>Recent Reports</h2>
          <div className="space-y-3">
            {PAST_REPORTS.map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                style={{ borderColor: COLORS.border }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg" style={{ background: `${COLORS.primary}20` }}>
                    <FileText className="h-5 w-5" style={{ color: COLORS.primary }} />
                  </div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: COLORS.text }}>{report.type}</div>
                    <div className="text-xs flex items-center gap-3 mt-1" style={{ color: COLORS.subt }}>
                      <span>{report.date}</span>
                      <span>•</span>
                      <span>{report.downloads} downloads</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                    {report.status}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toast.success("Download started!")}
                      className="relative text-sm font-medium group"
                      style={{ color: COLORS.primary }}
                    >
                      Download
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                    </button>
                    <button
                      onClick={() => toast.success("Share link generated!")}
                      className="relative text-sm font-medium group"
                      style={{ color: COLORS.text }}
                    >
                      Share
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-400 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
