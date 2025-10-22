import React, { useState, useEffect } from 'react';
import Button from '../landing/shared/Button';

const ValueProposition = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentBenefit, setCurrentBenefit] = useState(0);

  const benefits = [
    {
      title: "score de risque de marge",
      description: "évalue précisément le risque de perdre de l'argent sur chaque projet",
      icon: "📊",
      value: "0-100"
    },
    {
      title: "profil de perte de temps",
      description: "identifie exactement où tu perds tes heures les plus chères",
      icon: "⏰",
      value: "personnalisé"
    },
    {
      title: "plan d'action personnalisé",
      description: "étapes concrètes pour récupérer 10h/semaine minimum",
      icon: "🎯",
      value: "immédiat"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentBenefit((prev) => (prev + 1) % benefits.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [benefits.length]);

  const handleScorecardStart = () => {
    // Track analytics
    console.log('Track Event: value_proposition_cta_click', { position: 'value_prop' });
    // Navigate to scorecard
    window.location.href = '#scorecard';
  };

  return (
    <section id="scorecard" className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            découvre ton <span className="text-accent-300">score de chaos administratif</span>
          </h2>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
            réponds à 12 questions (2 min) et obtiens :
          </p>
        </div>

        {/* Benefits cards */}
        <div className={`grid md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-300 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 transition-all duration-500 ${
                currentBenefit === index 
                  ? 'scale-105 bg-white/20 shadow-2xl' 
                  : 'hover:scale-102 hover:bg-white/15'
              }`}
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {benefit.title}
              </h3>
              <p className="text-primary-100 mb-4">
                {benefit.description}
              </p>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent-500/30 border border-accent-500/50 text-sm font-semibold text-accent-200">
                {benefit.value}
              </div>
            </div>
          ))}
        </div>

        {/* Scorecard preview */}
        <div className={`max-w-4xl mx-auto mb-16 transition-all duration-1000 delay-500 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                exemple de résultats que tu recevras
              </h3>
              <div className="bg-danger-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                42/100
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold text-accent-300 mb-2">ton profil</h4>
                <p className="text-white">"chaos organisé avec risque critique de burnout"</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold text-accent-300 mb-2">potentiel d'économie</h4>
                <p className="text-white">"12h/semaine = 4 800$/mois récupérables"</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-success-500/20 rounded-lg border border-success-500/30">
              <div className="flex items-center space-x-2 text-success-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">action prioritaire #1</span>
              </div>
              <p className="text-success-100 mt-2">
                "centralise tes factures dans un système unique - gain immédiat : 3h/semaine"
              </p>
            </div>
          </div>
        </div>

        {/* Main CTA */}
        <div className={`text-center transition-all duration-1000 delay-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleScorecardStart}
            className="text-xl px-12 py-6 bg-accent-500 hover:bg-accent-600 text-white font-bold shadow-2xl hover:shadow-accent-500/25 transform hover:-translate-y-1 transition-all duration-300"
          >
            calculer mon score de chaos (gratuit, 2 min)
            <span className="block text-sm font-normal mt-2 text-accent-100">
              aucune carte · résultats instantanés · plan d'action inclus
            </span>
          </Button>
          
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-primary-200">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>développé après 47 entretiens entrepreneurs</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>basé sur analyse 10k+ documents réels</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>2 minutes seulement</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;