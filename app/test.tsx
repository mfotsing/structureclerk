export default function TestPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1rem'
        }}>
          StructureClerk
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: '#6b7280',
          marginBottom: '2rem'
        }}>
          Application opérationnelle! ✅
        </p>
        <div style={{
          padding: '1rem',
          backgroundColor: '#ecfdf5',
          border: '1px solid #10b981',
          borderRadius: '0.5rem',
          color: '#065f46'
        }}>
          <strong>Statut:</strong> En ligne et fonctionnel
        </div>
      </div>
    </div>
  );
}