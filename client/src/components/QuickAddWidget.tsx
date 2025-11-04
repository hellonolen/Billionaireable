import React, { useState } from "react";
import { COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface QuickAddWidgetProps {
  onClose: () => void;
}

export function QuickAddWidget({ onClose }: QuickAddWidgetProps) {
  const [metric, setMetric] = useState("net_worth");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const addMetricMutation = trpc.metrics.add.useMutation({
    onSuccess: () => {
      toast.success("Data added successfully");
      setValue("");
    },
    onError: (error) => {
      toast.error("Failed to add data: " + error.message);
    },
  });

  const metrics = [
    { value: "net_worth", label: "Net Worth", unit: "$" },
    { value: "cash", label: "Cash Balance", unit: "$" },
    { value: "hrv", label: "HRV", unit: "ms" },
    { value: "sleep", label: "Sleep Hours", unit: "hrs" },
    { value: "workout", label: "Workout", unit: "mins" },
    { value: "weight", label: "Weight", unit: "lbs" },
    { value: "steps", label: "Steps", unit: "" },
    { value: "revenue", label: "Revenue", unit: "$" },
    { value: "expenses", label: "Expenses", unit: "$" },
  ];

  const handleQuickAdd = () => {
    if (!value) {
      toast.error("Please enter a value");
      return;
    }

    addMetricMutation.mutate({
      metric,
      value: parseFloat(value),
      date,
      category: metric.includes('hrv') || metric.includes('sleep') || metric.includes('workout') || metric.includes('weight') || metric.includes('steps') ? 'health' : 'finance',
    });
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-2xl border p-6 w-96 z-50" style={{ borderColor: COLORS.border }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg" style={{ color: COLORS.text }}>Quick Add Data</h3>
        <button onClick={onClose} className="hover:bg-gray-100 rounded-full p-1">
          <X className="h-5 w-5" style={{ color: COLORS.text }} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Metric</label>
          <select
            className="w-full px-3 py-2 border rounded-lg"
            style={{ borderColor: COLORS.border }}
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          >
            {metrics.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
            Value {metrics.find(m => m.value === metric)?.unit && `(${metrics.find(m => m.value === metric)?.unit})`}
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-lg"
            style={{ borderColor: COLORS.border }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter value"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Date</label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded-lg"
            style={{ borderColor: COLORS.border }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <Button
          onClick={handleQuickAdd}
          disabled={addMetricMutation.isPending}
          className="w-full"
          style={{ background: COLORS.primary, color: "white" }}
        >
          {addMetricMutation.isPending ? "Adding..." : "Add Data"}
        </Button>
      </div>
    </div>
  );
}
