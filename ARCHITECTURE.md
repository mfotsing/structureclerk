# Architecture Technique - StructureClerk

## Vue d'ensemble

StructureClerk est une application SaaS multi-tenant construite avec Next.js 14, Supabase et Stripe, destinée aux entrepreneurs en construction au Québec.

## Stack Technique

### Frontend
- **Next.js 14** - Framework React avec App Router
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS 3** - Framework CSS utilitaire
- **React Hook Form** - Gestion de formulaires
- **Zod** - Validation de schémas

### Backend & Infrastructure
- **Supabase**
  - PostgreSQL - Base de données relationnelle
  - Auth - Authentification et autorisation
  - Storage - Stockage de fichiers
  - Row Level Security (RLS) - Sécurité au niveau des lignes
- **Stripe** - Gestion des paiements et abonnements

### Outils & Bibliothèques
- **next-intl** - Internationalisation (FR/EN)
- **date-fns** - Manipulation de dates
- **lucide-react** - Icônes
- **clsx / tailwind-merge** - Utilitaires CSS

## Architecture de la Base de Données

### Modèle Multi-tenant

L'application utilise un modèle multi-tenant basé sur les organisations:

```
organizations (1) ─── (N) profiles
      │
      ├─── (N) clients
      ├─── (N) projects
      ├─── (N) invoices
      ├─── (N) quotes
      └─── (N) documents
```

### Tables Principales

#### Organizations
- Représente une entreprise de construction
- Stocke les informations légales (NEQ, TPS, TVQ)
- Point central pour l'isolation multi-tenant

#### Profiles
- Extension de `auth.users` de Supabase
- Lié à une organisation
- Rôles: owner, admin, member, viewer

#### Clients
- Clients de l'entreprise
- Informations de contact
- Lié à une organisation

#### Projects (Chantiers)
- Projets de construction
- Lié à un client et une organisation
- Statuts: planning, active, on_hold, completed, cancelled

#### Invoices
- Factures avec calcul automatique TPS/TVQ
- Statuts: draft, sent, paid, overdue, cancelled
- Peut être liée à un projet et/ou une soumission

#### Quotes (Soumissions)
- Devis/estimations
- Statuts: draft, sent, accepted, rejected, expired
- Peut être convertie en facture

#### Documents
- Fichiers uploadés (photos, plans, contrats, etc.)
- Stockés dans Supabase Storage
- Organisés par projet/client/facture

#### Activities
- Journal d'audit et activités
- Commentaires et notifications

### Sécurité - Row Level Security (RLS)

Toutes les tables ont RLS activé avec des politiques qui garantissent:

1. **Isolation des données** - Les utilisateurs ne peuvent voir que les données de leur organisation
2. **Contrôle d'accès basé sur les rôles**
   - `owner` et `admin`: CRUD complet
   - `member`: Lecture/Écriture
   - `viewer`: Lecture seule

Exemple de politique RLS:
```sql
CREATE POLICY "Users can view clients in their organization"
  ON clients FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));
```

## Architecture de l'Application

