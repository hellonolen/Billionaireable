import React, { useState } from "react";
import { COLORS } from "@/lib/constants";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SectionKey } from "./Dashboard";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "wouter";
import { getDetailContent } from "@/lib/detailContent";
import { EditableDetailSquare } from "@/components/EditableDetailSquare";
import { SECTION_FORMS } from "@/lib/dataEntryForms";

interface DetailViewProps {
  sectionKey: SectionKey;
  onBack: () => void;
}

export default function DetailView({ sectionKey, onBack }: DetailViewProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  const utils = trpc.useUtils();
  const { data: savedData } = trpc.dashboard.getSection.useQuery({ sectionKey });
  const updateMutation = trpc.dashboard.updateSection.useMutation({
    onSuccess: () => {
      toast.success("Changes saved successfully");
      setIsEditMode(false);
      utils.dashboard.getSection.invalidate({ sectionKey });
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  // Example form state - in production, this would be dynamically generated based on section
  const [formData, setFormData] = React.useState<Record<string, any>>({
    // Initialize with saved data if available
  });

  React.useEffect(() => {
    if (savedData?.data) {
      try {
        const parsed = JSON.parse(savedData.data);
        setFormData(parsed);
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, [savedData]);

  const handleSave = () => {
    const dataToSave = JSON.stringify({
      ...formData,
      sectionKey,
      lastUpdated: new Date().toISOString(),
    });

    updateMutation.mutate({
      sectionKey,
      data: dataToSave,
    });
  };

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      <DashboardHeader />
      
      {/* Section title */}
      <div className="border-b" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>{sectionKey}</h1>
            </div>
            <div className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditMode(false)}
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  style={{ background: COLORS.primary, color: "white" }}
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditMode(true)}
                >
                  Edit
                </Button>
                <button
                  className="rounded-xl px-3 py-2 text-sm font-medium"
                  style={{ background: COLORS.primary, color: "white" }}
                >
                  Export
                </button>              </>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail tiles: responsive grid - 1 col mobile, 2 col tablet, 3 col desktop */}
      <section className="mx-auto max-w-7xl px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isEditMode ? (
            // Render editable forms
            SECTION_FORMS[sectionKey]?.map((form, idx) => (
              <EditableDetailSquare
                key={idx}
                title={form.title}
                isEditMode={true}
                fields={form.fields.map(field => ({
                  label: field.label,
                  value: formData[field.id] || "",
                  type: field.type === "textarea" ? "text" : field.type,
                  options: field.options,
                  onChange: (value) => setFormData(prev => ({ ...prev, [field.id]: value }))
                }))}
              >
                <div>Edit mode</div>
              </EditableDetailSquare>
            ))
          ) : (
            // Render read-only visualizations
            getDetailContent(sectionKey)
          )}
        </div>
      </section>

      <footer className="border-t" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto max-w-7xl px-4 pb-4 text-xs" style={{ color: COLORS.subt }}>
          © {new Date().getFullYear()} Investor Console. For development only.
        </div>
      </footer>
    </div>
  );
}
