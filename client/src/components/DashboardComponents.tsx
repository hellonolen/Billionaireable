import React, { useState } from "react";
import { COLORS } from "@/lib/constants";
import { Plus } from "lucide-react";
import { DataEntryModal } from "./DataEntryModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardKey = title?.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || 'unknown';

  return (
    <>
      <div
        className="rounded-2xl border p-3 md:p-4 cursor-pointer transition-all hover:shadow-lg relative group"
        style={{ 
          background: COLORS.panel, 
          borderColor: COLORS.border,
          aspectRatio: "1/1"
        }}
        onClick={onClick}
      >
        <div className="text-sm font-semibold mb-2" style={{ color: COLORS.text }}>{title}</div>
        <div className="rounded-xl bg-white p-3 h-full overflow-hidden">{children}</div>
        
        {/* Plus icon bottom-right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className="absolute bottom-3 right-3 bg-white rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:shadow-md"
          style={{ borderColor: COLORS.border }}
          title="Update Data"
        >
          <Plus className="h-4 w-4" style={{ color: COLORS.primary }} />
        </button>
      </div>
      
      <DataEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cardKey={cardKey}
        cardTitle={title}
      />
    </>
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
