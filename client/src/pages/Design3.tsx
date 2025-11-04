import { TrendingUp, TrendingDown, DollarSign, Users, Target, Clock, Heart, Briefcase, PieChart, BarChart3, Activity, AlertTriangle, CheckCircle2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";

/**
 * Design 3: Data-Rich Executive Dashboard
 * 
 * Concept: Maximum information density for data-driven executives.
 * Think financial terminal meets modern dashboard - charts, graphs, real-time data.
 * 
 * Key Features:
 * - High information density
 * - Multiple data visualizations
 * - Real-time updates feel
 * - Comprehensive metrics
 * - Professional color scheme
 * - Sidebar with quick stats
 * - Color: Navy/Teal with accent colors
 */

export default function Design3() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Status Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-3 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Markets Open</span>
            </div>
            <div className="text-gray-400">S&P 500: <span className="text-green-400">+0.8%</span></div>
            <div className="text-gray-400">NASDAQ: <span className="text-green-400">+1.2%</span></div>
          </div>
          <div className="text-gray-400">Last updated: 3:15 PM EST</div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Quick Stats */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            {/* Net Worth Card */}
            <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
              <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Total Net Worth</div>
              <div className="text-3xl font-bold mb-2">$127.4M</div>
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <ArrowUpRight className="h-4 w-4" />
                <span>+$4.2M (3.4%)</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400">This Week</div>
              </div>
            </Card>

            {/* Quick Metrics */}
            <Card className="p-4">
              <div className="text-xs font-semibold text-gray-600 mb-4 uppercase tracking-wide">Quick Stats</div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-gray-700">Cash Runway</span>
                  </div>
                  <div className="text-sm font-semibold">42mo</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">Total ARR</span>
                  </div>
                  <div className="text-sm font-semibold">$163M</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-700">Health Score</span>
                  </div>
                  <div className="text-sm font-semibold">94/100</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-700">Team Size</span>
                  </div>
                  <div className="text-sm font-semibold">628</div>
                </div>
              </div>
            </Card>

            {/* Alerts */}
            <Card className="p-4">
              <div className="text-xs font-semibold text-gray-600 mb-4 uppercase tracking-wide">Alerts</div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-gray-700">Cash runway -3mo</div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-gray-700">HealthTech +38% YTD</div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-gray-700">HRV down 12%</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* AI Insight Banner */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-l-blue-500">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-blue-500 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-2">AI Analysis: Cash Runway Attention Required</div>
                  <div className="text-sm text-gray-700 mb-4">
                    Your cash runway decreased to 42 months after 15% team expansion. Current burn rate suggests additional capital needed within 18 months.
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                      View Analysis
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Metric 1 */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                    <TrendingUp className="h-3 w-3" />
                    18.2%
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">$127M</div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Net Worth</div>
                <div className="mt-3 text-xs text-gray-500">vs $108M last quarter</div>
              </Card>

              {/* Metric 2 */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex items-center gap-1 text-orange-600 text-xs font-semibold">
                    <TrendingDown className="h-3 w-3" />
                    3mo
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">42mo</div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Cash Runway</div>
                <div className="mt-3 text-xs text-gray-500">$158M available</div>
              </Card>

              {/* Metric 3 */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                    <TrendingUp className="h-3 w-3" />
                    14.8%
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">$163M</div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Total ARR</div>
                <div className="mt-3 text-xs text-gray-500">Blended +36%</div>
              </Card>

              {/* Metric 4 */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Heart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                    <TrendingUp className="h-3 w-3" />
                    3.5%
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">94</div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Health Score</div>
                <div className="mt-3 text-xs text-gray-500">Top 5% for age</div>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Net Worth Trend */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Net Worth Trend</h3>
                    <p className="text-xs text-gray-600">Last 12 months</p>
                  </div>
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                </div>
                <div className="h-48 flex items-end justify-between gap-2">
                  {[65, 72, 68, 78, 85, 82, 92, 98, 105, 115, 123, 127].map((value, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t transition-all hover:from-blue-600 hover:to-cyan-500"
                        style={{ height: `${(value / 127) * 100}%` }}
                      />
                      <div className="text-xs text-gray-500">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Portfolio Allocation */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Portfolio Allocation</h3>
                    <p className="text-xs text-gray-600">By asset class</p>
                  </div>
                  <PieChart className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm text-gray-700">Private Equity</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">42%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '42%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span className="text-sm text-gray-700">Public Markets</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">28%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: '28%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm text-gray-700">Real Estate</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">18%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '18%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <span className="text-sm text-gray-700">Cash & Equivalents</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">12%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: '12%' }} />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Holdings Table */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Top Holdings</h3>
                  <p className="text-xs text-gray-600">Sorted by value</p>
                </div>
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide pb-3">Company</th>
                      <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wide pb-3">Revenue</th>
                      <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wide pb-3">Margin</th>
                      <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wide pb-3">Value</th>
                      <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wide pb-3">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-4">
                        <div className="font-medium text-gray-900">HealthTech Co</div>
                        <div className="text-xs text-gray-500">287 employees</div>
                      </td>
                      <td className="text-right text-sm text-gray-900">$85M</td>
                      <td className="text-right text-sm text-gray-900">42%</td>
                      <td className="text-right text-sm font-semibold text-gray-900">$85M</td>
                      <td className="text-right">
                        <div className="inline-flex items-center gap-1 text-green-600 text-sm font-semibold">
                          <ArrowUpRight className="h-3 w-3" />
                          +38%
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4">
                        <div className="font-medium text-gray-900">SaaS Infrastructure</div>
                        <div className="text-xs text-gray-500">143 employees</div>
                      </td>
                      <td className="text-right text-sm text-gray-900">$62M</td>
                      <td className="text-right text-sm text-gray-900">67%</td>
                      <td className="text-right text-sm font-semibold text-gray-900">$62M</td>
                      <td className="text-right">
                        <div className="inline-flex items-center gap-1 text-green-600 text-sm font-semibold">
                          <ArrowUpRight className="h-3 w-3" />
                          +44%
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4">
                        <div className="font-medium text-gray-900">Consumer Brand</div>
                        <div className="text-xs text-gray-500">198 employees</div>
                      </td>
                      <td className="text-right text-sm text-gray-900">$41M</td>
                      <td className="text-right text-sm text-gray-900">24%</td>
                      <td className="text-right text-sm font-semibold text-gray-900">$41M</td>
                      <td className="text-right">
                        <div className="inline-flex items-center gap-1 text-green-600 text-sm font-semibold">
                          <ArrowUpRight className="h-3 w-3" />
                          +51%
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Design Note */}
            <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
              <h3 className="font-semibold text-gray-900 mb-2">Design 3: Data-Rich Executive</h3>
              <p className="text-sm text-gray-600 mb-4">
                This design maximizes information density for data-driven executives. 
                Inspired by financial terminals, it provides comprehensive metrics, charts, and real-time data at a glance.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">High Density</span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">Charts & Graphs</span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">Real-Time Data</span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">Professional</span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">Navy/Teal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
