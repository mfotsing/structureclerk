import React from 'react';
import Button from './shared/Button';

const CredibilitySection = () => {
  const testimonial = {
    text: "Avant StructureClerk, je passais mes dimanches à rentrer des factures. Maintenant, l&rsquo;IA fait ça en temps réel. J&rsquo;ai enfin récupéré mes week-ends et évité un dépassement de 8000$ sur un projet.",
    author: "Martin L., Entrepreneur Général",
    details: "Rénovation résidentielle · 6 employés · 18 projets/an"
  };

  const handleCTAClick = () => {
    // Track analytics event
    console.log('Track Event: cta_click', { position: 'credibility' });
    window.location.href = '/auth/signup';
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Les entrepreneurs du bâtiment font confiance à StructureClerk
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Rejoignez les premiers utilisateurs qui transforment leur gestion documentaire
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Testimonial */}
          <div className="bg-primary-50 rounded-2xl p-8 lg:p-12 relative">
            <div className="absolute top-4 left-4">
              <svg className="w-8 h-8 text-primary-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            
            <blockquote className="text-lg sm:text-xl text-neutral-700 mb-6 leading-relaxed relative">
              &ldquo;{testimonial.text}&rdquo;
            </blockquote>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                ML
              </div>
              <div>
                <div className="font-semibold text-neutral-900">
                  {testimonial.author}
                </div>
                <div className="text-sm text-neutral-600">
                  {testimonial.details}
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="space-y-8">
            <div className="bg-neutral-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  Bêta exclusive limitée
                </h3>
              </div>
              <p className="text-neutral-600 mb-4">
                Seulement 15 entrepreneurs sélectionnés pour notre programme bêta. Profitez d&rsquo;un accès prioritaire et d&rsquo;un support personnalisé.
              </p>
              <div className="flex items-center text-sm text-neutral-500">
                <svg className="w-4 h-4 mr-1 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Places restantes : <span className="font-semibold text-accent-600">8</span>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  Sans risque, sans engagement
                </h3>
              </div>
              <p className="text-neutral-600 mb-4">
                Testez gratuitement avec vos 5 premiers documents. Pas de carte bancaire requise. Annulez à tout moment.
              </p>
              <div className="flex items-center text-sm text-neutral-500">
                <svg className="w-4 h-4 mr-1 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Garantie satisfait ou remboursé 30 jours
              </div>
            </div>

            <div className="bg-neutral-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  Résultats rapides
                </h3>
              </div>
              <p className="text-neutral-600 mb-4">
                Voyez des résultats dès les premiers documents. Temps de configuration moyen : 5 minutes.
              </p>
              <div className="flex items-center text-sm text-neutral-500">
                <svg className="w-4 h-4 mr-1 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414-1.414L14.586 7H12z" clipRule="evenodd" />
                </svg>
                Économie moyenne : <span className="font-semibold text-primary-600">4+ heures/semaine</span>
              </div>
            </div>

            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleCTAClick}
              className="w-full"
            >
              Réserver votre place bêta
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CredibilitySection;