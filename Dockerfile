# ============================================
# Dockerfile pour StructureClerk
# Stack: Next.js 14 + TypeScript + Supabase
# ============================================

# Étape 1: Builder - Installation des dépendances et build
FROM node:20-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Arguments de build pour les variables d'environnement
# Les variables NEXT_PUBLIC_* sont nécessaires au build time
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Définir les variables d'environnement pour le build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NODE_ENV=production

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
# --legacy-peer-deps pour éviter les conflits de dépendances
RUN npm ci --legacy-peer-deps

# Copier tout le code source
COPY . .

# Build de l'application Next.js
# Les variables NEXT_PUBLIC_* sont injectées dans le bundle au build time
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
