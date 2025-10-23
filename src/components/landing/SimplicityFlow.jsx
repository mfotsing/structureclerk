import React from 'react';
import Button from './shared/Button';

const SimplicityFlow = () => {
  const steps = [
    {
      number: 1,
      title: "Document",
      description: "Glissez-déposez factures, soumissions et contrats",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    {
      number: 2,
      title: "IA",
      description: "L'IA extrait automatiquement les données clés et alerte sur les dépassements",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      number: 3,
      title: "Décision",
      description: "Approuvez ou rejectez en un clic avec toutes les informations nécessaires",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const promises = [
    {
      title: "Récupérez votre temps",
      description: "Gagnez 4+ heures par semaine en automatisant la saisie de données",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Protégez vos marges",
      description: "Détectez les dépassements de budget avant qu'ils ne deviennent des pertes",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Décidez en confiance",
      description: "Accédez à toutes les informations critiques pour prendre des décisions éclairées",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  const handleCTAClick = () => {
    // Track analytics event
    console.log('Track Event: cta_click', { position: 'simplicity' });
    window.location.href = '/signup';
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            4 menus. Zéro courbe d'apprentissage. Pas de formation longue.
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            StructureClerk est conçu pour les entrepreneurs du bâtiment, pas pour les experts en logiciels.
          </p>
        </div>

        {/* 3-step diagram */}
        <div className="mb-20">
          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-200 -translate-y-1/2"></div>
            
            <div className="grid lg:grid-cols-3 gap-8 relative">
              {steps.map((step, index) => (
                <div key={index} className="text-center relative">
                  {/* Step number */}
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 relative z-10">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600 max-w-sm mx-auto">
                    {step.description}
                  </p>
                  
                  {/* Arrow for mobile */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-8">
                      <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3 promises */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-neutral-900 mb-12">
            Promesses de soulagement
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {promises.map((promise, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-success-100 text-success-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  {promise.icon}
                </div>
                <h4 className="text-lg font-semibold text-neutral-900 mb-3">
                  {promise.title}
                </h4>
                <p className="text-neutral-600">
                  {promise.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-primary-50 rounded-2xl p-8 lg:p-12">
          <h3 className="text-2xl font-bold text-neutral-900 mb-4">
            Prêt à simplifier votre gestion documentaire ?
          </h3>
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
            Commencez gratuitement avec vos 5 premiers documents. Pas de carte bancaire requise.
          </p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleCTAClick}
            className="text-lg px-8 py-4"
          >
            Analyser mes documents gratuitement
          </Button>
          <p className="text-sm text-neutral-500 mt-4">
            Configuration en 5 minutes • Annulation à tout moment
          </p>
        </div>
      </div>
    </section>
  );
};

export default SimplicityFlow;