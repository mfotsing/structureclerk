import React, { useState } from 'react';
import Button from './shared/Button';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question: "Mes documents sont-ils sécurisés avec StructureClerk ?",
      answer: "Oui, absolument. Nous utilisons un chiffrement de bout en bout (AES-256) pour protéger vos documents. Vos données sont sauvegardées automatiquement sur des serveurs sécurisés avec redondance géographique. Nous sommes conformes RGPD et HIPAA, et nous ne partageons jamais vos données avec des tiers sans votre consentement explicite."
    },
    {
      question: "Est-ce que StructureClerk est vraiment simple à utiliser ?",
      answer: "Oui, c'est notre promesse #1. StructureClerk est conçu spécifiquement pour les entrepreneurs du bâtiment, pas pour les experts en logiciels. Notre interface n'a que 4 menus principaux, et la plupart des utilisateurs sont opérationnels en moins de 5 minutes. Pas de formation longue, pas de manuel complexe à lire."
    },
    {
      question: "Comment StructureClerk se compare-t-il aux autres solutions ?",
      answer: "Contrairement aux solutions génériques qui nécessitent 12+ modules et 40+ clics pour approuver une facture, StructureClerk vous permet de faire la même chose en 2 clics : glisser + approuver. Notre IA est spécialisée pour les documents du bâtiment et reconnaît les termes techniques spécifiques à votre industrie. En moyenne, nos utilisateurs économisent 4+ heures par semaine."
    },
    {
      question: "Puis-je annuler mon abonnement à tout moment ?",
      answer: "Oui, sans aucun engagement. Vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord, et l'accès se terminera à la fin de votre période de facturation en cours. Pas de frais d'annulation, pas de questions posées. Nous proposons également une garantie satisfait ou remboursé de 30 jours : si vous n'êtes pas complètement satisfait, nous vous remboursons 100%."
    }
  ];

  const handleToggle = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  const handleCTAClick = () => {
    // Track analytics event
    console.log('Track Event: cta_click', { position: 'faq' });
    window.location.href = '/signup';
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Questions fréquentes
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Tout ce que vous devez savoir sur StructureClerk
          </p>
        </div>

        {/* FAQ items */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-neutral-200 rounded-xl overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neutral-50 focus:outline-none focus:bg-neutral-50 transition-colors duration-200"
                  onClick={() => handleToggle(index)}
                >
                  <h3 className="text-lg font-semibold text-neutral-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}>
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  activeIndex === index ? 'max-h-96' : 'max-h-0'
                }`}>
                  <div className="px-6 pb-4">
                    <p className="text-neutral-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact section */}
        <div className="bg-primary-50 rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl font-bold text-neutral-900 mb-4">
            Vous ne trouvez pas réponse à votre question ?
          </h3>
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
            Notre équipe d'experts est là pour vous aider. Contactez-nous et nous répondrons dans les 24 heures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleCTAClick}
            >
              Essayer StructureClerk gratuitement
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = 'mailto:support@structureclerk.ca'}
            >
              Contacter le support
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;