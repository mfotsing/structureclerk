'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useScorecardTracking } from '@/components/analytics/AnalyticsTracker';

interface Answer {
  [key: string]: string;
}

const ScoreQuizNew = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { trackScorecardEvent, trackLeadCapture } = useScorecardTracking();

  // Récupérer l'IP pour localisation (simulation)
  const [location, setLocation] = useState('Montréal, QC');

  useEffect(() => {
    setIsVisible(true);

    // Track quiz start when first question is displayed
    if (currentQuestion === 0) {
      trackScorecardEvent('started');
    }

    // Simuler détection de localisation
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.city && data.region) {
          setLocation(`${data.city}, ${data.region}`);
        }
      })
      .catch(() => {
        setLocation('Montréal, QC'); // Valeur par défaut
      });
  }, [currentQuestion, trackScorecardEvent]);

  const questions = [
    {
      id: 'fullName',
      type: 'text',
      question: "pour calculer ton score personnalisé, on a besoin de :",
      subtext: "prénom et nom",
      placeholder: "ex: Marc Tremblay",
      required: true,
      progress: "1/15"
    },
    {
      id: 'email',
      type: 'email',
      question: "adresse email professionnelle",
      placeholder: "ex: marc@construction.ca",
      required: true,
      progress: "2/15"
    },
    {
      id: 'phone',
      type: 'tel',
      question: "téléphone (optionnel, pour démo prioritaire si score critique)",
      placeholder: "ex: 514-555-0123",
      required: false,
      progress: "3/15"
    },
    {
      id: 'companySize',
      type: 'radio',
      question: "quelle phrase décrit le mieux ta situation actuelle ?",
      options: [
        "entrepreneur solo ou duo (1-2 employés)",
        "petite équipe en croissance (3-10 employés)",
        "équipe établie (11-25 employés)",
        "entreprise structurée (25+ employés)"
      ],
      info: "nous adaptons les recommandations selon ta taille",
      progress: "4/15"
    },
    {
      id: 'centralization',
      type: 'radio',
      question: "as-tu un système centralisé où toutes tes factures, soumissions et contrats sont stockés et cherchables en moins de 10 secondes ?",
      options: [
        "oui, tout est centralisé et je trouve n'importe quel document instantanément",
        "parfois, certains docs sont centralisés mais d'autres sont éparpillés (email, dropbox, papier)",
        "non, mes documents sont dispersés partout et je perds du temps à les chercher"
      ],
      insightTrigger: "non, mes documents sont dispersés partout et je perds du temps à les chercher",
      insight: "💡 78% des entrepreneurs perdent 3-5h/semaine juste à chercher des documents",
      progress: "5/15"
    },
    {
      id: 'visibility',
      type: 'radio',
      question: "peux-tu voir en temps réel la marge bénéficiaire de chacun de tes projets actifs, sans ouvrir excel ou appeler ton comptable ?",
      options: [
        "oui, j'ai un dashboard qui me montre la marge de chaque projet en direct",
        "parfois, je peux voir certains projets mais ça prend du temps à compiler",
        "non, je découvre mes marges réelles en fin de mois (ou pire, en fin de projet)"
      ],
      insightTrigger: "non, je découvre mes marges réelles en fin de mois",
      insight: "💡 découvrir un dépassement 3 semaines trop tard coûte en moyenne 8-15% de marge",
      progress: "6/15"
    },
    {
      id: 'automation',
      type: 'radio',
      question: "tes fournisseurs et sous-traitants peuvent-ils uploader directement leurs factures/documents dans ton système (au lieu de t'envoyer des pdfs par email) ?",
      options: [
        "oui, ils uploadent directement et tout est automatiquement lié au bon projet",
        "parfois, certains le font mais la majorité m'envoie encore par email",
        "non, je reçois tout par email et je dois manuellement classer/renommer/archiver"
      ],
      insightTrigger: "non, je reçois tout par email et je dois manuellement",
      insight: "💡 chaque facture reçue par email = 3-5 minutes perdues en manipulation manuelle",
      progress: "7/15"
    },
    {
      id: 'alerts',
      type: 'radio',
      question: "reçois-tu des alertes automatiques (notification mobile ou email) quand un projet dépasse son budget prévu ou approche d'un seuil critique ?",
      options: [
        "oui, je suis alerté en temps réel dès qu'un seuil est franchi",
        "parfois, je vérifie manuellement mes budgets chaque semaine",
        "non, je découvre les dépassements quand je fais mes rapports mensuels"
      ],
      insightTrigger: "non, je découvre les dépassements quand je fais mes rapports mensuels",
      insight: "💡 détection précoce d'un dépassement = possibilité de réagir et sauver 60-80% de la perte",
      progress: "8/15"
    },
    {
      id: 'hoursEntry',
      type: 'radio',
      question: "les heures de tes employés/sous-traitants sont-elles saisies une seule fois directement dans ton système (pas de papier → excel → erp) ?",
      options: [
        "oui, saisie unique mobile/web et tout est automatiquement lié aux projets",
        "parfois, certains employés saisissent directement mais d'autres utilisent encore papier",
        "non, on remplit des feuilles papier que je dois ressaisir manuellement"
      ],
      insightTrigger: "non, on remplit des feuilles papier que je dois ressaisir manuellement",
      insight: "💡 la triple saisie (papier → tableur → système) génère 90% des erreurs de paie et facturation",
      progress: "9/15"
    },
    {
      id: 'quotes',
      type: 'radio',
      question: "peux-tu générer un devis professionnel complet à partir d'un plan pdf en moins de 15 minutes (avec calculs automatiques de quantités/surfaces) ?",
      options: [
        "oui, j'ai un outil de prise de mesures numérique qui calcule tout automatiquement",
        "parfois, j'utilise des outils mais je dois encore vérifier/ajuster manuellement",
        "non, je prends toutes mes mesures à la main (règle, papier) puis je calcule dans excel"
      ],
      insightTrigger: "non, je prends toutes mes mesures à la main",
      insight: "💡 métrologie manuelle = 60-90 min/devis + taux erreur 15-20% vs 5 min + <2% erreur en numérique",
      progress: "10/15"
    },
    {
      id: 'workflows',
      type: 'radio',
      question: "as-tu un workflow automatisé pour les approbations (factures, changements, bons commande) où tu peux approuver/rejeter en 2 clics depuis ton mobile ?",
      options: [
        "oui, je reçois notification mobile et j'approuve en quelques secondes",
        "parfois, certaines approbations sont digitales mais d'autres nécessitent emails/appels",
        "non, tout se fait par échange emails ou appels, avec beaucoup d'allers-retours"
      ],
      insightTrigger: "non, tout se fait par échange emails ou appels",
      insight: "💡 approbations par email = délai moyen 2-5 jours vs 10 minutes avec workflow mobile",
      progress: "11/15"
    },
    {
      id: 'mobile',
      type: 'radio',
      question: "peux-tu accéder à tous tes documents critiques, faire des approbations et consulter l'état de tes projets directement depuis ton téléphone sur le chantier ?",
      options: [
        "oui, j'ai accès complet mobile et je gère autant depuis chantier que depuis bureau",
        "parfois, certaines choses sont accessibles mobile mais d'autres nécessitent ordinateur",
        "non, je dois attendre d'être au bureau pour accéder à la plupart des infos"
      ],
      insightTrigger: "non, je dois attendre d'être au bureau",
      insight: "💡 mobilité = gain moyen 6h/semaine en évitant les retours bureau pour infos/décisions",
      progress: "12/15"
    },
    {
      id: 'objective',
      type: 'radio',
      question: "quel est ton objectif numéro 1 pour les 90 prochains jours ?",
      options: [
        "arrêter de perdre mes soirées/week-ends sur l'administration",
        "détecter les dépassements de budget beaucoup plus tôt",
        "réduire les erreurs de facturation et accélérer les paiements",
        "gagner 10+ heures/semaine pour prendre plus de projets rentables",
        "avoir enfin confiance dans mes chiffres (éliminer les erreurs)"
      ],
      progress: "13/15"
    },
    {
      id: 'adminTime',
      type: 'radio',
      question: "combien d'heures passes-tu par semaine sur les tâches administratives (facturation, classement documents, reporting, relances, excel) ?",
      options: [
        "moins de 5 heures (je suis déjà bien organisé)",
        "5-10 heures (c'est gérable mais frustrant)",
        "10-20 heures (ça devient problématique)",
        "plus de 20 heures (🚨 zone burnout administratif)"
      ],
      progress: "14/15"
    },
    {
      id: 'obstacle',
      type: 'radio',
      question: "quel est le plus gros obstacle qui t'empêche d'avoir un meilleur contrôle sur ton business ?",
      options: [
        "tout est dispersé (excel, emails, papier, dropbox, tête des employés)",
        "je découvre les problèmes trop tard pour réagir efficacement",
        "mes employés perdent un temps fou à chercher des infos/documents",
        "je ne fais pas confiance à mes chiffres (trop d'erreurs de saisie)",
        "je n'ai pas le temps de former mon équipe à de nouveaux outils complexes"
      ],
      progress: "15/15"
    },
    {
      id: 'solution',
      type: 'radio',
      question: "quel type de solution correspondrait le mieux à tes besoins actuels ?",
      options: [
        "formation/méthodologie pour mieux m'organiser avec mes outils actuels (budget : 0-500$)",
        "logiciel simple et intuitif que je configure moi-même en quelques minutes (budget : 100-300$/mois)",
        "solution complète avec accompagnement personnalisé pour setup (budget : 300-800$/mois)",
        "service clé-en-main où tout est configuré et géré pour moi (budget : 1000$+/mois)"
      ],
      progress: "16/18"
    },
    {
      id: 'context',
      type: 'textarea',
      question: "y a-t-il autre chose qu'on devrait savoir sur ta situation, tes défis ou tes attentes ?",
      placeholder: "ex: j'ai un budget à dépenser avant fin d'année",
      maxLength: 500,
      progress: "18/18"
    }
  ];

  const currentQ = questions[currentQuestion];

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    // Track question answered
    trackScorecardEvent('question_answered', {
      question_id: currentQ.id,
      answer: value
    });

    // Show insight if applicable
    if (currentQ.insightTrigger && value === currentQ.insightTrigger) {
      setShowInsight(true);
    } else {
      setShowInsight(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowInsight(false);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowInsight(false);
    }
  };

  const calculateScore = () => {
    setIsCalculating(true);

    // Simulate calculation time
    setTimeout(() => {
      // Calculate score based on answers
      let scoreBase = 0;

      // Best practices questions (Q6-Q13) - 8 questions × 10 pts max = 80 pts
      const bestPracticeQuestions = ['centralization', 'visibility', 'automation', 'alerts', 'hoursEntry', 'quotes', 'workflows', 'mobile'];

      bestPracticeQuestions.forEach(qId => {
        const answer = answers[qId];
        if (answer && answer.startsWith('oui')) scoreBase += 10;
        else if (answer && answer.startsWith('parfois')) scoreBase += 5;
        // "non" = 0 points
      });

      // Bonus points based on context
      if (answers.adminTime?.includes('moins de 5 heures')) scoreBase += 10;
      if (answers.obstacle?.includes('pas confiance')) scoreBase -= 5;
      if (answers.solution?.includes('clé en main')) scoreBase += 5;

      // Normalize to 100
      const scoreFinal = Math.min(100, Math.round((scoreBase / 80) * 100));

      // Determine category
      let category;
      if (scoreFinal <= 35) category = 'rouge_critique';
      else if (scoreFinal <= 65) category = 'orange_attention';
      else category = 'vert_ok';

      // Track completion
      trackScorecardEvent('completed', {
        score: scoreFinal,
        category
      });

      // Track lead capture if we have email
      if (answers.email) {
        trackLeadCapture({
          email: answers.email,
          name: answers.fullName,
          phone: answers.phone,
          score: scoreFinal,
          category,
          qualification: scoreFinal <= 35 ? 'hot' : scoreFinal <= 65 ? 'warm' : 'cold'
        });
      }

      // Save to database via API
      try {
        await fetch('/api/scorecard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: answers.fullName,
            email: answers.email,
            phone: answers.phone,
            companySize: answers.companySize,
            answers,
            score: scoreFinal,
            category,
            completedAt: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Failed to save scorecard:', error);
      }

      // Redirect to results
      router.push(`/results?score=${scoreFinal}&category=${category}&answers=${encodeURIComponent(JSON.stringify(answers))}`);
    }, 2000);
  };

  const canProceed = answers[currentQ.id] || !currentQ.required;

  if (isCalculating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-navy to-brand-blue flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <svg className="w-8 h-8 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">analyse de tes réponses en cours...</h2>
          <p className="text-brand-blue/200">nous calculons ton score de chaos administratif</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-neutral-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">Question {currentQ.progress}</span>
            <span className="text-sm text-neutral-500">
              {Math.round((currentQuestion / questions.length) * 100)}% complété
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div
              className="bg-brand-orange h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question card */}
        <div className={`bg-white rounded-2xl shadow-xl p-8 border border-neutral-200 transition-all duration-500 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            {currentQ.question}
          </h2>

          {currentQ.subtext && (
            <p className="text-lg text-neutral-600 mb-6">{currentQ.subtext}</p>
          )}

          {/* Auto-detected info */}
          {currentQ.id === 'phone' && (
            <div className="bg-brand-blue/50 border border-brand-blue/200 rounded-lg p-3 mb-6">
              <p className="text-sm text-brand-blue-700">
                📍 Localisation détectée : {location}
              </p>
            </div>
          )}

          {/* Info bubble */}
          {currentQ.info && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-amber-700">
                💡 {currentQ.info}
              </p>
            </div>
          )}

          {/* Input fields */}
          {currentQ.type === 'text' && (
            <input
              type="text"
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={currentQ.placeholder}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              required={currentQ.required}
            />
          )}

          {currentQ.type === 'email' && (
            <input
              type="email"
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={currentQ.placeholder}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              required={currentQ.required}
            />
          )}

          {currentQ.type === 'tel' && (
            <input
              type="tel"
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={currentQ.placeholder}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            />
          )}

          {currentQ.type === 'textarea' && (
            <textarea
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={currentQ.placeholder}
              maxLength={currentQ.maxLength}
              rows={4}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-none"
            />
          )}

          {/* Radio options */}
          {currentQ.type === 'radio' && currentQ.options && (
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <label
                  key={index}
                  className={`block p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    answers[currentQ.id] === option
                      ? 'border-brand-orange bg-brand-orange/50'
                      : 'border-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name={currentQ.id}
                      value={option}
                      checked={answers[currentQ.id] === option}
                      onChange={(e) => handleAnswer(e.target.value)}
                      className="w-4 h-4 text-brand-orange focus:ring-brand-orange"
                    />
                    <span className="ml-3 text-neutral-700">{option}</span>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Insight */}
          {showInsight && currentQ.insight && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <span className="text-amber-600 text-lg">💡</span>
                <p className="text-sm text-amber-800">{currentQ.insight}</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                currentQuestion === 0
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              ← Précédent
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  canProceed
                    ? 'bg-brand-orange text-white hover:bg-orange-600'
                    : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                }`}
              >
                Suivant →
              </button>
            ) : (
              <button
                onClick={calculateScore}
                disabled={!canProceed}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  canProceed
                    ? 'bg-brand-orange text-white hover:bg-orange-600'
                    : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                }`}
              >
                Voir mon score et plan d'action
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScoreQuizNew;