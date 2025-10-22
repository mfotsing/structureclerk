import React, { useState, useEffect, useRef } from 'react';
import Button from './shared/Button';
import AnimatedCounter from './shared/AnimatedCounter';

const HeroSection = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [heroVariant, setHeroVariant] = useState('a');
  const [ctaVariant, setCtaVariant] = useState('a');
  
  // Animation steps for the hero sequence
  const animationSteps = [
    { title: "Déposez vos documents", description: "Factures, soumissions, contrats" },
    { title: "L'IA analyse en temps réel", description: "Extraction automatique des données" },
    { title: "Alertes budget immédiates", description: "Détectez les dépassements avant qu'ils ne deviennent des pertes" }
  ];

  // Hero and CTA variants for A/B testing
  const heroVariants = {
    a: "Fini le chaos des factures et soumissions. Protégez votre marge. Récupérez vos soirées.",
    b: "L'IA qui transforme vos documents en décisions. En 10 secondes, pas 2 heures."
  };
  
  const ctaVariants = {
    a: "Analysez vos 5 premiers documents gratuitement",
    b: "Essai gratuit 14 jours - sans carte bancaire"
  };

  // Auto-advance animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % animationSteps.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Start animation on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Track analytics events
  const trackEvent = (eventName, params = {}) => {
    // Placeholder for analytics tracking
    console.log('Track Event:', eventName, params);
    // In production, this would connect to your analytics service
    // Example: window.gtag('event', eventName, params);
  };

  const handleMainCTAClick = () => {
    trackEvent('cta_click', { position: 'hero', variation: ctaVariant });
    // Navigate to signup or demo
    window.location.href = '/auth/signup';
  };

  const handleSecondaryCTAClick = () => {
    trackEvent('video_play', { section: 'hero' });
    // Open video modal or navigate to video
    alert('Vidéo de démonstration de 90 secondes');
  };

  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230284c7' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="text-center">
          {/* Beta badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent-100 text-accent-800 mb-6">
            <span className="w-2 h-2 bg-accent-500 rounded-full mr-2 animate-pulse"></span>
            Actuellement en bêta exclusive avec 15 entrepreneurs
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
            {heroVariants[heroVariant]}
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-neutral-600 mb-10 max-w-4xl mx-auto leading-relaxed">
            Analysez automatiquement factures, soumissions et changements de contrat. Gagnez 
            <AnimatedCounter end={4} suffix="+" className="font-bold text-primary-600 mx-1" /> 
            heures par semaine. Détectez les dépassements avant qu'ils ne deviennent des pertes.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleMainCTAClick}
              className="text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
            >
              {ctaVariants[ctaVariant]}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleSecondaryCTAClick}
              className="text-lg px-8 py-4 border-2 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Voir comment ça marche (vidéo 90 sec)
            </Button>
          </div>

          {/* Animation sequence */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-neutral-100">
              <div className="grid md:grid-cols-3 gap-8">
                {animationSteps.map((step, index) => (
                  <div 
                    key={index}
                    className={`text-center transition-all duration-700 ${
                      currentStep === index 
                        ? 'scale-105 opacity-100' 
                        : 'scale-95 opacity-60'
                    }`}
                  >
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-700 ${
                      currentStep === index
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-neutral-100 text-neutral-400'
                    }`}>
                      {index === 0 && (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      )}
                      {index === 1 && (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                      {index === 2 && (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-neutral-600">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Progress indicators */}
              <div className="flex justify-center mt-8 space-x-2">
                {animationSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentStep === index
                        ? 'bg-primary-600 w-8'
                        : 'bg-neutral-300 hover:bg-neutral-400'
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;