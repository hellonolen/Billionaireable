import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Link } from "wouter";
import { User, Bell, Database, Link as LinkIcon, Save } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      {/* Header */}
      <DashboardHeader />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2"
            style={{
              background: activeTab === "profile" ? COLORS.primary : "white",
              color: activeTab === "profile" ? "white" : COLORS.text,
              border: `1px solid ${activeTab === "profile" ? COLORS.primary : COLORS.border}`,
            }}
          >
            <User className="h-4 w-4" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("integrations")}
            className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2"
            style={{
              background: activeTab === "integrations" ? COLORS.primary : "white",
              color: activeTab === "integrations" ? "white" : COLORS.text,
              border: `1px solid ${activeTab === "integrations" ? COLORS.primary : COLORS.border}`,
            }}
          >
            <LinkIcon className="h-4 w-4" />
            Integrations
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2"
            style={{
              background: activeTab === "data" ? COLORS.primary : "white",
              color: activeTab === "data" ? "white" : COLORS.text,
              border: `1px solid ${activeTab === "data" ? COLORS.primary : COLORS.border}`,
            }}
          >
            <Database className="h-4 w-4" />
            Data
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2"
            style={{
              background: activeTab === "notifications" ? COLORS.primary : "white",
              color: activeTab === "notifications" ? "white" : COLORS.text,
              border: `1px solid ${activeTab === "notifications" ? COLORS.primary : COLORS.border}`,
            }}
          >
            <Bell className="h-4 w-4" />
            Notifications
          </button>
        </div>

        {/* Content */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: COLORS.border }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Name</label>
                <input
                  type="text"
                  defaultValue={user?.name || ""}
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: COLORS.border }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Email</label>
                <input
                  type="email"
                  defaultValue={user?.email || ""}
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: COLORS.border }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Time Zone</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: COLORS.border }}
                >
                  <option>America/New_York (EST)</option>
                  <option>America/Chicago (CST)</option>
                  <option>America/Denver (MST)</option>
                  <option>America/Los_Angeles (PST)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Currency</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: COLORS.border }}
                >
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "integrations" && (
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: COLORS.border }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>Connected Services</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: COLORS.border }}>
                <div>
                  <div className="font-medium" style={{ color: COLORS.text }}>Apple Health</div>
                  <div className="text-xs" style={{ color: COLORS.subt }}>Last synced 2 hours ago</div>
                </div>
                <Button variant="outline">Disconnect</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: COLORS.border }}>
                <div>
                  <div className="font-medium" style={{ color: COLORS.text }}>Google Fit</div>
                  <div className="text-xs" style={{ color: COLORS.subt }}>Not connected</div>
                </div>
                <Button style={{ background: COLORS.primary, color: "white" }}>Connect</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: COLORS.border }}>
                <div>
                  <div className="font-medium" style={{ color: COLORS.text }}>Plaid Financial</div>
                  <div className="text-xs" style={{ color: COLORS.subt }}>Last synced 1 day ago</div>
                </div>
                <Button variant="outline">Disconnect</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "data" && (
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: COLORS.border }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>Data Management</h2>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg" style={{ borderColor: COLORS.border }}>
                <h3 className="font-medium mb-2" style={{ color: COLORS.text }}>Export Your Data</h3>
                <p className="text-sm mb-3" style={{ color: COLORS.subt }}>
                  Download all your dashboard data in CSV or JSON format
                </p>
                <div className="flex gap-2">
                  <Button variant="outline">Export CSV</Button>
                  <Button variant="outline">Export JSON</Button>
                </div>
              </div>
              <div className="p-4 border rounded-lg" style={{ borderColor: COLORS.border }}>
                <h3 className="font-medium mb-2" style={{ color: COLORS.text }}>Import Data</h3>
                <p className="text-sm mb-3" style={{ color: COLORS.subt }}>
                  Upload historical data from CSV files
                </p>
                <Button variant="outline">Upload CSV</Button>
              </div>
              <div className="p-4 border rounded-lg border-red-200">
                <h3 className="font-medium mb-2 text-red-600">Delete All Data</h3>
                <p className="text-sm mb-3 text-red-500">
                  Permanently delete all your dashboard data. This cannot be undone.
                </p>
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                  Delete Data
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: COLORS.border }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: COLORS.border }}>
                <div>
                  <div className="font-medium" style={{ color: COLORS.text }}>Email Notifications</div>
                  <div className="text-xs" style={{ color: COLORS.subt }}>Receive updates via email</div>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: COLORS.border }}>
                <div>
                  <div className="font-medium" style={{ color: COLORS.text }}>Push Notifications</div>
                  <div className="text-xs" style={{ color: COLORS.subt }}>Browser notifications for alerts</div>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: COLORS.border }}>
                <div>
                  <div className="font-medium" style={{ color: COLORS.text }}>Weekly Summary</div>
                  <div className="text-xs" style={{ color: COLORS.subt }}>Get weekly performance reports</div>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: COLORS.border }}>
                <div>
                  <div className="font-medium" style={{ color: COLORS.text }}>Goal Milestones</div>
                  <div className="text-xs" style={{ color: COLORS.subt }}>Alerts when goals are achieved</div>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
