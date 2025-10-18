# TODO - StructureClerk

Prochaines étapes de développement organisées par priorité.

## Phase 1: MVP Core (En cours)

### ✅ Complété

- [x] Configuration du projet Next.js 14 + TypeScript
- [x] Configuration Supabase (PostgreSQL, Auth, Storage)
- [x] Schéma de base de données complet avec RLS
- [x] Système d'authentification (signup/login/logout)
- [x] Architecture multi-tenant
- [x] Dashboard principal avec statistiques
- [x] Module de gestion de clients (liste, création)
- [x] Layout et navigation
- [x] Utilitaires pour calcul taxes québécoises
- [x] Documentation (README, QUICKSTART, ARCHITECTURE)

### 🚧 En cours / À compléter

#### Module Clients
- [ ] Page de détail d'un client (`/clients/[id]`)
- [ ] Édition d'un client
- [ ] Suppression d'un client (avec confirmation)
- [ ] Recherche et filtres

#### Module Projets/Chantiers
- [ ] Liste des projets (`/projects`)
- [ ] Création de projet (`/projects/new`)
- [ ] Détail de projet avec timeline
- [ ] Association client-projet
- [ ] Membres d'équipe par projet
- [ ] Statuts de projet

#### Module Facturation
- [ ] Liste des factures (`/invoices`)
- [ ] Création de facture (`/invoices/new`)
  - [ ] Sélection client
  - [ ] Ajout de lignes de facturation (drag & drop pour réorganiser)
  - [ ] Calcul automatique TPS/TVQ
  - [ ] Termes et conditions
  - [ ] Numérotation automatique
- [ ] Édition de facture
- [ ] Changement de statut (draft → sent → paid)
- [ ] Suivi des paiements
- [ ] Détail de facture avec historique

#### Module Soumissions
- [ ] Liste des soumissions (`/quotes`)
- [ ] Création de soumission (`/quotes/new`)
- [ ] Conversion soumission → facture
- [ ] Gestion des statuts (draft, sent, accepted, rejected, expired)
- [ ] Date de validité avec notification d'expiration

## Phase 2: Fonctionnalités Avancées

### Documents
- [ ] Upload de fichiers
- [ ] Organisation par catégorie (photos, plans, contrats, etc.)
- [ ] Prévisualisation des fichiers
- [ ] Galerie de photos par projet
- [ ] Recherche de documents

### Génération PDF
- [ ] Template PDF pour factures
- [ ] Template PDF pour soumissions
- [ ] Personnalisation du template (logo, couleurs)
- [ ] Téléchargement PDF
- [ ] Envoi par email en pièce jointe

### Email
- [ ] Configuration SMTP ou service email (Resend, SendGrid)
- [ ] Template email pour factures
- [ ] Template email pour soumissions
- [ ] Historique des emails envoyés
- [ ] Rappels automatiques pour factures impayées

### Paramètres Organisation
- [ ] Page de paramètres (`/settings`)
- [ ] Édition des informations de l'entreprise
- [ ] Upload du logo
- [ ] Configuration NEQ, TPS, TVQ
- [ ] Personnalisation des termes et conditions
- [ ] Configuration de la numérotation (factures, soumissions)

### Gestion d'équipe
- [ ] Invitation de membres d'équipe
- [ ] Gestion des rôles et permissions
- [ ] Liste des membres
- [ ] Désactivation/suppression de membres

### Collaboration
- [ ] Commentaires sur projets/factures
- [ ] Mentions (@user)
- [ ] Notifications en temps réel
- [ ] Journal d'activité par projet
- [ ] Notifications par email

## Phase 3: Optimisations & Features Premium

### Rapports & Statistiques
- [ ] Dashboard avec graphiques (Chart.js ou Recharts)
- [ ] Rapport de revenus par mois/année
- [ ] Rapport par client
- [ ] Rapport par projet
- [ ] Export CSV/Excel

