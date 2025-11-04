import React, { useState } from "react";
import { COLORS } from "@/lib/constants";
import { DashboardHeader } from "@/components/DashboardHeader";
import { User, Mail, Building, Upload, CreditCard, FileText, CheckCircle, Shield, Key, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const [avatar, setAvatar] = useState<string>("");
  const [name, setName] = useState("John Billionaire");
  const [email, setEmail] = useState("john@billionaire.com");
  const [company, setCompany] = useState("Billionaire Ventures");
  const [isEditing, setIsEditing] = useState(false);
  const [cardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry] = useState("12/25");
  const [idUploaded, setIdUploaded] = useState(false);
  const [idFileName, setIdFileName] = useState("");

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        toast.success("Avatar uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdUploaded(true);
      setIdFileName(file.name);
      toast.success("Government ID uploaded successfully");
    }
  };

  const handleSave = () => {
    toast.success("Profile updated successfully");
    setIsEditing(false);
  };

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      <DashboardHeader />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.text }}>Profile</h1>
          <p className="text-sm" style={{ color: COLORS.subt }}>Manage your personal information and account settings</p>
        </div>

        {/* Grid Layout - 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Personal Information */}
          <div className="bg-white border rounded-xl p-5" style={{ borderColor: COLORS.border }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
                  style={{ background: avatar ? "transparent" : COLORS.primary }}
                >
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-base font-semibold" style={{ color: COLORS.text }}>Personal Information</h2>
                  <label htmlFor="avatar-upload">
                    <button
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      className="relative text-xs font-medium group mt-0.5"
                      style={{ color: COLORS.primary }}
                    >
                      Change Photo
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                    </button>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </div>
              </div>
              {!isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="relative text-sm font-medium group"
                    style={{ color: COLORS.text }}
                  >
                    Edit
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-400 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                  </button>

                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: COLORS.subt }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor: COLORS.border }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: COLORS.subt }}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor: COLORS.border }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: COLORS.subt }}>
                  Company
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor: COLORS.border }}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="relative text-sm font-medium group flex-1 text-center py-2"
                  style={{ color: COLORS.text }}
                >
                  Cancel
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-400 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                </button>
                <button
                  onClick={handleSave}
                  className="relative text-sm font-medium group flex-1 text-center py-2"
                  style={{ color: COLORS.primary }}
                >
                  Save Changes
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                </button>
              </div>
            )}
          </div>

          {/* Payment & Subscription */}
          <div className="bg-white border rounded-xl p-5" style={{ borderColor: COLORS.border }}>
            <h2 className="text-base font-semibold mb-4" style={{ color: COLORS.text }}>
              Payment & Subscription
            </h2>
            
            {/* Credit Card */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium" style={{ color: COLORS.subt }}>Credit Card</div>
                <button
                  onClick={() => toast.info("Opening payment method editor...")}
                  className="relative text-xs font-medium group"
                  style={{ color: COLORS.primary }}
                >
                  Update
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                </button>
              </div>
              <div className="border rounded-lg p-3" style={{ borderColor: COLORS.border }}>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-7 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm" style={{ color: COLORS.text }}>{cardNumber}</div>
                    <div className="text-xs" style={{ color: COLORS.subt }}>Expires {cardExpiry}</div>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                </div>
              </div>
            </div>

            {/* Subscription */}
            <div className="border-t pt-4" style={{ borderColor: COLORS.border }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-sm mb-0.5" style={{ color: COLORS.text }}>Pro Plan</div>
                  <div className="text-xs" style={{ color: COLORS.subt }}>$99/month</div>
                  <div className="text-xs" style={{ color: COLORS.subt }}>Renews Dec 15, 2024</div>
                </div>
                <button
                  onClick={() => toast.info("Opening subscription management...")}
                  className="relative text-xs font-medium group"
                  style={{ color: COLORS.text }}
                >
                  Manage
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-400 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Identity Verification */}
          <div className="bg-white border rounded-xl p-5" style={{ borderColor: COLORS.border }}>
            <h2 className="text-base font-semibold mb-3" style={{ color: COLORS.text }}>
              Identity Verification
            </h2>
            
            {idUploaded ? (
              <div className="border rounded-lg p-3 bg-green-50" style={{ borderColor: '#10b981' }}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-green-900">ID Verified</div>
                    <div className="text-xs text-green-700 truncate">{idFileName}</div>
                  </div>
                  <button
                    onClick={() => {
                      setIdUploaded(false);
                      setIdFileName("");
                      toast.info("ID removed");
                    }}
                    className="relative text-xs font-medium group text-red-600 flex-shrink-0"
                  >
                    Remove
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                style={{ borderColor: COLORS.border }}
                onClick={() => document.getElementById('id-upload')?.click()}
              >
                <input
                  id="id-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleIdUpload}
                  className="hidden"
                />
                <Upload className="h-8 w-8 mx-auto mb-2" style={{ color: COLORS.subt }} />
                <div className="font-medium text-sm mb-1" style={{ color: COLORS.text }}>Upload Government ID</div>
                <div className="text-xs" style={{ color: COLORS.subt }}>Driver's License, Passport, or National ID</div>
                <div className="text-xs mt-1" style={{ color: COLORS.subt }}>PDF, JPG, PNG (Max 10MB)</div>
              </div>
            )}
          </div>

          {/* Security Settings */}
          <div className="bg-white border rounded-xl p-5" style={{ borderColor: COLORS.border }}>
            <h2 className="text-base font-semibold mb-3" style={{ color: COLORS.text }}>Security</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: COLORS.border }}>
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4" style={{ color: COLORS.subt }} />
                  <div>
                    <div className="font-medium text-sm" style={{ color: COLORS.text }}>Password</div>
                    <div className="text-xs" style={{ color: COLORS.subt }}>Changed 30 days ago</div>
                  </div>
                </div>
                <button
                  onClick={() => toast.info("Opening password change dialog...")}
                  className="relative text-xs font-medium group"
                  style={{ color: COLORS.text }}
                >
                  Change
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-400 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                </button>
              </div>
              <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: COLORS.border }}>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" style={{ color: COLORS.subt }} />
                  <div>
                    <div className="font-medium text-sm" style={{ color: COLORS.text }}>Two-Factor Auth</div>
                    <div className="text-xs" style={{ color: COLORS.subt }}>Extra security layer</div>
                  </div>
                </div>
                <button
                  onClick={() => toast.info("Opening 2FA setup...")}
                  className="relative text-xs font-medium group"
                  style={{ color: COLORS.primary }}
                >
                  Enable
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" style={{ color: '#ef4444' }} />
                  <div>
                    <div className="font-medium text-sm" style={{ color: COLORS.text }}>Delete Account</div>
                    <div className="text-xs" style={{ color: COLORS.subt }}>Permanently remove data</div>
                  </div>
                </div>
                <button
                  onClick={() => toast.error("Please contact support to delete your account")}
                  className="relative text-xs font-medium group text-red-600"
                >
                  Delete
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
