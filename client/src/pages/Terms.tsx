import { COLORS } from "@/lib/constants";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function Terms() {
  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      <DashboardHeader />
      
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
          Terms of Service
        </h1>
        <p className="text-sm mb-8" style={{ color: COLORS.subt }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              1. Acceptance of Terms
            </h2>
            <p style={{ color: COLORS.text }}>
              By accessing and using Billionaireable ("the Service"), you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              2. Description of Service
            </h2>
            <p style={{ color: COLORS.text }}>
              Billionaireable provides a comprehensive dashboard platform for tracking wealth, health, business metrics, 
              and personal goals. The Service includes data visualization, analytics, integrations with third-party services, 
              and collaboration features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              3. User Accounts
            </h2>
            <p style={{ color: COLORS.text }}>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities 
              that occur under your account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{ color: COLORS.text }}>
              <li>Provide accurate and complete information</li>
              <li>Keep your account information up to date</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Not share your account with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              4. Acceptable Use
            </h2>
            <p style={{ color: COLORS.text }}>
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{ color: COLORS.text }}>
              <li>Use the Service for any illegal purpose</li>
              <li>Violate any laws in your jurisdiction</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit malicious code or viruses</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Use the Service to harass or harm others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              5. Subscription and Billing
            </h2>
            <p style={{ color: COLORS.text }}>
              Certain features of the Service require a paid subscription. By purchasing a subscription, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{ color: COLORS.text }}>
              <li>Pay all fees associated with your subscription</li>
              <li>Provide accurate billing information</li>
              <li>Automatic renewal unless cancelled</li>
              <li>No refunds for partial subscription periods</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              6. Intellectual Property
            </h2>
            <p style={{ color: COLORS.text }}>
              The Service and its original content, features, and functionality are owned by Billionaireable LLC and are 
              protected by international copyright, trademark, and other intellectual property laws. You retain ownership 
              of your data, but grant us a license to use it to provide the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              7. Disclaimer of Warranties
            </h2>
            <p style={{ color: COLORS.text }}>
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT 
              WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. WE ARE NOT FINANCIAL ADVISORS 
              AND DO NOT PROVIDE FINANCIAL, INVESTMENT, OR MEDICAL ADVICE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              8. Limitation of Liability
            </h2>
            <p style={{ color: COLORS.text }}>
              IN NO EVENT SHALL BILLIONAIREABLE LLC BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, 
              OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY SHALL NOT EXCEED THE 
              AMOUNT YOU PAID FOR THE SERVICE IN THE PAST 12 MONTHS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              9. Indemnification
            </h2>
            <p style={{ color: COLORS.text }}>
              You agree to indemnify and hold harmless Billionaireable LLC from any claims, damages, or expenses arising 
              from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              10. Termination
            </h2>
            <p style={{ color: COLORS.text }}>
              We may terminate or suspend your account at any time, without prior notice, for conduct that we believe 
              violates these Terms or is harmful to other users, us, or third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              11. Governing Law
            </h2>
            <p style={{ color: COLORS.text }}>
              These Terms shall be governed by the laws of the State of Delaware, United States, without regard to its 
              conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              12. Changes to Terms
            </h2>
            <p style={{ color: COLORS.text }}>
              We reserve the right to modify these Terms at any time. We will notify users of material changes via 
              email or through the Service. Continued use after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
              13. Contact Information
            </h2>
            <p style={{ color: COLORS.text }}>
              For questions about these Terms, please contact us via Discord support or email at legal@billionaireable.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
