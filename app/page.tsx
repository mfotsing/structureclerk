'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Détecter la langue du navigateur et rediriger
    const userLang = navigator.language || navigator.languages?.[0];
    const targetLang = userLang?.startsWith('fr') ? 'fr' : 'en';

    router.replace(`/${targetLang}`);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          StructureClerk
        </h1>
        <p className="text-gray-600">
          Redirection en cours...
        </p>
      </div>
    </div>
  );
}