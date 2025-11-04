import { useState } from "react";
import { COLORS } from "@/lib/constants";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Preferences() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [monthlyReports, setMonthlyReports] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);

  const handleSave = () => {
    // TODO: Save to database
    localStorage.setItem('preferences', JSON.stringify({
      emailNotifications,
      weeklyReports,
      monthlyReports,
      marketingEmails,
      dataSharing,
    }));
    toast.success("Preferences saved successfully");
  };

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      <DashboardHeader />
      
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
          Preferences
        </h1>
        <p className="text-sm mb-8" style={{ color: COLORS.subt }}>
          Manage your notification and privacy preferences
        </p>

        <div className="space-y-6">
          {/* Notifications Section */}
          <div className="bg-white border rounded-xl p-6" style={{ borderColor: COLORS.border }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>
              Notifications
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium" style={{ color: COLORS.text }}>
                    Email Notifications
                  </div>
                  <div className="text-sm" style={{ color: COLORS.subt }}>
                    Receive email notifications for important updates
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium" style={{ color: COLORS.text }}>
                    Weekly Reports
                  </div>
                  <div className="text-sm" style={{ color: COLORS.subt }}>
                    Receive weekly summary of your metrics
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={weeklyReports}
                    onChange={(e) => setWeeklyReports(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium" style={{ color: COLORS.text }}>
                    Monthly Reports
                  </div>
                  <div className="text-sm" style={{ color: COLORS.subt }}>
                    Receive monthly comprehensive reports
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={monthlyReports}
                    onChange={(e) => setMonthlyReports(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium" style={{ color: COLORS.text }}>
                    Marketing Emails
                  </div>
                  <div className="text-sm" style={{ color: COLORS.subt }}>
                    Receive updates about new features and offers
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingEmails}
                    onChange={(e) => setMarketingEmails(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="bg-white border rounded-xl p-6" style={{ borderColor: COLORS.border }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>
              Privacy
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium" style={{ color: COLORS.text }}>
                    Anonymous Usage Data
                  </div>
                  <div className="text-sm" style={{ color: COLORS.subt }}>
                    Help us improve by sharing anonymous usage statistics
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dataSharing}
                    onChange={(e) => setDataSharing(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white border rounded-xl p-6" style={{ borderColor: COLORS.border }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>
              Data Management
            </h2>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => toast.info("Data export feature coming soon")}
              >
                Export My Data
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700"
                onClick={() => toast.error("Please contact support to delete your account")}
              >
                Delete My Account
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              style={{ background: COLORS.primary, color: "white" }}
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
