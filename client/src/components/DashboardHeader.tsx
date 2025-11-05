import { COLORS } from "@/lib/constants";
import { Bell, User, ChevronDown, CreditCard, Users, Link as LinkIcon, Download, LogOut, Plus, Settings, Shield } from "lucide-react";
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

  return (
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
          <Link href="/markets">
            <button className="relative px-2 py-1.5 text-xs font-medium hidden md:inline-block group" style={{ color: COLORS.text }}>
              Markets
              <span className={`absolute bottom-0 left-0 w-full h-0.5 transition-all ${isActive('/markets') ? 'bg-blue-500' : 'bg-blue-500 scale-x-0 group-hover:scale-x-100'}`} style={{ transformOrigin: 'left' }} />
            </button>
          </Link>
          <Link href="/system">
            <button className="relative px-2 py-1.5 text-xs font-medium hidden md:inline-block group" style={{ color: COLORS.text }}>
              System
              <span className={`absolute bottom-0 left-0 w-full h-0.5 transition-all ${isActive('/system') ? 'bg-blue-500' : 'bg-blue-500 scale-x-0 group-hover:scale-x-100'}`} style={{ transformOrigin: 'left' }} />
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
                      <div className="font-medium text-sm truncate" style={{ color: COLORS.text }}>Dashboard User</div>
                      <div className="text-xs truncate" style={{ color: COLORS.subt }}>user@example.com</div>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