### Structure des Dossiers

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Routes publiques (login, signup)
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/       # Routes protégées
│   │   ├── dashboard/
│   │   ├── clients/
│   │   ├── projects/
│   │   ├── invoices/
│   │   ├── quotes/
│   │   ├── documents/
│   │   └── settings/
│   ├── auth/              # Callbacks auth
│   │   ├── callback/
│   │   └── signout/
│   ├── api/               # API routes (webhooks, etc.)
│   ├── layout.tsx
│   └── page.tsx
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI de base
│   ├── forms/            # Composants de formulaires
│   └── layouts/          # Layouts partagés
├── lib/                   # Configurations et utilitaires
│   ├── supabase/
│   │   ├── client.ts     # Client-side Supabase
│   │   ├── server.ts     # Server-side Supabase
│   │   └── middleware.ts # Middleware Supabase
│   ├── stripe/           # Configuration Stripe
│   └── utils.ts          # Utilitaires (taxes, formatage)
├── types/
│   └── database.ts       # Types TypeScript générés
└── utils/                # Fonctions utilitaires
```

### Route Groups

- `(auth)` - Routes publiques d'authentification
- `(dashboard)` - Routes protégées nécessitant une authentification

### Middleware

Le middleware (`src/middleware.ts`) gère:
1. Rafraîchissement automatique de la session Supabase
2. Redirection vers `/login` pour les routes protégées
3. Protection des routes du dashboard

## Flux d'Authentification

### Inscription (Signup)

1. Utilisateur remplit le formulaire avec:
   - Nom de l'entreprise
   - Nom complet
   - Email
   - Mot de passe

2. Création du compte utilisateur via Supabase Auth

3. Trigger `on_auth_user_created` crée automatiquement le profil

4. L'application crée une organisation

5. Le profil est mis à jour avec `organization_id` et rôle `owner`

6. Redirection vers `/dashboard`

### Connexion (Login)

1. Email + mot de passe
2. Supabase Auth valide
3. Session créée avec cookie
4. Redirection vers `/dashboard`

### Gestion de Session

- Cookie httpOnly géré par Supabase
- Rafraîchissement automatique via middleware
- Expiration configurable

## Fonctionnalités Spécifiques Québec

### Calcul des Taxes

```typescript
function calculateQuebecTaxes(subtotal: number) {
  const TPS_RATE = 0.05      // 5%
  const TVQ_RATE = 0.09975   // 9.975%

  const tps = subtotal * TPS_RATE
  const tvq = subtotal * TVQ_RATE
  const total = subtotal + tps + tvq

  return { subtotal, tps, tvq, total }
}
```

### Formatage

- **Devise**: `fr-CA` avec dollar canadien (CAD)
- **Dates**: Format québécois (jour mois année)
- **Adresses**: Province par défaut = QC

### Informations Légales

Les organisations peuvent stocker:
- **NEQ** - Numéro d'entreprise du Québec
- **TPS** - Numéro de TPS
- **TVQ** - Numéro de TVQ

## Internationalisation

Support bilingue Français/Anglais via `next-intl`:

- Fichiers de traduction dans `/locales/`
- Détection automatique de la langue
- Switch de langue dans les paramètres utilisateur

## Gestion des Abonnements (Stripe)

### Plans

1. **Starter** - Fonctionnalités de base
2. **Professional** - Fonctionnalités avancées
3. **Enterprise** - Sur mesure

### Webhook Stripe

Route API `/api/webhooks/stripe` pour:
- `invoice.paid` - Mise à jour du statut d'abonnement
- `customer.subscription.updated` - Changement de plan
- `customer.subscription.deleted` - Annulation

## Performance

### Optimisations

1. **Server Components par défaut** - Réduction du JavaScript côté client
2. **Streaming** - Chargement progressif des pages
3. **Code Splitting** - Découpage automatique par route
4. **Image Optimization** - Via `next/image`
5. **Caching** - Cache Supabase et Next.js

### Métriques Cibles

- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s

## Sécurité

### Principes

1. **Authentication Required** - Toutes les routes du dashboard nécessitent une authentification
2. **Row Level Security** - Isolation complète des données par organisation
3. **Role-Based Access Control** - Permissions granulaires par rôle
4. **Input Validation** - Validation côté client (Zod) et serveur (PostgreSQL constraints)
5. **XSS Protection** - React échappe automatiquement les valeurs
6. **CSRF Protection** - Tokens CSRF via Supabase

### Variables d'Environnement Sensibles

- `SUPABASE_SERVICE_ROLE_KEY` - Jamais exposée au client
- `STRIPE_SECRET_KEY` - Server-side uniquement
- `STRIPE_WEBHOOK_SECRET` - Validation des webhooks

## Déploiement

### Vercel (Recommandé)

1. Push sur GitHub
2. Import dans Vercel
3. Configuration des variables d'environnement
4. Déploiement automatique

### Variables d'Environnement Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

## Monitoring & Analytics

### Outils Recommandés

- **Vercel Analytics** - Performance et Web Vitals
- **Sentry** - Error tracking
- **Supabase Logs** - Logs de base de données
- **Stripe Dashboard** - Métriques de paiement

## Évolutivité

### Capacités Actuelles

- **Supabase Free Tier**:
  - 500 MB stockage
  - 50K utilisateurs actifs mensuels
  - Illimité d'organisations

- **Supabase Pro** (au besoin):
  - 8 GB stockage
  - 100K utilisateurs actifs mensuels

### Points d'Extension Futurs

1. **Background Jobs** - Supabase Functions ou Vercel Cron
2. **Email Service** - Resend ou SendGrid
3. **PDF Generation** - jsPDF ou react-pdf
4. **Real-time Collaboration** - Supabase Realtime
5. **Mobile App** - React Native ou PWA

## Support & Maintenance

### Logs

- Supabase: Logs SQL et authentification
- Vercel: Logs runtime et build
- Stripe: Logs webhooks

### Backup

- **Base de données**: Backups quotidiens automatiques via Supabase
- **Storage**: Réplication dans Supabase Storage

### Mises à Jour

- Dépendances: Mise à jour mensuelle via Dependabot
- Sécurité: Alertes automatiques GitHub

---

**Dernière mise à jour**: 2025-10-18
