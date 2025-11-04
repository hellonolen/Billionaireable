import { TrendingUp, TrendingDown, ArrowUpRight, Circle, Minus } from "lucide-react";

/**
 * Design 2: Luxury Minimalist Dashboard
 * 
 * Concept: Dark, elegant, and sophisticated. Think Bloomberg Terminal meets luxury brand.
 * Less is more - only show what matters, with perfect typography and spacing.
 * 
 * Key Features:
 * - Dark theme (charcoal/black)
 * - Minimal UI, maximum impact
 * - Gold accents for premium feel
 * - Large typography
 * - Generous white space
 * - Subtle animations
 * - Color: Black/Charcoal with Gold accents
 */

export default function Design2() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section - Minimalist */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Time & Date */}
          <div className="text-sm text-gray-500 mb-8 font-light tracking-wide">
            MONDAY, NOVEMBER 4, 2025 • 3:15 PM EST
          </div>
          
          {/* Main Net Worth */}
          <div className="mb-16">
            <div className="text-sm text-gray-500 mb-3 font-light tracking-widest uppercase">Net Worth</div>
            <div className="flex items-baseline gap-6 mb-4">
              <div className="text-8xl font-light tracking-tight">$127.4<span className="text-gray-600">M</span></div>
              <div className="flex items-center gap-2 text-[#D4AF37] text-2xl font-light">
                <ArrowUpRight className="h-6 w-6" />
                <span>+3.4%</span>
              </div>
            </div>
            <div className="text-gray-500 font-light">
              +$4.2M this week
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-16" />

          {/* Key Metrics - Horizontal */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="text-xs text-gray-600 mb-3 font-light tracking-widest uppercase">Cash Runway</div>
              <div className="text-4xl font-light mb-2">42 <span className="text-2xl text-gray-600">months</span></div>
              <div className="flex items-center gap-2 text-orange-400 text-sm font-light">
                <TrendingDown className="h-4 w-4" />
                <span>-3 months</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-600 mb-3 font-light tracking-widest uppercase">Total ARR</div>
              <div className="text-4xl font-light mb-2">$163<span className="text-2xl text-gray-600">M</span></div>
              <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-light">
                <TrendingUp className="h-4 w-4" />
                <span>+14.8%</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-600 mb-3 font-light tracking-widest uppercase">Investments</div>
              <div className="text-4xl font-light mb-2">+22.1<span className="text-2xl text-gray-600">%</span></div>
              <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-light">
                <TrendingUp className="h-4 w-4" />
                <span>YTD</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-600 mb-3 font-light tracking-widest uppercase">Health Score</div>
              <div className="text-4xl font-light mb-2">94<span className="text-2xl text-gray-600">/100</span></div>
              <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-light">
                <TrendingUp className="h-4 w-4" />
                <span>+3.5%</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-16" />

          {/* AI Insight - Minimal */}
          <div className="border border-gray-800 rounded-none p-8 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-1 h-20 bg-[#D4AF37]" />
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-4 font-light tracking-widest uppercase">AI Observation</div>
                <div className="text-xl font-light text-gray-300 mb-6 leading-relaxed">
                  Your cash runway decreased to 42 months after increasing team size by 15% last quarter. 
                  This trajectory suggests you'll need additional capital within 18 months if burn rate continues.
                </div>
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-white text-black text-sm font-light tracking-wide hover:bg-gray-200 transition-colors">
                    DISCUSS
                  </button>
                  <button className="px-6 py-3 border border-gray-700 text-gray-400 text-sm font-light tracking-wide hover:border-gray-600 transition-colors">
                    DISMISS
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent my-16" />

          {/* Portfolio Breakdown - Minimal Table */}
          <div className="mb-16">
            <div className="text-xs text-gray-600 mb-8 font-light tracking-widest uppercase">Top Holdings</div>
            
            <div className="space-y-6">
              {/* Holding 1 */}
              <div className="flex items-center justify-between py-4 border-b border-gray-900">
                <div className="flex items-center gap-6">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <div>
                    <div className="text-lg font-light text-white mb-1">HealthTech Co</div>
                    <div className="text-sm text-gray-600 font-light">287 employees</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-light text-white mb-1">$85M</div>
                  <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-light">
                    <TrendingUp className="h-4 w-4" />
                    <span>+38%</span>
                  </div>
                </div>
              </div>

              {/* Holding 2 */}
              <div className="flex items-center justify-between py-4 border-b border-gray-900">
                <div className="flex items-center gap-6">
                  <div className="w-2 h-2 rounded-full bg-gray-600" />
                  <div>
                    <div className="text-lg font-light text-white mb-1">SaaS Infra</div>
                    <div className="text-sm text-gray-600 font-light">143 employees</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-light text-white mb-1">$62M</div>
                  <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-light">
                    <TrendingUp className="h-4 w-4" />
                    <span>+44%</span>
                  </div>
                </div>
              </div>

              {/* Holding 3 */}
              <div className="flex items-center justify-between py-4 border-b border-gray-900">
                <div className="flex items-center gap-6">
                  <div className="w-2 h-2 rounded-full bg-gray-600" />
                  <div>
                    <div className="text-lg font-light text-white mb-1">Consumer Brand</div>
                    <div className="text-sm text-gray-600 font-light">198 employees</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-light text-white mb-1">$41M</div>
                  <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-light">
                    <TrendingUp className="h-4 w-4" />
                    <span>+51%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-16" />

          {/* Alerts - Minimal */}
          <div className="mb-16">
            <div className="text-xs text-gray-600 mb-8 font-light tracking-widest uppercase">Requires Attention</div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-6 border border-orange-900/30 bg-orange-950/10">
                <Circle className="h-2 w-2 text-orange-500 mt-2 flex-shrink-0" fill="currentColor" />
                <div className="flex-1">
                  <div className="text-white font-light mb-1">Haven't connected with Sarah Chen in 3 weeks</div>
                  <div className="text-sm text-gray-500 font-light">Lead investor • Usually connect every 10 days</div>
                </div>
                <button className="text-xs text-gray-500 hover:text-white transition-colors font-light tracking-wide">
                  EMAIL
                </button>
              </div>

              <div className="flex items-start gap-4 p-6 border border-blue-900/30 bg-blue-950/10">
                <Circle className="h-2 w-2 text-blue-500 mt-2 flex-shrink-0" fill="currentColor" />
                <div className="flex-1">
                  <div className="text-white font-light mb-1">HRV dropped 12% this week</div>
                  <div className="text-sm text-gray-500 font-light">4 consecutive late nights • Recovery recommended</div>
                </div>
                <button className="text-xs text-gray-500 hover:text-white transition-colors font-light tracking-wide">
                  VIEW
                </button>
              </div>
            </div>
          </div>

          {/* Design Note */}
          <div className="mt-20 p-8 border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/5 to-transparent">
            <h3 className="text-white font-light text-lg mb-3 tracking-wide">Design 2: Luxury Minimalist</h3>
            <p className="text-gray-400 font-light mb-6 leading-relaxed">
              This design embraces dark elegance with a focus on typography, spacing, and restraint. 
              Inspired by luxury brands and Bloomberg Terminal, it shows only what matters with maximum impact.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 border border-gray-800 text-xs font-light text-gray-400 tracking-wide">DARK THEME</span>
              <span className="px-4 py-2 border border-gray-800 text-xs font-light text-gray-400 tracking-wide">MINIMALIST</span>
              <span className="px-4 py-2 border border-gray-800 text-xs font-light text-gray-400 tracking-wide">GOLD ACCENTS</span>
              <span className="px-4 py-2 border border-gray-800 text-xs font-light text-gray-400 tracking-wide">ELEGANT</span>
              <span className="px-4 py-2 border border-gray-800 text-xs font-light text-gray-400 tracking-wide">LUXURY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
