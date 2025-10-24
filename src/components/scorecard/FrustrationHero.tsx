import React, { useState, useEffect } from 'react';
import HeroNavigation from '../hero/HeroNavigation';

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
      {/* Navigation minimale */}
      <HeroNavigation />

      {/* Background image with 10% overlay - Image "soirée" */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("/frustration.png")`, // Temporarily using existing image until "soirée.png" is available
          width: '100vw',
          height: '100vh'
        }}
      />

      {/* Dark overlay 10% pour lisibilité */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Contenu superposé sur l'image */}
      <div className="relative w-full h-full flex flex-col items-center justify-center px-4">
        {/* Texte principal centré */}
        <div className="text-center max-w-4xl">
          {/* Main frustration hook */}
          <div className="max-w-4xl mx-auto mb-12">
            <h1
              className={`text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 leading-tight transition-all duration-1000 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                textShadow: '0px 2px 4px rgba(0,0,0,0.8), 0px 4px 8px rgba(0,0,0,0.5)'
              }}
            >
              <span className="text-white">{frustrations[currentFrustration]}</span>
            </h1>
          </div>

          {/* Transition subtitle */}
          <div
            className={`max-w-3xl mx-auto mb-16 transition-all duration-1000 delay-500 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{
              textShadow: '0px 1px 2px rgba(0,0,0,0.8)'
            }}
          >
            <p className="text-xl sm:text-2xl text-white">
              <span className="font-semibold">si tu reconnais au moins 2 de ces situations,</span> tu es au bon endroit.
              <br />
              pas pour un autre logiciel compliqué. pour découvrir exactement où tu perds du temps et de l'argent.
            </p>
          </div>
        </div>

        {/* Bouton CTA bleu */}
        <div className={`w-full max-w-lg transition-all duration-1000 delay-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <button
            onClick={handleScorecardClick}
            className="w-full text-xl lg:text-2xl px-8 py-6 font-bold transform hover:-translate-y-1 transition-all duration-300 rounded-xl hover:shadow-[0_15px_35px_rgba(14,165,233,0.4),0_25px_60px_rgba(14,165,233,0.3)] shadow-[0_10px_25px_rgba(14,165,233,0.3),0_20px_50px_rgba(14,165,233,0.2)] bg-[#0ea5e9] hover:bg-[#0284c7] text-white"
          >
            Calculer mon score de chaos administratif
            <span className="block text-sm font-normal mt-2 text-white/90">
              Sans carte bancaire - Résultats immédiats
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FrustrationHero;