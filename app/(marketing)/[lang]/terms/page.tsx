'use client';

import { motion } from 'framer-motion';
import { FileText, Shield, AlertCircle, CheckCircle, Scale, Users, DollarSign, Clock, MapPin } from 'lucide-react';
import { BRAND_COLORS } from '@/components/brand/BrandColors';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden"
               style={{ background: 'linear-gradient(135deg, #0A1A33 0%, #1E40AF 50%, #0A1A33 100%)' }}>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold mb-8"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Scale className="w-4 h-4 mr-2" />
              Legal Terms & Conditions
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Terms of Service for
              <span className="block" style={{ color: BRAND_COLORS.accentTeal }}>
                Canadian Businesses
              </span>
            </h1>

            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              By using StructureClerk's AI-powered business automation platform, you agree to these terms
              designed to protect both your business and ours under Canadian law.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">

            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-6" style={{ color: BRAND_COLORS.primaryNavy }}>
                Terms of Service
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Last updated: {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to StructureClerk. These Terms of Service ("Terms") govern your use of our AI-powered business
                automation platform, website, and related services (collectively, the "Service") operated by StructureClerk
                Inc. ("StructureClerk," "we," "us," or "our").
              </p>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by
                these Terms. If you are agreeing to these Terms on behalf of a company or other legal entity, you represent
                that you have the authority to bind such entity to these Terms.
              </p>
            </motion.div>

            {/* Acceptance of Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.primaryNavy }}>
                1. Acceptance of Terms
              </h3>

              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <p className="text-gray-700 leading-relaxed">
                  By creating an account, using our Service, or clicking "I agree" when prompted, you:
                </p>
                <ul className="mt-4 space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Confirm that you are at least 18 years old and have the legal capacity to enter into contracts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Agree to comply with these Terms and all applicable laws</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Represent that all information you provide is accurate and complete</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Accept responsibility for all activities under your account</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Service Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.primaryNavy }}>
                2. Service Description
              </h3>

              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  StructureClerk provides AI-powered business automation services including:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "AI document processing and OCR",
                    "Audio transcription and analysis",
                    "Business workflow automation",
                    "Client and project management",
                    "Canadian compliance tools",
                    "Bilingual AI assistant (English/French)"
                  ].map((service, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed mt-6">
                  We reserve the right to modify, suspend, or discontinue any part of our Service at any time,
                  with or without notice. We are not liable to you or any third party for any modification,
                  suspension, or discontinuation of our Service.
                </p>
              </div>
            </motion.div>

            {/* User Accounts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.primaryNavy }}>
                3. User Accounts
              </h3>

              <div className="space-y-4">
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center" style={{ color: BRAND_COLORS.primaryNavy }}>
                    <Users className="h-5 w-5 mr-2" />
                    Account Responsibilities
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• You are responsible for maintaining the confidentiality of your account credentials</li>
                    <li>• You must notify us immediately of any unauthorized use of your account</li>
                    <li>• You are responsible for all activities that occur under your account</li>
                    <li>• You may not share your account credentials with others</li>
                    <li>• You must provide accurate and complete registration information</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center" style={{ color: BRAND_COLORS.primaryNavy }}>
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Account Termination
                  </h4>
                  <p className="text-gray-700">
                    We reserve the right to suspend or terminate your account at any time for violations of these Terms,
                    fraudulent activity, or any other reason we deem necessary to protect our Service and other users.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Fees and Payments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.primaryNavy }}>
                4. Fees and Payments
              </h3>

              <div className="space-y-4">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center" style={{ color: BRAND_COLORS.primaryNavy }}>
                    <DollarSign className="h-5 w-5 mr-2" />
                    Pricing and Billing
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Subscription fees are charged in advance on a monthly or annual basis</li>
                    <li>• All prices are in Canadian dollars (CAD) unless otherwise specified</li>
                    <li>• Taxes (GST/HST) will be added where applicable</li>
                    <li>• Payment is processed through secure third-party payment processors</li>
                    <li>• Refunds are subject to our refund policy</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center" style={{ color: BRAND_COLORS.primaryNavy }}>
                    <Clock className="h-5 w-5 mr-2" />
                    Free Trials and Changes
                  </h4>
                  <p className="text-gray-700 mb-3">
                    Free trials are available for eligible new users. We may change our fees at any time,
                    with at least 30 days' notice for existing subscribers.
                  </p>
                  <p className="text-gray-700">
                    You may cancel your subscription at any time. Cancellations take effect at the end of the current billing period.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* User Conduct */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.primaryNavy }}>
                5. Acceptable Use
              </h3>

              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3" style={{ color: BRAND_COLORS.primaryNavy }}>
                    You May Not:
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Use the Service for any illegal or unauthorized purpose</li>
                    <li>• Violate any applicable laws or regulations</li>
                    <li>• Upload malicious code, viruses, or harmful content</li>
                    <li>• Attempt to gain unauthorized access to our systems</li>
                    <li>• Interfere with or disrupt the Service or servers</li>
                    <li>• Use the Service to harass, abuse, or harm others</li>
                    <li>• Infringe on intellectual property rights</li>
                    <li>• Submit false or misleading information</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Intellectual Property */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.primaryNavy }}>
                6. Intellectual Property
              </h3>

              <div className="space-y-4">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center" style={{ color: BRAND_COLORS.primaryNavy }}>
                    <Shield className="h-5 w-5 mr-2" />
                    Our Intellectual Property
                  </h4>
                  <p className="text-gray-700 mb-3">
                    The Service and its original content, features, and functionality are owned by StructureClerk
                    and are protected by copyright, trademark, and other intellectual property laws.
                  </p>
                  <p className="text-gray-700">
                    You may not copy, modify, distribute, sell, or lease any part of our Service without our
                    express written permission.
                  </p>
                </div>

                <div className="bg-teal-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3" style={{ color: BRAND_COLORS.primaryNavy }}>
                    <FileText className="h-5 w-5 mr-2" />
                    Your Content
                  </h4>
                  <p className="text-gray-700 mb-3">
                    You retain ownership of any content you upload or create using our Service. You grant us a
                    limited, non-exclusive license to use, process, and store your content solely to provide our Service.
                  </p>
                  <p className="text-gray-700">
                    We will not use your content for any other purpose without your explicit consent.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Privacy and Data */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.primaryNavy }}>
                7. Privacy and Data Protection
              </h3>

              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use
                of our Service, to understand how we collect, use, and protect your information.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border-2"
                   style={{ borderColor: `${BRAND_COLORS.primaryNavy}20` }}>
                <h4 className="font-semibold mb-3" style={{ color: BRAND_COLORS.primaryNavy }}>
                  Canadian Data Protection
                </h4>
                <p className="text-gray-700">
                  All data is stored in Canadian data centers and processed in compliance with PIPEDA,
                  Quebec Bill 64, and other applicable Canadian privacy laws.
                </p>
              </div>
            </motion.div>

            {/* Limitation of Liability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.primaryNavy }}>
                8. Limitation of Liability
              </h3>

              <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      To the maximum extent permitted by law, StructureClerk shall not be liable for any indirect,
                      incidental, special, or consequential damages arising from your use of our Service.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      Our total liability for any claims related to the Service shall not exceed the amount you
                      paid us in the 12 months preceding the claim.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Some jurisdictions do not allow the exclusion of certain warranties, so some of the above
                      limitations may not apply to you.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Governing Law */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.primaryNavy }}>
                9. Governing Law and Jurisdiction
              </h3>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 mr-3" style={{ color: BRAND_COLORS.primaryNavy }} />
                  <h4 className="font-semibold" style={{ color: BRAND_COLORS.primaryNavy }}>
                    Canadian Jurisdiction
                  </h4>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These Terms are governed by and construed in accordance with the laws of the Province of Ontario
                  and the federal laws of Canada, without regard to conflict of law principles.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Any disputes arising from these Terms or your use of our Service shall be resolved in the courts
                  located in Toronto, Ontario, Canada.
                </p>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.0 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.primaryNavy }}>
                10. Contact Information
              </h3>

              <div className="bg-gray-50 p-8 rounded-xl">
                <p className="text-gray-700 mb-6">
                  If you have any questions about these Terms, please contact us:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: BRAND_COLORS.primaryNavy }}>
                      Legal Department
                    </h4>
                    <p className="text-gray-700">legal@structureclerk.ca</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: BRAND_COLORS.primaryNavy }}>
                      General Inquiries
                    </h4>
                    <p className="text-gray-700">support@structureclerk.ca</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: BRAND_COLORS.primaryNavy }}>
                      Phone
                    </h4>
                    <p className="text-gray-700">1-833-STRUCTURE</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: BRAND_COLORS.primaryNavy }}>
                      Address
                    </h4>
                    <p className="text-gray-700">
                      1234 Bay Street<br />
                      Toronto, ON M5R 1A8<br />
                      Canada
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Final Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.1 }}
            >
              <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: BRAND_COLORS.primaryNavy }}>
                      Important Legal Notice
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      These Terms of Service constitute a legally binding agreement between you and StructureClerk Inc.
                      If you do not agree to these Terms, you may not access or use our Service. We reserve the right
                      to update these Terms at any time. Your continued use of our Service after any changes constitutes
                      acceptance of the updated Terms.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 text-white relative overflow-hidden"
               style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.primaryNavy} 0%, #1E40AF 100%)` }}>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Questions About Our Terms?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Our legal team is available to answer any questions about our terms and conditions.
          </motion.p>
          <motion.a
            href="mailto:legal@structureclerk.ca"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: BRAND_COLORS.accentTeal, color: BRAND_COLORS.white }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Contact Legal Team
          </motion.a>
        </div>
      </section>
    </div>
  );
}