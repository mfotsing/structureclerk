export default function DebugPage() {
  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      margin: 0,
      padding: 0,
      backgroundColor: '#f3f4f6',
      color: '#1f2937'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginTop: '40px'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '24px',
          color: '#1f2937'
        }}>
          🚀 StructureClerk - Page de Debug
        </h1>

        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #10b981',
          color: '#065f46',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <strong>✅ Succès!</strong> Cette page se charge correctement sans timeout.
        </div>

        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #3b82f6',
          color: '#1e40af',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <strong>ℹ️ Information:</strong> Si vous voyez cette page, le déploiement Vercel fonctionne.
          Le problème se situait au niveau des composants React ou des dépendances.
        </div>

        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#1f2937'
        }}>
          Pages de test disponibles:
        </h2>

        <div style={{ marginBottom: '30px' }}>
          {[
            { url: '/', label: 'Page d\'accueil' },
            { url: '/test', label: 'Page test' },
            { url: '/minimal', label: 'Page minimale' },
            { url: '/en', label: 'Version anglaise' },
            { url: '/fr', label: 'Version française' }
          ].map((link, index) => (
            <a
              key={index}
              href={link.url}
              style={{
                display: 'inline-block',
                margin: '10px',
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                transition: 'backgroundColor 0.2s'
              }}
              onMouseOver={(e: any) => e.target.style.backgroundColor = '#2563eb'}
              onMouseOut={(e: any) => e.target.style.backgroundColor = '#3b82f6'}
            >
              {link.label}
            </a>
          ))}
        </div>

        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#1f2937'
        }}>
          Informations de debug:
        </h2>

        <ul style={{
          color: '#4b5563',
          lineHeight: '1.6'
        }}>
          <li>URL actuelle: <code>{typeof window !== 'undefined' ? window.location.href : 'N/A (SSR)'}</code></li>
          <li>User Agent: <code>{typeof window !== 'undefined' ? navigator.userAgent : 'N/A (SSR)'}</code></li>
          <li>Timestamp: <code>{new Date().toISOString()}</code></li>
          <li>Statut: <span style={{ color: '#059669', fontWeight: 'bold' }}>Page chargée avec succès</span></li>
        </ul>

        <div style={{
          backgroundColor: '#f1f5f9',
          border: '1px solid #94a3b8',
          color: '#475569',
          padding: '16px',
          borderRadius: '8px',
          marginTop: '24px'
        }}>
          <strong>🎯 Résultat du diagnostic:</strong><br />
          Cette page fonctionne parfaitement! Le problème était dans les composants React complexes ou next-intl.
        </div>
      </div>
    </div>
  );
}