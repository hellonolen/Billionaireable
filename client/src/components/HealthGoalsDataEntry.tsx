import { useState } from "react";
import { COLORS } from "@/lib/constants";
import { Button } from "./ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { X, Plus, Trash2 } from "lucide-react";

interface HealthGoalsDataEntryProps {
  onClose: () => void;
  onSave: () => void;
}

interface Goal {
  title: string;
  target: string;
  current: string;
  status: "On Track" | "At Risk" | "Achieved";
}

export function HealthGoalsDataEntry({ onClose, onSave }: HealthGoalsDataEntryProps) {
  const [goals, setGoals] = useState<Goal[]>([
    { title: "", target: "", current: "", status: "On Track" }
  ]);

  const updateSectionMutation = trpc.dashboard.updateSection.useMutation({
    onSuccess: () => {
      toast.success("Health goals saved successfully");
      onSave();
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to save: " + error.message);
    },
  });

  const handleSave = () => {
    const data = {
      goals: goals.filter(g => g.title && g.target),
      lastUpdated: new Date().toISOString(),
    };

    updateSectionMutation.mutate({
      sectionKey: "personal_goals",
      data: JSON.stringify(data),
    });
  };

  const addGoal = () => {
    setGoals([...goals, { title: "", target: "", current: "", status: "On Track" }]);
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const updateGoal = (index: number, field: keyof Goal, value: string) => {
    const updated = [...goals];
    updated[index] = { ...updated[index], [field]: value };
    setGoals(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" style={{ borderColor: COLORS.border }}>
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between" style={{ borderColor: COLORS.border }}>
          <h2 className="text-xl font-semibold" style={{ color: COLORS.text }}>
            Edit Personal Goals & Legacy
          </h2>
          <button onClick={onClose} className="hover:bg-gray-100 rounded-full p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {goals.map((goal, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4" style={{ borderColor: COLORS.border }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium" style={{ color: COLORS.text }}>Goal {index + 1}</h3>
                {goals.length > 1 && (
                  <button
                    onClick={() => removeGoal(index)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                    Goal Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                    value={goal.title}
                    onChange={(e) => updateGoal(index, "title", e.target.value)}
                    placeholder="e.g., Net Worth $1.5B by EOY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                    Target
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                    value={goal.target}
                    onChange={(e) => updateGoal(index, "target", e.target.value)}
                    placeholder="e.g., $1.42B"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                    Current Progress
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                    value={goal.current}
                    onChange={(e) => updateGoal(index, "current", e.target.value)}
                    placeholder="e.g., 95%"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                    Status
                  </label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                    value={goal.status}
                    onChange={(e) => updateGoal(index, "status", e.target.value)}
                  >
                    <option value="On Track">On Track</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Achieved">Achieved</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addGoal}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Goal
          </Button>

          <div className="flex gap-3 pt-4 border-t" style={{ borderColor: COLORS.border }}>
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
