# 🚀 Guide de Déploiement - StructureClerk

Ce guide explique comment déployer StructureClerk en production de manière sécurisée.

---

## ⚠️ Sécurité des Variables d'Environnement

**IMPORTANT:** Ne jamais commiter de fichiers `.env` contenant des secrets dans Git !

Les fichiers suivants sont dans `.gitignore` :
- `.env.production` ✅
- `.env.local` ✅
- `.env` ✅

Seuls les fichiers `.example` doivent être versionnés.

---

## 🐳 Déploiement avec Docker

### Méthode 1: Script Helper (Recommandé)

```bash
# 1. Charger les variables d'environnement localement
export NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
export NEXT_PUBLIC_APP_URL="https://structureclerk.ca"
export NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# 2. Lancer le build avec le script
./docker-build.sh

# 3. Lancer le conteneur avec les secrets runtime
docker run -d \
  --name structureclerk \
  -p 3000:3000 \
  -e SUPABASE_SERVICE_ROLE_KEY="eyJ..." \
  -e ANTHROPIC_API_KEY="sk-ant-..." \
  -e STRIPE_SECRET_KEY="sk_live_..." \
  -e STRIPE_WEBHOOK_SECRET="whsec_..." \
  structureclerk:latest
```

### Méthode 2: Build Manuel avec --build-arg

```bash
# Build de l'image avec les variables publiques
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..." \
  --build-arg NEXT_PUBLIC_APP_URL="https://structureclerk.ca" \
  --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..." \
  -t structureclerk:latest \
  .

# Run avec les secrets runtime
docker run -d \
  --name structureclerk \
  -p 3000:3000 \
  -e SUPABASE_SERVICE_ROLE_KEY="eyJ..." \
  -e ANTHROPIC_API_KEY="sk-ant-..." \
  -e STRIPE_SECRET_KEY="sk_live_..." \
  -e STRIPE_WEBHOOK_SECRET="whsec_..." \
  structureclerk:latest
```

### Méthode 3: Avec fichier .env LOCAL (sur le serveur uniquement)

```bash
# Sur le serveur de production seulement, créer .env.production
# Ce fichier NE DOIT PAS être dans Git !

# Charger les variables
set -a
source .env.production
set +a

# Build
./docker-build.sh

# Run
docker run -d \
  --name structureclerk \
  -p 3000:3000 \
  --env-file .env.production \
  structureclerk:latest
```

---

## 📦 Variables d'Environnement

### Variables de Build Time (NEXT_PUBLIC_*)
Ces variables sont injectées dans le bundle JavaScript au build.
Elles sont **visibles côté client**.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...  # Clé anonyme (safe côté client)
NEXT_PUBLIC_APP_URL=https://structureclerk.ca
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  # Clé publique Stripe
```

### Variables de Runtime (Secrets)
Ces variables sont utilisées côté serveur seulement.
Elles **NE SONT PAS** injectées dans le bundle client.

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # ⚠️ SECRET - Accès admin Supabase
ANTHROPIC_API_KEY=sk-ant-...      # ⚠️ SECRET - Clé API Anthropic
STRIPE_SECRET_KEY=sk_live_...     # ⚠️ SECRET - Clé secrète Stripe
STRIPE_WEBHOOK_SECRET=whsec_...   # ⚠️ SECRET - Webhook Stripe
```

---

## ☁️ Déploiement sur VPS

### Prérequis
- Serveur Ubuntu/Debian avec Docker installé
- DNS configuré pour pointer vers le serveur
- Certificat SSL (Let's Encrypt)

### Étapes

#### 1. Cloner le repository (sans secrets)
```bash
git clone https://github.com/mfotsing/structureclerk.git
cd structureclerk
```

#### 2. Configurer les variables d'environnement
```bash
# Créer un fichier .env.production LOCAL (pas dans Git!)
nano .env.production

# Ou exporter directement
export NEXT_PUBLIC_SUPABASE_URL="..."
export NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
# etc.
```

#### 3. Builder l'image
```bash
chmod +x docker-build.sh
./docker-build.sh production
```

#### 4. Lancer le conteneur
```bash
docker run -d \
  --name structureclerk \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.production \
  structureclerk:production

# Vérifier les logs
docker logs -f structureclerk
```

#### 5. Configurer Nginx (reverse proxy)
```nginx
server {
    listen 80;
    server_name structureclerk.ca;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 6. Configurer SSL avec Certbot
```bash
sudo certbot --nginx -d structureclerk.ca
```

---

## 🔐 Bonnes Pratiques de Sécurité

### ✅ À FAIRE
1. **Utiliser des secrets managers** (AWS Secrets Manager, HashiCorp Vault)
2. **Variables d'environnement système** sur le serveur
3. **GitHub Secrets** pour CI/CD
4. **Rotation régulière** des clés API
5. **Monitoring des accès** aux secrets

### ❌ À NE PAS FAIRE
1. ~~Commiter `.env.production` dans Git~~
2. ~~Partager les secrets par email/Slack~~
3. ~~Hardcoder les secrets dans le code~~
4. ~~Utiliser les mêmes secrets dev/prod~~
5. ~~Logger les secrets dans les logs~~

---

## 🔄 CI/CD avec GitHub Actions

### Exemple de workflow sécurisé

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker Image
        run: |
          docker build \
            --build-arg NEXT_PUBLIC_SUPABASE_URL="${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}" \
            --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}" \
            --build-arg NEXT_PUBLIC_APP_URL="https://structureclerk.ca" \
            -t structureclerk:latest \
            .

      - name: Deploy to Server
        # ... SSH deploy logic
```

**Configuration GitHub Secrets:**
1. Repository → Settings → Secrets and variables → Actions
2. Ajouter chaque secret individuellement
3. Ne jamais logger les secrets dans les actions

---

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Logs
```bash
# Logs en temps réel
docker logs -f structureclerk

# Dernières 100 lignes
docker logs --tail 100 structureclerk

# Avec timestamps
docker logs -t structureclerk
```

### Métriques
- CPU/RAM usage: `docker stats structureclerk`
- Disk usage: `du -sh .next/`
- Network: `docker inspect structureclerk`

---

## 🆘 Troubleshooting

### Problème: Build échoue avec "NEXT_PUBLIC_* undefined"
**Solution:** Vérifier que les `--build-arg` sont bien passés
```bash
docker build --progress=plain ...  # Voir les logs détaillés
```

### Problème: App démarre mais erreurs Supabase
**Solution:** Vérifier les variables runtime
```bash
docker exec structureclerk env | grep SUPABASE
```

### Problème: API Anthropic retourne 401
**Solution:** Vérifier la clé API
```bash
docker exec structureclerk env | grep ANTHROPIC
# La clé doit commencer par sk-ant-
```

---

## 📚 Ressources

- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [GitHub Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Let's Encrypt](https://letsencrypt.org/)

---

**Dernière mise à jour:** 2025-10-19
**Version:** 1.0.0
