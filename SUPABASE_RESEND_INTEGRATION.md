# Intégration Resend avec Supabase Auth - StructureClerk

## 📧 Configuration de Resend comme Fournisseur SMTP pour Supabase

Ce guide explique comment configurer **Resend** pour envoyer tous les emails d'authentification Supabase (signup, reset password, email change) via ton propre domaine **structureclerk.ca**.

---

## 🎯 Pourquoi Faire Ça ?

**Avantages :**
- ✅ Emails envoyés depuis `noreply@structureclerk.ca` au lieu de `noreply@mail.supabase.co`
- ✅ Meilleur taux de délivrabilité (moins de spam)
- ✅ Branding professionnel cohérent
- ✅ Contrôle total sur les emails envoyés
- ✅ Analytics Resend pour tous les emails Auth

**Ce qui sera envoyé via Resend :**
- Email de confirmation d'inscription
- Email de réinitialisation de mot de passe
- Email de changement d'email
- Email d'invitation (si tu utilises cette fonctionnalité)

---

## 📋 Prérequis

- [ ] Compte Resend créé (https://resend.com)
- [ ] Clé API Resend obtenue (format : `re_xxx...`)
- [ ] Domaine `structureclerk.ca` vérifié dans Resend avec SPF/DKIM

---

## 🔧 Étape 1 : Obtenir les Identifiants SMTP de Resend

Resend fournit un serveur SMTP compatible avec Supabase.

### Identifiants SMTP Resend (Standard)

```
Host: smtp.resend.com
Port: 465 (SSL) ou 587 (TLS) - Utilise 587
Username: resend
Password: [Ta clé API Resend] (commence par re_)
```

**Important :** Le mot de passe SMTP est **ta clé API Resend** elle-même !

---

## ⚙️ Étape 2 : Configurer SMTP dans Supabase

### 2.1 Accéder aux Paramètres SMTP

1. Va sur https://supabase.com/dashboard
2. Sélectionne ton projet **structureclerk**
3. Va dans **Project Settings** (icône engrenage en bas à gauche)
4. Clique sur **Auth** dans la sidebar
5. Descends jusqu'à **SMTP Settings**

### 2.2 Activer Custom SMTP

1. Active l'option **Enable Custom SMTP**

2. Remplis les champs :

   ```
   Sender Name: StructureClerk
   Sender Email: noreply@structureclerk.ca
   Host: smtp.resend.com
   Port: 587
   Username: resend
   Password: [Ta clé API Resend - re_xxx...]
   ```

3. **Important :** Assure-toi que `noreply@structureclerk.ca` est bien vérifié dans Resend :
   - Va dans Resend → Domains
   - Vérifie que `structureclerk.ca` est vérifié (✅ Verified)
   - Si ce n'est pas le cas, ajoute les enregistrements DNS (voir section DNS ci-dessous)

4. Clique sur **Save**

### 2.3 Tester la Configuration

1. Dans la même page (**SMTP Settings**), clique sur **Send Test Email**
2. Entre ton adresse email
3. Clique sur **Send**
4. Vérifie que tu reçois l'email de test depuis `noreply@structureclerk.ca`

**Si l'email n'arrive pas :**
- Vérifie le dossier Spam
- Vérifie que le domaine est bien vérifié dans Resend
- Vérifie que la clé API est correcte
- Consulte les logs Resend (https://resend.com/emails)

---

## 🌐 Étape 3 : Vérifier le Domaine dans Resend (Obligatoire)

Pour envoyer depuis `noreply@structureclerk.ca`, tu **dois** vérifier le domaine dans Resend.

### 3.1 Ajouter le Domaine dans Resend

1. Va sur https://resend.com/domains
2. Clique sur **Add Domain**
3. Entre `structureclerk.ca` (sans le "www")
4. Clique sur **Add**

### 3.2 Obtenir les Enregistrements DNS

Resend va te fournir 3 enregistrements DNS à ajouter :

#### A. Enregistrement SPF (TXT)

```
Type: TXT
Name: @ (ou structureclerk.ca)
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600
```

#### B. Enregistrement DKIM (TXT)

```
Type: TXT
Name: resend._domainkey (donné par Resend - unique à ton compte)
Value: [Longue chaîne fournie par Resend]
TTL: 3600
```

#### C. Enregistrement DMARC (TXT) - Optionnel mais Recommandé

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:info@structureclerk.ca
TTL: 3600
```

### 3.3 Ajouter les Enregistrements DNS

**Où ajouter les DNS ?** Ça dépend de ton hébergeur de domaine :

#### Option A : Vercel (si ton domaine est géré par Vercel)

1. Va dans Vercel Dashboard
2. Settings → Domains → structureclerk.ca
3. Clique sur **DNS Records**
4. Ajoute les 3 enregistrements TXT

#### Option B : Cloudflare

1. Connexion Cloudflare
2. Sélectionne `structureclerk.ca`
3. Va dans **DNS**
4. Ajoute les 3 enregistrements TXT

#### Option C : GoDaddy / Namecheap / Autre

1. Connexion à ton registrar de domaine
2. Cherche "DNS Settings" ou "Manage DNS"
3. Ajoute les 3 enregistrements TXT

### 3.4 Vérifier les Enregistrements

1. Retourne dans Resend → Domains
2. Clique sur **Verify Records** à côté de `structureclerk.ca`
3. Resend va vérifier les enregistrements DNS
4. ✅ Une fois vérifié, le statut passe à **Verified**

**Note :** La propagation DNS peut prendre 5 minutes à 48 heures (généralement 15-30 minutes).

---

## 📧 Étape 4 : Personnaliser les Templates Email Supabase

Maintenant que Resend est configuré, personnalise les templates (voir `CUSTOM_EMAILS.md`) :

1. Va dans Supabase → **Authentication** → **Email Templates**
2. Configure les 3 templates :
   - **Confirm signup** : Email de bienvenue
   - **Reset password** : Réinitialisation de mot de passe
   - **Change email** : Changement d'email

**Important :** Avec SMTP Resend configuré, ces emails seront automatiquement envoyés via Resend depuis `noreply@structureclerk.ca` ! 🎉

---

## ✅ Étape 5 : Tester le Flow Complet

### Test 1 : Inscription d'un Nouveau Compte

1. Va sur https://structureclerk-lqcz.vercel.app/signup (ou localhost:3000/signup)
2. Crée un nouveau compte avec un email de test
3. Vérifie que tu reçois l'email de confirmation
4. **Vérifie dans l'email :**
   - ✅ Expéditeur : `StructureClerk <noreply@structureclerk.ca>`
   - ✅ Design personnalisé avec couleurs StructureClerk
   - ✅ Lien de confirmation fonctionnel

### Test 2 : Réinitialisation de Mot de Passe

1. Va sur la page de login
2. Clique sur "Mot de passe oublié ?"
3. Entre ton email
4. Vérifie que tu reçois l'email depuis `noreply@structureclerk.ca`

### Test 3 : Dashboard Resend

1. Va sur https://resend.com/emails
2. Tu devrais voir tous les emails envoyés par Supabase
3. Vérifie les statuts (Delivered, Bounced, etc.)

---

## 🎨 Configuration Avancée : Modèles HTML Personnalisés

Si tu veux encore plus de contrôle, tu peux utiliser **Resend avec React Email** :

### Option : Créer des Templates React Email

1. Installe React Email :
   ```bash
   npm install @react-email/components
   ```

2. Crée un dossier `emails/` :
   ```
   src/
   └── emails/
       ├── WelcomeEmail.tsx
       ├── ResetPasswordEmail.tsx
       └── ChangeEmailEmail.tsx
   ```

3. Exemple `WelcomeEmail.tsx` :
   ```tsx
   import { Html, Head, Body, Container, Heading, Text, Button } from '@react-email/components'

   export default function WelcomeEmail({ confirmationUrl }: { confirmationUrl: string }) {
     return (
       <Html>
         <Head />
         <Body style={{ backgroundColor: '#f9fafb' }}>
           <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
             <Heading style={{ color: '#0F3B5F', textAlign: 'center' }}>
               Bienvenue sur StructureClerk! 🏗️
             </Heading>
             <Text>
               Merci de vous être inscrit à StructureClerk, la plateforme intelligente pour entrepreneurs en construction au Québec.
             </Text>
             <Button
               href={confirmationUrl}
               style={{ backgroundColor: '#F59E0B', color: 'white', padding: '12px 30px', borderRadius: '8px' }}
             >
               Confirmer mon compte
             </Button>
           </Container>
         </Body>
       </Html>
     )
   }
   ```

4. Utilise dans l'API :
   ```typescript
   import { render } from '@react-email/render'
   import WelcomeEmail from '@/emails/WelcomeEmail'

   const html = render(<WelcomeEmail confirmationUrl={url} />)

   await resend.emails.send({
     from: 'noreply@structureclerk.ca',
     to: email,
     subject: 'Bienvenue sur StructureClerk',
     html,
   })
   ```

**Note :** Supabase ne supporte pas directement React Email, mais tu peux créer une Edge Function Supabase qui utilise Resend + React Email.

---

## 📊 Monitoring et Analytics

### Dashboard Resend

1. **Emails envoyés** : https://resend.com/emails
   - Voir tous les emails (Supabase Auth + Contact Form)
   - Statuts : Delivered, Bounced, Complained
   - Taux d'ouverture (si activé)

2. **Logs et Erreurs** :
   - Clique sur un email pour voir les détails
   - Headers SMTP
   - Raisons de bounce

3. **Analytics** :
   - Dashboard → Analytics
   - Volume d'emails par jour
   - Taux de délivrabilité
   - Quotas utilisés (3000/mois gratuit)

### Logs Supabase

1. Va dans Supabase → **Logs** → **Auth Logs**
2. Tu verras les tentatives d'envoi d'email
3. En cas d'erreur SMTP, Supabase affichera les détails

---

## 🔒 Sécurité et Bonnes Pratiques

### 1. Rotation de Clés API

Change ta clé API Resend tous les 3-6 mois :

1. Crée une nouvelle clé dans Resend
2. Mets à jour dans Supabase SMTP Settings
3. Supprime l'ancienne clé

### 2. Limiter les Permissions

Dans Resend, crée des clés API avec permissions limitées :
- **Sending Access** uniquement (pas Full Access)

### 3. Monitoring des Bounces

Configure des alertes Resend pour :
- Taux de bounce élevé
- Emails en spam
- Quota proche de la limite

### 4. DMARC Policy

Après avoir testé, change la politique DMARC de `p=none` à `p=quarantine` ou `p=reject` :

```
v=DMARC1; p=quarantine; rua=mailto:info@structureclerk.ca; pct=100
```

---

## 🆘 Dépannage

### Problème : "SMTP Error: Authentication failed"

**Solutions :**
1. ✅ Vérifie que le mot de passe est bien ta clé API Resend (pas un autre mot de passe)
2. ✅ Vérifie que la clé commence par `re_`
3. ✅ Recrée une nouvelle clé API dans Resend
4. ✅ Vérifie qu'il n'y a pas d'espaces avant/après dans le champ Password

### Problème : "Domain not verified"

**Solutions :**
1. ✅ Attends 15-30 minutes pour la propagation DNS
2. ✅ Vérifie les enregistrements DNS avec `dig` :
   ```bash
   dig TXT structureclerk.ca
   dig TXT resend._domainkey.structureclerk.ca
   ```
3. ✅ Utilise temporairement `onboarding@resend.dev` comme sender email pour tester

### Problème : Emails en Spam

**Solutions :**
1. ✅ Assure-toi que SPF, DKIM, DMARC sont configurés
2. ✅ Vérifie que le domaine est vérifié (✅ Verified)
3. ✅ Réchauffe le domaine : envoie des petits volumes au début
4. ✅ Ajoute `noreply@structureclerk.ca` aux contacts des destinataires

### Problème : "Sending quota exceeded"

**Solutions :**
1. ✅ Plan gratuit Resend : 3000 emails/mois
2. ✅ Vérifie ton usage dans Resend Dashboard
3. ✅ Upgrade vers le plan Pro si nécessaire (20$/mois pour 50k emails)

---

## 💰 Coûts Resend

### Plan Gratuit (Recommandé pour démarrer)

- ✅ **3 000 emails/mois** gratuits
- ✅ Domaines personnalisés illimités
- ✅ Logs 30 jours
- ✅ Support communauté

**Suffisant pour :**
- ~100 signups/mois
- Formulaires de contact
- Emails transactionnels de base

### Plan Pro (20$/mois)

- ✅ **50 000 emails/mois**
- ✅ Logs 90 jours
- ✅ Support prioritaire
- ✅ Analytics avancées

**Upgrade quand :**
- Tu dépasses 2500 emails/mois régulièrement
- Tu as besoin de plus de logs
- Tu veux des analytics détaillées

---

## ✅ Checklist Complète

### Configuration Resend
- [ ] Compte Resend créé
- [ ] Clé API obtenue (re_xxx...)
- [ ] Domaine structureclerk.ca ajouté dans Resend
- [ ] Enregistrements DNS ajoutés (SPF, DKIM, DMARC)
- [ ] Domaine vérifié (✅ Verified dans Resend)

### Configuration Supabase
- [ ] SMTP Custom activé dans Supabase
- [ ] Identifiants SMTP Resend configurés
- [ ] Email de test envoyé et reçu
- [ ] Templates email personnalisés (voir CUSTOM_EMAILS.md)

### Tests
- [ ] Signup → Email de bienvenue reçu depuis noreply@structureclerk.ca
- [ ] Reset password → Email reçu
- [ ] Emails visibles dans Resend Dashboard
- [ ] Aucun email en spam

### Monitoring
- [ ] Alerts Resend configurées (bounces, quota)
- [ ] Dashboard Resend vérifié régulièrement
- [ ] Logs Supabase Auth vérifiés

---

## 📚 Ressources

- [Resend SMTP Documentation](https://resend.com/docs/dashboard/smtp)
- [Supabase Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
- [Email Authentication (SPF/DKIM/DMARC)](https://www.cloudflare.com/learning/email-security/dmarc-dkim-spf/)

---

## 🎉 Résultat Final

Une fois configuré, **tous les emails** seront envoyés via Resend depuis `noreply@structureclerk.ca` :

✅ **Emails Supabase Auth** (signup, reset password) → Via SMTP Resend
✅ **Formulaire de contact** → Via API Resend directement

Branding cohérent et professionnel sur tous les emails ! 🚀

---

**Prochaines étapes :**

1. Configure SMTP Resend dans Supabase (Étape 2)
2. Vérifie le domaine dans Resend (Étape 3)
3. Applique les templates personnalisés (CUSTOM_EMAILS.md)
4. Teste le flow complet (Étape 5)
5. Push les changements et redéploie

**Besoin d'aide ?** Consulte le dépannage ou contacte le support Resend (support@resend.com).
