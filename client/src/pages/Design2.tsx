import { TrendingUp, TrendingDown, DollarSign, Clock, Target, Heart, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * Design 2: Luxury Minimalist Dashboard
 * 
 * Concept: Dark, elegant, sophisticated. Think Bloomberg Terminal meets luxury brands.
 * Less is more - generous white space, large typography, gold accents.
 * 
 * Key Features:
 * - Dark theme (charcoal/black background)
 * - Gold accents for premium feel
 * - Large, elegant typography
 * - Generous white space
 * - Minimal UI, maximum impact
 * - Color: Black/Charcoal with Gold highlights
 */

export default function Design2() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Minimal Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-2">Monday, November 4</div>
              <h1 className="text-4xl font-light">Good morning, John</h1>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-600/30">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-yellow-500">AI Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Net Worth */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl">
          <div className="mb-16">
            <div className="text-gray-500 text-sm uppercase tracking-widest mb-4">Total Net Worth</div>
            <div className="text-8xl font-light mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              $127.4M
            </div>
            <div className="flex items-center gap-3 text-xl">
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp className="h-6 w-6" />
                <span>+$4.2M</span>
              </div>
              <span className="text-gray-600">|</span>
              <span className="text-gray-400">+3.4% this week</span>
            </div>
          </div>

          {/* AI Insight - Minimal */}
          <div className="border-l-2 border-yellow-600 pl-6 py-4 mb-16">
            <div className="text-yellow-500 text-sm uppercase tracking-widest mb-3">AI Insight</div>
            <p className="text-xl text-gray-300 leading-relaxed mb-6">
              Your cash runway decreased to 42 months after expanding your team by 15%. 
              Current burn rate suggests you'll need additional capital within 18 months.
            </p>
            <Button className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-black font-medium">
              Discuss with AI
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Key Metrics - Minimal Grid */}
          <div className="grid grid-cols-2 gap-12">
            {/* Metric 1 */}
            <div>
              <div className="text-gray-600 text-xs uppercase tracking-widest mb-3">Cash Runway</div>
              <div className="text-5xl font-light mb-2">42 mo</div>
              <div className="flex items-center gap-2 text-orange-400">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm">-3 months</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div>
              <div className="text-gray-600 text-xs uppercase tracking-widest mb-3">Total ARR</div>
              <div className="text-5xl font-light mb-2">$163M</div>
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">+14.8%</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div>
              <div className="text-gray-600 text-xs uppercase tracking-widest mb-3">Health Score</div>
              <div className="text-5xl font-light mb-2">94</div>
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Top 5%</span>
              </div>
            </div>

            {/* Metric 4 */}
            <div>
              <div className="text-gray-600 text-xs uppercase tracking-widest mb-3">Portfolio Growth</div>
              <div className="text-5xl font-light mb-2">+38%</div>
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">YTD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings - Minimal Table */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl">
            <div className="text-gray-500 text-sm uppercase tracking-widest mb-8">Top Holdings</div>
            
            <div className="space-y-6">
              {/* Holding 1 */}
              <div className="flex items-center justify-between py-6 border-b border-gray-800/50 hover:border-gray-700 transition-colors cursor-pointer group">
                <div className="flex-1">
                  <div className="text-2xl font-light mb-1 group-hover:text-yellow-500 transition-colors">HealthTech Co</div>
                  <div className="text-sm text-gray-500">287 employees · $85M revenue</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-light mb-1">$85M</div>
                  <div className="flex items-center gap-2 text-green-400">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">+38%</span>
                  </div>
                </div>
              </div>

              {/* Holding 2 */}
              <div className="flex items-center justify-between py-6 border-b border-gray-800/50 hover:border-gray-700 transition-colors cursor-pointer group">
                <div className="flex-1">
                  <div className="text-2xl font-light mb-1 group-hover:text-yellow-500 transition-colors">SaaS Infrastructure</div>
                  <div className="text-sm text-gray-500">143 employees · $62M revenue</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-light mb-1">$62M</div>
                  <div className="flex items-center gap-2 text-green-400">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">+44%</span>
                  </div>
                </div>
              </div>

              {/* Holding 3 */}
              <div className="flex items-center justify-between py-6 border-b border-gray-800/50 hover:border-gray-700 transition-colors cursor-pointer group">
                <div className="flex-1">
                  <div className="text-2xl font-light mb-1 group-hover:text-yellow-500 transition-colors">Consumer Brand</div>
                  <div className="text-sm text-gray-500">198 employees · $41M revenue</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-light mb-1">$41M</div>
                  <div className="flex items-center gap-2 text-green-400">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">+51%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Design Note */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl p-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-800">
            <h3 className="text-2xl font-light mb-4">Design 2: Luxury Minimalist</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              This design embraces dark elegance with generous white space and refined typography. 
              Inspired by Bloomberg Terminal and luxury brands, it uses restraint to create impact. 
              Gold accents provide premium feel without overwhelming the interface.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300 border border-gray-700">Dark Theme</span>
              <span className="px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300 border border-gray-700">Gold Accents</span>
              <span className="px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300 border border-gray-700">Minimalist</span>
              <span className="px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300 border border-gray-700">Large Typography</span>
              <span className="px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300 border border-gray-700">Sophisticated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
