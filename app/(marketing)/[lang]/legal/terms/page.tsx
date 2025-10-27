import { useTranslations } from 'next-intl';
import { FileText, Shield, AlertCircle, Users, Scale, Gavel } from 'lucide-react';

export default function TermsPage() {
  const t = useTranslations('terms');

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <FileText className="h-16 w-16 text-brand-blue mx-auto mb-6" />
          <h1 className="text-4xl font-bold font-heading mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            These terms govern your use of StructureClerk's AI administrative assistant service.
            By using our service, you agree to these terms.
          </p>
        </div>

        {/* Effective Date */}
        <div className="bg-muted/50 p-6 rounded-lg mb-12">
          <p className="text-sm">
            <strong>Last Updated:</strong> January 27, 2024 |
            <strong>Effective Date:</strong> January 27, 2024
          </p>
        </div>

        {/* Agreement to Terms */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">
            <Scale className="inline h-6 w-6 mr-2" />
            Agreement to Terms
          </h2>
          <div className="prose prose-neutral max-w-none">
            <p className="text-muted-foreground text-lg leading-relaxed">
              These Terms of Service ("Terms") govern your access to and use of StructureClerk Inc.'s
              ("StructureClerk," "we," "us," "our") AI-powered administrative assistant service,
              website, and related services (collectively, the "Service").
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              By accessing or using our Service, you agree to be bound by these Terms, our
              Privacy Policy, and any other applicable policies referenced herein. If you do not agree
              to these Terms, you may not access or use the Service.
            </p>
          </div>
        </section>

        {/* Service Description */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">Service Description</h2>
          <div className="bg-card p-8 rounded-lg border space-y-4">
            <p className="text-muted-foreground">
              StructureClerk provides an AI-powered administrative assistant service that includes:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Document scanning, processing, and AI-powered data extraction</li>
              <li>• Audio transcription, summarization, and action item generation</li>
              <li>• Client relationship management and project organization</li>
              <li>• Task creation, management, and automation</li>
              <li>• Invoice generation and payment tracking</li>
              <li>• Email template generation and communication automation</li>
              <li>• Integration with third-party services (Google Drive, OneDrive)</li>
            </ul>
            <p className="text-muted-foreground text-sm">
              The Service is provided "as is" and we reserve the right to modify, suspend,
              or discontinue any part of the Service at any time.
            </p>
          </div>
        </section>

        {/* User Responsibilities */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">
            <Users className="inline h-6 w-6 mr-2" />
            User Responsibilities
          </h2>

          <div className="space-y-6">
            <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
              <h3 className="font-semibold mb-3 text-amber-900 dark:text-amber-100">Account Security</h3>
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                You are responsible for maintaining the confidentiality of your account credentials and
                for all activities that occur under your account. You must notify us immediately of any
                unauthorized use of your account.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">Content Responsibility</h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                You retain ownership of all content you upload or create using our Service. You are
                responsible for ensuring your content complies with applicable laws and does not infringe
                on third-party rights.
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
              <h3 className="font-semibold mb-3 text-red-900 dark:text-red-100">Prohibited Uses</h3>
              <p className="text-red-800 dark:text-red-200 text-sm">
                You may not use our Service for illegal activities, to harass others, to upload malicious
                content, to violate intellectual property rights, or to interfere with service operation.
              </p>
            </div>
          </div>
        </section>

        {/* Data and Privacy */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">
            <Shield className="inline h-6 w-6 mr-2" />
            Data and Privacy
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">Data Ownership</h3>
              <p className="text-muted-foreground text-sm">
                You retain full ownership of all content, documents, and data you upload or create
                through our Service. We do not claim ownership of your user-generated content.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">Data Processing</h3>
              <p className="text-muted-foreground text-sm">
                We process your data to provide the Service, improve our AI models, and ensure security.
                Our Privacy Policy explains how we collect, use, and protect your information.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">Data Security</h3>
              <p className="text-muted-foreground text-sm">
                We implement appropriate technical and organizational security measures to protect your data,
                including encryption, access controls, and regular security audits.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">Data Deletion</h3>
              <p className="text-muted-foreground text-sm">
                You can request deletion of your account and associated data at any time. We will delete
                your data within 30 days, except where required by law to retain it.
              </p>
            </div>
          </div>
        </section>

        {/* Fees and Payments */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">Fees and Payments</h2>

          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">Subscription Plans</h3>
              <p className="text-muted-foreground text-sm mb-4">
                We offer various subscription plans with different features and usage limits:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Free:</strong> 10 documents/month, 30 minutes audio, 1 GB storage</li>
                <li>• <strong>Pro:</strong> $12/month, 180 minutes audio, 20 GB storage, advanced features</li>
                <li>• <strong>Business:</strong> $24/month, 600 minutes audio, 100 GB storage, team features</li>
                <li>• <strong>Teams:</strong> $49/month + $9/user, unlimited users, collaboration features</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">Billing Terms</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Subscriptions are billed monthly or annually in advance</li>
                <li>• Prices are in Canadian dollars (CAD) plus applicable taxes</li>
                <li>• You can change or cancel your subscription at any time</li>
                <li>• No refunds for partial months or unused features</li>
                <li>• We use Stripe for secure payment processing</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">Intellectual Property</h2>

          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">StructureClerk IP</h3>
              <p className="text-muted-foreground text-sm">
                The Service, including all software, AI models, interfaces, and content provided by
                StructureClerk, is owned by us and protected by copyright, trademark, and other
                intellectual property laws.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">User Content License</h3>
              <p className="text-muted-foreground text-sm">
                You grant us a limited, non-exclusive, worldwide license to use, process, and store
                your content solely to provide and improve our Service. This license terminates when
                you delete your content.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">Feedback</h3>
              <p className="text-muted-foreground text-sm">
                Any feedback or suggestions you provide about our Service becomes our property and may be
                used to improve our Service without compensation or attribution.
              </p>
            </div>
          </div>
        </section>

        {/* Service Availability */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">Service Availability</h2>

          <div className="bg-card p-6 rounded-lg border space-y-4">
            <p className="text-muted-foreground text-sm">
              We strive to maintain high service availability but cannot guarantee uninterrupted service.
              The Service may be temporarily unavailable due to:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Scheduled maintenance (we'll provide advance notice when possible)</li>
              <li>• Technical issues or system failures</li>
              <li>• Circumstances beyond our reasonable control</li>
            </ul>
            <p className="text-muted-foreground text-sm">
              We are not liable for any losses resulting from service unavailability.
            </p>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">
            <AlertCircle className="inline h-6 w-6 mr-2" />
            Limitation of Liability
          </h2>

          <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-800 dark:text-red-200 text-sm leading-relaxed">
              <strong>To the fullest extent permitted by law</strong>, StructureClerk shall not be liable
              for any indirect, incidental, special, consequential, or punitive damages, including
              without limitation, loss of profits, data, use, goodwill, or other intangible losses,
              resulting from your use of the Service.
            </p>
            <p className="text-red-800 dark:text-red-200 text-sm mt-4 leading-relaxed">
              Our total liability for any claims arising from or relating to the Service shall not exceed
              the amount you paid to us in the twelve (12) months preceding the claim.
            </p>
            <p className="text-red-800 dark:text-red-200 text-sm mt-4 leading-relaxed">
              Some jurisdictions do not allow the exclusion or limitation of liability for consequential
              or incidental damages, so the above limitation may not apply to you.
            </p>
          </div>
        </section>

        {/* Termination */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">Termination</h2>

          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">User Termination</h3>
              <p className="text-muted-foreground text-sm">
                You may terminate your account at any time by contacting us or using the account
                deletion feature in your settings. Upon termination, your right to use the Service
                ceases immediately.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">StructureClerk Termination</h3>
              <p className="text-muted-foreground text-sm">
                We may suspend or terminate your account immediately if you violate these Terms,
                engage in fraudulent activity, or misuse the Service. We'll provide notice and
                opportunity to cure when reasonable.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">Effect of Termination</h3>
              <p className="text-muted-foreground text-sm">
                Upon termination, your access to the Service ends. Sections regarding Data Ownership,
                Intellectual Property, Limitation of Liability, and Governing Law survive termination.
              </p>
            </div>
          </div>
        </section>

        {/* Governing Law */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">
            <Gavel className="inline h-6 w-6 mr-2" />
            Governing Law
          </h2>

          <div className="bg-card p-8 rounded-lg border">
            <p className="text-muted-foreground text-sm mb-4">
              These Terms shall be governed by and construed in accordance with the laws of Canada and
              the Province of Quebec, without regard to conflict of law principles.
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              Any dispute arising from or relating to these Terms or the Service shall be resolved in
              the courts located in Montreal, Quebec, Canada.
            </p>
            <p className="text-muted-foreground text-sm">
              These Terms constitute the entire agreement between you and StructureClerk regarding the
              Service and supersede all prior agreements, communications, and understandings.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">Contact Information</h2>

          <div className="bg-card p-8 rounded-lg border">
            <p className="text-muted-foreground mb-4">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Legal Department</h4>
                <p className="text-sm text-muted-foreground">
                  Email: legal@structureclerk.ca<br />
                  Phone: +1 (514) 555-0123 ext. 200
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">General Support</h4>
                <p className="text-sm text-muted-foreground">
                  Email: support@structureclerk.ca<br />
                  Phone: +1 (514) 555-0123<br />
                  Hours: 9 AM - 6 PM EST (Mon-Fri)
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}