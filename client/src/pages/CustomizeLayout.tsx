import React, { useState } from "react";
import { COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Link } from "wouter";
import { GripVertical, Eye, EyeOff, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const ALL_SECTIONS = [
  "Net Worth & Asset Allocation",
  "Cash & Liquidity Runway",
  "Business KPIs",
  "Investment Performance",
  "Pipeline of Opportunities & Exits",
  "Key People / Talent",
  "Time Allocation & Productivity",
  "Personal Health & Cognitive Performance",
  "Reputation, Brand & Legal/Regulatory",
  "Macroeconomic & Market",
  "Network & Deal Flow Quality",
  "Risk Exposures & Hedging",
  "Philanthropy, ESG & Impact",
  "Personal Goals & Legacy",
  "News & Market Intelligence",
];

export default function CustomizeLayout() {
  const [sections, setSections] = useState(ALL_SECTIONS.map((name, index) => ({
    name,
    visible: true,
    order: index,
  })));

  const toggleVisibility = (index: number) => {
    setSections(prev => prev.map((s, i) => 
      i === index ? { ...s, visible: !s.visible } : s
    ));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setSections(prev => {
      const newSections = [...prev];
      [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
      return newSections.map((s, i) => ({ ...s, order: i }));
    });
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    setSections(prev => {
      const newSections = [...prev];
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      return newSections.map((s, i) => ({ ...s, order: i }));
    });
  };

  const saveLayout = () => {
    localStorage.setItem('dashboardLayout', JSON.stringify(sections));
    toast.success("Layout saved successfully");
  };

  const resetLayout = () => {
    setSections(ALL_SECTIONS.map((name, index) => ({
      name,
      visible: true,
      order: index,
    })));
    localStorage.removeItem('dashboardLayout');
    toast.success("Layout reset to default");
  };

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      {/* Header */}
      <DashboardHeader />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Instructions */}
        <div className="bg-white border rounded-xl p-4 mb-6" style={{ borderColor: COLORS.border }}>
          <p className="text-sm" style={{ color: COLORS.text }}>
            Customize your dashboard by reordering sections and toggling their visibility. Changes will be saved to your profile.
          </p>
        </div>

        {/* Sections List */}
        <div className="space-y-3">
          {sections.map((section, index) => (
            <div
              key={section.name}
              className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow"
              style={{ borderColor: COLORS.border }}
            >
              <div className="flex items-center gap-4">
                {/* Drag Handle */}
                <button className="cursor-move p-2 hover:bg-gray-100 rounded">
                  <GripVertical className="h-5 w-5" style={{ color: COLORS.subt }} />
                </button>

                {/* Section Name */}
                <div className="flex-1">
                  <div
                    className="font-medium"
                    style={{ color: section.visible ? COLORS.text : COLORS.subt }}
                  >
                    {section.name}
                  </div>
                  <div className="text-xs" style={{ color: COLORS.subt }}>
                    Position {index + 1} of {sections.length}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="px-3 py-1 text-xs border rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ borderColor: COLORS.border }}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === sections.length - 1}
                    className="px-3 py-1 text-xs border rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ borderColor: COLORS.border }}
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => toggleVisibility(index)}
                    className="p-2 border rounded hover:bg-gray-50"
                    style={{ borderColor: COLORS.border }}
                  >
                    {section.visible ? (
                      <Eye className="h-4 w-4" style={{ color: COLORS.primary }} />
                    ) : (
                      <EyeOff className="h-4 w-4" style={{ color: COLORS.subt }} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-xl p-4" style={{ borderColor: COLORS.border }}>
            <div className="text-2xl font-bold mb-1" style={{ color: COLORS.text }}>
              {sections.length}
            </div>
            <div className="text-sm" style={{ color: COLORS.subt }}>Total Sections</div>
          </div>
          <div className="bg-white border rounded-xl p-4" style={{ borderColor: COLORS.border }}>
            <div className="text-2xl font-bold mb-1" style={{ color: COLORS.text }}>
              {sections.filter(s => s.visible).length}
            </div>
            <div className="text-sm" style={{ color: COLORS.subt }}>Visible Sections</div>
          </div>
          <div className="bg-white border rounded-xl p-4" style={{ borderColor: COLORS.border }}>
            <div className="text-2xl font-bold mb-1" style={{ color: COLORS.text }}>
              {sections.filter(s => !s.visible).length}
            </div>
            <div className="text-sm" style={{ color: COLORS.subt }}>Hidden Sections</div>
          </div>
        </div>
      </div>
    </div>
  );
}
