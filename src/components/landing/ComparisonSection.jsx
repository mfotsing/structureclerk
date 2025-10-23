import React from 'react';
import Button from './shared/Button';

const ComparisonSection = () => {
  const comparison = [
    { 
      feature: "Modules à apprendre", 
      competitor: "12+", 
      structureclerk: "4 menus",
      better: true
    },
    { 
      feature: "Formation obligatoire", 
      competitor: "4-8 heures", 
      structureclerk: "Prêt en 5 minutes",
      better: true
    },
    { 
      feature: "Clics pour approuver facture", 
      competitor: "40+", 
      structureclerk: "2 : glisser + approuver",
      better: true
    }
  ];

  const handleCTAClick = () => {
    // Track analytics event
    console.log('Track Event: cta_click', { position: 'comparison' });
    window.location.href = '/signup';
  };

  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Arrêtez de gérer des feuilles de calcul. Obtenez de lArrêtez de gérer des feuilles de calcul. Obtenez de l'intelligence, pas un autre logiciel complexe.rsquo;intelligence, pas un autre logiciel complexe.
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            StructureClerk est conçu spécifiquement pour les entrepreneurs du bâtiment, pas adapté d'autres industries.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Feature blocks */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    IA spécialisée construction
                  </h3>
                  <p className="text-neutral-600">
                    Notre IA est entraînée spécifiquement sur les documents du bâtiment (factures, soumissions, contrats). Elle reconnaît les termes techniques, les codes de matériaux et les structures de prix spécifiques à votre industrie.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Détection en temps réel
                  </h3>
                  <p className="text-neutral-600">
                    Recevez des alertes immédiates lors de dépassements de budget. Notre système surveille vos documents en temps réel et vous notifie avant quRecevez des alertes immédiates lors de dépassements de budget. Notre système surveille vos documents en temps réel et vous notifie avant qu'un problème ne devienne une crise.rsquo;un problème ne devienne une crise.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard mockup with alert */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-neutral-200">
            <div className="bg-neutral-900 text-white p-4 text-sm font-medium">
              StructureClerk - Tableau de bord
            </div>
            <div className="p-6">
              {/* Alert banner */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-red-800">
                      Alerte de dépassement de budget
                    </h4>
                    <p className="text-sm text-red-600">
                      Projet &ldquo;Centre Commercial Sainte-Foy&rdquo; : risque de dépassement de 8,500$
                    </p>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-50 rounded-lg p-3">
                  <div className="text-xs text-neutral-500 mb-1">Budget utilisé</div>
                  <div className="text-lg font-semibold text-red-600">87%</div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 mt-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3">
                  <div className="text-xs text-neutral-500 mb-1">Jours restants</div>
                  <div className="text-lg font-semibold text-neutral-900">12</div>
                  <div className="text-xs text-neutral-500">sur 45 jours</div>
                </div>
              </div>

              {/* Recent documents */}
              <div>
                <h4 className="text-sm font-medium text-neutral-900 mb-3">Documents récents</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Facture #2024-087</div>
                        <div className="text-xs text-neutral-500">Matériaux BTP</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-red-600">+2,450$</div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Soumission #45-2024</div>
                        <div className="text-xs text-neutral-500">Rénovation résidentielle</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-green-600">12,800$</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                    Fonctionnalité
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-neutral-900">
                    Solutions concurrentes
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-primary-600 bg-primary-50">
                    StructureClerk
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {comparison.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                    <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                      {item.feature}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-neutral-600">
                      {item.competitor}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        item.better 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {item.structureclerk}
                        {item.better && (
                          <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-neutral-900 mb-4">
            Prêt à simplifier votre gestion documentaire ?
          </h3>
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
            Rejoignez les entrepreneurs qui économisent 4+ heures par semaine avec StructureClerk.
          </p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleCTAClick}
          >
            Commencer l'essai gratuit
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;