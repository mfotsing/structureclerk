# ============================================
# Dockerfile pour StructureClerk
# Stack: Next.js 14 + TypeScript + Supabase
# ============================================

# Étape 1: Builder - Installation des dépendances et build
FROM node:20-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
# --legacy-peer-deps pour éviter les conflits de dépendances
RUN npm ci --legacy-peer-deps

# Copier tout le code source
COPY . .

# Copier les variables d'environnement de build
# Utilise .env.production s'il existe, sinon .env.example
# Les variables NEXT_PUBLIC_* doivent être présentes au build time
RUN if [ -f .env.production ]; then \
        echo "📦 Utilisation de .env.production pour le build"; \
        cp .env.production .env; \
    else \
        echo "📦 Utilisation de .env.example pour le build"; \
        cp .env.example .env; \
    fi

# Build de l'application Next.js
# Génère le dossier .next optimisé pour production
RUN npm run build

# ============================================
# Étape 2: Runner - Image de production légère
FROM node:20-alpine AS runner

# Définir le répertoire de travail
WORKDIR /app

# Variables d'environnement pour Next.js
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Créer un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copier les fichiers publics
COPY --from=builder /app/public ./public

# Créer le dossier .next avec les bonnes permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copier les fichiers de build depuis le builder
# --chown pour donner les droits au user nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Passer à l'utilisateur non-root
USER nextjs

# Exposer le port 3000 (port par défaut de Next.js)
EXPOSE 3000

# Variables d'environnement par défaut
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Commande de démarrage
CMD ["node", "server.js"]
