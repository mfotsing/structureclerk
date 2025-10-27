export default function MinimalPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '16px'
        }}>
          StructureClerk ✅
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: '#64748b',
          marginBottom: '32px'
        }}>
          Page React minimale - Test de timeout
        </p>

        <div style={{
          backgroundColor: '#dcfce7',
          border: '1px solid #16a34a',
          color: '#15803d',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          ✅ Cette page React se charge correctement
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <a
            href="/"
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          >
            Accueil
          </a>
          <a
            href="/debug"
            style={{
              padding: '12px 24px',
              backgroundColor: '#10b981',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          >
            Debug
          </a>
        </div>

        <div style={{
          marginTop: '32px',
          padding: '16px',
          backgroundColor: '#f1f5f9',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#475569'
        }}>
          <strong>Debug Info:</strong><br/>
          Status: ✅ Chargée avec succès<br/>
          Type: React Component<br/>
          Date: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}