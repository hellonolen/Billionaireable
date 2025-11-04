import React, { useState } from "react";
import { COLORS } from "@/lib/constants";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Bell, TrendingUp, Flame, Trophy, AlertCircle, CheckCircle, Settings } from "lucide-react";
import { toast } from "sonner";

const NOTIFICATIONS = [
  {
    id: 1,
    type: "milestone",
    icon: Trophy,
    color: "#f59e0b",
    title: "Milestone Achieved!",
    message: "You're 95% of the way to your next net worth milestone of $1.5B",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "streak",
    icon: Flame,
    color: "#ef4444",
    title: "Streak Alert",
    message: "You're 3 days away from your best workout streak of 30 days!",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "insight",
    icon: TrendingUp,
    color: COLORS.primary,
    title: "New Insight Available",
    message: "Your HRV improved 18% this month. Check out the correlation with sleep quality.",
    time: "1 day ago",
    read: true,
  },
  {
    id: 4,
    type: "achievement",
    icon: Trophy,
    color: "#8b5cf6",
    title: "Achievement Unlocked!",
    message: "You've unlocked 'Data Devotee' - 90 days of consistent tracking",
    time: "2 days ago",
    read: true,
  },
  {
    id: 5,
    type: "alert",
    icon: AlertCircle,
    color: "#f59e0b",
    title: "Unusual Pattern Detected",
    message: "Your sleep quality dropped 25% this week. Consider reviewing your schedule.",
    time: "3 days ago",
    read: true,
  },
  {
    id: 6,
    type: "milestone",
    icon: Trophy,
    color: "#10b981",
    title: "Portfolio Milestone",
    message: "Your portfolio crossed $500M in total assets under management",
    time: "4 days ago",
    read: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    toast.success("Marked as read");
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      <DashboardHeader />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.text }}>Notifications</h1>
            <p className="text-sm" style={{ color: COLORS.subt }}>{unreadCount} unread notifications</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilter("all")}
              className="relative text-sm font-medium group"
              style={{ color: filter === "all" ? COLORS.primary : COLORS.text }}
            >
              All
              <span className={`absolute bottom-0 left-0 w-full h-0.5 transition-all ${filter === "all" ? 'bg-blue-500 scale-x-100' : 'bg-blue-500 scale-x-0 group-hover:scale-x-100'}`} style={{ transformOrigin: 'left' }} />
            </button>
            <button
              onClick={() => setFilter("unread")}
              className="relative text-sm font-medium group"
              style={{ color: filter === "unread" ? COLORS.primary : COLORS.text }}
            >
              Unread
              <span className={`absolute bottom-0 left-0 w-full h-0.5 transition-all ${filter === "unread" ? 'bg-blue-500 scale-x-100' : 'bg-blue-500 scale-x-0 group-hover:scale-x-100'}`} style={{ transformOrigin: 'left' }} />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="relative text-sm font-medium group"
                style={{ color: COLORS.text }}
              >
                Mark All Read
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-400 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
              </button>
            )}
          </div>
        </div>

        {/* Notifications Grid - 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {filteredNotifications.map(notification => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className="bg-white border rounded-xl p-4 hover:shadow-sm transition-shadow cursor-pointer"
                style={{
                  borderColor: notification.read ? COLORS.border : notification.color,
                  borderLeftWidth: notification.read ? "1px" : "4px",
                  opacity: notification.read ? 0.8 : 1,
                }}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="p-2.5 rounded-lg flex-shrink-0"
                    style={{ background: `${notification.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: notification.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-sm" style={{ color: COLORS.text }}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                          style={{ background: notification.color }}
                        />
                      )}
                    </div>
                    <p className="text-xs mb-2 line-clamp-2" style={{ color: COLORS.subt }}>
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: COLORS.subt }}>
                        {notification.time}
                      </span>
                      {notification.read && (
                        <CheckCircle className="h-3.5 w-3.5" style={{ color: COLORS.primary }} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12 bg-white border rounded-xl" style={{ borderColor: COLORS.border }}>
            <Bell className="h-12 w-12 mx-auto mb-3" style={{ color: COLORS.subt }} />
            <p className="text-lg font-medium mb-1" style={{ color: COLORS.text }}>
              No notifications
            </p>
            <p className="text-sm" style={{ color: COLORS.subt }}>
              You're all caught up!
            </p>
          </div>
        )}

        {/* Notification Preferences - Compact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border rounded-xl p-5" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base" style={{ color: COLORS.text }}>
                Notification Preferences
              </h3>
              <Settings className="h-4 w-4" style={{ color: COLORS.subt }} />
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Milestone Alerts", desc: "Near milestone achievements" },
                { label: "Streak Reminders", desc: "Daily streak maintenance" },
                { label: "New Insights", desc: "AI pattern discoveries" },
              ].map((pref, idx) => (
                <label key={idx} className="flex items-center justify-between p-2.5 border rounded-lg hover:bg-gray-50 cursor-pointer" style={{ borderColor: COLORS.border }}>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs" style={{ color: COLORS.text }}>{pref.label}</div>
                    <div className="text-xs" style={{ color: COLORS.subt }}>{pref.desc}</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 flex-shrink-0 ml-2" />
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white border rounded-xl p-5" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base" style={{ color: COLORS.text }}>
                Alert Settings
              </h3>
              <Settings className="h-4 w-4" style={{ color: COLORS.subt }} />
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Achievement Unlocks", desc: "New badge notifications" },
                { label: "Anomaly Alerts", desc: "Unusual pattern detection" },
                { label: "Email Digest", desc: "Weekly summary emails" },
              ].map((pref, idx) => (
                <label key={idx} className="flex items-center justify-between p-2.5 border rounded-lg hover:bg-gray-50 cursor-pointer" style={{ borderColor: COLORS.border }}>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs" style={{ color: COLORS.text }}>{pref.label}</div>
                    <div className="text-xs" style={{ color: COLORS.subt }}>{pref.desc}</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 flex-shrink-0 ml-2" />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
