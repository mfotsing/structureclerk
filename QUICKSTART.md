# Guide de Démarrage Rapide - StructureClerk

Ce guide vous aidera à configurer et lancer StructureClerk en quelques minutes.

## Prérequis

- Node.js 18 ou plus récent
- Un compte Supabase (gratuit: https://supabase.com)
- Un compte Stripe (optionnel pour le MVP, gratuit: https://stripe.com)

## Étape 1: Installer les dépendances

```bash
npm install
```

## Étape 2: Configurer Supabase

### 2.1 Créer un projet Supabase

1. Allez sur https://supabase.com
2. Créez un compte ou connectez-vous
3. Créez un nouveau projet
4. Notez votre **URL du projet** et votre **clé anon publique**

### 2.2 Exécuter le schéma SQL

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Créez une nouvelle requête
3. Copiez tout le contenu du fichier `supabase/schema.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur **Run** pour exécuter le script

Cela va créer toutes les tables, politiques RLS, triggers et indexes.

### 2.3 Configurer le Storage

1. Dans Supabase, allez dans **Storage**
2. Créez les buckets suivants:

**Bucket: documents** (Private)
- Name: `documents`
- Public: Non (décoché)
- Allowed MIME types: Tous

**Bucket: logos** (Public)
- Name: `logos`
- Public: Oui (coché)
- Allowed MIME types: image/*

**Bucket: avatars** (Public)
- Name: `avatars`
- Public: Oui (coché)
- Allowed MIME types: image/*

### 2.4 Configurer l'authentification

1. Dans Supabase, allez dans **Authentication > Providers**
2. Assurez-vous que **Email** est activé
3. Configurez l'URL de redirection:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://votre-domaine.com/auth/callback`

## Étape 3: Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet:

```bash
cp .env.example .env.local
```

Éditez `.env.local` et ajoutez vos clés Supabase:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-publique
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key

# Stripe (optionnel pour le MVP)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Où trouver vos clés Supabase:

1. Allez dans **Settings > API** dans votre projet Supabase
2. **Project URL**: c'est votre `NEXT_PUBLIC_SUPABASE_URL`
3. **anon public**: c'est votre `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **service_role**: c'est votre `SUPABASE_SERVICE_ROLE_KEY` (gardez-la secrète!)

## Étape 4: Lancer l'application

```bash
npm run dev
```

Ouvrez http://localhost:3000 dans votre navigateur.

## Étape 5: Créer votre premier compte

1. Allez sur http://localhost:3000
2. Cliquez sur **Commencer gratuitement** ou allez sur `/signup`
3. Remplissez le formulaire:
   - Nom de votre entreprise
   - Votre nom complet
   - Votre courriel
   - Mot de passe (min. 6 caractères)
4. Cliquez sur **Créer mon compte**

Vous serez automatiquement redirigé vers le tableau de bord!

## Étape 6: Tester l'application

### Ajouter un client

1. Dans la sidebar, cliquez sur **Clients**
2. Cliquez sur **+ Ajouter un client**
3. Remplissez les informations du client
4. Cliquez sur **Créer le client**

### Créer une facture (à venir)

1. Dans la sidebar, cliquez sur **Factures**
2. Cliquez sur **Nouvelle facture**
3. Sélectionnez un client
4. Ajoutez des lignes de facturation
5. Les taxes québécoises (TPS 5% + TVQ 9.975%) sont calculées automatiquement!

## Fonctionnalités Disponibles (MVP)

✅ **Authentification**
- Inscription / Connexion
- Multi-tenant (une organisation par entreprise)

✅ **Tableau de bord**
- Vue d'ensemble des statistiques
- Actions rapides

✅ **Gestion de clients**
- Créer, lister, voir les clients
- Informations de contact complètes

🚧 **À venir dans les prochaines phases:**
- Gestion de projets/chantiers
- Module de facturation avec calcul automatique des taxes québécoises
- Module de soumissions/estimations
- Gestion de documents
- Collaboration d'équipe
- Génération PDF
- Envoi d'emails
- Intégration Stripe pour abonnements

## Dépannage

### Erreur: "Invalid API key"

Vérifiez que vos variables d'environnement dans `.env.local` sont correctes.

### Erreur: "relation 'organizations' does not exist"

Le schéma SQL n'a pas été exécuté. Retournez à l'Étape 2.2.

### Erreur: "User not found" après signup

C'est normal! Le trigger `on_auth_user_created` devrait créer automatiquement le profil. Si le problème persiste, vérifiez que le trigger existe dans Supabase SQL Editor:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### L'application ne démarre pas

1. Vérifiez que Node.js 18+ est installé: `node --version`
2. Supprimez `node_modules` et réinstallez: `rm -rf node_modules && npm install`
3. Vérifiez qu'il n'y a pas d'erreur dans `.env.local`

## Structure du Projet

```
structureclerk/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Pages d'authentification
│   │   ├── (dashboard)/     # Pages protégées
│   │   ├── auth/            # Callbacks auth
│   │   └── page.tsx         # Page d'accueil
│   ├── components/          # Composants réutilisables
│   ├── lib/
│   │   ├── supabase/        # Config Supabase
│   │   └── utils.ts         # Utilitaires (taxes, formatage)
│   └── types/
│       └── database.ts      # Types TypeScript
├── supabase/
│   └── schema.sql           # Schéma de base de données
└── public/                  # Fichiers statiques
```

## Prochaines Étapes

Maintenant que l'application fonctionne, vous pouvez:

1. **Personnaliser votre organisation**
   - Aller dans Paramètres (à venir)
   - Ajouter votre logo
   - Remplir vos informations (NEQ, TPS, TVQ)

2. **Ajouter des clients**
   - Commencez par ajouter vos clients existants

3. **Créer des projets** (à venir)
   - Organisez votre travail par chantier

4. **Commencer à facturer** (à venir)
   - Créez vos premières factures avec calcul automatique des taxes

## Support

Pour toute question ou problème:
- GitHub Issues: https://github.com/mfotsing/structureclerk/issues
- Documentation complète: Voir `README.md`

## Contribution

Les contributions sont bienvenues! Consultez le `README.md` pour plus d'informations.

---

Bon travail avec StructureClerk! 🏗️
