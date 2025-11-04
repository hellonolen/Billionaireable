import { useState } from "react";
import { COLORS } from "@/lib/constants";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Save, Eye, EyeOff, Key, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function AdminSettings() {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  
  // Fetch current settings
  const { data: settings, refetch } = trpc.admin.getSettings.useQuery();
  const saveSettings = trpc.admin.saveSettings.useMutation({
    onSuccess: () => {
      toast.success("Settings saved successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to save settings");
    },
  });

  const [formData, setFormData] = useState({
    // Stripe
    stripeSecretKey: "",
    stripePublishableKey: "",
    stripeWebhookSecret: "",
    
    // OpenAI
    openaiApiKey: "",
    
    // Integration APIs
    plaidClientId: "",
    plaidSecret: "",
    whoopApiKey: "",
    ouraApiKey: "",
    
    // Email/Notifications
    sendgridApiKey: "",
    discordWebhookUrl: "",
    
    // General Settings
    maintenanceMode: false,
    allowNewSignups: true,
    maxFreeUsers: 1000,
  });

  const handleSave = () => {
    saveSettings.mutate(formData);
  };

  const toggleSecret = (field: string) => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const renderSecretField = (label: string, field: keyof typeof formData, placeholder: string) => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type={showSecrets[field] ? "text" : "password"}
          className="flex-1 px-3 py-2 border rounded-lg"
          style={{ borderColor: COLORS.border }}
          placeholder={placeholder}
          value={formData[field] as string}
          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
        />
        <button
          onClick={() => toggleSecret(field)}
          className="px-3 py-2 border rounded-lg hover:bg-gray-50"
          style={{ borderColor: COLORS.border }}
        >
          {showSecrets[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      <DashboardHeader />

      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>
            Admin Settings
          </h1>
          <p className="text-sm" style={{ color: COLORS.subt }}>
            Manage API keys, integrations, and platform configuration
          </p>
        </div>

        {/* Stripe Configuration */}
        <div className="bg-white border rounded-xl p-6 mb-6" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-2 mb-4">
            <Key className="h-5 w-5" style={{ color: COLORS.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: COLORS.text }}>
              Stripe Configuration
            </h2>
          </div>
          {renderSecretField("Secret Key", "stripeSecretKey", "sk_live_...")}
          {renderSecretField("Publishable Key", "stripePublishableKey", "pk_live_...")}
          {renderSecretField("Webhook Secret", "stripeWebhookSecret", "whsec_...")}
        </div>

        {/* OpenAI Configuration */}
        <div className="bg-white border rounded-xl p-6 mb-6" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-2 mb-4">
            <Key className="h-5 w-5" style={{ color: COLORS.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: COLORS.text }}>
              OpenAI Configuration
            </h2>
          </div>
          {renderSecretField("API Key", "openaiApiKey", "sk-...")}
        </div>

        {/* Integration APIs */}
        <div className="bg-white border rounded-xl p-6 mb-6" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-2 mb-4">
            <Key className="h-5 w-5" style={{ color: COLORS.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: COLORS.text }}>
              Integration APIs
            </h2>
          </div>
          {renderSecretField("Plaid Client ID", "plaidClientId", "...")}
          {renderSecretField("Plaid Secret", "plaidSecret", "...")}
          {renderSecretField("WHOOP API Key", "whoopApiKey", "...")}
          {renderSecretField("Oura API Key", "ouraApiKey", "...")}
        </div>

        {/* Email & Notifications */}
        <div className="bg-white border rounded-xl p-6 mb-6" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-2 mb-4">
            <Key className="h-5 w-5" style={{ color: COLORS.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: COLORS.text }}>
              Email & Notifications
            </h2>
          </div>
          {renderSecretField("SendGrid API Key", "sendgridApiKey", "SG....")}
          {renderSecretField("Discord Webhook URL", "discordWebhookUrl", "https://discord.com/api/webhooks/...")}
        </div>

        {/* General Settings */}
        <div className="bg-white border rounded-xl p-6 mb-6" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-2 mb-4">
            <SettingsIcon className="h-5 w-5" style={{ color: COLORS.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: COLORS.text }}>
              General Settings
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium" style={{ color: COLORS.text }}>Maintenance Mode</div>
                <div className="text-sm" style={{ color: COLORS.subt }}>Disable access for all users except admins</div>
              </div>
              <input
                type="checkbox"
                checked={formData.maintenanceMode}
                onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                className="h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium" style={{ color: COLORS.text }}>Allow New Signups</div>
                <div className="text-sm" style={{ color: COLORS.subt }}>Enable new user registration</div>
              </div>
              <input
                type="checkbox"
                checked={formData.allowNewSignups}
                onChange={(e) => setFormData({ ...formData, allowNewSignups: e.target.checked })}
                className="h-4 w-4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                Max Free Users
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
                value={formData.maxFreeUsers}
                onChange={(e) => setFormData({ ...formData, maxFreeUsers: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="flex items-center gap-2"
            style={{ background: COLORS.primary, color: "white" }}
          >
            <Save className="h-4 w-4" />
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
