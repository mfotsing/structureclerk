# 🐳 Guide Docker - StructureClerk

Ce guide vous explique comment containeriser et déployer **StructureClerk** avec Docker.

---

## 📋 Prérequis

- Docker 20.10+ installé
- Docker Compose 2.0+ (optionnel mais recommandé)
- Compte Supabase configuré
- Variables d'environnement prêtes

---

## 🏗️ Architecture Docker

### Stack Technique
- **Base**: `node:20-alpine` (image légère)
- **Framework**: Next.js 14 avec TypeScript
- **Build**: Multi-stage pour optimisation
- **Port**: 3000 (configurable)

### Structure du Dockerfile

```
┌─────────────────────────────┐
│  Stage 1: Builder           │
│  - Installation dépendances │
│  - Build Next.js            │
│  - Génération .next         │
└─────────────────────────────┘
              │
              ▼
┌─────────────────────────────┐
│  Stage 2: Runner            │
│  - Image Alpine légère      │
│  - Copie artifacts build    │
│  - User non-root (sécurité) │
│  - Standalone mode          │
└─────────────────────────────┘
```

---

## 🚀 Démarrage Rapide

### Méthode 1: Docker Build Simple

```bash
# 1. Copier les variables d'environnement
cp .env.production.example .env.production
# Éditer .env.production avec vos vraies valeurs

# 2. Builder l'image
docker build -t structureclerk:latest .

# 3. Lancer le conteneur
docker run -d \
  --name structureclerk \
  -p 3000:3000 \
  --env-file .env.production \
  structureclerk:latest

# 4. Vérifier les logs
docker logs -f structureclerk

# 5. Accéder à l'app
# http://localhost:3000
```

### Méthode 2: Docker Compose (Recommandé)

```bash
# 1. Copier les variables d'environnement
cp .env.production.example .env.production
# Éditer .env.production avec vos vraies valeurs

# 2. Lancer avec Docker Compose
docker-compose up -d

# 3. Vérifier le statut
docker-compose ps

# 4. Voir les logs
docker-compose logs -f

# 5. Arrêter
docker-compose down
```

---

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env.production` avec:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

### Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `Dockerfile` | Instructions de build multi-stage |
| `.dockerignore` | Fichiers à exclure du build |
| `docker-compose.yml` | Orchestration des services |
| `.env.production.example` | Template variables d'environnement |

---

## 📦 Build et Push vers un Registry

### Docker Hub

```bash
# 1. Login
docker login

# 2. Tag l'image
docker tag structureclerk:latest votre-username/structureclerk:v1.0.0
docker tag structureclerk:latest votre-username/structureclerk:latest

# 3. Push
docker push votre-username/structureclerk:v1.0.0
docker push votre-username/structureclerk:latest
```

### GitHub Container Registry (GHCR)

```bash
# 1. Login avec token GitHub
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# 2. Tag l'image
docker tag structureclerk:latest ghcr.io/votre-username/structureclerk:v1.0.0

# 3. Push
docker push ghcr.io/votre-username/structureclerk:v1.0.0
```

---

## 🌐 Déploiement en Production

### Option 1: VPS (DigitalOcean, AWS EC2, etc.)

```bash
# 1. SSH vers votre serveur
ssh user@votre-serveur.com

# 2. Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Cloner le repo
git clone https://github.com/mfotsing/structureclerk.git
cd structureclerk

# 4. Configurer les variables
nano .env.production

# 5. Lancer avec Docker Compose
docker-compose up -d

# 6. Configurer Nginx reverse proxy
# Voir section ci-dessous
```

### Option 2: Fly.io

```bash
# 1. Installer flyctl
curl -L https://fly.io/install.sh | sh

# 2. Login
flyctl auth login

# 3. Créer l'app
flyctl launch

# 4. Déployer
flyctl deploy

# 5. Configurer les secrets
flyctl secrets set NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
flyctl secrets set NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
# etc...
```

### Option 3: Railway

```bash
# 1. Installer Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Créer un nouveau projet
railway init

