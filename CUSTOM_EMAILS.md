# Configuration des Emails Personnalisés StructureClerk

## 📧 Personnaliser les Emails Supabase

Pour recevoir les emails de bienvenue de la part de **StructureClerk** au lieu de Supabase :

### 1. Accéder aux Paramètres Supabase

1. Va sur https://supabase.com/dashboard
2. Sélectionne ton projet **structureclerk**
3. Va dans **Authentication** → **Email Templates**

### 2. Templates à Personnaliser

#### A. Email de Confirmation (Signup)

**Template Name:** Confirm signup

**Sujet:**
```
Bienvenue sur StructureClerk - Confirmez votre compte
```

**Corps du message (HTML):**
```html
<h2>Bienvenue sur StructureClerk! 🏗️</h2>

<p>Bonjour,</p>

<p>Merci de vous être inscrit à <strong>StructureClerk</strong>, la plateforme intelligente pour entrepreneurs en construction au Québec.</p>

<p>Pour commencer à utiliser votre compte, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}"
     style="background-color: #F59E0B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
    Confirmer mon compte
  </a>
</p>

<p>Ou copiez ce lien dans votre navigateur :</p>
<p style="color: #64748B; word-break: break-all;">{{ .ConfirmationURL }}</p>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

<h3>Ce qui vous attend :</h3>
<ul>
  <li>✅ 30 jours d'essai gratuit complet</li>
  <li>🤖 Analyse de documents par IA</li>
  <li>📄 Génération automatique de réponses aux appels d'offres</li>
  <li>💰 Calcul automatique des taxes québécoises (TPS/TVQ)</li>
  <li>📊 Gestion complète de vos projets et factures</li>
</ul>

<p>Besoin d'aide ? Notre équipe est là pour vous :</p>
<ul>
  <li>📧 Email : <a href="mailto:info@structureclerk.ca">info@structureclerk.ca</a></li>
  <li>📖 Questions fréquentes : <a href="https://structureclerk.ca/qa">structureclerk.ca/qa</a></li>
</ul>

<p style="margin-top: 30px;">À bientôt sur StructureClerk!</p>

<p style="color: #64748B; font-size: 14px; margin-top: 40px;">
  © 2025 StructureClerk • Propulsé par <a href="https://techvibes.ca">Techvibes</a>
</p>
```

#### B. Email de Réinitialisation de Mot de Passe

**Template Name:** Reset password

**Sujet:**
```
Réinitialisation de votre mot de passe StructureClerk
```

**Corps du message (HTML):**
```html
<h2>Réinitialisation de mot de passe 🔐</h2>

<p>Bonjour,</p>

<p>Vous avez demandé à réinitialiser le mot de passe de votre compte <strong>StructureClerk</strong>.</p>

<p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}"
     style="background-color: #F59E0B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
    Réinitialiser mon mot de passe
  </a>
</p>

<p>Ou copiez ce lien dans votre navigateur :</p>
<p style="color: #64748B; word-break: break-all;">{{ .ConfirmationURL }}</p>

<p style="color: #EF4444; font-weight: bold; margin-top: 30px;">
  ⚠️ Si vous n'avez pas demandé cette réinitialisation, ignorez cet email et votre mot de passe ne sera pas modifié.
</p>

<p style="color: #64748B; margin-top: 30px;">
  Ce lien expire dans 1 heure pour des raisons de sécurité.
</p>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

<p>Besoin d'aide ?</p>
<p>📧 <a href="mailto:info@structureclerk.ca">info@structureclerk.ca</a></p>

<p style="color: #64748B; font-size: 14px; margin-top: 40px;">
  © 2025 StructureClerk • Propulsé par <a href="https://techvibes.ca">Techvibes</a>
</p>
```

#### C. Email de Changement d'Email

**Template Name:** Change email address

**Sujet:**
```
Confirmez votre nouvelle adresse email - StructureClerk
```

**Corps du message (HTML):**
```html
<h2>Confirmation de changement d'email 📧</h2>

<p>Bonjour,</p>

<p>Vous avez demandé à modifier l'adresse email de votre compte <strong>StructureClerk</strong>.</p>

<p>Pour confirmer ce changement, cliquez sur le bouton ci-dessous :</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}"
     style="background-color: #F59E0B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
    Confirmer le changement
  </a>
</p>

<p>Ou copiez ce lien dans votre navigateur :</p>
<p style="color: #64748B; word-break: break-all;">{{ .ConfirmationURL }}</p>

<p style="color: #EF4444; font-weight: bold; margin-top: 30px;">
  ⚠️ Si vous n'avez pas demandé ce changement, contactez immédiatement notre support.
</p>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

<p>Support : <a href="mailto:info@structureclerk.ca">info@structureclerk.ca</a></p>

<p style="color: #64748B; font-size: 14px; margin-top: 40px;">
  © 2025 StructureClerk • Propulsé par <a href="https://techvibes.ca">Techvibes</a>
</p>
```

### 3. Configuration SMTP Personnalisée (Optionnel mais Recommandé)

Pour envoyer depuis **noreply@structureclerk.ca** au lieu de **noreply@mail.supabase.com** :

1. Va dans **Project Settings** → **Auth** → **SMTP Settings**
2. Active **Enable Custom SMTP**
3. Configure avec un service SMTP (SendGrid, AWS SES, Mailgun) :

```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: [Ton SendGrid API Key]
Sender email: noreply@structureclerk.ca
Sender name: StructureClerk
```

### 4. URLs de Redirection

Dans **Authentication** → **URL Configuration** :

- **Site URL:** `https://structureclerk-lqcz.vercel.app` (ou `https://structureclerk.ca`)
- **Redirect URLs:** Ajoute :
  - `https://structureclerk-lqcz.vercel.app/**`
  - `https://structureclerk.ca/**`

### 5. Tester les Emails

Après configuration :

1. Crée un nouveau compte test
2. Vérifie que tu reçois l'email de **StructureClerk**
3. Vérifie que les liens fonctionnent
4. Vérifie le design et les couleurs

## ✅ Checklist

- [ ] Templates email personnalisés configurés
- [ ] SMTP personnalisé configuré (optionnel)
- [ ] URLs de redirection ajoutées
- [ ] Migration 004 appliquée (fix RLS)
- [ ] Test signup complet effectué
- [ ] Emails de bienvenue reçus avec branding StructureClerk

## 📚 Documentation

- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)

---

**Note:** Les templates ci-dessus utilisent les variables Supabase :
- `{{ .ConfirmationURL }}` - Lien de confirmation
- `{{ .Token }}` - Token si nécessaire
- `{{ .Email }}` - Email de l'utilisateur
