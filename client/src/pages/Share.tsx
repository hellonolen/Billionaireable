import { useState } from "react";
import { COLORS } from "@/lib/constants";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Share2, Copy, Check, Heart, Briefcase, Users, Activity, FileText, Stethoscope, Lock, Calendar, X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

const SHARE_TEMPLATES = [
  {
    id: "doctor",
    icon: Stethoscope,
    color: "#10b981",
    title: "Doctor / Healthcare Provider",
    description: "Share health biomarkers and medical data",
    sections: [
      "HRV & VO2 Max",
      "Blood Work Results",
      "Sleep Quality Metrics",
      "Cognitive Performance",
      "Fitness & Activity Levels",
    ],
  },
  {
    id: "team",
    icon: Briefcase,
    color: "#3b82f6",
    title: "Team / Colleagues",
    description: "Share business metrics and KPIs",
    sections: [
      "Business KPIs",
      "Pipeline & Opportunities",
      "Key People / Talent",
      "Network & Deal Flow",
      "Time Allocation",
    ],
  },
  {
    id: "spouse",
    icon: Heart,
    color: "#ec4899",
    title: "Spouse / Partner",
    description: "Share financial overview and goals",
    sections: [
      "Net Worth & Assets",
      "Cash & Liquidity",
      "Investment Performance",
      "Personal Goals & Legacy",
      "Philanthropy & Impact",
    ],
  },
  {
    id: "family",
    icon: Users,
    color: "#8b5cf6",
    title: "Family / Kids",
    description: "Share specific family-relevant data",
    sections: [
      "Personal Goals",
      "Philanthropy & ESG",
      "Time Allocation",
      "Health & Wellness",
      "Legacy Planning",
    ],
  },
  {
    id: "health-results",
    icon: Activity,
    color: "#f59e0b",
    title: "Quick Health Results",
    description: "Share recent test results (STD, bloodwork, etc.)",
    sections: [
      "Latest Blood Work",
      "STD Test Results",
      "Vaccination Records",
      "Recent Health Screenings",
      "Biomarker Trends",
    ],
  },
  {
    id: "advisor",
    icon: FileText,
    color: "#06b6d4",
    title: "Financial Advisor / CPA",
    description: "Share financial data for professional review",
    sections: [
      "Net Worth & Asset Allocation",
      "Investment Performance",
      "Tax Documents",
      "Risk Exposures & Hedging",
      "Macroeconomic Insights",
    ],
  },
];

