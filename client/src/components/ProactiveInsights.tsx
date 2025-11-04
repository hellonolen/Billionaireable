import { trpc } from "@/lib/trpc";
import { AlertCircle, TrendingUp, Heart, Users, X } from "lucide-react";
import { useState } from "react";

export function ProactiveInsights() {
  const { data: insights, isLoading } = trpc.aiCompanion.getProactiveInsights.useQuery();
  const dismissMutation = trpc.aiCompanion.dismissInsight.useMutation();
  const [dismissedIds, setDismissedIds] = useState<number[]>([]);

  const handleDismiss = async (insightId: number) => {
    setDismissedIds(prev => [...prev, insightId]);
    await dismissMutation.mutateAsync({ insightId });
  };

  if (isLoading || !insights || insights.length === 0) {
    return null;
  }

  const visibleInsights = insights.filter(i => !dismissedIds.includes(i.id));

  if (visibleInsights.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "action_required":
        return <AlertCircle className="h-5 w-5" />;
      case "opportunity":
        return <TrendingUp className="h-5 w-5" />;
      case "health":
        return <Heart className="h-5 w-5" />;
      case "relationship":
        return <Users className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "action_required":
        return "border-orange-500 bg-orange-50 dark:bg-orange-950/20";
      case "opportunity":
        return "border-green-500 bg-green-50 dark:bg-green-950/20";
      case "health":
        return "border-blue-500 bg-blue-50 dark:bg-blue-950/20";
      case "relationship":
        return "border-purple-500 bg-purple-50 dark:bg-purple-950/20";
      default:
        return "border-gray-500 bg-gray-50 dark:bg-gray-950/20";
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case "action_required":
        return "text-orange-700 dark:text-orange-300";
      case "opportunity":
        return "text-green-700 dark:text-green-300";
      case "health":
        return "text-blue-700 dark:text-blue-300";
      case "relationship":
        return "text-purple-700 dark:text-purple-300";
      default:
        return "text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-3 mb-6">
      <h2 className="text-lg font-semibold">AI Insights</h2>
      {visibleInsights.map((insight) => (
        <div
          key={insight.id}
          className={`border-l-4 rounded-lg p-4 ${getColor(insight.type)}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className={getTextColor(insight.type)}>
                {getIcon(insight.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium uppercase ${getTextColor(insight.type)}`}>
                    {insight.type.replace("_", " ")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(insight.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-medium mb-1">{insight.title}</h3>
                <p className="text-sm text-muted-foreground">{insight.content}</p>
                {insight.actionUrl && (
                  <a
                    href={insight.actionUrl}
                    className="text-sm font-medium text-blue-600 hover:underline mt-2 inline-block"
                  >
                    {insight.actionLabel || "Take Action"}
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDismiss(insight.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
