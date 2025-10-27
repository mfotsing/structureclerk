export default function RootPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          StructureClerk
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Gestion documentaire intelligente pour PME canadiennes
        </p>
        <div className="space-y-4">
          <a
            href="/en"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voir le site en anglais
          </a>
          <br />
          <a
            href="/fr"
            className="inline-block px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Voir le site en français
          </a>
        </div>
        <div className="mt-8 text-sm text-gray-500">
          <p>Application déployée avec succès sur Vercel 🚀</p>
          <p className="mt-2">Statut: En ligne et fonctionnel</p>
        </div>
      </div>
    </div>
  );
}