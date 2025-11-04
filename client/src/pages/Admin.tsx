import { useState } from "react";
import { COLORS } from "@/lib/constants";
import { DashboardHeader } from "@/components/DashboardHeader";
import { 
  Users, DollarSign, TrendingUp, Activity, 
  Settings, FileText, CreditCard, AlertCircle,
  UserCheck, UserX, Crown, Shield
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

type AdminTab = "overview" | "users" | "settings" | "analytics" | "billing" | "content" | "system";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [, setLocation] = useLocation();
  
  // Fetch admin data
  const { data: stats } = trpc.admin.getStats.useQuery();
  const { data: users } = trpc.admin.getAllUsers.useQuery();
  const { data: recentActivity } = trpc.admin.getRecentActivity.useQuery();

  const tabs = [
    { id: "overview" as AdminTab, label: "Overview", icon: Activity },
    { id: "users" as AdminTab, label: "Users", icon: Users },
    { id: "billing" as AdminTab, label: "Billing", icon: CreditCard },
    { id: "analytics" as AdminTab, label: "Analytics", icon: TrendingUp },
    { id: "content" as AdminTab, label: "Content", icon: FileText },
    { id: "settings" as AdminTab, label: "Settings", icon: Settings },
    { id: "system" as AdminTab, label: "System", icon: AlertCircle },
  ];

  const StatCard = ({ icon: Icon, label, value, change, trend }: any) => (
    <div className="bg-white border rounded-xl p-6" style={{ borderColor: COLORS.border }}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg" style={{ background: `${COLORS.primary}15` }}>
          <Icon className="h-6 w-6" style={{ color: COLORS.primary }} />
        </div>
        {change && (
          <div className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? '↑' : '↓'} {change}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color: COLORS.text }}>{value}</div>
      <div className="text-sm" style={{ color: COLORS.subt }}>{label}</div>
    </div>
  );

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      <DashboardHeader />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6" style={{ color: COLORS.primary }} />
            <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>
              Admin Dashboard
            </h1>
          </div>
          <p className="text-sm" style={{ color: COLORS.subt }}>
            Manage users, billing, content, and platform settings
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'bg-white border hover:bg-gray-50'
              }`}
              style={{
                background: activeTab === tab.id ? COLORS.primary : undefined,
                borderColor: activeTab === tab.id ? undefined : COLORS.border,
                color: activeTab === tab.id ? 'white' : COLORS.text,
              }}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Users}
                label="Total Users"
                value={stats?.totalUsers || "0"}
                change="+12%"
                trend="up"
              />
              <StatCard
                icon={UserCheck}
                label="Active Users (30d)"
                value={stats?.activeUsers || "0"}
                change="+8%"
                trend="up"
              />
              <StatCard
                icon={Crown}
                label="Paid Subscribers"
                value={stats?.paidUsers || "0"}
                change="+15%"
                trend="up"
              />
              <StatCard
                icon={DollarSign}
                label="Monthly Revenue"
                value={`$${stats?.totalRevenue || "0"}`}
                change="+22%"
                trend="up"
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-white border rounded-xl p-6" style={{ borderColor: COLORS.border }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>
                Recent Activity
              </h2>
              <div className="space-y-3">
                {recentActivity?.slice(0, 10).map((activity: any, i: number) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: COLORS.border }}>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div>
                        <div className="text-sm font-medium" style={{ color: COLORS.text }}>
                          {activity.action}
                        </div>
                        <div className="text-xs" style={{ color: COLORS.subt }}>
                          {activity.user} • {activity.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      {activity.type}
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8" style={{ color: COLORS.subt }}>
                    No recent activity
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab("users")}
                className="bg-white border rounded-xl p-6 text-left hover:shadow-md transition-shadow"
                style={{ borderColor: COLORS.border }}
              >
                <Users className="h-8 w-8 mb-3" style={{ color: COLORS.primary }} />
                <div className="font-semibold mb-1" style={{ color: COLORS.text }}>Manage Users</div>
                <div className="text-sm" style={{ color: COLORS.subt }}>View and manage all user accounts</div>
              </button>

              <button
                onClick={() => setActiveTab("billing")}
                className="bg-white border rounded-xl p-6 text-left hover:shadow-md transition-shadow"
                style={{ borderColor: COLORS.border }}
              >
                <CreditCard className="h-8 w-8 mb-3" style={{ color: COLORS.primary }} />
                <div className="font-semibold mb-1" style={{ color: COLORS.text }}>Billing Overview</div>
                <div className="text-sm" style={{ color: COLORS.subt }}>Manage subscriptions and payments</div>
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className="bg-white border rounded-xl p-6 text-left hover:shadow-md transition-shadow"
                style={{ borderColor: COLORS.border }}
              >
                <Settings className="h-8 w-8 mb-3" style={{ color: COLORS.primary }} />
                <div className="font-semibold mb-1" style={{ color: COLORS.text }}>Platform Settings</div>
                <div className="text-sm" style={{ color: COLORS.subt }}>Configure API keys and settings</div>
              </button>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white border rounded-xl p-6" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold" style={{ color: COLORS.text }}>
                User Management
              </h2>
              <input
                type="search"
                placeholder="Search users..."
                className="px-4 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: COLORS.border }}>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: COLORS.subt }}>User</th>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: COLORS.subt }}>Email</th>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: COLORS.subt }}>Plan</th>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: COLORS.subt }}>Joined</th>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: COLORS.subt }}>Status</th>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: COLORS.subt }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user: any, i: number) => (
                    <tr key={i} className="border-b hover:bg-gray-50" style={{ borderColor: COLORS.border }}>
                      <td className="py-3 px-4">
                        <div className="font-medium" style={{ color: COLORS.text }}>{user.name}</div>
                      </td>
                      <td className="py-3 px-4" style={{ color: COLORS.text }}>{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.plan === 'pro' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.plan || 'Free'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm" style={{ color: COLORS.subt }}>{user.joined}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-sm hover:underline" style={{ color: COLORS.primary }}>
                          Manage
                        </button>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={6} className="text-center py-8" style={{ color: COLORS.subt }}>
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            <button
              onClick={() => setLocation("/admin/settings")}
              className="w-full bg-white border rounded-xl p-6 text-left hover:shadow-md transition-shadow"
              style={{ borderColor: COLORS.border }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold mb-1" style={{ color: COLORS.text }}>API Keys & Configuration</div>
                  <div className="text-sm" style={{ color: COLORS.subt }}>
                    Manage Stripe, OpenAI, and integration API keys
                  </div>
                </div>
                <Settings className="h-6 w-6" style={{ color: COLORS.primary }} />
              </div>
            </button>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="space-y-4">
            <button
              onClick={() => setLocation("/admin/ai-companion")}
              className="w-full bg-white border rounded-xl p-6 text-left hover:shadow-md transition-shadow"
              style={{ borderColor: COLORS.border }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold mb-1" style={{ color: COLORS.text }}>AI Companion Management</div>
                  <div className="text-sm" style={{ color: COLORS.subt }}>
                    Manage knowledge base, insights, and conversations
                  </div>
                </div>
                <FileText className="h-6 w-6" style={{ color: COLORS.primary }} />
              </div>
            </button>
          </div>
        )}

        {/* Other tabs - placeholder for now */}
        {["billing", "analytics", "system"].includes(activeTab) && (
          <div className="bg-white border rounded-xl p-12 text-center" style={{ borderColor: COLORS.border }}>
            <div className="text-lg font-semibold mb-2" style={{ color: COLORS.text }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard
            </div>
            <div className="text-sm" style={{ color: COLORS.subt }}>
              Coming soon - this section is under development
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
