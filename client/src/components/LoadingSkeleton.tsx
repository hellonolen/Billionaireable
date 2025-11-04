import { COLORS } from "@/lib/constants";

export function CardSkeleton() {
  return (
    <div className="bg-white border rounded-xl p-6 animate-pulse" style={{ borderColor: COLORS.border }}>
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(12, minmax(0, 1fr))" }}>
      {[...Array(12)].map((_, i) => (
        <div key={i} className="col-span-12 sm:col-span-6 lg:col-span-4">
          <CardSkeleton />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded flex-1"></div>
          <div className="h-4 bg-gray-200 rounded flex-1"></div>
          <div className="h-4 bg-gray-200 rounded flex-1"></div>
        </div>
      ))}
    </div>
  );
}
