import { COLORS } from "@/lib/constants";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function Disclosures() {
  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      <DashboardHeader />
      
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
          Disclosures
        </h1>
        <p className="text-sm mb-8" style={{ color: COLORS.subt }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              Not Financial Advice
            </h2>
            <p style={{ color: COLORS.text }}>
              Billionaireable is a data tracking and visualization platform. We do not provide financial, investment, 
              tax, or legal advice. The information and tools provided through our Service are for informational purposes 
              only and should not be construed as professional advice.
            </p>
            <p style={{ color: COLORS.text }}>
              You should consult with qualified professionals before making any financial or investment decisions. 
              Past performance does not guarantee future results.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              Not Medical Advice
            </h2>
            <p style={{ color: COLORS.text }}>
              Health and wellness features in Billionaireable are for tracking and informational purposes only. 
              We are not medical professionals and do not provide medical advice, diagnosis, or treatment.
            </p>
            <p style={{ color: COLORS.text }}>
              Always seek the advice of your physician or other qualified health provider with any questions you may 
              have regarding a medical condition. Never disregard professional medical advice or delay seeking it 
              because of something you have read on Billionaireable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              Data Accuracy
            </h2>
            <p style={{ color: COLORS.text }}>
              While we strive to provide accurate and up-to-date information, we make no representations or warranties 
              of any kind about the completeness, accuracy, reliability, or availability of the data displayed in the Service.
            </p>
            <p style={{ color: COLORS.text }}>
              Data from third-party integrations may be delayed, incomplete, or inaccurate. You are responsible for 
              verifying the accuracy of all data before making decisions based on it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              Third-Party Integrations
            </h2>
            <p style={{ color: COLORS.text }}>
              Billionaireable integrates with various third-party services (financial institutions, health tracking devices, 
              business tools, etc.). These integrations are provided "as is" and we are not responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{ color: COLORS.text }}>
              <li>The availability or reliability of third-party services</li>
              <li>Changes to third-party APIs or data formats</li>
              <li>Security or privacy practices of third parties</li>
              <li>Accuracy of data received from third parties</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              Investment Risks
            </h2>
            <p style={{ color: COLORS.text }}>
              All investments involve risk, including the possible loss of principal. The value of investments can go 
              down as well as up. You may receive back less than you originally invested.
            </p>
            <p style={{ color: COLORS.text }}>
              Diversification does not guarantee profit or protect against loss. Historical performance is not indicative 
              of future results.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              Affiliate Relationships
            </h2>
            <p style={{ color: COLORS.text }}>
              Billionaireable may receive compensation from some of the third-party services we integrate with or recommend. 
              This does not influence our recommendations or the functionality of the Service. We only integrate with 
              services we believe provide value to our users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              Beta Features
            </h2>
            <p style={{ color: COLORS.text }}>
              Some features of the Service may be labeled as "beta" or "experimental." These features are provided for 
              testing purposes and may not function as intended. We make no guarantees about the availability or 
              functionality of beta features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              Forward-Looking Statements
            </h2>
            <p style={{ color: COLORS.text }}>
              Any projections, forecasts, or forward-looking statements provided through the Service are based on 
              assumptions and estimates. Actual results may differ materially from these projections.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              Regulatory Compliance
            </h2>
            <p style={{ color: COLORS.text }}>
              Billionaireable is not a registered investment advisor, broker-dealer, or financial institution. We are 
              not subject to the same regulatory requirements as these entities. Our Service is designed for personal 
              use and information management only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              Contact Us
            </h2>
            <p style={{ color: COLORS.text }}>
              If you have questions about these disclosures, please contact us via Discord support or email at 
              legal@billionaireable.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
