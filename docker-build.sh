#!/bin/bash

# ============================================
# Script de Build Docker pour StructureClerk
# ============================================
# Ce script facilite le build de l'image Docker
# en passant les variables d'environnement nécessaires

set -e

echo "🐳 Build Docker - StructureClerk"
echo "================================"

# Vérifier que les variables sont définies
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ Erreur: NEXT_PUBLIC_SUPABASE_URL non définie"
    echo "💡 Chargez vos variables: source .env.production"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ Erreur: NEXT_PUBLIC_SUPABASE_ANON_KEY non définie"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_APP_URL" ]; then
    echo "❌ Erreur: NEXT_PUBLIC_APP_URL non définie"
    exit 1
fi

# Tag de l'image (par défaut: latest)
TAG="${1:-latest}"

echo ""
echo "📦 Configuration du build:"
echo "  - NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL:0:30}..."
echo "  - NEXT_PUBLIC_APP_URL: $NEXT_PUBLIC_APP_URL"
echo "  - Tag: $TAG"
echo ""

# Build de l'image Docker
echo "🔨 Lancement du build..."
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --build-arg NEXT_PUBLIC_APP_URL="$NEXT_PUBLIC_APP_URL" \
  --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" \
  -t "structureclerk:$TAG" \
  .

echo ""
echo "✅ Build terminé avec succès!"
echo ""
echo "🚀 Pour lancer le conteneur:"
echo "   docker run -d \\"
echo "     --name structureclerk \\"
echo "     -p 3000:3000 \\"
echo "     -e SUPABASE_SERVICE_ROLE_KEY=\"\$SUPABASE_SERVICE_ROLE_KEY\" \\"
echo "     -e ANTHROPIC_API_KEY=\"\$ANTHROPIC_API_KEY\" \\"
echo "     -e STRIPE_SECRET_KEY=\"\$STRIPE_SECRET_KEY\" \\"
echo "     -e STRIPE_WEBHOOK_SECRET=\"\$STRIPE_WEBHOOK_SECRET\" \\"
echo "     structureclerk:$TAG"
echo ""
