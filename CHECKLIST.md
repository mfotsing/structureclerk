# ✅ Checklist de Configuration - StructureClerk

Cette checklist vous guide à travers toutes les étapes nécessaires pour lancer StructureClerk.

## 📋 Avant de Commencer

- [ ] Node.js 18+ est installé (`node --version`)
- [ ] Git est configuré
- [ ] Vous avez un compte GitHub (pour déploiement Vercel)
- [ ] Vous avez lu le `README.md` et `QUICKSTART.md`

## 🔧 Configuration Locale

### Étape 1: Installation
- [ ] Cloner le repository (déjà fait ✅)
- [ ] Exécuter `npm install`
- [ ] Vérifier qu'il n'y a pas d'erreurs d'installation

### Étape 2: Supabase

#### Créer le Projet
- [ ] Aller sur https://supabase.com
- [ ] Créer un compte ou se connecter
- [ ] Créer un nouveau projet
  - [ ] Choisir un nom
  - [ ] Choisir un mot de passe sécurisé pour la BD
  - [ ] Choisir la région (US East est recommandé)
- [ ] Attendre que le projet soit créé (~2 minutes)

#### Récupérer les Clés
- [ ] Aller dans Settings > API
- [ ] Copier le **Project URL**
- [ ] Copier la clé **anon public**
- [ ] Copier la clé **service_role** (gardez-la secrète!)

#### Exécuter le Schéma SQL
- [ ] Aller dans SQL Editor
- [ ] Créer une nouvelle requête
- [ ] Ouvrir le fichier `supabase/schema.sql` de ce projet
- [ ] Copier tout le contenu
- [ ] Coller dans l'éditeur SQL
- [ ] Cliquer sur **Run** ou **Execute**
- [ ] Vérifier qu'il n'y a pas d'erreurs
- [ ] Aller dans Table Editor - vous devriez voir 12 tables:
  - [ ] organizations
  - [ ] profiles
  - [ ] subscriptions
  - [ ] clients
  - [ ] projects
  - [ ] project_members
  - [ ] quotes
  - [ ] quote_items
  - [ ] invoices
  - [ ] invoice_items
  - [ ] documents
  - [ ] activities

#### Configurer Storage
- [ ] Aller dans Storage
- [ ] Créer le bucket **documents**
  - [ ] Public: Non (décoché)
  - [ ] Créer
- [ ] Créer le bucket **logos**
  - [ ] Public: Oui (coché)
  - [ ] Créer
- [ ] Créer le bucket **avatars**
  - [ ] Public: Oui (coché)
  - [ ] Créer

#### Configurer Authentication
- [ ] Aller dans Authentication > Providers
- [ ] Vérifier que Email est activé ✅
- [ ] Aller dans Authentication > URL Configuration
- [ ] Ajouter `http://localhost:3000/auth/callback` dans Site URL
- [ ] Ajouter `http://localhost:3000/auth/callback` dans Redirect URLs

### Étape 3: Variables d'Environnement

- [ ] Créer le fichier `.env.local` à la racine
- [ ] Copier le contenu de `.env.example`
- [ ] Remplacer les valeurs:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[votre-projet].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- [ ] Sauvegarder le fichier
- [ ] ⚠️ NE JAMAIS commiter ce fichier dans Git

### Étape 4: Lancer l'Application

- [ ] Exécuter `npm run dev`
- [ ] Ouvrir http://localhost:3000
- [ ] Vérifier que la page d'accueil s'affiche correctement

## 🧪 Tests Fonctionnels

### Test 1: Inscription
- [ ] Aller sur http://localhost:3000
- [ ] Cliquer sur "Commencer gratuitement" ou aller sur `/signup`
- [ ] Remplir le formulaire:
  - [ ] Nom de l'entreprise: "Test Construction Inc."
  - [ ] Nom complet: "Jean Test"
  - [ ] Email: votre-email-test@example.com
  - [ ] Mot de passe: minimum 6 caractères
- [ ] Cliquer sur "Créer mon compte"
- [ ] Vérifier la redirection vers `/dashboard`
- [ ] Vérifier que le nom apparaît dans le header

### Test 2: Vérification dans Supabase
- [ ] Aller dans Supabase > Table Editor
- [ ] Ouvrir la table **organizations**
  - [ ] Vérifier qu'une ligne a été créée avec votre entreprise
- [ ] Ouvrir la table **profiles**
  - [ ] Vérifier que votre profil existe
  - [ ] Vérifier que `organization_id` est rempli
  - [ ] Vérifier que `role` = "owner"