### Export Comptable
- [ ] Export pour logiciels comptables
- [ ] Format CSV compatible
- [ ] Intégration QuickBooks (futur)

### Stripe Integration
- [ ] Configuration des plans (Starter, Pro, Enterprise)
- [ ] Page de tarification
- [ ] Checkout Stripe
- [ ] Webhooks Stripe
- [ ] Gestion des abonnements
- [ ] Facturation automatique
- [ ] Portail client Stripe

### Internationalisation
- [ ] Configuration next-intl
- [ ] Fichiers de traduction FR
- [ ] Fichiers de traduction EN
- [ ] Switch de langue dans les paramètres
- [ ] Détection automatique de langue

### Performance
- [ ] Optimisation des requêtes Supabase
- [ ] Pagination pour les listes
- [ ] Lazy loading des images
- [ ] Cache avec React Query ou SWR
- [ ] Optimisation du bundle size

### Mobile
- [ ] Design responsive (déjà en grande partie fait avec Tailwind)
- [ ] PWA (Progressive Web App)
  - [ ] Service Worker
  - [ ] Offline mode
  - [ ] App installable
- [ ] Application mobile native (React Native - phase ultérieure)

## Phase 4: Features Entreprise

### Signature Électronique
- [ ] Intégration DocuSign ou équivalent
- [ ] Signature de soumissions
- [ ] Signature de contrats

### Gestion de Stock/Matériaux
- [ ] Catalogue de matériaux
- [ ] Prix unitaires
- [ ] Insertion rapide dans factures/soumissions

### Planning & Calendrier
- [ ] Calendrier des projets
- [ ] Timeline des tâches
- [ ] Gantt chart basique

### API Publique
- [ ] API REST pour intégrations tierces
- [ ] Documentation API
- [ ] Authentification API (JWT)

## Bugs & Améliorations

### Bugs Connus
- [ ] Warning Supabase dans Edge Runtime (non-critique)
- [ ] Warning lockfiles multiples (à nettoyer)

### Améliorations UX
- [ ] Loading states pour toutes les actions
- [ ] Messages de succès/erreur toasts
- [ ] Animations de transition
- [ ] Skeleton loaders
- [ ] Meilleure gestion des erreurs
- [ ] Confirmation avant suppression

### Sécurité
- [ ] Rate limiting sur les routes sensibles
- [ ] 2FA (Two-Factor Authentication)
- [ ] Logs d'audit détaillés
- [ ] GDPR compliance
  - [ ] Export de données utilisateur
  - [ ] Suppression de compte
  - [ ] Politique de confidentialité

### SEO & Marketing
- [ ] Page d'accueil optimisée
- [ ] Page de tarification
- [ ] Blog (optionnel)
- [ ] Témoignages clients
- [ ] Case studies

## DevOps & Infrastructure

### CI/CD
- [ ] GitHub Actions pour tests
- [ ] Prévisualisation des PRs (Vercel Preview)
- [ ] Tests E2E avec Playwright
- [ ] Tests unitaires avec Jest

### Monitoring
- [ ] Sentry pour error tracking
- [ ] Vercel Analytics
- [ ] Supabase logs monitoring
- [ ] Uptime monitoring (UptimeRobot)

### Documentation
- [ ] Documentation API
- [ ] Guide de contribution
- [ ] Storybook pour composants UI (optionnel)

## Prochaines Actions Immédiates

1. **Compléter le module Clients**
   - Détail client
   - Édition client
   - Tests

2. **Commencer le module Projets**
   - Liste des projets
   - Création de projet

3. **Module Facturation (prioritaire)**
   - Création de facture avec ligne items
   - Calcul automatique des taxes

4. **Configuration Supabase**
   - Créer un compte Supabase
   - Exécuter le schema.sql
   - Configurer les buckets Storage

5. **Tests**
   - Tester le flow complet signup → création client → création facture

---

**Note**: Cette roadmap est flexible et peut être ajustée selon les priorités et le feedback utilisateur.

**Dernière mise à jour**: 2025-10-18
