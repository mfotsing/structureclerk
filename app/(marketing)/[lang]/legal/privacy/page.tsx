import { useTranslations } from 'next-intl';
import { Shield, Database, Lock, Users, FileText, CheckCircle } from 'lucide-react';

export default function PrivacyPage() {
  const t = useTranslations('privacy');

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 text-brand-blue mx-auto mb-6" />
          <h1 className="text-4xl font-bold font-heading mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your privacy is fundamental. We're committed to protecting your personal information
            with transparency, security, and Canadian privacy standards.
          </p>
        </div>

        {/* Last Updated */}
        <div className="bg-muted/50 p-6 rounded-lg mb-12">
          <p className="text-sm">
            <strong>Last Updated:</strong> November 1, 2024 |
            <strong>Effective Date:</strong> November 1, 2024
          </p>
        </div>

        {/* Overview */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">Overview</h2>
          <div className="prose prose-neutral max-w-none">
            <p className="text-muted-foreground text-lg leading-relaxed">
              StructureClerk Inc. ("StructureClerk," "we," "us," "our") is committed to protecting
              the privacy and security of personal information in accordance with Canadian privacy laws,
              including the Personal Information Protection and Electronic Documents Act (PIPEDA) and
              Quebec's Bill 64 (Law 25).
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              This Privacy Policy explains how we collect, use, disclose, and protect your personal
              information when you use our AI-powered administrative assistant service.
            </p>
          </div>
        </section>

        {/* Information We Collect */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">
            <Database className="inline h-6 w-6 mr-2" />
            Information We Collect
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">Account Information</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Name, email address, and contact information</li>
                <li>• Business details and company information</li>
                <li>• Authentication credentials (via Clerk)</li>
                <li>• Language preferences (English/French)</li>
                <li>• Timezone and regional settings</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">Document & Content Data</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Uploaded documents (PDFs, images, contracts)</li>
                <li>• Audio recordings and transcriptions</li>
                <li>• Extracted data (names, amounts, dates)</li>
                <li>• Client information and project details</li>
                <li>• Tasks, notes, and administrative content</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">Usage & Technical Data</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Service usage metrics and feature interactions</li>
                <li>• IP address and general geographic location</li>
                <li>• Browser type, device, and operating system</li>
                <li>• Cookies and similar tracking technologies</li>
                <li>• Error logs and performance data</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">Communications</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Customer support communications</li>
                <li>• Marketing emails (with consent)</li>
                <li>• Product announcements and updates</li>
                <li>• Survey responses and feedback</li>
                <li>• Legal notices and policy updates</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">
            <FileText className="inline h-6 w-6 mr-2" />
            How We Use Your Information
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-brand-green flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Service Provision</h3>
                <p className="text-muted-foreground">
                  To provide and maintain our AI administrative assistant service, including document processing,
                  transcription, task generation, and other core features.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-brand-green flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">AI Processing & Improvement</h3>
                <p className="text-muted-foreground">
                  To process your documents and audio using AI models, extract relevant information,
                  and improve our AI accuracy and service quality.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-brand-green flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Customer Support</h3>
                <p className="text-muted-foreground">
                  To respond to your inquiries, provide technical support, and address any issues
                  you may encounter with our service.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-brand-green flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Security & Compliance</h3>
                <p className="text-muted-foreground">
                  To protect our service, prevent fraud, maintain security, and comply with
                  legal obligations and Canadian privacy laws.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-brand-green flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Marketing (With Consent)</h3>
                <p className="text-muted-foreground">
                  To send you information about our products, services, and promotional offers
                  when you have explicitly provided consent.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Protection & Security */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">
            <Lock className="inline h-6 w-6 mr-2" />
            Data Protection & Security
          </h2>

          <div className="bg-card p-8 rounded-lg border space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Encryption & Storage</h3>
              <p className="text-muted-foreground">
                All personal information is encrypted using industry-standard AES-256 encryption at rest
                and TLS 1.3 encryption in transit. Data is stored in Canadian data centers to ensure
                compliance with Canadian data residency requirements.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Access Controls</h3>
              <p className="text-muted-foreground">
                Access to personal information is restricted to authorized employees who require it for
                legitimate business purposes. All employees undergo privacy training and sign confidentiality
                agreements.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Security Measures</h3>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational security measures including firewalls,
                intrusion detection systems, regular security audits, and vulnerability assessments to protect
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Data Retention</h3>
              <p className="text-muted-foreground">
                We retain personal information only as long as necessary for the purposes identified in
                this policy, unless required or permitted by law to retain it longer. You may request
                deletion of your account and associated personal information at any time.
              </p>
            </div>
          </div>
        </section>

        {/* Canadian Privacy Compliance */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">
            Canadian Privacy Compliance
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">PIPEDA Compliance</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                We comply with PIPEDA's 10 fair information principles, including accountability,
                identifying purposes, consent, limiting collection, limiting use, disclosure,
                accuracy, safeguards, openness, individual access, and challenging compliance.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-semibold mb-3 text-green-900 dark:text-green-100">Law 25 (Quebec)</h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                We exceed Quebec's Bill 64 requirements with enhanced consent mechanisms,
                privacy impact assessments, breach notification procedures, and designated privacy officer.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
            <h3 className="font-semibold mb-3 text-amber-900 dark:text-amber-100">Your Privacy Rights</h3>
            <div className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
              <p><strong>Access:</strong> Request access to your personal information we hold.</p>
              <p><strong>Correction:</strong> Request correction of inaccurate personal information.</p>
              <p><strong>Withdrawal:</strong> Withdraw consent where we rely on consent for processing.</p>
              <p><strong>Complaint:</strong> File a complaint about our privacy practices.</p>
              <p><strong>Deletion:</strong> Request deletion of your personal information.</p>
            </div>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">
            <Users className="inline h-6 w-6 mr-2" />
            Third-Party Services & Subprocessors
          </h2>

          <p className="text-muted-foreground mb-6">
            We use trusted third-party services to operate our business. These subprocessors are carefully
            vetted and contractually bound to protect your data with at least the same level of security
            and privacy protection as we do.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded border">
              <h4 className="font-semibold text-sm mb-2">Authentication</h4>
              <p className="text-xs text-muted-foreground">Clerk - User authentication and identity</p>
            </div>
            <div className="bg-card p-4 rounded border">
              <h4 className="font-semibold text-sm mb-2">Infrastructure</h4>
              <p className="text-xs text-muted-foreground">Vercel - Hosting and CDN</p>
            </div>
            <div className="bg-card p-4 rounded border">
              <h4 className="font-semibold text-sm mb-2">Database</h4>
              <p className="text-xs text-muted-foreground">Supabase - PostgreSQL database and storage</p>
            </div>
            <div className="bg-card p-4 rounded border">
              <h4 className="font-semibold text-sm mb-2">AI Processing</h4>
              <p className="text-xs text-muted-foreground">Anthropic - Claude AI for text processing</p>
            </div>
            <div className="bg-card p-4 rounded border">
              <h4 className="font-semibold text-sm mb-2">Payments</h4>
              <p className="text-xs text-muted-foreground">Stripe - Payment processing</p>
            </div>
            <div className="bg-card p-4 rounded border">
              <h4 className="font-semibold text-sm mb-2">Email</h4>
              <p className="text-xs text-muted-foreground">Resend - Transactional emails</p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">Privacy Contact</h2>

          <div className="bg-card p-8 rounded-lg border">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Privacy Officer</h3>
                <address className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Name:</strong> Privacy Officer</p>
                  <p><strong>Email:</strong> privacy@structureclerk.ca</p>
                  <p><strong>Phone:</strong> +1 (514) 555-0123 ext. 100</p>
                  <p><strong>Address:</strong></p>
                  <p>123 Rue Sainte-Catherine<br />
                  Montréal, QC H3B 1B6<br />
                  Canada</p>
                </address>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Making a Privacy Request</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  To exercise your privacy rights or make a privacy-related inquiry:
                </p>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Email privacy@structureclerk.ca with your request</li>
                  <li>Provide sufficient detail to identify your account</li>
                  <li>Specify the information you want to access, correct, or delete</li>
                  <li>We'll respond within 30 days as required by law</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Policy Updates */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">Policy Updates</h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time to reflect changes in our practices,
            applicable law, or our service offerings. We will notify users of any material changes
            by email, prominent notice on our website, or other appropriate means. Your continued
            use of our service after such changes constitutes acceptance of the updated policy.
          </p>
        </section>

        {/* Footer Note */}
        <div className="text-center py-8 border-t">
          <p className="text-sm text-muted-foreground">
            This Privacy Policy is governed by the laws of Canada and the Province of Quebec.
            Any disputes arising from this policy will be resolved in the courts of Montreal, Quebec.
          </p>
        </div>
      </div>
    </div>
  );
}