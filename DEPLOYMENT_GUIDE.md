# 🚀 Guide de Déploiement Production - StructureClerk

Guide complet pour déployer StructureClerk en production sur Vercel avec toutes les intégrations.

---

## ✅ PRÉREQUIS COMPLÉTÉS

- [x] **Migrations Supabase 005, 006, 007** appliquées ✅
- [x] **Stripe Products créés:**
  - Pro (99 CAD/mois): `price_1SKJTqCBFi583kPttlJHbaJV`
  - Enterprise (299 CAD/mois): `price_1SKJV8CBFi583kPtsW6sup4k`
- [x] **Code poussé sur GitHub** (main branch)

---

## 📋 ÉTAPES DE DÉPLOIEMENT

### 1️⃣ Configuration Stripe Webhook

**Objectif:** Permettre à Stripe de notifier l'application des événements (paiements, changements d'abonnement)

**Actions:**

1. Aller sur **Stripe Dashboard** → **Developers** → **Webhooks**
   - URL: https://dashboard.stripe.com/webhooks

2. Cliquer **"Add endpoint"**

3. Configurer l'endpoint:
   ```
   Endpoint URL: https://structureclerk.ca/api/stripe/webhooks
   Description: StructureClerk Production Webhook
   Version: Latest API version
   ```

4. Sélectionner les **Events à écouter:**
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

5. Cliquer **"Add endpoint"**

6. **IMPORTANT:** Copier le **Signing Secret** (commence par `whsec_...`)
   - Vous en aurez besoin pour les variables d'environnement Vercel

**Résultat attendu:**
- Endpoint créé et actif ✅
- Signing secret copié (whsec_xxx) ✅

---

### 2️⃣ Configuration Variables d'Environnement Vercel

**Objectif:** Configurer toutes les clés API et secrets nécessaires

**Actions:**

1. Aller sur **Vercel Dashboard** → **Votre Projet** → **Settings** → **Environment Variables**
   - URL: https://vercel.com/[votre-username]/structureclerk/settings/environment-variables

2. Ajouter les variables suivantes (cliquer **"Add New"** pour chacune):

#### **Supabase**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-service-role-key
```

#### **Anthropic AI**
```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-anthropic-api-key
```

#### **Stripe (À VÉRIFIER/AJOUTER)**
```bash
# Publishable Key (pk_live_xxx)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key

# Secret Key (sk_live_xxx)
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key

# Webhook Secret (OBTENU À L'ÉTAPE 1)
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-signing-secret

