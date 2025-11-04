import { COLORS } from "@/lib/constants";
import { Bell, User, ChevronDown, CreditCard, Users, Link as LinkIcon, Download, LogOut, Plus, Sun, Moon, Settings, Shield } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface DashboardHeaderProps {
  onQuickAdd?: () => void;
  onToggleTheme?: () => void;
  onOpenCustomize?: () => void;
}

export function DashboardHeader({ onQuickAdd, onToggleTheme, onOpenCustomize }: DashboardHeaderProps) {
  const [location] = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignIn = () => {
    setShowSignInModal(true);
  };

  return (
    <>
    <header className="border-b sticky top-0 z-10" style={{ borderColor: COLORS.border, background: COLORS.bg }}>
      <div className="mx-auto max-w-7xl px-2 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Link href="/">
            <div className="leading-tight cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-lg font-semibold" style={{ color: COLORS.text }}>Billionaireable</div>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <Link href="/notifications">
            <button
              className="rounded-lg p-1.5 hover:bg-gray-50 flex items-center justify-center relative"
              title="Notifications"
            >
              <Bell className="h-4 w-4" style={{ color: COLORS.text }} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
            </button>
          </Link>
          
          {/* Navigation links with animated underline */}
          <Link href="/reports">
            <button className="relative px-2 py-1.5 text-xs font-medium hidden sm:inline-block group" style={{ color: COLORS.text }}>
              Reports
              <span className={`absolute bottom-0 left-0 w-full h-0.5 transition-all ${isActive('/reports') ? 'bg-blue-500' : 'bg-blue-500 scale-x-0 group-hover:scale-x-100'}`} style={{ transformOrigin: 'left' }} />
            </button>
          </Link>
          <Link href="/insights">
            <button className="relative px-2 py-1.5 text-xs font-medium hidden sm:inline-block group" style={{ color: COLORS.text }}>
              Insights
              <span className={`absolute bottom-0 left-0 w-full h-0.5 transition-all ${isActive('/insights') ? 'bg-blue-500' : 'bg-blue-500 scale-x-0 group-hover:scale-x-100'}`} style={{ transformOrigin: 'left' }} />
            </button>
          </Link>
          <Link href="/health-goals">
            <button className="relative px-2 py-1.5 text-xs font-medium hidden sm:inline-block group" style={{ color: COLORS.text }}>
              Health
              <span className={`absolute bottom-0 left-0 w-full h-0.5 transition-all ${isActive('/health-goals') ? 'bg-blue-500' : 'bg-blue-500 scale-x-0 group-hover:scale-x-100'}`} style={{ transformOrigin: 'left' }} />
            </button>
          </Link>
          <Link href="/share">
            <button className="relative px-2 py-1.5 text-xs font-medium hidden md:inline-block group" style={{ color: COLORS.text }}>
              Share
              <span className={`absolute bottom-0 left-0 w-full h-0.5 transition-all ${isActive('/share') ? 'bg-blue-500' : 'bg-blue-500 scale-x-0 group-hover:scale-x-100'}`} style={{ transformOrigin: 'left' }} />
            </button>
          </Link>
          
          {/* Action icons - Quick Add only on dashboard */}
          {location === '/' && (
            <button
              onClick={onQuickAdd}
              className="rounded-lg p-1.5 hover:bg-gray-50"
              title="Quick Add"
            >
              <Plus className="h-4 w-4" style={{ color: COLORS.text }} />
            </button>
          )}

          
          {/* Profile Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="rounded-lg p-1.5 hover:bg-gray-50 flex items-center gap-1"
            >
              <User className="h-4 w-4" style={{ color: COLORS.text }} />
              <ChevronDown className="h-3 w-3" style={{ color: COLORS.text }} />
            </button>
            
            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-lg border shadow-lg overflow-hidden z-50"
                style={{ borderColor: COLORS.border, background: COLORS.bg }}
              >
                {/* User Info Section */}
                <div className="px-4 py-3 border-b" style={{ borderColor: COLORS.border, background: COLORS.bg }}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: COLORS.primary }}>
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate" style={{ color: COLORS.text }}>John Billionaire</div>
                      <div className="text-xs truncate" style={{ color: COLORS.subt }}>john@example.com</div>
                    </div>
                  </div>
                </div>
                
                <Link href="/profile">
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    style={{ color: COLORS.text }}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </button>
                </Link>
                <Link href="/settings">
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    style={{ color: COLORS.text }}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </Link>
                <Link href="/admin">
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    style={{ color: COLORS.text }}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Shield className="h-4 w-4" />
                    Admin Dashboard
                  </button>
                </Link>
                <Link href="/billing">
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    style={{ color: COLORS.text }}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <CreditCard className="h-4 w-4" />
                    Billing
                  </button>
                </Link>
                <Link href="/team">
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    style={{ color: COLORS.text }}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Users className="h-4 w-4" />
                    Team
                  </button>
                </Link>
                <Link href="/integrations">
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    style={{ color: COLORS.text }}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <LinkIcon className="h-4 w-4" />
                    Integrations
                  </button>
                </Link>
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  style={{ color: COLORS.text }}
                  onClick={() => {
                    setShowProfileMenu(false);
                    // Export functionality
                  }}
                >
                  <Download className="h-4 w-4" />
                  Export Data
                </button>
                {onOpenCustomize && (
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    style={{ color: COLORS.text }}
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenCustomize();
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    Customize Dashboard
                  </button>
                )}
                <div className="border-t" style={{ borderColor: COLORS.border }} />
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  onClick={() => {
                    setShowProfileMenu(false);
                    // Logout functionality
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Sign In button with animated underline */}
          <button 
            onClick={handleSignIn}
            className="relative px-2 py-1.5 text-xs font-medium group" 
            style={{ color: COLORS.text }}
          >
            Sign In
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
          </button>
        </div>
      </div>
    </header>

    {/* Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(8px)', background: 'rgba(255, 255, 255, 0.3)' }} onClick={() => setShowSignInModal(false)}>
          <div className="bg-white/95 backdrop-blur-xl rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg border" style={{ borderColor: COLORS.border }} onClick={(e) => e.stopPropagation()}>
            <div className="mb-5">
              <h2 className="text-lg font-semibold mb-1" style={{ color: COLORS.text }}>Sign In</h2>
              <p className="text-xs" style={{ color: COLORS.subt }}>Access your dashboard</p>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: COLORS.text }}>Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded text-sm"
                  style={{ borderColor: COLORS.border }}
                  placeholder="john@billionaire.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: COLORS.text }}>Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded text-sm"
                  style={{ borderColor: COLORS.border }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setShowSignInModal(false)}
                className="flex-1 px-3 py-2 border rounded text-xs font-medium hover:bg-gray-50 transition-colors"
                style={{ borderColor: COLORS.border, color: COLORS.text }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSignInModal(false)}
                className="flex-1 px-3 py-2 rounded text-xs font-medium text-white transition-colors"
                style={{ background: COLORS.primary }}
              >
                Sign In
              </button>
            </div>

            <div className="mt-6 text-center">
              <button className="relative text-xs font-medium group" style={{ color: COLORS.primary }}>
                Forgot password?
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
