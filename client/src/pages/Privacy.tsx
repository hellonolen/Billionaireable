import { COLORS } from "@/lib/constants";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function Privacy() {
  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      <DashboardHeader />
      
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
          Privacy Policy
        </h1>
        <p className="text-sm mb-8" style={{ color: COLORS.subt }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              1. Information We Collect
            </h2>
            <p style={{ color: COLORS.text }}>
              Billionaireable collects information you provide directly to us when you create an account, 
              use our services, or communicate with us. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{ color: COLORS.text }}>
              <li>Account information (name, email address)</li>
              <li>Financial data you choose to input (net worth, investments, business metrics)</li>
              <li>Health and wellness data you choose to track</li>
              <li>Usage data and analytics</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              2. How We Use Your Information
            </h2>
            <p style={{ color: COLORS.text }}>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{ color: COLORS.text }}>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns and optimize user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              3. Data Security
            </h2>
            <p style={{ color: COLORS.text }}>
              We take reasonable measures to protect your information from unauthorized access, use, or disclosure. 
              All data is encrypted in transit and at rest. However, no internet transmission is ever fully secure, 
              and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              4. Data Sharing
            </h2>
            <p style={{ color: COLORS.text }}>
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{ color: COLORS.text }}>
              <li>With your explicit consent</li>
              <li>With service providers who assist in our operations</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              5. Your Rights
            </h2>
            <p style={{ color: COLORS.text }}>
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{ color: COLORS.text }}>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              6. Cookies and Tracking
            </h2>
            <p style={{ color: COLORS.text }}>
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              7. Third-Party Services
            </h2>
            <p style={{ color: COLORS.text }}>
              Our service may contain links to third-party websites or services. We are not responsible for the privacy 
              practices of these third parties. We encourage you to read their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              8. Children's Privacy
            </h2>
            <p style={{ color: COLORS.text }}>
              Our service is not intended for individuals under the age of 18. We do not knowingly collect personal 
              information from children under 18.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              9. Changes to This Policy
            </h2>
            <p style={{ color: COLORS.text }}>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              10. Contact Us
            </h2>
            <p style={{ color: COLORS.text }}>
              If you have any questions about this Privacy Policy, please contact us via Discord support or email 
              at privacy@billionaireable.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
