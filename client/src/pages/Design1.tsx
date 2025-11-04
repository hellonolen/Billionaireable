import { Bot, TrendingUp, TrendingDown, Sparkles, MessageCircle, Mic, ArrowRight, Zap, Target, Heart, Clock, DollarSign, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * Design 1: AI-First Modern Dashboard
 * 
 * Concept: Put the AI companion front and center with a bold gradient hero section.
 * The AI is the star - everything else supports it.
 * 
 * Key Features:
 * - Gradient hero with AI greeting
 * - Proactive insight cards
 * - Voice activation prominent
 * - Modern glassmorphism effects
 * - Micro-interactions and animations
 * - Color: Purple/Blue gradient (premium, tech-forward)
 */

export default function Design1() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* AI Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 opacity-90" />
        
        {/* Animated Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        
        {/* Content */}
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* AI Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI Companion Active</span>
            </div>
            
            {/* Greeting */}
            <h1 className="text-5xl font-bold text-white mb-4">
              Good morning, John 👋
            </h1>
            
            {/* Net Worth */}
            <div className="text-white/90 mb-2">Your net worth</div>
            <div className="text-6xl font-bold text-white mb-2">$127.4M</div>
            <div className="flex items-center justify-center gap-2 text-green-300 text-lg mb-8">
              <TrendingUp className="h-5 w-5" />
              <span>+$4.2M this week (+3.4%)</span>
            </div>
            
            {/* AI Insight Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-left mb-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold mb-2">AI Insight</div>
                  <div className="text-white/90 mb-4">
                    "Your cash runway dropped to 42 months. I noticed you increased team size by 15% last quarter. 
                    Let's talk about your burn rate and whether this aligns with your growth targets."
                  </div>
                  <div className="flex gap-3">
                    <Button className="bg-white text-purple-600 hover:bg-white/90">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Discuss This
                    </Button>
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat with AI
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Mic className="h-5 w-5 mr-2" />
                Voice Mode
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Proactive Insights Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What Needs Your Attention</h2>
          <p className="text-gray-600">AI-generated insights based on your data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Insight Card 1 */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-orange-500">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium text-orange-600">Action Required</span>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Haven't connected with Sarah Chen in 3 weeks</h3>
            <p className="text-sm text-gray-600 mb-4">
              You usually connect with your lead investor every 10 days. Consider scheduling a check-in.
            </p>
            <Button size="sm" variant="outline" className="w-full">
              Send Email
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Card>

          {/* Insight Card 2 */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-600">Opportunity</span>
              </div>
              <span className="text-xs text-gray-500">5 hours ago</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">HealthTech Co revenue up 38% YTD</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your best-performing investment. Consider increasing your position or taking some profits.
            </p>
            <Button size="sm" variant="outline" className="w-full">
              Analyze
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Card>

          {/* Insight Card 3 */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-blue-600">Health</span>
              </div>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">HRV dropped 12% this week</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your stress levels are elevated. You've had 4 late nights in a row. Time to recover?
            </p>
            <Button size="sm" variant="outline" className="w-full">
              View Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Card>
        </div>

        {/* Key Metrics Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Metric Card 1 */}
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                +18.2%
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">$127M</div>
            <div className="text-sm text-gray-600">Net Worth</div>
            <div className="mt-4 text-xs text-gray-500">vs $108M last quarter</div>
          </Card>

          {/* Metric Card 2 */}
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-orange-600 text-sm font-medium">
                <TrendingDown className="h-4 w-4" />
                -3 mo
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">42 mo</div>
            <div className="text-sm text-gray-600">Cash Runway</div>
            <div className="mt-4 text-xs text-gray-500">$158M available</div>
          </Card>

          {/* Metric Card 3 */}
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-100">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                +14.8%
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">$163M</div>
            <div className="text-sm text-gray-600">Total ARR</div>
            <div className="mt-4 text-xs text-gray-500">Blended growth +36%</div>
          </Card>

          {/* Metric Card 4 */}
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-orange-100">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                +3.5%
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">94</div>
            <div className="text-sm text-gray-600">Health Score</div>
            <div className="mt-4 text-xs text-gray-500">Top 5% for your age</div>
          </Card>
        </div>

        {/* Design Note */}
        <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
          <h3 className="font-semibold text-gray-900 mb-2">Design 1: AI-First Modern</h3>
          <p className="text-sm text-gray-600 mb-4">
            This design puts the AI companion front and center with a bold gradient hero section. 
            The focus is on proactive insights, conversational engagement, and making the AI feel alive and present.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700">Gradient Hero</span>
            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700">AI-First</span>
            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700">Proactive Insights</span>
            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700">Modern</span>
            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700">Purple/Blue</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
