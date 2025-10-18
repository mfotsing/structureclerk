# StructureClerk

Application SaaS minimaliste de gestion de factures et documents pour entrepreneurs en construction au Québec.

## Description

StructureClerk est une plateforme conçue spécifiquement pour les PME et entrepreneurs en construction au Québec. Elle offre une alternative abordable et bilingue pour gérer:

- **Factures** avec calcul automatique des taxes québécoises (TPS/TVQ)
- **Soumissions et estimations**
- **Gestion de projets/chantiers**
- **Gestion de clients**
- **Documents de chantier**
- **Collaboration d'équipe**

## Stack Technique

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Paiements**: Stripe
- **Internationalisation**: next-intl (Français/Anglais)

## Fonctionnalités Principales

### ✅ Gestion de Factures
- Création et modification de factures
- Calcul automatique TPS (5%) et TVQ (9.975%)
- Numérotation automatique
- Envoi par email
- Suivi des paiements
- Génération PDF

### ✅ Soumissions/Estimations
- Création de devis professionnels
- Conversion en facture
- Suivi du statut (brouillon, envoyé, accepté, rejeté)
- Date de validité

### ✅ Gestion de Projets/Chantiers
- Organisation par projet
- Suivi de l'avancement
- Budget vs réalisé
- Association de documents
- Équipe assignée

### ✅ Gestion de Clients
- Base de données clients
- Informations de contact
- Historique de facturation
- Notes et commentaires

### ✅ Gestion de Documents
- Upload de fichiers (photos, plans, contrats)
- Organisation par projet
- Stockage sécurisé Supabase
- Catégorisation

### ✅ Collaboration d'Équipe
- Multi-utilisateurs
- Rôles et permissions (propriétaire, admin, membre, visualisateur)
- Journal d'activité
- Commentaires

### ✅ Multi-tenant
- Une organisation = une entreprise de construction
- Isolation complète des données
- Gestion des abonnements

## Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase
- Compte Stripe (pour les paiements)

### Configuration

1. Cloner le repository
```bash
git clone https://github.com/mfotsing/structureclerk.git
cd structureclerk
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env.local
```

Éditer `.env.local` avec vos clés:
```env
NEXT_PUBLIC_SUPABASE_URL=votre-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-supabase
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=votre-cle-publique-stripe
STRIPE_SECRET_KEY=votre-cle-secrete-stripe
STRIPE_WEBHOOK_SECRET=votre-webhook-secret

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Configurer Supabase

Dans votre projet Supabase, exécuter le script SQL:
```bash
# Dans le SQL Editor de Supabase
# Copier/coller le contenu de supabase/schema.sql
```

Ou utiliser la CLI Supabase:
```bash
npx supabase db push
```

5. Configurer le Storage Supabase

Créer les buckets suivants dans Supabase Storage:
- `documents` (private)
- `logos` (public)
- `avatars` (public)

6. Lancer le serveur de développement
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Structure du Projet

```
structureclerk/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Routes d'authentification
│   │   ├── (dashboard)/       # Routes protégées (tableau de bord)
│   │   ├── api/               # API routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/            # Composants React réutilisables
│   │   ├── ui/               # Composants UI (shadcn/ui)
│   │   ├── forms/            # Formulaires
│   │   ├── layouts/          # Layouts
│   │   └── ...
│   ├── lib/                   # Utilitaires et configurations
│   │   ├── supabase/         # Configuration Supabase
│   │   ├── stripe/           # Configuration Stripe
│   │   └── utils.ts          # Fonctions utilitaires
│   ├── types/                 # Types TypeScript
│   │   └── database.ts       # Types Supabase
│   └── utils/                 # Fonctions utilitaires
├── supabase/
│   └── schema.sql            # Schéma de base de données
├── public/                    # Fichiers statiques
├── .env.example              # Variables d'environnement (exemple)
├── next.config.ts            # Configuration Next.js
├── tailwind.config.ts        # Configuration Tailwind
├── tsconfig.json             # Configuration TypeScript
└── package.json
```

## Schéma de Base de Données

### Tables Principales

- **organizations**: Entreprises (multi-tenant)
- **profiles**: Profils utilisateurs (extension de auth.users)
- **subscriptions**: Abonnements Stripe
- **clients**: Clients
- **projects**: Projets/chantiers
- **project_members**: Membres d'équipe par projet
- **invoices**: Factures
- **invoice_items**: Lignes de factures
- **quotes**: Soumissions/devis
- **quote_items**: Lignes de soumissions
- **documents**: Documents uploadés
- **activities**: Journal d'activité

### Relations

- Une organisation a plusieurs clients, projets, factures
- Un projet appartient à une organisation et peut avoir un client
- Une facture peut être liée à un projet et/ou une soumission
- Les membres d'équipe peuvent être assignés à des projets spécifiques

## Taxes Québécoises

Le système calcule automatiquement les taxes québécoises:

- **TPS** (Taxe sur les produits et services): 5%
- **TVQ** (Taxe de vente du Québec): 9.975%
- **Total**: 14.975%

La logique est dans `src/lib/utils.ts`:
```typescript
export function calculateQuebecTaxes(subtotal: number) {
  const TPS_RATE = 0.05
  const TVQ_RATE = 0.09975
  const tps = subtotal * TPS_RATE
  const tvq = subtotal * TVQ_RATE
  const total = subtotal + tps + tvq
  return { subtotal, tps, tvq, total }
}
```

## Internationalisation

L'application supporte le français et l'anglais via `next-intl`.

Les traductions se trouvent dans `/locales/`:
- `/locales/fr/` - Français
- `/locales/en/` - Anglais

## Sécurité

- **Row Level Security (RLS)** activé sur toutes les tables
- Isolation complète des données par organisation
- Authentication via Supabase Auth
- Rôles et permissions granulaires
- Validation des données avec Zod

## Déploiement

### Vercel (Recommandé)

1. Pusher le code sur GitHub
2. Importer le projet dans Vercel
3. Configurer les variables d'environnement
4. Déployer

### Variables d'environnement Vercel

Ajouter toutes les variables de `.env.local` dans les settings Vercel.

## Roadmap

### Phase 1 (MVP) ✅
- [x] Configuration du projet
- [x] Schéma de base de données
- [ ] Authentification et multi-tenant
- [ ] Dashboard de base
- [ ] Gestion de clients
- [ ] Gestion de projets
- [ ] Module de facturation
- [ ] Module de soumissions

### Phase 2
- [ ] Upload de documents
- [ ] Génération PDF de factures
- [ ] Envoi d'emails
- [ ] Collaboration d'équipe avancée
- [ ] Notifications

### Phase 3
- [ ] Intégration Stripe complète
- [ ] Rapports et statistiques
- [ ] Export comptable
- [ ] Application mobile (PWA)
- [ ] Signature électronique

## Contribuer

Les contributions sont bienvenues! Pour contribuer:

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## Licence

ISC

## Contact

Pour toute question ou support:
- GitHub Issues: https://github.com/mfotsing/structureclerk/issues
- Email: [votre-email]

---

Fait avec ❤️ pour les entrepreneurs en construction du Québec
