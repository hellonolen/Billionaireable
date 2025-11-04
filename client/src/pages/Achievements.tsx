import React from "react";
import { COLORS } from "@/lib/constants";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Link } from "wouter";
import { Trophy, Flame, Target, Award, TrendingUp, Star, Share2 } from "lucide-react";
import { toast } from "sonner";

const ACHIEVEMENTS = [
  {
    id: "net-worth-milestone",
    name: "Billionaire Status",
    description: "Reached $1 billion net worth",
    icon: Trophy,
    unlocked: true,
    date: "2024-01-15",
    rarity: "legendary",
  },
  {
    id: "health-streak-30",
    name: "Health Champion",
    description: "30-day workout streak",
    icon: Flame,
    unlocked: true,
    date: "2024-05-10",
    rarity: "epic",
  },
  {
    id: "hrv-improvement",
    name: "Recovery Master",
    description: "Improved HRV by 20% in 3 months",
    icon: TrendingUp,
    unlocked: true,
    date: "2024-04-22",
    rarity: "rare",
  },
  {
    id: "goal-completion",
    name: "Goal Crusher",
    description: "Completed 10 major goals",
    icon: Target,
    unlocked: true,
    date: "2024-03-08",
    rarity: "epic",
  },
  {
    id: "consistent-tracking",
    name: "Data Devotee",
    description: "Logged data every day for 90 days",
    icon: Star,
    unlocked: true,
    date: "2024-02-14",
    rarity: "rare",
  },
  {
    id: "investment-return",
    name: "Investment Genius",
    description: "Achieved 25%+ annual return",
    icon: Award,
    unlocked: false,
    date: null,
    rarity: "legendary",
  },
];

const STREAKS = [
  { name: "Daily Data Entry", current: 47, best: 92, icon: "📊" },
  { name: "Workout Streak", current: 12, best: 30, icon: "💪" },
  { name: "Sleep 7+ Hours", current: 8, best: 21, icon: "😴" },
  { name: "Meditation", current: 5, best: 14, icon: "🧘" },
];

const MILESTONES = [
  { value: "$1.5B", label: "Next Net Worth Milestone", progress: 80 },
  { value: "100", label: "Days of Consistent Tracking", progress: 47 },
  { value: "50", label: "Health Goals Achieved", progress: 62 },
];

export default function Achievements() {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "#f59e0b";
      case "epic": return "#8b5cf6";
      case "rare": return COLORS.primary;
      default: return COLORS.subt;
    }
  };

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      {/* Header */}
      <DashboardHeader />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border rounded-xl p-4" style={{ borderColor: COLORS.border }}>
            <div className="text-3xl font-bold mb-1" style={{ color: COLORS.text }}>
              {ACHIEVEMENTS.filter(a => a.unlocked).length}
            </div>
            <div className="text-sm" style={{ color: COLORS.subt }}>Achievements Unlocked</div>
          </div>
          <div className="bg-white border rounded-xl p-4" style={{ borderColor: COLORS.border }}>
            <div className="text-3xl font-bold mb-1" style={{ color: COLORS.text }}>47</div>
            <div className="text-sm" style={{ color: COLORS.subt }}>Current Streak</div>
          </div>
          <div className="bg-white border rounded-xl p-4" style={{ borderColor: COLORS.border }}>
            <div className="text-3xl font-bold mb-1" style={{ color: COLORS.text }}>92</div>
            <div className="text-sm" style={{ color: COLORS.subt }}>Best Streak</div>
          </div>
          <div className="bg-white border rounded-xl p-4" style={{ borderColor: COLORS.border }}>
            <div className="text-3xl font-bold mb-1" style={{ color: COLORS.text }}>3</div>
            <div className="text-sm" style={{ color: COLORS.subt }}>Legendary Badges</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Achievements */}
          <div className="lg:col-span-2">
            <h2 className="font-semibold text-lg mb-4" style={{ color: COLORS.text }}>Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACHIEVEMENTS.map(achievement => {
                const Icon = achievement.icon;
                const rarityColor = getRarityColor(achievement.rarity);
                return (
                  <div
                    key={achievement.id}
                    className="bg-white border rounded-xl p-6 transition-shadow hover:shadow-md"
                    style={{
                      borderColor: achievement.unlocked ? rarityColor : COLORS.border,
                      opacity: achievement.unlocked ? 1 : 0.5,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="p-3 rounded-xl flex-shrink-0"
                        style={{ background: `${rarityColor}20` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: rarityColor }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1" style={{ color: COLORS.text }}>
                          {achievement.name}
                        </h3>
                        <p className="text-sm mb-2" style={{ color: COLORS.subt }}>
                          {achievement.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-xs px-2 py-1 rounded-full font-medium"
                              style={{ background: `${rarityColor}20`, color: rarityColor }}
                            >
                              {achievement.rarity}
                            </span>
                            {achievement.unlocked && achievement.date && (
                              <span className="text-xs" style={{ color: COLORS.subt }}>
                                {achievement.date}
                              </span>
                            )}
                          </div>
                          {achievement.unlocked && (
                            <button
                              onClick={() => {
                                toast.success("Share link copied to clipboard!");
                                navigator.clipboard.writeText(`I just unlocked "${achievement.name}" with Billionaireable! 🏆`);
                              }}
                              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                              title="Share on social media"
                            >
                              <Share2 className="h-3.5 w-3.5" style={{ color: COLORS.primary }} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Streaks */}
            <div className="bg-white border rounded-xl p-6" style={{ borderColor: COLORS.border }}>
              <h3 className="font-semibold mb-4" style={{ color: COLORS.text }}>Active Streaks</h3>
              <div className="space-y-4">
                {STREAKS.map(streak => (
                  <div key={streak.name} className="pb-4 border-b last:border-b-0" style={{ borderColor: COLORS.border }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{streak.icon}</span>
                        <span className="font-medium text-sm" style={{ color: COLORS.text }}>
                          {streak.name}
                        </span>
                      </div>
                      <Flame className="h-5 w-5" style={{ color: "#f59e0b" }} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: COLORS.text }}>
                        <strong>{streak.current}</strong> days
                      </span>
                      <span style={{ color: COLORS.subt }}>Best: {streak.best}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-white border rounded-xl p-6" style={{ borderColor: COLORS.border }}>
              <h3 className="font-semibold mb-4" style={{ color: COLORS.text }}>Upcoming Milestones</h3>
              <div className="space-y-4">
                {MILESTONES.map(milestone => (
                  <div key={milestone.label}>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span style={{ color: COLORS.text }}>{milestone.label}</span>
                      <span className="font-medium" style={{ color: COLORS.primary }}>
                        {milestone.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${milestone.progress}%`,
                          background: COLORS.primary,
                        }}
                      />
                    </div>
                    <div className="text-xs mt-1" style={{ color: COLORS.subt }}>
                      Target: {milestone.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