export default function Share() {
  const [generatedLinks, setGeneratedLinks] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [expiresInDays, setExpiresInDays] = useState(7);

  const createShare = trpc.sharing.create.useMutation({
    onSuccess: (data: any) => {
      setGeneratedLinks(prev => ({ ...prev, [showOptions!]: data.shareUrl }));
      navigator.clipboard.writeText(data.shareUrl);
      toast.success("Share link generated and copied to clipboard!");
      setShowOptions(null);
      setPassword("");
      setExpiresInDays(7);
    },
    onError: () => {
      toast.error("Failed to generate share link");
    },
  });

  const generateShareLink = (templateId: string) => {
    setShowOptions(templateId);
  };

  const confirmGenerate = () => {
    if (!showOptions) return;
    
    const template = SHARE_TEMPLATES.find(t => t.id === showOptions);
    if (!template) return;

    createShare.mutate({
      recipientEmail: undefined,
      recipientName: template.title,
      sections: template.sections,
      expiresInDays,
      password: password || undefined,
    });
  };

  const copyLink = (templateId: string) => {
    const link = generatedLinks[templateId];
    if (link) {
      navigator.clipboard.writeText(link);
      setCopiedId(templateId);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      <DashboardHeader />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.text }}>Share Dashboard</h1>
          <p className="text-sm" style={{ color: COLORS.subt }}>Generate secure links to share specific data with trusted individuals</p>
        </div>

        {/* Share Templates Grid - 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {SHARE_TEMPLATES.map(template => {
            const Icon = template.icon;
            const hasLink = generatedLinks[template.id];
            const isCopied = copiedId === template.id;

            return (
              <div
                key={template.id}
                className="bg-white border rounded-xl p-5 hover:shadow-sm transition-shadow"
                style={{ borderColor: COLORS.border }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="p-3 rounded-lg flex-shrink-0"
                    style={{ background: `${template.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: template.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1" style={{ color: COLORS.text }}>
                      {template.title}
                    </h3>
                    <p className="text-xs" style={{ color: COLORS.subt }}>
                      {template.description}
                    </p>
                  </div>
                </div>

                {/* Sections to be shared */}
                <div className="mb-4">
                  <div className="text-xs font-medium mb-2" style={{ color: COLORS.subt }}>
                    Data Included:
                  </div>
                  <div className="space-y-1">
                    {template.sections.map((section, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="h-3 w-3 flex-shrink-0" style={{ color: template.color }} />
                        <span className="text-xs" style={{ color: COLORS.text }}>{section}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generated Link Display */}
                {hasLink && (
                  <div className="mb-3 p-2.5 bg-gray-50 border rounded-lg" style={{ borderColor: COLORS.border }}>
                    <div className="text-xs font-medium mb-1" style={{ color: COLORS.text }}>Share Link:</div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={generatedLinks[template.id]}
                        readOnly
                        className="flex-1 text-xs bg-transparent border-none outline-none truncate"
                        style={{ color: COLORS.subt }}
                      />
                      <button
                        onClick={() => copyLink(template.id)}
                        className="flex-shrink-0"
                      >
                        {isCopied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" style={{ color: COLORS.subt }} />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowOptions(template.id)}
                    className="relative flex-1 text-sm font-medium group text-center py-2"
                    style={{ color: template.color }}
                  >
                    {hasLink ? "Regenerate Link" : "Generate Link"}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 scale-x-0 group-hover:scale-x-100 transition-all" style={{ background: template.color, transformOrigin: 'left' }} />
                  </button>
                  {hasLink && (
                    <button
                      onClick={() => toast.info("Opening share settings...")}
                      className="relative text-sm font-medium group px-3"
                      style={{ color: COLORS.text }}
                    >
                      Settings
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-400 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Shares Section */}
        <div className="mt-6 bg-white border rounded-xl p-5" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-base" style={{ color: COLORS.text }}>
              Active Share Links
            </h3>
            <span className="text-xs" style={{ color: COLORS.subt }}>
              {Object.keys(generatedLinks).length} active
            </span>
          </div>

          {Object.keys(generatedLinks).length === 0 ? (
            <div className="text-center py-8">
              <Share2 className="h-10 w-10 mx-auto mb-2" style={{ color: COLORS.subt }} />
              <p className="text-sm" style={{ color: COLORS.subt }}>
                No active share links. Generate a link above to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(generatedLinks).map(([templateId, link]) => {
                const template = SHARE_TEMPLATES.find(t => t.id === templateId);
                if (!template) return null;

                return (
                  <div
                    key={templateId}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    style={{ borderColor: COLORS.border }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="p-2 rounded-lg flex-shrink-0"
                        style={{ background: `${template.color}15` }}
                      >
                        <template.icon className="h-4 w-4" style={{ color: template.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm" style={{ color: COLORS.text }}>{template.title}</div>
                        <div className="text-xs truncate" style={{ color: COLORS.subt }}>{link}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => copyLink(templateId)}
                        className="relative text-xs font-medium group"
                        style={{ color: COLORS.primary }}
                      >
                        Copy
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                      </button>
                      <button
                        onClick={() => {
                          setGeneratedLinks(prev => {
                            const newLinks = { ...prev };
                            delete newLinks[templateId];
                            return newLinks;
                          });
                          toast.success("Share link revoked");
                        }}
                        className="relative text-xs font-medium group text-red-600"
                      >
                        Revoke
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Password & Expiration Modal */}
      {showOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: COLORS.text }}>Share Link Options</h3>
              <button onClick={() => setShowOptions(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" style={{ color: COLORS.subt }} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Password */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                  <Lock className="h-4 w-4" />
                  Password Protection (Optional)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave empty for no password"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor: COLORS.border }}
                />
              </div>

              {/* Expiration */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                  <Calendar className="h-4 w-4" />
                  Link Expiration
                </label>
                <select
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor: COLORS.border }}
                >
                  <option value={1}>1 day</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={365}>1 year</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowOptions(null)}
                  className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
                  style={{ borderColor: COLORS.border, color: COLORS.text }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmGenerate}
                  disabled={createShare.isPending}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ background: COLORS.primary }}
                >
                  {createShare.isPending ? 'Generating...' : 'Generate Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