### Test 3: Dashboard
- [ ] Les statistiques affichent 0 pour tout (normal, c'est vide)
- [ ] Les 4 boutons d'actions rapides sont visibles
- [ ] La sidebar est visible avec tous les menus
- [ ] Aucune erreur dans la console du navigateur

### Test 4: Créer un Client
- [ ] Cliquer sur "Clients" dans la sidebar
- [ ] Voir le message "Aucun client"
- [ ] Cliquer sur "+ Ajouter un client"
- [ ] Remplir le formulaire:
  - [ ] Nom: "Client Test"
  - [ ] Email: client@test.com
  - [ ] Téléphone: (514) 555-1234
  - [ ] Ville: Montréal
  - [ ] Province: Québec (par défaut)
- [ ] Cliquer sur "Créer le client"
- [ ] Vérifier la redirection vers `/clients`
- [ ] Voir le client dans le tableau

### Test 5: Vérification BD Client
- [ ] Aller dans Supabase > Table Editor > clients
- [ ] Vérifier que le client a été créé
- [ ] Vérifier que `organization_id` correspond à votre organisation

### Test 6: Déconnexion/Reconnexion
- [ ] Cliquer sur "Déconnexion"
- [ ] Vérifier la redirection vers `/login`
- [ ] Se reconnecter avec les mêmes identifiants
- [ ] Vérifier l'accès au dashboard
- [ ] Vérifier que le client créé est toujours là

## 🎨 (Optionnel) Configuration Stripe

> Note: Pas obligatoire pour tester l'application, mais nécessaire pour les abonnements

- [ ] Créer un compte Stripe sur https://stripe.com
- [ ] Aller dans Developers > API keys
- [ ] Copier la **Publishable key** (pk_test_...)
- [ ] Copier la **Secret key** (sk_test_...)
- [ ] Ajouter dans `.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```
- [ ] Redémarrer le serveur de dev

## 🚀 Déploiement (Optionnel)

### Vercel (Recommandé)

- [ ] Push le code sur GitHub
- [ ] Aller sur https://vercel.com
- [ ] Importer le repository
- [ ] Configurer les variables d'environnement:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] NEXT_PUBLIC_APP_URL (votre URL Vercel)
  - [ ] (Optionnel) Les clés Stripe
- [ ] Déployer
- [ ] Dans Supabase Auth > URL Configuration:
  - [ ] Ajouter votre URL Vercel dans Site URL
  - [ ] Ajouter `https://[votre-app].vercel.app/auth/callback` dans Redirect URLs

## 📝 Vérification Finale

### Code
- [ ] `npm run build` - Build réussit sans erreur
- [ ] `npm run lint` - Pas d'erreur ESLint critique
- [ ] Tous les fichiers sont commités dans Git

### Supabase
- [ ] 12 tables créées
- [ ] 3 buckets Storage créés
- [ ] Auth configuré
- [ ] RLS activé sur toutes les tables
- [ ] Au moins 1 utilisateur de test créé

### Application
- [ ] Page d'accueil fonctionne
- [ ] Inscription fonctionne
- [ ] Login fonctionne
- [ ] Dashboard affiche les bonnes données
- [ ] Création de client fonctionne
- [ ] Isolation des données fonctionne (créer 2 comptes et vérifier)

### Documentation
- [ ] README.md lu
- [ ] QUICKSTART.md lu
- [ ] ARCHITECTURE.md parcouru
- [ ] TODO.md consulté pour prochaines étapes

## 🎯 Prochaines Actions

Une fois que tout est ✅:

1. **Court terme** (cette semaine)
   - [ ] Compléter le module clients (détail, édition)
   - [ ] Commencer le module projets

2. **Moyen terme** (2-3 semaines)
   - [ ] Module de facturation complet
   - [ ] Génération PDF
   - [ ] Module de soumissions

3. **Long terme** (1-2 mois)
   - [ ] Tests utilisateurs beta
   - [ ] Stripe integration complète
   - [ ] Features avancées (documents, emails)
   - [ ] Lancement public

## 🆘 Problèmes Courants

### "Invalid API key"
- Vérifier que `.env.local` contient les bonnes clés
- Redémarrer le serveur de dev après avoir modifié `.env.local`

### "Relation 'organizations' does not exist"
- Le schéma SQL n'a pas été exécuté correctement
- Retourner dans Supabase SQL Editor et réexécuter `supabase/schema.sql`

### Erreur après signup
- Vérifier que le trigger `on_auth_user_created` existe dans Supabase
- Vérifier les logs dans Supabase > Logs

### Build failed
- Exécuter `rm -rf .next node_modules && npm install && npm run build`
- Vérifier qu'il n'y a pas d'erreur TypeScript

### "Cannot find module"
- Vérifier que toutes les dépendances sont installées: `npm install`

## ✨ Vous êtes Prêt!

Si toutes les cases sont cochées, félicitations! 🎉

Vous avez maintenant:
- ✅ Une application SaaS fonctionnelle
- ✅ Multi-tenant sécurisé
- ✅ Authentification complète
- ✅ Base de données structurée
- ✅ Interface utilisateur moderne
- ✅ Prêt pour le développement

**Prochaine étape**: Consultez `TODO.md` pour voir les fonctionnalités à développer!

---

*Besoin d'aide? Consultez les fichiers de documentation ou créez une issue sur GitHub.*
