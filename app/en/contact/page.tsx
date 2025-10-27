import Link from 'next/link';

export default function EnglishContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/en" className="text-2xl font-bold text-gray-900">
              StructureClerk
            </Link>
            <nav className="flex space-x-8">
              <Link href="/en/pricing" className="text-gray-700 hover:text-blue-600">
                Pricing
              </Link>
              <Link href="/fr" className="text-blue-600 font-medium">
                Français
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about StructureClerk? We're here to help. Reach out to our Canadian
            support team and we'll get back to you within 24 business hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <p className="text-gray-600 mb-6">
              Contact form is currently being updated. Please use the contact information below.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl border shadow-sm">
              <h3 className="text-xl font-bold mb-6">Get in touch</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-5 h-5 text-blue-600 mt-1">📧</div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-gray-600">hello@structureclerk.ca</p>
                    <p className="text-sm text-gray-500">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-5 h-5 text-blue-600 mt-1">📞</div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <p className="text-gray-600">+1 (514) 555-0123</p>
                    <p className="text-sm text-gray-500">Mon-Fri, 9 AM - 6 PM EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-5 h-5 text-blue-600 mt-1">📍</div>
                  <div>
                    <h4 className="font-semibold mb-1">Office</h4>
                    <address className="text-gray-600 not-italic">
                      123 Rue Sainte-Catherine<br />
                      Montréal, QC H3B 1B6<br />
                      Canada
                    </address>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 StructureClerk. All rights reserved. Made in Canada. 🇨🇦
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}