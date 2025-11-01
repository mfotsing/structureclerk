'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, UserCheck, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { BRAND_COLORS } from '@/components/brand/BrandColors';

export default function PrivacyPage() {
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
              <Shield className="w-4 h-4 mr-2" />
              PIPEDA & Quebec Bill 64 Compliant
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Your Privacy is Our
              <span className="block" style={{ color: BRAND_COLORS.accentTeal }}>
                Top Priority
              </span>
            </h1>

            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              StructureClerk is built with Canadian privacy standards at our core.
              Your data is encrypted, stored in Canada, and never shared without your consent.
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
                Privacy Policy Overview
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Last updated: {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-gray-700 leading-relaxed">
                At StructureClerk, we are committed to protecting your personal information and respecting your privacy.
                This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our
                AI-powered business automation platform.
              </p>
            </motion.div>

            {/* Information We Collect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.primaryNavy }}>
                Information We Collect
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <UserCheck className="h-6 w-6 mr-3" style={{ color: BRAND_COLORS.primaryNavy }} />
                    <h4 className="font-semibold" style={{ color: BRAND_COLORS.primaryNavy }}>
                      Account Information
                    </h4>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Name, email address, phone number</li>
                    <li>• Company name and business details</li>
                    <li>• Payment and billing information</li>
                    <li>• User preferences and settings</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <FileText className="h-6 w-6 mr-3" style={{ color: BRAND_COLORS.accentTeal }} />
                    <h4 className="font-semibold" style={{ color: BRAND_COLORS.primaryNavy }}>
                      Business Data
                    </h4>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Documents you upload and process</li>
                    <li>• Audio transcriptions and recordings</li>
                    <li>• Client information and project data</li>
                    <li>• Analytics and usage metrics</li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Database className="h-6 w-6 mr-3" style={{ color: BRAND_COLORS.primaryNavy }} />
                    <h4 className="font-semibold" style={{ color: BRAND_COLORS.primaryNavy }}>
                      Technical Data
                    </h4>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• IP address and device information</li>
                    <li>• Browser type and operating system</li>
                    <li>• Interaction data with our platform</li>
                    <li>• Performance and diagnostic data</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Eye className="h-6 w-6 mr-3" style={{ color: BRAND_COLORS.primaryNavy }} />
                    <h4 className="font-semibold" style={{ color: BRAND_COLORS.primaryNavy }}>
                      Usage Analytics
                    </h4>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Feature usage patterns</li>
                    <li>• Session duration and frequency</li>
                    <li>• Document processing statistics</li>
                    <li>• AI interaction data</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* How We Use Your Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.primaryNavy }}>
                How We Use Your Information
              </h3>

              <div className="space-y-4">
                {[
                  {
                    icon: CheckCircle,
                    title: "Service Provision",
                    description: "To provide, maintain, and improve our AI-powered business automation services"
                  },
                  {
                    icon: CheckCircle,
                    title: "Personalization",
                    description: "To customize your experience and provide relevant features and recommendations"
                  },
                  {
                    icon: CheckCircle,
                    title: "Communication",
                    description: "To respond to your inquiries, provide support, and send important updates"
                  },
                  {
                    icon: CheckCircle,
                    title: "Security",
                    description: "To protect against fraud, ensure security, and prevent abuse of our platform"
                  },
                  {
                    icon: CheckCircle,
                    title: "Legal Compliance",
                    description: "To comply with legal obligations and protect our rights and interests"
                  },
                  {
                    icon: CheckCircle,
                    title: "Analytics",
                    description: "To analyze usage patterns and improve our services and user experience"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <item.icon className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: BRAND_COLORS.primaryNavy }}>
                        {item.title}
                      </h4>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Data Protection & Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.primaryNavy }}>
                Data Protection & Security
              </h3>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-xl border-2"
                   style={{ borderColor: `${BRAND_COLORS.primaryNavy}20` }}>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center" style={{ color: BRAND_COLORS.primaryNavy }}>
                      <Lock className="h-5 w-5 mr-2" />
                      Canadian Data Residency
                    </h4>
                    <p className="text-gray-700 mb-4">
                      All your data is stored exclusively in Canadian data centers, ensuring compliance with
                      PIPEDA and Quebec Bill 64 requirements.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• AES-256 encryption at rest and in transit</li>
                      <li>• 24/7 security monitoring</li>
                      <li>• Regular security audits</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4 flex items-center" style={{ color: BRAND_COLORS.primaryNavy }}>
                      <Shield className="h-5 w-5 mr-2" />
                      Enterprise Security
                    </h4>
                    <p className="text-gray-700 mb-4">
                      We use bank-level security measures to protect your information and maintain
                      SOC 2 Type II certification.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Multi-factor authentication</li>
                      <li>• Role-based access control</li>
                      <li>• Automated backups and recovery</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Your Rights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.primaryNavy }}>
                Your Privacy Rights
              </h3>

              <p className="text-gray-700 mb-6">
                Under Canadian privacy laws, you have the following rights regarding your personal information:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Access",
                    description: "Request access to your personal information we hold"
                  },
                  {
                    title: "Correction",
                    description: "Request correction of inaccurate personal information"
                  },
                  {
                    title: "Withdrawal",
                    description: "Withdraw consent for processing (where applicable)"
                  },
                  {
                    title: "Deletion",
                    description: "Request deletion of your personal information"
                  },
                  {
                    title: "Portability",
                    description: "Request transfer of your data to another service"
                  },
                  {
                    title: "Complaint",
                    description: "File a complaint with privacy authorities"
                  }
                ].map((right, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                    <h4 className="font-semibold mb-2" style={{ color: BRAND_COLORS.primaryNavy }}>
                      {right.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{right.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.primaryNavy }}>
                Contact Us About Privacy
              </h3>

              <div className="bg-gray-50 p-8 rounded-xl">
                <p className="text-gray-700 mb-6">
                  If you have questions, concerns, or requests regarding your privacy, please contact our
                  Canadian privacy team:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: BRAND_COLORS.primaryNavy }}>
                      Email
                    </h4>
                    <p className="text-gray-700">privacy@structureclerk.ca</p>
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
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: BRAND_COLORS.primaryNavy }}>
                      Response Time
                    </h4>
                    <p className="text-gray-700">Within 5 business days</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: BRAND_COLORS.primaryNavy }}>
                      Important Notice
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      This privacy policy is a legal document that outlines our practices regarding the collection,
                      use, and disclosure of your information. By using StructureClerk, you acknowledge that you have
                      read, understood, and agree to be bound by this policy. We may update this policy from time to
                      time, and any changes will be effective immediately upon posting.
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
            Questions About Your Privacy?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Our Canadian privacy team is here to help with any questions or concerns.
          </motion.p>
          <motion.a
            href="mailto:privacy@structureclerk.ca"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: BRAND_COLORS.accentTeal, color: BRAND_COLORS.white }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Contact Privacy Team
          </motion.a>
        </div>
      </section>
    </div>
  );
}