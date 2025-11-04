import { useState } from "react";
import { COLORS } from "@/lib/constants";
import { Button } from "./ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { X, Plus, Trash2 } from "lucide-react";

interface BusinessKPIsDataEntryProps {
  onClose: () => void;
  onSave: () => void;
}

interface Company {
  name: string;
  revenue: string;
  growth: string;
  margin: string;
  employees: number;
  arr: string;
}

export function BusinessKPIsDataEntry({ onClose, onSave }: BusinessKPIsDataEntryProps) {
  const [companies, setCompanies] = useState<Company[]>([
    { name: "", revenue: "", growth: "", margin: "", employees: 0, arr: "" }
  ]);

  const updateSectionMutation = trpc.dashboard.updateSection.useMutation({
    onSuccess: () => {
      toast.success("Business KPIs saved successfully");
      onSave();
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to save: " + error.message);
    },
  });

  const handleSave = () => {
    const data = {
      companies: companies.filter(c => c.name && c.revenue),
      lastUpdated: new Date().toISOString(),
    };

    updateSectionMutation.mutate({
      sectionKey: "business_kpis",
      data: JSON.stringify(data),
    });
  };

  const addCompany = () => {
    setCompanies([...companies, { name: "", revenue: "", growth: "", margin: "", employees: 0, arr: "" }]);
  };

  const removeCompany = (index: number) => {
    setCompanies(companies.filter((_, i) => i !== index));
  };

  const updateCompany = (index: number, field: keyof Company, value: string | number) => {
    const updated = [...companies];
    updated[index] = { ...updated[index], [field]: value };
    setCompanies(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ borderColor: COLORS.border }}>
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between" style={{ borderColor: COLORS.border }}>
          <h2 className="text-xl font-semibold" style={{ color: COLORS.text }}>
            Edit Business KPIs
          </h2>
          <button onClick={onClose} className="hover:bg-gray-100 rounded-full p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {companies.map((company, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4" style={{ borderColor: COLORS.border }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium" style={{ color: COLORS.text }}>Company {index + 1}</h3>
                {companies.length > 1 && (
                  <button
                    onClick={() => removeCompany(index)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                    value={company.name}
                    onChange={(e) => updateCompany(index, "name", e.target.value)}
                    placeholder="e.g., HealthTechCo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                    Revenue
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                    value={company.revenue}
                    onChange={(e) => updateCompany(index, "revenue", e.target.value)}
                    placeholder="e.g., $85M"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                    Growth Rate
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                    value={company.growth}
                    onChange={(e) => updateCompany(index, "growth", e.target.value)}
                    placeholder="e.g., +38%"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                    Profit Margin
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                    value={company.margin}
                    onChange={(e) => updateCompany(index, "margin", e.target.value)}
                    placeholder="e.g., 42%"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                    Employees
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                    value={company.employees || ""}
                    onChange={(e) => updateCompany(index, "employees", parseInt(e.target.value) || 0)}
                    placeholder="e.g., 287"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                    ARR (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                    value={company.arr}
                    onChange={(e) => updateCompany(index, "arr", e.target.value)}
                    placeholder="e.g., $92M"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addCompany}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Company
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
