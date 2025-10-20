# Configuration Resend - StructureClerk

## 📧 Configuration du Service d'Email Resend

StructureClerk utilise **Resend** pour envoyer les emails du formulaire de contact vers **info@structureclerk.ca**.

---

## 🚀 Étape 1 : Créer un Compte Resend

1. Va sur https://resend.com
2. Clique sur **Sign Up** (ou connecte-toi si tu as déjà un compte)
3. Crée un compte avec ton email

---

## 🔑 Étape 2 : Obtenir la Clé API

1. Une fois connecté, va dans **API Keys** dans la sidebar
2. Clique sur **Create API Key**
3. Nom : `StructureClerk Production` (ou un nom de ton choix)
4. Permissions : **Full Access** (ou **Sending Access** si tu veux limiter)
5. Clique sur **Create**
6. **⚠️ COPIE LA CLÉ IMMÉDIATEMENT** - Elle ne sera plus visible après
   - Format : `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## 🌐 Étape 3 : Vérifier ton Domaine (Recommandé)

Pour envoyer depuis `noreply@structureclerk.ca` au lieu de `onboarding@resend.dev`, tu dois vérifier ton domaine :

### Option A : Domaine Complet (structureclerk.ca)

1. Dans Resend, va dans **Domains**
2. Clique sur **Add Domain**
3. Entre `structureclerk.ca`
4. Resend va te donner des enregistrements DNS à ajouter :
   - **SPF** (TXT record)
   - **DKIM** (TXT record)
   - **DMARC** (TXT record - optionnel mais recommandé)

5. Va dans ton hébergeur DNS (ex: Vercel, Cloudflare, GoDaddy) et ajoute ces enregistrements
6. Retourne dans Resend et clique sur **Verify Records**
7. Une fois vérifié, tu pourras envoyer depuis `noreply@structureclerk.ca`

### Option B : Test avec onboarding@resend.dev

Si tu veux tester rapidement sans configurer le DNS :
- Resend te donne `onboarding@resend.dev` par défaut
- Change `from: 'noreply@structureclerk.ca'` dans `src/app/api/contact/route.ts` ligne 53 par :
  ```typescript
  from: 'onboarding@resend.dev',
  ```
- ⚠️ **Les emails iront peut-être en spam** avec cette adresse

---

## 🔧 Étape 4 : Configurer les Variables d'Environnement

### Local (.env.local)

Crée un fichier `.env.local` à la racine du projet (s'il n'existe pas) :

```bash
# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Production (Vercel)

1. Va sur https://vercel.com/dashboard
2. Sélectionne ton projet **structureclerk**
3. Va dans **Settings** → **Environment Variables**
4. Ajoute une nouvelle variable :
   - **Name :** `RESEND_API_KEY`
   - **Value :** `re_xxxxxxxxxxxxxxxxxxxxxxxxxx` (ta clé API Resend)
   - **Environment :** Sélectionne **Production**, **Preview**, et **Development**
5. Clique sur **Save**

**⚠️ IMPORTANT :** Après avoir ajouté la variable, tu dois **redéployer** ton application :
- Va dans **Deployments**
- Clique sur les **3 points** à côté du dernier déploiement
- Clique sur **Redeploy**

---

## ✅ Étape 5 : Tester le Formulaire de Contact

### Test Local

1. Lance le serveur de développement :
   ```bash
   npm run dev
   ```

2. Va sur http://localhost:3000/qa

3. Remplis le formulaire de contact :
   - Nom : Ton nom
   - Email : Ton email
   - Sujet : Test Resend
   - Message : Test d'intégration Resend

4. Clique sur **Envoyer le message**

5. Vérifie que :
   - ✅ Le formulaire affiche "Message envoyé avec succès"
   - ✅ Tu reçois un email sur **info@structureclerk.ca**
   - ✅ L'email contient les informations du formulaire
   - ✅ Le design de l'email utilise les couleurs StructureClerk (navy, orange)

### Test Production

1. Va sur https://structureclerk-lqcz.vercel.app/qa (ou https://structureclerk.ca/qa si DNS configuré)

2. Remplis et envoie le formulaire

3. Vérifie la réception de l'email sur **info@structureclerk.ca**

---

## 📊 Monitoring et Logs

### Dashboard Resend

1. Va sur https://resend.com/emails
2. Tu verras tous les emails envoyés avec leur statut :
   - ✅ **Delivered** : Email reçu avec succès
   - ⏳ **Queued** : Email en cours d'envoi
   - ❌ **Failed** : Échec d'envoi (vérifie les logs)

### Logs Vercel

Si un email n'est pas envoyé :

