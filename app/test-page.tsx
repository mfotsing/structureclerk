export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-blue-500 mb-4">
        Tailwind Test Page
      </h1>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg">
        <p className="text-lg">
          If you can see blue text on black background with a gradient card,
          then Tailwind is working!
        </p>
      </div>
      <div className="mt-4 p-4 bg-white/10 backdrop-blur border border-white/20 rounded">
        <p className="text-sm">
          This should have glass morphism effect if Tailwind is working.
        </p>
      </div>
    </div>
  );
}