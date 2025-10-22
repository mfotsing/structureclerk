import React, { useState, useEffect } from 'react';
import Button from '../landing/shared/Button';

const TransformationSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      before: "dimanches soirs sur excel pendant que famille regarde film",
      after: "photo facture → dashboard mis à jour 10 sec",
      icon: "📱"
    },
    {
      before: "découverte dépassements 3 semaines trop tard",
      after: "alerte budget jour même, pas 3 semaines après",
      icon: "🔔"
    },
    {
      before: "18h/semaine perdues chercher documents",
      after: "10h/semaine récupérées pour prendre plus projets",
      icon: "⏰"
    },
    {
      before: "stress permanent de ne pas savoir si tu fais argent",
      after: "tu sais temps réel : quel chantier gagne, lequel perd",
      icon: "📊"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [features.length]);

  const handleTransformationClick = () => {
    // Track analytics
    console.log('Track Event: transformation_cta_click', { position: 'transformation' });
    // Navigate to scorecard
    window.location.href = '#scorecard';
  };

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230ea5e9' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
            ta <span className="text-danger-600">souffrance</span> devient ta <span className="text-success-600">force</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            voici comment structureclerk transforme ton chaos quotidien en avantage compétitif
          </p>
        </div>

        {/* Split-screen transformation */}
        <div className={`grid md:grid-cols-2 gap-8 mb-16 transition-all duration-1000 delay-300 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Before section */}
          <div className="bg-neutral-50 rounded-2xl p-8 border-2 border-neutral-200 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-danger-100 text-danger-800 px-3 py-1 rounded-full text-sm font-semibold">
              AVANT
            </div>
            
            <h3 className="text-2xl font-bold text-neutral-900 mb-6">
              avant structureclerk <span className="text-danger-500">😞</span>
            </h3>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-300 ${
                    currentFeature === index ? 'bg-danger-100 border border-danger-200' : 'bg-white'
                  }`}
                >
                  <span className="text-2xl flex-shrink-0">❌</span>
                  <span className="text-neutral-700">{feature.before}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-danger-50 rounded-lg border border-danger-200">
              <div className="flex items-center space-x-2 text-danger-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">coût réel du chaos</span>
              </div>
              <p className="text-danger-700 mt-2">
                18h/semaine perdues × 50$/h = 900$/semaine = 3 600$/mois de pure perte
              </p>
            </div>
          </div>

          {/* After section */}
          <div className="bg-gradient-to-br from-primary-50 to-success-50 rounded-2xl p-8 border-2 border-primary-200 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-success-100 text-success-800 px-3 py-1 rounded-full text-sm font-semibold">
              APRÈS
            </div>
            
            <h3 className="text-2xl font-bold text-neutral-900 mb-6">
              après structureclerk <span className="text-success-500">😊</span>
            </h3>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-300 ${
                    currentFeature === index ? 'bg-success-100 border border-success-200' : 'bg-white'
                  }`}
                >
                  <span className="text-2xl flex-shrink-0">{feature.icon}</span>
                  <span className="text-neutral-700">{feature.after}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-success-50 rounded-lg border border-success-200">
              <div className="flex items-center space-x-2 text-success-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">gain réel mesuré</span>
              </div>
              <p className="text-success-700 mt-2">
                10h/semaine récupérées × 100$/h = 1 000$/semaine = 4 000$/mois de profit supplémentaire
              </p>
            </div>
          </div>
        </div>

        {/* Secondary CTA */}
        <div className={`text-center transition-all duration-1000 delay-600 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleTransformationClick}
            className="text-lg px-8 py-4 border-2 border-primary-500 text-primary-600 hover:bg-primary-50 font-semibold"
          >
            je veux cette transformation
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
          
          <p className="mt-4 text-sm text-neutral-500">
            ⚡ temps estimé : 2 minutes pour découvrir ton potentiel d'économie
          </p>
        </div>
      </div>
    </section>
  );
};

export default TransformationSection;