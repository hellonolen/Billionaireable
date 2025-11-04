import { COLORS } from "@/lib/constants";
import { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Icon className="h-12 w-12 mx-auto mb-4" style={{ color: COLORS.subt, opacity: 0.5 }} />
      <div className="font-medium mb-2" style={{ color: COLORS.text }}>
        {title}
      </div>
      <div className="text-sm mb-4 max-w-sm mx-auto" style={{ color: COLORS.subt }}>
        {description}
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} style={{ background: COLORS.primary, color: "white" }}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
