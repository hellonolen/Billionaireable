import { COLORS } from "@/lib/constants";
import { Link } from "wouter";

export function UpgradeBanner() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-3">
      <div 
        className="rounded-lg p-4 flex items-center justify-between"
        style={{ background: COLORS.primary, color: "white" }}
      >
        <div>
          <h3 className="font-semibold mb-1">
            You're viewing the demo dashboard
          </h3>
          <p className="text-sm opacity-90">
            Unlock full access to customize your data, add contacts, and export reports for $97 (one-time payment)
          </p>
        </div>
        <Link href="/checkout">
          <button 
            className="px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            style={{ background: "white", color: COLORS.primary }}
          >
            Unlock Now
          </button>
        </Link>
      </div>
    </div>
  );
}
