export default function DebugPage() {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StructureClerk Debug</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f3f4f6;
            color: #1f2937;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .success {
            background: #ecfdf5;
            border: 1px solid #10b981;
            color: #065f46;
            padding: 16px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .info {
            background: #eff6ff;
            border: 1px solid #3b82f6;
            color: #1e40af;
            padding: 16px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .links {
            margin-top: 30px;
        }
        .links a {
            display: inline-block;
            margin: 10px;
            padding: 12px 24px;
            background: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background-color 0.2s;
        }
        .links a:hover {
            background: #2563eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 StructureClerk - Page de Debug</h1>

        <div class="success">
            <strong>✅ Succès!</strong> Cette page se charge correctement sans timeout.
        </div>

        <div class="info">
            <strong>ℹ️ Information:</strong> Si vous voyez cette page, le déploiement Vercel fonctionne.
            Le problème se situe au niveau des composants React ou des dépendances.
        </div>

        <h2>Pages de test disponibles:</h2>
        <div class="links">
            <a href="/">Page d'accueil</a>
            <a href="/test">Page test</a>
            <a href="/en">Version anglaise</a>
            <a href="/fr">Version française</a>
        </div>

        <h2>Informations de debug:</h2>
        <ul>
            <li>URL actuelle: ${typeof window !== 'undefined' ? window.location.href : 'N/A (SSR)'}</li>
            <li>User Agent: ${typeof window !== 'undefined' ? navigator.userAgent : 'N/A (SSR)'}</li>
            <li>Timestamp: ${new Date().toISOString()}</li>
            <li>Statut: Page chargée avec succès</li>
        </ul>

        <div class="info">
            <strong>Prochaines étapes:</strong><br>
            1. Si les autres pages timeout, le problème est dans les composants<br>
            2. Vérifiez les logs Vercel pour plus de détails<br>
            3. Testez avec des pages de plus en plus complexes
        </div>
    </div>
</body>
</html>
  `;
}