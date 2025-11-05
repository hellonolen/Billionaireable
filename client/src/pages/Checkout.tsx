import { COLORS } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Checkout() {
  return (
    <div className="min-h-screen" style={{ background: COLORS.bg }}>
      {/* Header */}
      <header className="border-b sticky top-0 z-10" style={{ borderColor: COLORS.border, background: COLORS.bg }}>
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-4 w-4" style={{ color: COLORS.text }} />
              <span className="text-sm font-medium" style={{ color: COLORS.text }}>Back to Dashboard</span>
            </button>
          </Link>
          <div className="text-lg font-semibold" style={{ color: COLORS.text }}>Billionaireable</div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Features */}
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
              Unlock Your Dashboard
            </h1>
            <p className="text-lg mb-8" style={{ color: COLORS.subt }}>
              One-time payment. Lifetime access. No subscriptions.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}>
                <h3 className="font-semibold mb-1" style={{ color: COLORS.text }}>
                  15 Comprehensive Dashboard Cards
                </h3>
                <p className="text-sm" style={{ color: COLORS.subt }}>
                  Track net worth, investments, health metrics, business KPIs, and more in one place.
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}>
                <h3 className="font-semibold mb-1" style={{ color: COLORS.text }}>
                  Real-Time Market Data
                </h3>
                <p className="text-sm" style={{ color: COLORS.subt }}>
                  Live cryptocurrency prices, stock quotes, and market intelligence.
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}>
                <h3 className="font-semibold mb-1" style={{ color: COLORS.text }}>
                  Contacts & Document Management
                </h3>
                <p className="text-sm" style={{ color: COLORS.subt }}>
                  Organize key relationships and important documents in your System page.
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}>
                <h3 className="font-semibold mb-1" style={{ color: COLORS.text }}>
                  AI-Powered Insights
                </h3>
                <p className="text-sm" style={{ color: COLORS.subt }}>
                  Get personalized recommendations and trend analysis across all your metrics.
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}>
                <h3 className="font-semibold mb-1" style={{ color: COLORS.text }}>
                  Unlimited Data Entry & Updates
                </h3>
                <p className="text-sm" style={{ color: COLORS.subt }}>
                  Update all metrics, add contacts, upload documents, and customize your dashboard.
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}>
                <h3 className="font-semibold mb-1" style={{ color: COLORS.text }}>
                  Export & Share Reports
                </h3>
                <p className="text-sm" style={{ color: COLORS.subt }}>
                  Generate professional reports to share with advisors, partners, or family.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Payment */}
          <div>
            <div className="rounded-lg p-8" style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}>
              <div className="text-center mb-8">
                <div className="text-5xl font-bold mb-2" style={{ color: COLORS.text }}>
                  $97
                </div>
                <p className="text-sm" style={{ color: COLORS.subt }}>
                  One-time payment • Lifetime access
                </p>
              </div>

              {/* Whop.com Embed Placeholder */}
              <div className="mb-6">
                <div 
                  className="w-full rounded-lg p-8 text-center"
                  style={{ background: COLORS.bg, border: `2px dashed ${COLORS.border}` }}
                >
                  <p className="font-semibold mb-2" style={{ color: COLORS.text }}>
                    Whop.com Payment Embed
                  </p>
                  <p className="text-sm mb-4" style={{ color: COLORS.subt }}>
                    Replace this div with your Whop.com embed code
                  </p>
                  <div className="text-xs font-mono p-3 rounded inline-block" style={{ background: COLORS.panel, color: COLORS.subt }}>
                    {`<iframe src="https://whop.com/checkout/..."`}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-6" style={{ color: COLORS.subt }}>
                <p>• Secure payment via Whop.com</p>
                <p>• Instant access after payment</p>
                <p>• 30-day money-back guarantee</p>
              </div>

              <p className="text-xs text-center" style={{ color: COLORS.subt }}>
                By purchasing, you agree to our <Link href="/terms"><a className="underline">Terms</a></Link> and <Link href="/privacy"><a className="underline">Privacy Policy</a></Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