# 4. Déployer
railway up

# 5. Configurer les variables
railway variables set NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
# etc...
```

---

## 🔒 Configuration Nginx (Reverse Proxy)

Créez `/etc/nginx/sites-available/structureclerk`:

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activer le site:

```bash
sudo ln -s /etc/nginx/sites-available/structureclerk /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### HTTPS avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir le certificat
sudo certbot --nginx -d votre-domaine.com

# Auto-renewal est configuré automatiquement
```

---

## 🧪 Tests et Debugging

### Tester le Build Localement

```bash
# Build
docker build -t structureclerk:test .

# Run avec variables de test
docker run -it \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=test-key \
  structureclerk:test
```

### Inspecter le Conteneur

```bash
# Entrer dans le conteneur
docker exec -it structureclerk sh

# Voir les fichiers
ls -la

# Voir les variables d'environnement
env | grep NEXT
```

### Logs

```bash
# Logs en temps réel
docker logs -f structureclerk

# Logs des 100 dernières lignes
docker logs --tail 100 structureclerk

# Docker Compose logs
docker-compose logs -f
```

### Health Check

```bash
# Vérifier le status
docker inspect structureclerk | grep -A 10 Health

# Tester manuellement
curl http://localhost:3000/
```

---

## 📊 Monitoring et Performance

### Ressources

```bash
# Voir l'utilisation des ressources
docker stats structureclerk

# Limiter les ressources (dans docker-compose.yml)
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 1G
```

### Logs Rotation

Dans `docker-compose.yml`:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

---

## 🔄 CI/CD avec GitHub Actions

Créez `.github/workflows/docker.yml`:

```yaml
name: Docker Build and Push

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            your-username/structureclerk:latest
            your-username/structureclerk:${{ github.sha }}
```

---

## 🐛 Troubleshooting

### Problème: Build échoue

```bash
# Nettoyer le cache Docker
docker builder prune -a

# Rebuild sans cache
docker build --no-cache -t structureclerk:latest .
```

### Problème: Variables d'environnement non trouvées

```bash
# Vérifier que le fichier .env.production existe
ls -la .env.production

# Vérifier les variables dans le conteneur
docker exec structureclerk env
```

### Problème: Port 3000 déjà utilisé

```bash
# Trouver le processus
lsof -i :3000

# Utiliser un autre port
docker run -p 8080:3000 structureclerk:latest
```

### Problème: Image trop grande

```bash
# Vérifier la taille
docker images structureclerk:latest

# Optimiser:
# 1. Utiliser alpine au lieu de debian
# 2. Nettoyer le cache npm
# 3. Utiliser .dockerignore
# 4. Multi-stage build (déjà implémenté)
```

---

## 📈 Optimisations

### Build Plus Rapide

```dockerfile
# Utiliser BuildKit
# Dans votre shell:
export DOCKER_BUILDKIT=1

# Ou avec docker-compose:
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build
```

### Image Plus Légère

L'image actuelle (~150MB) est déjà optimisée avec:
- ✅ Alpine Linux (base légère)
- ✅ Multi-stage build
- ✅ Standalone mode Next.js
- ✅ .dockerignore complet

### Cache Layers

```bash
# Utiliser le cache de build
docker build --cache-from structureclerk:latest -t structureclerk:latest .
```

---

## 📚 Ressources

- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

---

## ✅ Checklist de Déploiement

- [ ] Variables d'environnement configurées
- [ ] Supabase URL de production configurée
- [ ] Stripe clés de production configurées
- [ ] Domaine DNS pointé vers le serveur
- [ ] HTTPS configuré (Let's Encrypt)
- [ ] Firewall configuré (ports 80, 443, 22)
- [ ] Backup automatique configuré
- [ ] Monitoring mis en place
- [ ] Logs rotation configurée

---

**Votre application StructureClerk est maintenant prête pour Docker! 🐳**

Pour toute question, consultez la documentation ou créez une issue sur GitHub.
