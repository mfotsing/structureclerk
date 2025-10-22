import React, { useState, useEffect } from 'react';
import Button from '../landing/shared/Button';

const CredibilitySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      text: "l'IA a lu ma facture manuscrite parfaitement",
      author: "entrepreneur bêta",
      type: "slack"
    },
    {
      text: "détecté dépassement 6k$ que j'aurais raté",
      author: "gérant chantier",
      type: "email"
    },
    {
      text: "temps de traitement factures divisé par 5",
      author: "directeur administratif",
      type: "slack"
    }
  ];

  const stats = [
    {
      value: "55%",
      description: "PME construction perdent 40%+ temps admin",
      source: "visma"
    },
    {
      value: "90%",
      description: "Tableurs Excel contiennent des erreurs graves",
      source: "étude interne"
    },
    {
      value: "25%",
      description: "Journée perdue en reporting manuel",
      source: "conducteurs"
    },
    {
      value: "10k+",
      description: "Documents chantier analysés pour entraîner l'IA",
      source: "structureclerk"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleScorecardClick = () => {
    // Track analytics
    console.log('Track Event: credibility_cta_click', { position: 'credibility' });
    // Navigate to scorecard
    window.location.href = '#scorecard';
  };

  return (
    <section className="relative bg-neutral-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230284c7' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
            la preuve par les <span className="text-primary-600">chiffres</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            pas de promesses vides. juste des données vérifiées et retours réels
          </p>
        </div>

        {/* Beta status with testimonials */}
        <div className={`mb-16 transition-all duration-1000 delay-300 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-accent-100 text-accent-800 mb-4">
                <span className="w-2 h-2 bg-accent-500 rounded-full mr-2 animate-pulse"></span>
                Actuellement bêta exclusive avec 15 entrepreneurs
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                voici ce qu'ils testent :
              </h3>
            </div>

            {/* Testimonials carousel */}
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className={`bg-neutral-50 rounded-lg p-6 border transition-all duration-500 ${
                    currentTestimonial === index 
                      ? 'border-primary-300 bg-primary-50 scale-105 shadow-lg' 
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center mb-4">
                    {testimonial.type === 'slack' && (
                      <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/>
                          <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                          <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/>
                          <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/>
                          <path d="M14.5 14c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5z"/>
                          <path d="M20.5 14H19v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
                          <path d="M9.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/>
                          <path d="M3.5 10H5V8.5C5 7.67 4.33 7 3.5 7S2 7.67 2 8.5 2.67 10 3.5 10z"/>
                        </svg>
                      </div>
                    )}
                    {testimonial.type === 'email' && (
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-neutral-500">via {testimonial.type}</div>
                      <div className="text-xs text-neutral-400">{testimonial.author}</div>
                    </div>
                  </div>
                  <blockquote className="text-neutral-700 italic">
                    "{testimonial.text}"
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 transition-all duration-1000 delay-500 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary-600 mb-3">
                {stat.value}
              </div>
              <p className="text-neutral-600 mb-2">
                {stat.description}
              </p>
              <div className="text-xs text-neutral-500 italic">
                source : {stat.source}
              </div>
            </div>
          ))}
        </div>

        {/* Credibility details */}
        <div className={`bg-white rounded-2xl shadow-xl p-8 border border-neutral-200 mb-16 transition-all duration-1000 delay-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h3 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
            pourquoi tu peux nous faire confiance
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-primary-100 text-primary-600 p-3 rounded-lg flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 mb-2">données réelles, pas théoriques</h4>
                <p className="text-neutral-600 text-sm">
                  notre IA est entraînée sur 10 000+ documents de chantier réels. factures manuscrites, soumissions pdf, contrats modifiés.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary-100 text-primary-600 p-3 rounded-lg flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 mb-2">47 entretiens avec entrepreneurs</h4>
                <p className="text-neutral-600 text-sm">
                  nous avons écouté vos frustrations. chaque fonctionnalité résout un problème réel identifié pendant des heures d'entretiens.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary-100 text-primary-600 p-3 rounded-lg flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 mb-2">stats validées par tiers</h4>
                <p className="text-neutral-600 text-sm">
                  visma, conducteurs et autres études indépendantes confirment : 55% PME construction subissent un chaos administratif critique.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary-100 text-primary-600 p-3 rounded-lg flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 mb-2">résultats mesurables</h4>
                <p className="text-neutral-600 text-sm">
                  nos utilisateurs bêta économisent en moyenne 10h/semaine. pas des promesses, des chiffres vérifiés semaine après semaine.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className={`text-center transition-all duration-1000 delay-900 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleScorecardClick}
            className="text-xl px-12 py-6 bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-2xl hover:shadow-primary-600/25 transform hover:-translate-y-1 transition-all duration-300"
          >
            calculer mon score de chaos (gratuit, 2 min)
          </Button>
          <p className="mt-4 text-sm text-neutral-500">
            rejoint les 15 entrepreneurs qui testent déjà la solution
          </p>
        </div>
      </div>
    </section>
  );
};

export default CredibilitySection;