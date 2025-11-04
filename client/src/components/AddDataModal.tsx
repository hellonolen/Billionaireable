import { useState } from "react";
import { COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface AddDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionKey: string;
  sectionTitle: string;
}

export function AddDataModal({ isOpen, onClose, sectionKey, sectionTitle }: AddDataModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  const utils = trpc.useUtils();
  const addMetric = trpc.metrics.add.useMutation({
    onSuccess: () => {
      toast.success("Data added successfully");
      utils.metrics.getByMetric.invalidate();
      onClose();
      setFormData({});
    },
    onError: () => {
      toast.error("Failed to add data");
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit each field as a separate metric
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        addMetric.mutate({
          metric: `${sectionKey}.${key}`,
          value: parseFloat(formData[key]) || 0,
          date: new Date().toISOString(),
          category: sectionKey,
        });
      }
    });
  };

  const renderFields = () => {
    switch (sectionKey) {
      case "net-worth":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                Total Net Worth ($M)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
                value={formData.totalNetWorth || ""}
                onChange={(e) => setFormData({ ...formData, totalNetWorth: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                Public Equity ($M)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
                value={formData.publicEquity || ""}
                onChange={(e) => setFormData({ ...formData, publicEquity: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                Private Equity ($M)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
                value={formData.privateEquity || ""}
                onChange={(e) => setFormData({ ...formData, privateEquity: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                Real Estate ($M)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
                value={formData.realEstate || ""}
                onChange={(e) => setFormData({ ...formData, realEstate: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                Cash ($M)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
                value={formData.cash || ""}
                onChange={(e) => setFormData({ ...formData, cash: e.target.value })}
              />
            </div>
          </>
        );

      case "health":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                HRV (Heart Rate Variability)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
                value={formData.hrv || ""}
                onChange={(e) => setFormData({ ...formData, hrv: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                Sleep Hours
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
                value={formData.sleep || ""}
                onChange={(e) => setFormData({ ...formData, sleep: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                Recovery Score (%)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
                value={formData.recovery || ""}
                onChange={(e) => setFormData({ ...formData, recovery: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                Readiness Score
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
                value={formData.readiness || ""}
                onChange={(e) => setFormData({ ...formData, readiness: e.target.value })}
              />
            </div>
          </>
        );

      case "business":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                Company Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
                value={formData.companyName || ""}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                Revenue ($M)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
                value={formData.revenue || ""}
                onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                Growth Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
                value={formData.growth || ""}
                onChange={(e) => setFormData({ ...formData, growth: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                Margin (%)
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
                value={formData.margin || ""}
                onChange={(e) => setFormData({ ...formData, margin: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                Employees
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
                value={formData.employees || ""}
                onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
              />
            </div>
          </>
        );

      default:
        return (
          <div className="text-center py-8" style={{ color: COLORS.subt }}>
            Data entry form for this section coming soon
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: COLORS.border }}>
          <h2 className="text-lg font-semibold" style={{ color: COLORS.text }}>
            Add Data: {sectionTitle}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5" style={{ color: COLORS.text }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {renderFields()}

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1"
              style={{ background: "white", border: `1px solid ${COLORS.border}`, color: COLORS.text }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              style={{ background: COLORS.primary, color: "white" }}
              disabled={addMetric.isPending}
            >
              {addMetric.isPending ? "Saving..." : "Save Data"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
