import { useState, ReactNode } from "react";
import { Edit2 } from "lucide-react";
import { COLORS } from "@/lib/constants";

interface EditableSectionProps {
  children: ReactNode;
  onEdit: () => void;
  hasRealData?: boolean;
}

export function EditableSection({ children, onEdit, hasRealData = false }: EditableSectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {isHovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-lg border hover:bg-gray-50 transition-all z-10"
          style={{ borderColor: COLORS.border }}
          title="Edit data"
        >
          <Edit2 className="h-4 w-4" style={{ color: COLORS.primary }} />
        </button>
      )}
      
      {!hasRealData && (
        <div className="absolute bottom-2 left-2 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">
          Sample data
        </div>
      )}
    </div>
  );
}
