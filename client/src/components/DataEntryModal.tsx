import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface DataEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardKey: string;
  cardTitle: string;
}

export function DataEntryModal({ isOpen, onClose, cardKey, cardTitle }: DataEntryModalProps) {
  const utils = trpc.useUtils();
  const [formData, setFormData] = useState<Record<string, string>>({});

  const saveMutation = trpc.dashboard.updateSection.useMutation({
    onSuccess: () => {
      utils.dashboard.getAllSections.invalidate();
      toast.success("Data saved successfully");
      onClose();
      setFormData({});
    },
    onError: (error: any) => {
      toast.error("Failed to save data: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      sectionKey: cardKey,
      data: JSON.stringify(formData),
      cadence: "Monthly",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get form fields based on card type
  const getFormFields = () => {
    switch (cardKey) {
      case "net_worth":
        return [
          { name: "totalAssets", label: "Total Assets", type: "number", placeholder: "1420000000" },
          { name: "totalLiabilities", label: "Total Liabilities", type: "number", placeholder: "50000000" },
          { name: "netWorth", label: "Net Worth", type: "number", placeholder: "1370000000" },
          { name: "change", label: "Change (%)", type: "number", placeholder: "8.2" },
        ];
      
      case "cash_liquidity":
        return [
          { name: "totalCash", label: "Total Cash", type: "number", placeholder: "125000000" },
          { name: "operatingCash", label: "Operating Cash", type: "number", placeholder: "45000000" },
          { name: "reserves", label: "Reserves", type: "number", placeholder: "80000000" },
          { name: "daysOfRunway", label: "Days of Runway", type: "number", placeholder: "180" },
        ];

      case "business_kpis":
        return [
          { name: "revenue", label: "Revenue", type: "number", placeholder: "450000000" },
          { name: "revenueGrowth", label: "Revenue Growth (%)", type: "number", placeholder: "22" },
          { name: "ebitda", label: "EBITDA", type: "number", placeholder: "125000000" },
          { name: "ebitdaMargin", label: "EBITDA Margin (%)", type: "number", placeholder: "28" },
        ];

      case "investment_performance":
        return [
          { name: "portfolioValue", label: "Portfolio Value", type: "number", placeholder: "850000000" },
          { name: "ytdReturn", label: "YTD Return (%)", type: "number", placeholder: "18.5" },
          { name: "topPerformer", label: "Top Performer", type: "text", placeholder: "Tech Growth Fund" },
          { name: "topPerformerReturn", label: "Top Performer Return (%)", type: "number", placeholder: "45" },
        ];

      case "deal_pipeline":
        return [
          { name: "activeDeals", label: "Active Deals", type: "number", placeholder: "12" },
          { name: "totalValue", label: "Total Value", type: "number", placeholder: "2400000000" },
          { name: "closingThisQuarter", label: "Closing This Quarter", type: "number", placeholder: "3" },
          { name: "expectedValue", label: "Expected Value", type: "number", placeholder: "450000000" },
        ];

      case "time_allocation":
        return [
          { name: "strategicWork", label: "Strategic Work (hours)", type: "number", placeholder: "45" },
          { name: "meetings", label: "Meetings (hours)", type: "number", placeholder: "25" },
          { name: "dealWork", label: "Deal Work (hours)", type: "number", placeholder: "15" },
          { name: "personal", label: "Personal (hours)", type: "number", placeholder: "10" },
        ];

      case "health_metrics":
        return [
          { name: "hrv", label: "HRV", type: "number", placeholder: "65" },
          { name: "sleep", label: "Sleep (hours)", type: "number", placeholder: "7.5" },
          { name: "vo2Max", label: "VO2 Max", type: "number", placeholder: "52" },
          { name: "workouts", label: "Workouts This Week", type: "number", placeholder: "5" },
        ];

      case "cognitive_performance":
        return [
          { name: "focusScore", label: "Focus Score", type: "number", placeholder: "85" },
          { name: "decisionQuality", label: "Decision Quality", type: "number", placeholder: "92" },
          { name: "stressLevel", label: "Stress Level", type: "number", placeholder: "3" },
          { name: "energyLevel", label: "Energy Level", type: "number", placeholder: "8" },
        ];

      case "reputation_legal":
        return [
          { name: "mediaScore", label: "Media Sentiment Score", type: "number", placeholder: "8.5" },
          { name: "activeCases", label: "Active Legal Cases", type: "number", placeholder: "0" },
          { name: "complianceScore", label: "Compliance Score", type: "number", placeholder: "98" },
          { name: "riskLevel", label: "Risk Level (1-10)", type: "number", placeholder: "2" },
        ];

      case "market_intelligence":
        return [
          { name: "sp500", label: "S&P 500", type: "number", placeholder: "4500" },
          { name: "sectorFocus", label: "Sector Focus", type: "text", placeholder: "Technology" },
          { name: "opportunities", label: "Opportunities Identified", type: "number", placeholder: "8" },
          { name: "threats", label: "Threats Monitored", type: "number", placeholder: "3" },
        ];

      case "network_dealflow":
        return [
          { name: "activeConnections", label: "Active Connections", type: "number", placeholder: "450" },
          { name: "newIntros", label: "New Intros This Month", type: "number", placeholder: "12" },
          { name: "inboundDeals", label: "Inbound Deals", type: "number", placeholder: "8" },
          { name: "qualityScore", label: "Deal Quality Score", type: "number", placeholder: "7.5" },
        ];

      case "risk_exposure":
        return [
          { name: "concentrationRisk", label: "Concentration Risk", type: "text", placeholder: "Medium" },
          { name: "marketRisk", label: "Market Risk", type: "text", placeholder: "Low" },
          { name: "operationalRisk", label: "Operational Risk", type: "text", placeholder: "Low" },
          { name: "hedges", label: "Active Hedges", type: "number", placeholder: "5" },
        ];

      case "philanthropy":
        return [
          { name: "totalGiven", label: "Total Given This Year", type: "number", placeholder: "25000000" },
          { name: "activeProjects", label: "Active Projects", type: "number", placeholder: "8" },
          { name: "impact", label: "People Impacted", type: "number", placeholder: "150000" },
          { name: "esgScore", label: "ESG Score", type: "number", placeholder: "92" },
        ];

      case "personal_goals":
        return [
          { name: "goal1", label: "Goal 1", type: "text", placeholder: "Close Series C" },
          { name: "goal1Progress", label: "Goal 1 Progress (%)", type: "number", placeholder: "75" },
          { name: "goal2", label: "Goal 2", type: "text", placeholder: "Launch new product" },
          { name: "goal2Progress", label: "Goal 2 Progress (%)", type: "number", placeholder: "60" },
        ];

      default:
        return [
          { name: "value", label: "Value", type: "text", placeholder: "Enter value" },
          { name: "notes", label: "Notes", type: "textarea", placeholder: "Additional notes" },
        ];
    }
  };

  const fields = getFormFields();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update {cardTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
