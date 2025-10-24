'use client';

import { useState } from 'react';
import ScoreQuizNew from '@/components/scorecard/ScoreQuizNew';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ScoreCardContent() {
  const searchParams = useSearchParams();
  const showQuiz = searchParams.get('scorecard') === 'scorecard' || searchParams.get('quiz') === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-navy to-brand-blue">
      {!showQuiz ? (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Calculer votre Score de Gestion
          </h1>
          <p className="text-xl text-white/90 mb-4 max-w-3xl mx-auto">
            Découvrez combien d'heures et d'argent vous pourriez économiser avec StructureClerk
          </p>
          <p className="text-lg text-brand-orange font-medium mb-8">
            Questionnaire de 10 questions • 2 minutes • Résultats immédiats
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Pourquoi calculer votre score ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-brand-orange mb-2">10h+</div>
                <div className="text-sm">Temps économisé par semaine</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-brand-orange mb-2">94%</div>
                <div className="text-sm">Précision de l'IA</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-brand-orange mb-2">2min</div>
                <div className="text-sm">Création de devis</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => window.location.href = '/scorecard?scorecard=scorecard'}
            className="px-8 py-4 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-lg"
          >
            Commencer le questionnaire de 10 questions
          </button>
        </div>
      ) : (
        <ScoreQuizNew />
      )}
    </div>
  );
}

export default function ScorecardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-brand-navy to-brand-blue flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    }>
      <ScoreCardContent />
    </Suspense>
  );
}