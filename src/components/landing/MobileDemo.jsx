import React, { useState } from 'react';
import Image from 'next/image';
import Button from './shared/Button';

const MobileDemo = () => {
  const [activeScenario, setActiveScenario] = useState(0);

  const scenarios = [
    {
      title: "Sur le chantier",
      description: "Prenez une photo d'une facture de matériaux et recevez une alerte de dépassement en temps réel",
      image: "/api/placeholder/300/600",
      features: [
        "Capture photo instantanée",
        "Reconnaissance IA des articles",
        "Alerte budget immédiate",
        "Validation sur place"
      ]
    },
    {
      title: "Au bureau",
      description: "Traitez toutes vos soumissions en un glisser-déposer et prenez des décisions éclairées",
      image: "/api/placeholder/300/600",
      features: [
        "Upload multiple de documents",
        "Extraction automatique des données",
        "Comparaison avec le budget",
        "Approbation en un clic"
      ]
    }
  ];

  const handleCTAClick = () => {
    // Track analytics event
    console.log('Track Event: cta_click', { position: 'mobile_demo' });
    window.location.href = '/signup';
  };

  return (
    <section className="py-20 bg-neutral-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Conçu pour le chantier, pas pour le bureau
          </h2>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
            Utilisez StructureClerk où que vous soyez. Sur le chantier, dans votre véhicule ou au bureau.
          </p>
        </div>

        {/* Scenario selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg bg-neutral-800 p-1">
            {scenarios.map((scenario, index) => (
              <button
                key={index}
                onClick={() => setActiveScenario(index)}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeScenario === index
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-700'
                }`}
              >
                {scenario.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Mobile mockup */}
          <div className="relative">
            {/* Construction site background */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1518517917554-4b4c6b1b4ceb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Construction site" 
                width={320}
                height={640}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent"></div>
            </div>
            
            {/* Phone mockup */}
            <div className="relative bg-neutral-800 rounded-3xl p-2 shadow-2xl mx-auto" style={{ width: '320px' }}>
              <div className="bg-neutral-900 rounded-2xl overflow-hidden">
                {/* Phone status bar */}
                <div className="bg-neutral-900 px-4 py-2 flex justify-between items-center text-xs">
                  <span className="text-white">9:41</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-3 bg-white rounded-sm"></div>
                    <div className="w-4 h-3 bg-white rounded-sm"></div>
                    <div className="w-4 h-3 bg-white rounded-sm"></div>
                  </div>
                </div>
                
                {/* App screen */}
                <div className="bg-white h-96 relative">
                  {activeScenario === 0 ? (
                    // Scenario 1: On construction site
                    <div className="p-4 h-full flex flex-col">
                      <div className="text-center mb-4">
                        <h4 className="text-sm font-semibold text-neutral-900">StructureClerk</h4>
                        <p className="text-xs text-neutral-500">Scannez une facture</p>
                      </div>
                      
                      {/* Camera view */}
                      <div className="flex-1 bg-neutral-100 rounded-lg mb-4 relative overflow-hidden">
                        <Image 
                          src="https://images.unsplash.com/photo-1581224246174-3cbf5aa9975a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                          alt="Invoice" 
                          width={300}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-32 border-2 border-white rounded-lg"></div>
                        </div>
                      </div>
                      
                      {/* Alert */}
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-semibold text-red-800">Alerte budget</span>
                        </div>
                        <p className="text-xs text-red-700">Dépassement possible de 450$ sur ce projet</p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex space-x-2 mt-3">
                        <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-xs font-medium">
                          Analyser
                        </button>
                        <button className="flex-1 bg-neutral-200 text-neutral-700 py-2 rounded-lg text-xs font-medium">
                          Ignorer
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Scenario 2: In the office
                    <div className="p-4 h-full flex flex-col">
                      <div className="text-center mb-4">
                        <h4 className="text-sm font-semibold text-neutral-900">StructureClerk</h4>
                        <p className="text-xs text-neutral-500">Documents en attente</p>
                      </div>
                      
                      {/* Document list */}
                      <div className="flex-1 space-y-2 mb-4 overflow-y-auto">
                        <div className="bg-neutral-50 rounded-lg p-3 border-l-4 border-l-red-500">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-medium">Facture #2024-087</span>
                            <span className="text-xs text-red-600">+2,450$</span>
                          </div>
                          <p className="text-xs text-neutral-500">Matériaux BTP</p>
                        </div>
                        <div className="bg-neutral-50 rounded-lg p-3 border-l-4 border-l-green-500">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-medium">Soumission #45-2024</span>
                            <span className="text-xs text-green-600">12,800$</span>
                          </div>
                          <p className="text-xs text-neutral-500">Rénovation résidentielle</p>
                        </div>
                        <div className="bg-neutral-50 rounded-lg p-3 border-l-4 border-l-yellow-500">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-medium">Contrat #78-2024</span>
                            <span className="text-xs text-yellow-600">En attente</span>
                          </div>
                          <p className="text-xs text-neutral-500">Services électriques</p>
                        </div>
                      </div>
                      
                      {/* Quick stats */}
                      <div className="bg-primary-50 rounded-lg p-3 mb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-primary-900">Budget projet</span>
                          <span className="text-xs font-bold text-primary-900">87% utilisé</span>
                        </div>
                        <div className="w-full bg-primary-200 rounded-full h-1.5 mt-1">
                          <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-xs font-medium">
                          Traiter tout
                        </button>
                        <button className="flex-1 bg-neutral-200 text-neutral-700 py-2 rounded-lg text-xs font-medium">
                          Voir détails
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Phone home indicator */}
                <div className="bg-neutral-900 h-6 flex justify-center items-center">
                  <div className="w-20 h-1 bg-neutral-700 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario details */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">{scenarios[activeScenario].title}</h3>
              <p className="text-lg text-neutral-300 mb-8">
                {scenarios[activeScenario].description}
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white">Fonctionnalités clés</h4>
              <div className="space-y-4">
                {scenarios[activeScenario].features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">{feature}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-800 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Témoignage</h4>
              <blockquote className="text-neutral-300 italic mb-4">
                &ldquo;J'utilise StructureClerk directement sur mes chantiers. Je prends une photo d'une facture et je sais immédiatement si ça affecte mon budget. Plus besoin d'attendre de rentrer au bureau.&rdquo;
              </blockquote>
              <div className="text-sm text-neutral-400">
                <div className="font-medium">Marc Tremblay</div>
                <div>Entrepreneur en électricité • 12 employés</div>
              </div>
            </div>

            <Button 
              variant="primary" 
              size="lg"
              onClick={handleCTAClick}
              className="w-full"
            >
              Essayer sur mobile
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileDemo;