'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ScorecardNavigation from '@/components/scorecard/ScorecardNavigation';
import FrustrationHero from '@/components/scorecard/FrustrationHero';
import TransformationSection from '@/components/scorecard/TransformationSection';
import ValueProposition from '@/components/scorecard/ValueProposition';
import CredibilitySection from '@/components/scorecard/CredibilitySection';

export default function HomePage() {
  // Analytics tracking
  useEffect(() => {
    // Track page view
    console.log('Track Event: page_view', { page: 'landing' });
    
    // Track scroll depth
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = (window.scrollY / scrollHeight) * 100;
      
      if (currentScroll > maxScroll) {
        maxScroll = currentScroll;
        
        // Track milestones
        if (maxScroll >= 25 && maxScroll < 26) {
          console.log('Track Event: scroll_depth', { percentage: 25 });
        } else if (maxScroll >= 50 && maxScroll < 51) {
          console.log('Track Event: scroll_depth', { percentage: 50 });
        } else if (maxScroll >= 75 && maxScroll < 76) {
          console.log('Track Event: scroll_depth', { percentage: 75 });
        } else if (maxScroll >= 90 && maxScroll < 91) {
          console.log('Track Event: scroll_depth', { percentage: 90 });
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // A/B testing for hero and CTA variants
  const getHeroVariant = () => {
    // In production, this would be determined by your A/B testing service
    // For now, we'll use a random selection
    return Math.random() > 0.5 ? 'a' : 'b';
  };
  
  const getCTAVariant = () => {
    // In production, this would be determined by your A/B testing service
    // For now, we'll use a random selection
    return Math.random() > 0.5 ? 'a' : 'b';
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <ScorecardNavigation />
      
      {/* Hero Section avec Frustration Hook */}
      <FrustrationHero />
      
      {/* Transformation Avant/Après */}
      <section id="transformation">
        <TransformationSection />
      </section>
      
      {/* Value Proposition Scorecard */}
      <section id="value-prop">
        <ValueProposition />
      </section>
      
      {/* Crédibilité Authentique */}
      <section id="credibility">
        <CredibilitySection />
      </section>
      
      {/* Section navigation vers dashboard */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            prêt à transformer ton chaos en avantage ?
          </h2>
          <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
            Rejoins les entrepreneurs qui ont déjà calculé leur score et commencent à récupérer 10h+ par semaine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/scorecard?scorecard=scorecard"
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              calculer mon score gratuit
            </Link>
            <Link
              href="/auth/signup"
              className="px-8 py-4 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-bold rounded-lg transition-all duration-200"
            >
              essayer structureclerk
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Image 
                  src="/logo-icon.svg" 
                  alt="StructureClerk" 
                  width={32}
                  height={32}
                  className="mr-2"
                />
                <span className="text-xl font-bold">
                  <span className="text-white">Structure</span>
                  <span className="text-primary-400">Clerk</span>
                </span>
              </div>
              <p className="text-neutral-400 mb-4 max-w-md">
                LL'IA qui transforme vos documents en décisionsrsquo;IA qui transforme vos documents en décisions. Spécialement conçu pour les entrepreneurs du bâtiment.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Produit</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Intégrations</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Statut du système</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Mentions légales</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">
              © {new Date().getFullYear()} StructureClerk. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">
                Confidentialité
              </a>
              <a href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
