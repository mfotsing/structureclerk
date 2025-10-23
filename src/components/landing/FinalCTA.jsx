import React from 'react';
import Button from './shared/Button';

const FinalCTA = () => {
  const handleTrialClick = () => {
    // Track analytics event
    console.log('Track Event: cta_click', { position: 'final', type: 'trial' });
    window.location.href = '/signup';
  };

  const handleDemoClick = () => {
    // Track analytics event
    console.log('Track Event: cta_click', { position: 'final', type: 'demo' });
    window.location.href = 'mailto:demo@structureclerk.ca?subject=Demande de démo personnalisée';
  };

  const trustBadges = [
    {
      name: "Chiffrement AES-256",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: "Garantie 30 jours",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812 3.066 3.066 0 01.723 1.745 3.066 3.066 0 010 3.976 3.066 3.066 0 01-.723 1.745 3.066 3.066 0 00-2.812 2.812 3.066 3.066 0 01-1.745.723 3.066 3.066 0 00-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 00-2.812-2.812 3.066 3.066 0 01-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 002.812-2.812zm-1.745 9.382a1 1 0 01-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: "Support 24/7",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
      )
    },
    {
      name: "Conforme RGPD",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-20 bg-primary-600 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Prêt à récupérer 4+ heures par semaine ?
          </h2>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Rejoignez les entrepreneurs qui transforment leur gestion documentaire avec StructureClerk.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Button 
            variant="secondary" 
            size="xl"
            onClick={handleTrialClick}
            className="text-xl px-10 py-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 bg-white text-primary-600 hover:bg-neutral-50"
          >
            Essai gratuit 14 jours
          </Button>
          <Button 
            variant="outline" 
            size="xl"
            onClick={handleDemoClick}
            className="text-xl px-10 py-6 border-2 border-white text-white hover:bg-white hover:text-primary-600 transition-all duration-200"
          >
            Démo personnalisée
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {trustBadges.map((badge, index) => (
            <div key={index} className="flex items-center text-primary-100">
              <div className="mr-2 text-primary-200">
                {badge.icon}
              </div>
              <span className="text-sm font-medium">
                {badge.name}
              </span>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="bg-primary-700 rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">
              Rejoignez la bêta exclusive
            </h3>
            <p className="text-primary-200">
              Seulement 15 entrepreneurs sélectionnés. Places limitées.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 bg-primary-600 rounded-full border-2 border-primary-500 flex items-center justify-center text-sm font-bold">
                  ML
                </div>
                <div className="w-10 h-10 bg-primary-600 rounded-full border-2 border-primary-500 flex items-center justify-center text-sm font-bold">
                  JT
                </div>
                <div className="w-10 h-10 bg-primary-600 rounded-full border-2 border-primary-500 flex items-center justify-center text-sm font-bold">
                  SB
                </div>
                <div className="w-10 h-10 bg-primary-600 rounded-full border-2 border-primary-500 flex items-center justify-center text-sm font-bold">
                  PR
                </div>
              </div>
              <span className="ml-4 text-primary-200">
                <span className="font-semibold">8 places</span> restantes
              </span>
            </div>
            
            <Button 
              variant="secondary" 
              size="lg"
              onClick={handleTrialClick}
              className="bg-white text-primary-600 hover:bg-neutral-50"
            >
              Réserver ma place
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;