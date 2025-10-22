'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/landing/shared/Button';
import Link from 'next/link';

interface Answers {
  [key: string]: string;
}

const ResultsPage = () => {
  const searchParams = useSearchParams();
  const [score, setScore] = useState<number>(0);
  const [category, setCategory] = useState<string>('');
  const [answers, setAnswers] = useState<Answers>({});
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  const [showReferral, setShowReferral] = useState(false);

  useEffect(() => {
    const scoreParam = searchParams.get('score');
    const categoryParam = searchParams.get('category');
    const answersParam = searchParams.get('answers');

    if (scoreParam) setScore(parseInt(scoreParam));
    if (categoryParam) setCategory(categoryParam);
    
    let parsedAnswers: Answers = {};
    if (answersParam) {
      try {
        parsedAnswers = JSON.parse(decodeURIComponent(answersParam));
        setAnswers(parsedAnswers);
      } catch (e) {
        console.error('Error parsing answers:', e);
      }
    }

    setIsVisible(true);

    // Generate referral link
    const userId = Math.random().toString(36).substr(2, 9);
    setReferralLink(`${window.location.origin}/?ref=${userId}`);

    // Extract email from answers if available
    if (parsedAnswers?.email) {
      setEmail(parsedAnswers.email);
    }
  }, [searchParams]);

  const getScoreColor = () => {
    if (score <= 35) return 'text-danger-600';
    if (score <= 65) return 'text-accent-600';
    return 'text-success-600';
  };

  const getScoreBg = () => {
    if (score <= 35) return 'bg-danger-100 border-danger-200';
    if (score <= 65) return 'bg-accent-100 border-accent-200';
    return 'bg-success-100 border-success-200';
  };

  const getCategoryTitle = () => {
    if (score <= 35) return 'CHAOS CRITIQUE 🔴';
    if (score <= 65) return 'ATTENTION REQUISE 🟡';
    return 'OPTIMISATION POSSIBLE 🟢';
  };

  const getStoryText = () => {
    if (score <= 35) {
      return `ton score : ${score}/100 🔴
ton entreprise respire le chaos organisé.
tu es à deux doigts burnout administratif, mais tiens par pure force volonté.
bonne nouvelle ? tu es exactement là où étaient 78% de nos clients avant structureclerk.
dans 8 semaines, tu pourrais être celui qui rentre 17h pendant concurrents encore excel 22h.`;
    }
    if (score <= 65) {
      return `ton score : ${score}/100 🟡
tu as mis en place quelques bonnes pratiques, mais des failles critiques subsistent.
ton intuition te dit que quelque chose cloche - elle a raison.
chaque semaine qui passe sans action te coûte entre 800$ et 2 400$ en pertes évitables.
la bonne nouvelle ? tu es à 60% du chemin vers la sérénité administrative.`;
    }
    return `ton score : ${score}/100 🟢
tu es déjà dans le top 15% des entrepreneurs en organisation.
mais même les meilleurs optimisent continuellement.
ces 10-15% de marge supplémentaire que tu laisses sur la table ?
ce pourrait être la différence entre une bonne année et une année exceptionnelle.
tu as le droit d'être fier, mais pas le droit de t'arrêter là.`;
  };

  const getInsights = () => {
    const insights = [];
    
    // Insight #1 based on admin time
    if (answers.adminTime?.includes('plus de 20 heures')) {
      insights.push({
        title: "⚠️ ZONE DANGER IMMÉDIAT",
        description: "Tu perds 20h+/semaine = 4 000$/mois. C'est un employé à plein temps que tu payes avec ta santé et ton temps famille.",
        action: "Priorité absolue : réorganiser maintenant, pas demain."
      });
    } else if (answers.adminTime?.includes('10-20 heures')) {
      insights.push({
        title: "🎯 CIBLE D'OPTIMISATION IDENTIFIÉE",
        description: "10-20h/semaine perdues = 2 000$/mois d'opportunité. Tu pourrais financer un assistant partiel avec ces économies.",
        action: "Action prioritaire : automatiser la gestion documents."
      });
    }

    // Insight #2 based on main obstacle
    if (answers.obstacle?.includes('dispersé')) {
      insights.push({
        title: "📂 PROBLÈME FONDAMENTAL : DISPERSION",
        description: "Tes informations sont éparpillées sur 5+ systèmes différents. Chaque recherche d'info = 3-8 minutes perdues.",
        action: "Solution : centraliser tout dans un seul lieu accessible mobile."
      });
    } else if (answers.obstacle?.includes('trop tard')) {
      insights.push({
        title: "⏰ PROBLÈME CRITIQUE : RÉACTIVITÉ",
        description: "Tu découvres les problèmes 3 semaines trop tard. Chaque jour de retard = 1-3% de marge perdue.",
        action: "Solution : alertes temps réel sur mobile, pas rapports hebdomadaires."
      });
    }

    // Insight #3 based on objective
    if (answers.objective?.includes('soirées')) {
      insights.push({
        title: "🌅 OBJECTIF DE VIE IDENTIFIÉ",
        description: "Tu veux récupérer tes soirées et week-ends. StructureClerk te rend exactement ça : 10h+/semaine de vie.",
        action: "Promesse tenue : tes dimanches soirs retrouvés en 8 semaines."
      });
    } else if (answers.objective?.includes('confiance')) {
      insights.push({
        title: "🔍 OBJECTIF DE MAÎTRISE",
        description: "Tu veux faire confiance à tes chiffres. Avec double-check IA et alertes automatiques, tes décisions seront basées sur des données fiables.",
        action: "Résultat : zéro surprise de fin de mois, confiance totale dans tes marges."
      });
    }

    return insights;
  };

  const getNextSteps = () => {
    if (answers.adminTime?.includes('plus de 20 heures')) {
      return {
        title: "INTERVENTION CRITIQUE",
        description: "Ton niveau de chaos nécessite une action immédiate",
        cta: "audit gratuit 30 min",
        priority: "URGENT"
      };
    }
    if (answers.adminTime?.includes('10-20 heures')) {
      return {
        title: "TRANSFORMATION URGENTE",
        description: "Tu es à un point de bascule critique",
        cta: "démo personnalisée",
        priority: "HAUTE"
      };
    }
    if (answers.adminTime?.includes('5-10 heures')) {
      return {
        title: "OPTIMISATION RAPIDE",
        description: "Des gains significatifs sont accessibles maintenant",
        cta: "essai gratuit 14j",
        priority: "MOYENNE"
      };
    }
    return {
      title: "PERFECTIONNEMENT",
      description: "Passe de bon à excellent",
      cta: "guide gratuit",
      priority: "BASSE"
    };
  };

  const handleSendReport = () => {
    if (!email) return;
    
    // Simulate sending report
    setEmailSent(true);
    console.log('Track Event: report_sent', { email, score, category });
    
    // In real implementation, this would call an API
    setTimeout(() => {
      setEmailSent(false);
    }, 3000);
  };

  const handleReferral = () => {
    setShowReferral(true);
    console.log('Track Event: referral_initiated', { score, category });
  };

  const handleShareLinkedIn = () => {
    const text = `Je viens de calculer mon score de chaos administratif : ${score}/100 avec ${getCategoryTitle()}. Les entrepreneurs du bâtiment, découvrez où vous perdez temps et argent en 2 minutes !`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    console.log('Track Event: linkedin_share', { score, category });
  };

  const insights = getInsights();
  const nextSteps = getNextSteps();

  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Score header */}
        <div className={`text-center mb-12 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
            tes résultats personnalisés
          </h1>
          
          <div className={`inline-block ${getScoreBg()} rounded-2xl p-8 border-2 mb-8`}>
            <div className="text-6xl font-bold mb-2">
              <span className={getScoreColor()}>{score}/100</span>
            </div>
            <div className="text-xl font-semibold text-neutral-800">
              {getCategoryTitle()}
            </div>
          </div>
        </div>

        {/* Story section */}
        <div className={`bg-white rounded-2xl shadow-xl p-8 border border-neutral-200 mb-8 transition-all duration-1000 delay-300 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            ton histoire, ta solution
          </h2>
          <div className="whitespace-pre-line text-lg text-neutral-700 leading-relaxed">
            {getStoryText()}
          </div>
        </div>

        {/* Personalized insights */}
        <div className={`space-y-6 mb-8 transition-all duration-1000 delay-500 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-2xl font-bold text-neutral-900 text-center">
            tes 3 insights personnalisés
          </h2>
          
          {insights.map((insight, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-900 mb-3">
                {insight.title}
              </h3>
              <p className="text-neutral-700 mb-4">
                {insight.description}
              </p>
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <p className="text-primary-800 font-medium">
                  ✅ {insight.action}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lead magnet */}
        <div className={`bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-xl p-8 text-white mb-8 transition-all duration-1000 delay-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-2xl font-bold mb-4">
            reçois ton rapport complet par email
          </h2>
          <p className="text-primary-100 mb-6">
            Un PDF de 8 pages avec :
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Diagnostic détaillé de tes 3 faiblesses critiques
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Checklist 12 optimisations rapides (gains immédiats)
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Calculateur Excel : combien tu perds vraiment chaque mois
            </li>
          </ul>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton email professionnel"
              className="flex-1 px-4 py-3 rounded-lg text-neutral-900 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <Button
              variant="primary"
              size="lg"
              onClick={handleSendReport}
              disabled={!email || emailSent}
              className="bg-white text-primary-600 hover:bg-primary-50 font-bold"
            >
              {emailSent ? 'envoyé !' : 'envoyer rapport gratuit'}
            </Button>
          </div>
        </div>

        {/* Next steps */}
        <div className={`bg-white rounded-2xl shadow-xl p-8 border border-neutral-200 mb-8 transition-all duration-1000 delay-900 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-2 bg-danger-100 text-danger-800 rounded-full text-sm font-semibold mb-4">
              {nextSteps.priority}
            </span>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              {nextSteps.title}
            </h2>
            <p className="text-neutral-600">
              {nextSteps.description}
            </p>
          </div>
          
          <div className="text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => console.log('Track Event: next_steps_cta', { cta: nextSteps.cta })}
              className="bg-accent-500 hover:bg-accent-600 text-white font-bold text-lg px-8 py-4"
            >
              {nextSteps.cta}
            </Button>
          </div>
        </div>

        {/* Viral loop */}
        <div className={`bg-neutral-50 rounded-2xl p-8 border border-neutral-200 mb-8 transition-all duration-1000 delay-1100 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
            compare ton score avec d'autres entrepreneurs
          </h2>
          
          <div className="text-center mb-6">
            <p className="text-neutral-600 mb-4">
              Les 3 meilleurs scores ce mois-ci gagnent 3 mois gratuits StructureClerk Pro (300$ valeur)
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleReferral}
                className="border-2 border-primary-500 text-primary-600 hover:bg-primary-50"
              >
                inviter un collègue à faire le test
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleShareLinkedIn}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                partager mon score LinkedIn
              </Button>
            </div>
          </div>
          
          {showReferral && (
            <div className="bg-white rounded-lg p-4 border border-neutral-200">
              <p className="text-sm text-neutral-600 mb-2">
                Ton lien d'invitation unique :
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-300 rounded text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(referralLink);
                    alert('Lien copié !');
                  }}
                >
                  copier
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Final credibility */}
        <div className={`text-center transition-all duration-1000 delay-1300 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="bg-neutral-900 text-white rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">
              prochaine ouverture bêta : décembre 2024
            </h3>
            <p className="text-neutral-300 mb-6">
              25 places disponibles
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <input
                type="email"
                placeholder="ton email pour la liste d'attente"
                className="px-4 py-3 rounded-lg text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
              <Button
                variant="primary"
                size="lg"
                onClick={() => console.log('Track Event: waitlist_join')}
                className="bg-accent-500 hover:bg-accent-600 text-white font-bold"
              >
                rejoindre la liste d'attente
              </Button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </Suspense>
  );
};

function ResultsPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <ResultsPage />
    </Suspense>
  );
}

export default ResultsPageWrapper;

export const dynamic = 'force-dynamic';