1. Va dans **Vercel Dashboard** → **Deployments**
2. Clique sur ton déploiement actuel
3. Va dans **Functions Logs**
4. Cherche les logs de `/api/contact`
5. Regarde les erreurs Resend (le code affiche `console.error` en cas d'échec)

---

## 🎨 Design de l'Email

L'email envoyé utilise un template HTML avec :

- **Header navy** (#0F3B5F) - Couleur principale StructureClerk
- **Accents orange** (#F59E0B) - Couleur CTA StructureClerk
- **Champs structurés** :
  - 👤 Nom
  - 📧 Email (cliquable pour répondre)
  - 📌 Sujet
  - 💬 Message
- **Action suggérée** : "Répondez directement à [email]"
- **Footer** : © 2025 StructureClerk • Propulsé par Techvibes

---

## 🔒 Sécurité

### Bonnes Pratiques

- ✅ **Ne jamais committer** `.env.local` ou `.env.production` dans Git
- ✅ `.env.local` est dans `.gitignore` par défaut
- ✅ Utilise des variables d'environnement pour toutes les clés sensibles
- ✅ Limite les permissions de la clé API Resend (Sending Access uniquement)

### Rotation de Clés

Si ta clé API est compromise :

1. Va dans **Resend** → **API Keys**
2. Supprime l'ancienne clé
3. Crée une nouvelle clé
4. Mets à jour `.env.local` et Vercel Environment Variables
5. Redéploie l'application sur Vercel

---

## 🎁 Plan Gratuit Resend

Resend offre un **plan gratuit** généreux :

- ✅ **3 000 emails/mois** gratuits
- ✅ Pas de carte de crédit requise
- ✅ Support des domaines personnalisés
- ✅ Logs et analytics inclus

Pour un formulaire de contact, c'est largement suffisant ! 🎉

---

## 🆘 Dépannage

### Problème : "Error sending email with Resend"

**Causes possibles :**

1. **Clé API invalide** :
   - Vérifie que `RESEND_API_KEY` est bien définie
   - Vérifie que la clé commence par `re_`
   - Recrée une nouvelle clé si nécessaire

2. **Domaine non vérifié** :
   - Si tu utilises `noreply@structureclerk.ca`, assure-toi que le domaine est vérifié dans Resend
   - Sinon, utilise `onboarding@resend.dev` pour tester

3. **Rate limiting** :
   - Plan gratuit : Max 3000 emails/mois
   - Vérifie ton quota dans Resend Dashboard

### Problème : Emails en spam

**Solutions :**

1. ✅ Vérifie ton domaine avec SPF/DKIM/DMARC
2. ✅ Utilise une adresse "from" avec domaine vérifié (`noreply@structureclerk.ca`)
3. ✅ Évite les mots spam dans le sujet/corps
4. ✅ Ajoute info@structureclerk.ca à tes contacts

### Problème : Email non reçu

**Checklist :**

1. ☐ Vérifie le dossier **Spam/Junk** de info@structureclerk.ca
2. ☐ Vérifie les logs Resend (https://resend.com/emails)
3. ☐ Vérifie les logs Vercel (Functions Logs)
4. ☐ Teste avec un autre email (Gmail, Outlook)
5. ☐ Vérifie que `RESEND_API_KEY` est définie dans Vercel

---

## 📚 Documentation Officielle

- [Resend Documentation](https://resend.com/docs)
- [Node.js SDK](https://resend.com/docs/send-with-nodejs)
- [Domain Verification](https://resend.com/docs/dashboard/domains/introduction)

---

## ✅ Checklist Complète

- [ ] Compte Resend créé
- [ ] Clé API obtenue (`re_xxx...`)
- [ ] Domaine vérifié (ou utilise `onboarding@resend.dev` pour test)
- [ ] Variable `RESEND_API_KEY` ajoutée dans `.env.local`
- [ ] Variable `RESEND_API_KEY` ajoutée dans Vercel
- [ ] Application redéployée sur Vercel
- [ ] Formulaire testé en local (http://localhost:3000/qa)
- [ ] Formulaire testé en production (https://structureclerk-lqcz.vercel.app/qa)
- [ ] Email reçu sur info@structureclerk.ca
- [ ] Design de l'email validé (couleurs StructureClerk)

---

**Prochaines étapes :**

1. Configure Resend avec cette documentation
2. Applique la migration 004 (RLS fix) sur Supabase
3. Configure les templates email personnalisés (voir CUSTOM_EMAILS.md)
4. Teste le flow complet : signup → email de bienvenue → contact form

🎉 Une fois terminé, StructureClerk aura un système d'email professionnel complet !
