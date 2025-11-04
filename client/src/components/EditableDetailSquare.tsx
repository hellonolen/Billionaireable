import React from "react";
import { COLORS } from "@/lib/constants";

interface EditableDetailSquareProps {
  title: string;
  children: React.ReactNode;
  isEditMode: boolean;
  fields?: Array<{
    label: string;
    value: string | number;
    type?: "text" | "number" | "date" | "select";
    options?: string[];
    onChange?: (value: string) => void;
  }>;
}

export function EditableDetailSquare({ title, children, isEditMode, fields }: EditableDetailSquareProps) {
  return (
    <div
      className="col-span-12 sm:col-span-6 lg:col-span-4 rounded-xl border p-4"
      style={{ background: COLORS.panel, borderColor: COLORS.border, aspectRatio: "1/1" }}
    >
      <div className="text-sm font-semibold mb-3" style={{ color: COLORS.text }}>
        {title}
      </div>
      <div className="h-[calc(100%-2rem)] overflow-auto">
        {isEditMode && fields ? (
          <div className="space-y-3">
            {fields.map((field, idx) => (
              <div key={idx}>
                <label className="block text-xs font-medium mb-1" style={{ color: COLORS.subt }}>
                  {field.label}
                </label>
                {field.type === "select" && field.options ? (
                  <select
                    className="w-full px-2 py-1 text-sm border rounded"
                    style={{ borderColor: COLORS.border }}
                    value={field.value}
                    onChange={(e) => field.onChange?.(e.target.value)}
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    className="w-full px-2 py-1 text-sm border rounded"
                    style={{ borderColor: COLORS.border }}
                    value={field.value}
                    onChange={(e) => field.onChange?.(e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
