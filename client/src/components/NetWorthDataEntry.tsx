import { useState } from "react";
import { COLORS } from "@/lib/constants";
import { Button } from "./ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { X } from "lucide-react";

interface NetWorthDataEntryProps {
  onClose: () => void;
  onSave: () => void;
}

export function NetWorthDataEntry({ onClose, onSave }: NetWorthDataEntryProps) {
  const [totalNetWorth, setTotalNetWorth] = useState("");
  const [publicEquity, setPublicEquity] = useState("");
  const [privateEquity, setPrivateEquity] = useState("");
  const [realEstate, setRealEstate] = useState("");
  const [fixedIncome, setFixedIncome] = useState("");
  const [alternatives, setAlternatives] = useState("");
  const [cash, setCash] = useState("");

  const updateSectionMutation = trpc.dashboard.updateSection.useMutation({
    onSuccess: () => {
      toast.success("Net worth data saved successfully");
      onSave();
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to save: " + error.message);
    },
  });

  const handleSave = () => {
    const data = {
      totalNetWorth: parseFloat(totalNetWorth) || 0,
      assetAllocation: [
        { name: "Public Equity", value: parseFloat(publicEquity) || 0 },
        { name: "Private Equity", value: parseFloat(privateEquity) || 0 },
        { name: "Real Estate", value: parseFloat(realEstate) || 0 },
        { name: "Fixed Income", value: parseFloat(fixedIncome) || 0 },
        { name: "Alternatives", value: parseFloat(alternatives) || 0 },
        { name: "Cash", value: parseFloat(cash) || 0 },
      ],
      lastUpdated: new Date().toISOString(),
    };

    updateSectionMutation.mutate({
      sectionKey: "net_worth",
      data: JSON.stringify(data),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ borderColor: COLORS.border }}>
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between" style={{ borderColor: COLORS.border }}>
          <h2 className="text-xl font-semibold" style={{ color: COLORS.text }}>
            Edit Net Worth & Asset Allocation
          </h2>
          <button onClick={onClose} className="hover:bg-gray-100 rounded-full p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
              Total Net Worth ($M)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full px-4 py-2 border rounded-lg"
              style={{ borderColor: COLORS.border }}
              value={totalNetWorth}
              onChange={(e) => setTotalNetWorth(e.target.value)}
              placeholder="e.g., 1.42"
            />
          </div>

          <div className="border-t pt-6" style={{ borderColor: COLORS.border }}>
            <h3 className="font-medium mb-4" style={{ color: COLORS.text }}>
              Asset Allocation ($M)
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                  Public Equity
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: COLORS.border }}
                  value={publicEquity}
                  onChange={(e) => setPublicEquity(e.target.value)}
                  placeholder="e.g., 385"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                  Private Equity
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: COLORS.border }}
                  value={privateEquity}
                  onChange={(e) => setPrivateEquity(e.target.value)}
                  placeholder="e.g., 298"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                  Real Estate
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: COLORS.border }}
                  value={realEstate}
                  onChange={(e) => setRealEstate(e.target.value)}
                  placeholder="e.g., 187"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                  Fixed Income
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: COLORS.border }}
                  value={fixedIncome}
                  onChange={(e) => setFixedIncome(e.target.value)}
                  placeholder="e.g., 109"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                  Alternatives
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: COLORS.border }}
                  value={alternatives}
                  onChange={(e) => setAlternatives(e.target.value)}
                  placeholder="e.g., 76"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                  Cash
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: COLORS.border }}
                  value={cash}
                  onChange={(e) => setCash(e.target.value)}
                  placeholder="e.g., 38"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateSectionMutation.isPending}
              className="flex-1"
              style={{ background: COLORS.primary, color: "white" }}
            >
              {updateSectionMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
