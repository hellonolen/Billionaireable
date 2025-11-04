import React from "react";
import { COLORS } from "@/lib/constants";

interface TileProps {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
}

export function Tile({ title, children, subtitle }: TileProps) {
  return (
    <div
      className="rounded-2xl border p-3 md:p-4"
      style={{ background: COLORS.panel, borderColor: COLORS.border }}
    >
      <div className="mb-2">
        <div className="text-sm font-semibold" style={{ color: COLORS.text }}>{title}</div>
        {subtitle && <div className="text-xs" style={{ color: COLORS.subt }}>{subtitle}</div>}
      </div>
      <div className="rounded-xl bg-white p-3" style={{ height: 160, overflow: "hidden" }}>{children}</div>
    </div>
  );
}

interface MiniStatProps {
  label: string;
  value: string | number;
}

export function MiniStat({ label, value }: MiniStatProps) {
  return (
    <div className="flex flex-col">
      <span className="text-xs" style={{ color: COLORS.subt }}>{label}</span>
      <span className="text-lg font-semibold" style={{ color: COLORS.text }}>{value}</span>
    </div>
  );
}

interface ClickableTileProps {
  title: string;
  children: React.ReactNode;
  onClick: () => void;
}

export function ClickableTile({ title, children, onClick }: ClickableTileProps) {
  return (
    <div
      className="rounded-2xl border p-3 md:p-4 cursor-pointer transition-all hover:shadow-lg"
      style={{ 
        background: COLORS.panel, 
        borderColor: COLORS.border,
        aspectRatio: "1/1"
      }}
      onClick={onClick}
    >
      <div className="text-sm font-semibold mb-2" style={{ color: COLORS.text }}>{title}</div>
      <div className="rounded-xl bg-white p-3 h-full overflow-hidden">{children}</div>
    </div>
  );
}

interface DetailSquareProps {
  title: string;
  children: React.ReactNode;
}

export function DetailSquare({ title, children }: DetailSquareProps) {
  return (
    <div>
      <div 
        className="rounded-2xl border p-3 md:p-4" 
        style={{ 
          background: COLORS.panel, 
          borderColor: COLORS.border, 
          aspectRatio: "1/1" 
        }}
      >
        <div className="text-sm font-semibold mb-2" style={{ color: COLORS.text }}>{title}</div>
        <div className="rounded-xl bg-white p-3 h-full overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
