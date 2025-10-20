import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-white">Structure</span>
              <span className="text-brand-orange">Clerk</span>
            </h3>
            <p className="text-blue-200 text-sm">
              La plateforme intelligente pour entrepreneurs en construction au Québec
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Produit</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <Link href="/#features" className="hover:text-brand-orange transition-colors">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-brand-orange transition-colors">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/qa" className="hover:text-brand-orange transition-colors">
                  Questions fréquentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <Link href="/legal/terms" className="hover:text-brand-orange transition-colors">
                  Conditions d&apos;utilisation
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-brand-orange transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <a
                  href="mailto:info@structureclerk.ca"
                  className="hover:text-brand-orange transition-colors"
                >
                  info@structureclerk.ca
                </a>
              </li>
              <li>
                <Link href="/qa" className="hover:text-brand-orange transition-colors">
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-sm text-blue-300">
          <p>
            © 2025 StructureClerk • Propulsé par{' '}
            <a
              href="https://techvibes.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-orange hover:text-orange-400 transition-colors font-medium"
            >
              Techvibes
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