# Price IDs (NOUVEAUX)
STRIPE_PRICE_ID_PRO=price_your-pro-plan-price-id
STRIPE_PRICE_ID_ENTERPRISE=price_your-enterprise-plan-price-id
```

#### **Resend (pour emails contact)**
```bash
RESEND_API_KEY=re_your-resend-api-key
```

#### **App Configuration**
```bash
NEXT_PUBLIC_APP_URL=https://structureclerk.ca
NODE_ENV=production
```

3. **IMPORTANT:** Sélectionner **"Production"** pour chaque variable (pas Preview/Development)

4. Cliquer **"Save"** après chaque ajout

**Résultat attendu:**
- Toutes les variables configurées ✅
- Environment: Production ✅

---

### 3️⃣ Vérifier Supabase Storage Bucket

**Objectif:** S'assurer que le bucket "documents" existe pour l'upload de fichiers

**Actions:**

1. Aller sur **Supabase Dashboard** → **Storage**
   - URL: https://supabase.com/dashboard/project/lgcymcgbarjfjropanof/storage/buckets

2. Vérifier qu'un bucket nommé **"documents"** existe
   - Si OUI: ✅ Continuer à l'étape suivante
   - Si NON: Créer le bucket:
     - Cliquer **"New bucket"**
     - Name: `documents`
     - Public bucket: **OFF** (privé)
     - Cliquer **"Create bucket"**

3. Configurer les **RLS Policies** (normalement déjà fait via migrations):
   - Cliquer sur bucket `documents` → **"Policies"**
   - Devrait voir des policies pour SELECT, INSERT, UPDATE, DELETE
   - Si vide, les migrations n'ont pas créé les policies → Me contacter

**Résultat attendu:**
- Bucket "documents" existe ✅
- RLS policies actives ✅

---

### 4️⃣ Redéploiement Vercel

**Objectif:** Déployer la dernière version du code avec les nouvelles variables d'environnement

**Actions:**

1. **Option A: Redéploiement automatique (recommandé)**
   - Aller sur **Vercel Dashboard** → **Deployments**
   - Cliquer sur le dernier deployment
   - Cliquer **"Redeploy"**
   - Confirmer avec **"Redeploy"** (sans git changes)

2. **Option B: Push nouveau commit (si modifs locales)**
   ```bash
   git add .
   git commit -m "Production ready deployment"
   git push origin main
   ```
   - Vercel redéploiera automatiquement

3. Attendre la fin du déploiement (~3-5 minutes)

**Résultat attendu:**
- Déploiement réussi ✅
- Status: Ready ✅
- URL accessible: https://structureclerk.ca ✅

---

### 5️⃣ Tests End-to-End

**Objectif:** Valider que toutes les fonctionnalités critiques fonctionnent en production

#### **Test 1: Homepage & Navigation**
1. Visiter https://structureclerk.ca
2. Vérifier:
   - ✅ Logo StructureClerk visible
   - ✅ Page charge sans erreurs
   - ✅ Boutons "Commencer gratuitement" et "En savoir plus" fonctionnent

#### **Test 2: Inscription & Authentification**
1. Cliquer "Commencer gratuitement"
2. S'inscrire avec un nouvel email (ex: test@example.com)
3. Vérifier:
   - ✅ Email de confirmation reçu (check Supabase Email Templates)
   - ✅ Redirection vers /dashboard après inscription
   - ✅ Profil créé avec trial_ends_at (30 jours)

#### **Test 3: Dashboard**
1. Une fois connecté au dashboard
2. Vérifier:
   - ✅ Navigation sidebar visible avec toutes les sections
   - ✅ "Extraction IA 🤖" visible dans la navigation
   - ✅ Chat Assistant bubble (orange, bottom-right)
   - ✅ Statistiques s'affichent (même si 0)

#### **Test 4: Chat Assistant IA** 🤖
1. Cliquer sur le bubble orange Chat Assistant
2. Poser une question: "Combien j'ai de factures impayées?"
3. Vérifier:
   - ✅ Réponse reçue en quelques secondes
   - ✅ Réponse cohérente (ex: "Vous avez 0 factures impayées")
   - ✅ Conversation sauvegardée (visible dans Supabase → chat_messages)

#### **Test 5: Extraction de Facture IA** 📄
1. Aller sur **Extraction IA** dans la navigation
2. Uploader une facture test (PDF ou image)
   - Si vous n'avez pas de facture: créer un PDF simple avec:
     ```
     FACTURE
     Numéro: INV-001
     Date: 2025-01-20

     Sous-total: 1000.00 CAD
     TPS (5%): 50.00 CAD
     TVQ (9.975%): 99.75 CAD
     Total: 1149.75 CAD
     ```
3. Vérifier:
   - ✅ Upload réussi
   - ✅ Extraction complétée en quelques secondes
   - ✅ Données extraites affichées (invoice #, montants, taxes)
   - ✅ Confidence score affiché
   - ✅ Bouton "Réviser et Modifier" ou "Créer Automatiquement" visible

#### **Test 6: Stripe Checkout** 💳
1. Aller sur **Plans** (/subscription/plans)
   - Ou attendre 30 jours que le trial expire et aller sur /subscription/expired
2. Cliquer **"Commencer Maintenant"** sur le plan Pro
3. Vérifier:
   - ✅ Redirection vers Stripe Checkout
   - ✅ Prix affiché: 99 CAD/mois
   - ✅ Possibilité d'entrer carte de test:
     ```
     Numéro: 4242 4242 4242 4242
     Date: 12/34
     CVC: 123
     ```
4. Compléter le paiement de test
5. Vérifier:
   - ✅ Redirection vers /subscription/success
   - ✅ Message de succès affiché
   - ✅ Dans Supabase → subscriptions: status = 'active'
   - ✅ Dans Supabase → activities: log "subscription_activated"
   - ✅ Dans Stripe Dashboard: subscription créée

#### **Test 7: Stripe Webhook**
1. Aller sur **Stripe Dashboard** → **Developers** → **Webhooks**
2. Cliquer sur l'endpoint configuré
3. Vérifier:
   - ✅ Events listés (checkout.session.completed, etc.)
   - ✅ Status: Succeeded (200 OK)
   - ✅ Si erreurs (4xx, 5xx): vérifier les logs Vercel

#### **Test 8: Contact Form** ✉️
1. Aller sur **/qa** (Questions & Answers)
2. Remplir le formulaire de contact
3. Soumettre
4. Vérifier:
   - ✅ Message de confirmation
   - ✅ Email reçu à info@structureclerk.ca (via Resend)
   - ✅ Dans Supabase → contact_submissions: soumission enregistrée

---

### 6️⃣ Monitoring & Logs

**Objectif:** Surveiller l'application après déploiement

#### **Vercel Logs**
1. Aller sur **Vercel Dashboard** → **Deployments** → **[Latest]** → **Runtime Logs**
2. Chercher des erreurs (filtre: "error")
3. Vérifier que les API calls fonctionnent:
   - `/api/chat` → 200 OK
   - `/api/invoices/extract` → 200 OK
   - `/api/stripe/checkout` → 200 OK
   - `/api/stripe/webhooks` → 200 OK

#### **Supabase Logs**
1. Aller sur **Supabase Dashboard** → **Logs**
2. Vérifier:
   - Database queries (pas d'erreurs RLS)
   - Auth logs (signups, logins)
   - Storage logs (file uploads)

#### **Stripe Dashboard**
1. Vérifier section **"Payments"** pour voir les transactions test
2. Vérifier **"Subscriptions"** pour voir les abonnements actifs
3. Vérifier **"Webhooks"** pour voir les events reçus

---

## 🛠️ TROUBLESHOOTING

### Erreur: "Stripe webhook signature verification failed"
**Cause:** `STRIPE_WEBHOOK_SECRET` incorrect ou manquant
**Solution:**
1. Aller sur Stripe Webhooks → Cliquer sur endpoint
2. Cliquer "Reveal" sur Signing Secret
3. Copier le secret (whsec_xxx)
4. Mettre à jour dans Vercel env vars
5. Redéployer

### Erreur: "ANTHROPIC_API_KEY is not defined"
**Cause:** Variable d'environnement manquante
**Solution:**
1. Vérifier dans Vercel → Settings → Environment Variables
2. S'assurer que `ANTHROPIC_API_KEY` est définie pour Production
3. Redéployer

### Chat Assistant ne répond pas
**Cause:** Migration 006 pas appliquée ou token limit atteint
**Solution:**
1. Vérifier Supabase → Table Editor → chat_conversations existe
2. Vérifier Supabase → subscriptions → ai_tokens_used < ai_tokens_limit
3. Vérifier Vercel logs pour erreurs API Anthropic

### Extraction de facture échoue
**Cause:** Migration 007 pas appliquée ou bucket storage manquant
**Solution:**
1. Vérifier Supabase → Table Editor → extraction_jobs existe
2. Vérifier Supabase → Storage → bucket "documents" existe
3. Vérifier RLS policies sur bucket

### Stripe checkout ne redirige pas
**Cause:** Price IDs incorrects ou publishable key manquante
**Solution:**
1. Vérifier `STRIPE_PRICE_ID_PRO` et `STRIPE_PRICE_ID_ENTERPRISE` dans Vercel env vars
2. Vérifier `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` commence par pk_live_
3. Vérifier dans Stripe Dashboard que les price IDs existent et sont actifs

---

## 📊 MÉTRIQUES DE SUCCÈS

Après déploiement, vous devriez voir:

- ✅ **Uptime:** 99%+ (Vercel)
- ✅ **Temps de réponse:** <500ms (pages), <3s (IA)
- ✅ **Build time:** 3-5 minutes
- ✅ **Erreurs:** 0 (ou <1% traffic)

---

## 🎯 PROCHAINES ÉTAPES POST-DÉPLOIEMENT

### Immédiat (J+0)
- [ ] Tester tous les flows critiques (checklist ci-dessus)
- [ ] Configurer monitoring d'erreurs (Sentry optionnel)
- [ ] Vérifier que les emails Supabase sont envoyés (templates personnalisés)

### Court terme (Semaine 1)
- [ ] Inviter premiers beta testers
- [ ] Monitorer usage AI tokens (Supabase → ai_usage_logs)
- [ ] Créer backup manuel base de données (Supabase → Database → Backups)

### Moyen terme (Mois 1)
- [ ] Analyser metrics utilisateurs (Google Analytics optionnel)
- [ ] Ajuster plan limits si besoin
- [ ] Implémenter features Phase 2 selon feedback

---

## 📞 SUPPORT

**Problèmes durant déploiement?**
- Vérifier logs Vercel: https://vercel.com/dashboard
- Vérifier logs Supabase: https://supabase.com/dashboard/project/lgcymcgbarjfjropanof/logs/explorer
- Vérifier Stripe events: https://dashboard.stripe.com/webhooks

**Ressources:**
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs/webhooks

---

## ✅ CHECKLIST FINALE

Avant de marquer le déploiement comme COMPLET:

- [ ] Stripe webhook configuré et testé
- [ ] Toutes variables env Vercel configurées (Production)
- [ ] Bucket Supabase Storage "documents" existe avec RLS
- [ ] Redéploiement Vercel réussi
- [ ] Test signup/login fonctionne
- [ ] Test Chat Assistant fonctionne
- [ ] Test Invoice Extraction fonctionne
- [ ] Test Stripe Checkout fonctionne
- [ ] Webhook Stripe reçoit events (200 OK)
- [ ] Contact form envoie emails via Resend
- [ ] Aucune erreur dans Vercel Runtime Logs
- [ ] DNS pointe vers Vercel (structureclerk.ca)
- [ ] HTTPS actif (certificat SSL)

**Une fois tout coché:** 🎉 **PRODUCTION READY!** 🚀

---

**Date de création:** 2025-01-20
**Version:** 1.0.0
**Auteur:** Michel Fotsing + Claude (Anthropic)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
