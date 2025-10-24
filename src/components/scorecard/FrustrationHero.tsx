import React, { useState, useEffect } from 'react';
import Button from '../landing/shared/Button';

const FrustrationHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFrustration, setCurrentFrustration] = useState(0);

  const frustrations = [
    "Mercredi 22h17. Ton fils t'attend. Toi, tu es dans Excel. Et ton projet perd 8 % de marge.",
    "Dimanche 20h32. Ta famille regarde un film. Toi, tu traites tes dossiers. Et 12 devis attendent."
  ];

  const handleScorecardClick = () => {
    // Track analytics
    console.log('Track Event: scorecard_hero_click', { position: 'hero' });
    // Navigate to scorecard
    window.location.href = '/scorecard?scorecard=scorecard';
  };

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFrustration((prev) => (prev + 1) % frustrations.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [frustrations.length]);

  
  return (
    <section className="relative w-full h-screen bg-neutral-900 text-white overflow-hidden">
      {/* Background image with overlay - couvre tout l'écran */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("/frustration.png")`,
          width: '100vw',
          height: '100vh'
        }}
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/80 via-neutral-800/70 to-neutral-900/80"></div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Contenu superposé sur l'image */}
      <div className="relative w-full h-full flex flex-col items-center justify-between px-4 py-8">
        {/* Haut : Beta badge */}
        <div className="w-full max-w-4xl">
          <div className={`text-center transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
          }`}>
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-accent-500/20 border border-accent-500/30">
              <span className="w-2 h-2 bg-accent-500 rounded-full mr-2 animate-pulse"></span>
              🎯 Scorecard exclusive : 47 entretiens entrepreneurs + analyse 10k documents réels
            </div>
          </div>
        </div>

        {/* Milieu : Texte principal */}
        <div className="text-center max-w-4xl">
          {/* Main frustration hook */}
          <div className="max-w-4xl mx-auto mb-8">
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <span className="text-accent-400">{frustrations[currentFrustration].substring(0, 60)}...</span>
            </h1>

            <div className={`text-xl sm:text-2xl text-neutral-300 leading-relaxed transition-all duration-1000 delay-300 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <span className="block mb-4">{frustrations[currentFrustration].substring(60)}</span>
            </div>
          </div>

          {/* Transition subtitle */}
          <div className={`max-w-3xl mx-auto mb-12 transition-all duration-1000 delay-500 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <p className="text-lg text-neutral-200 bg-neutral-800/50 rounded-lg p-6 border border-neutral-700">
              <span className="text-accent-400 font-semibold">si tu reconnais au moins 2 de ces situations,</span> tu es au bon endroit.
              pas pour un autre logiciel compliqué. pour découvrir exactement où tu perds du temps et de l'argent.
            </p>
          </div>
        </div>

        {/* Bas : Bouton superposé */}
        <div className="w-full max-w-md">
          <div className={`transition-all duration-1000 delay-700 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleScorecardClick}
              className="w-full text-xl px-8 py-6 bg-accent-500 hover:bg-accent-600 text-white font-bold shadow-2xl hover:shadow-accent-500/25 transform hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm bg-opacity-90"
            >
              Calculer mon score de chaos administratif (gratuit, 2 min)
              <span className="block text-sm font-normal mt-2 text-accent-100">
                aucune carte · résultats instantanés · plan d'action inclus
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrustrationHero;