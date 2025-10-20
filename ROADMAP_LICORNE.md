# 🦄 ROADMAP LICORNE - StructureClerk

**Plan d'Implémentation Détaillé pour Transformer StructureClerk en Application Licorne**

Version: 1.0
Date: 2025-01-20
Développeur: Solo Developer
Budget estimé: Bootstrapped (optimisation coûts)

---

## 📊 ÉTAT ACTUEL DU PROJET

### ✅ Fonctionnalités Déjà Implémentées (Base Solide)

**AI Document Intelligence (COMPLET):**
- ✅ Classification automatique (7 types: contrat, facture, devis, appel_offres, licence, plan, autre)
- ✅ Extraction multi-format (PDF, DOCX, images avec OCR, texte)
- ✅ Extraction intelligente de champs structurés (factures, contrats)
- ✅ Résumés de contrats avec détection de risques
- ✅ Génération de réponses aux appels d'offres
- ✅ Génération de documents (contrats, factures, devis)
- ✅ Tracking des jobs d'upload avec progression asynchrone
- ✅ Caching en mémoire (1h TTL) pour réduire coûts API

**Gestion Business (COMPLET):**
- ✅ Gestion clients (CRUD complet)
- ✅ Gestion projets avec statuts et budgets
- ✅ Système de factures avec calcul TPS/TVQ
- ✅ Système de devis/soumissions
- ✅ Stockage documents Supabase
- ✅ Audit trail des activités
- ✅ Dashboard avec métriques de base

**Subscription & Billing (PARTIEL - 60%):**
- ✅ Trial gratuit 30 jours (auto-initialisé)
- ✅ Vérification subscription avant AI operations
- ✅ Page "subscription expired" avec upsell
- ✅ Tracking tokens AI utilisés/limites
- ✅ Infrastructure Stripe (tables, champs)
- ❌ **MANQUANT:** Checkout Stripe, webhooks, enforcement limites

**Conformité & Data (COMPLET):**
- ✅ Export complet des données (JSON, ZIP)
- ✅ Suppression de compte avec cascade
- ✅ Audit trail des suppressions
- ✅ RLS multi-tenant robuste
- ✅ Conformité RGPD/LPRPDE

**Communication (PARTIEL):**
- ✅ Formulaire de contact avec email via Resend
- ✅ Templates email personnalisés (signup, reset password)
- ❌ **MANQUANT:** Notifications automatiques, alertes

### 🔴 Gaps Identifiés (Opportunités Licorne)

| Catégorie | Gap | Impact Business | Priorité |
|-----------|-----|-----------------|----------|
| **Monétisation** | Stripe checkout/webhooks incomplets | ❌ Pas de revenus réels | 🔥 CRITIQUE |
| **UX/Retention** | Pas de chat assistant IA | Friction utilisateur élevée | 🔥 HAUTE |
| **Différenciation** | Extraction factures PDF limitée | Concurrent Bench/Wave ont ça | 🔥 HAUTE |
| **Insights** | Pas d'analytics prédictifs | Manque valeur ajoutée | 🟡 MOYENNE |
| **Compliance** | Pas de vérification RBQ/CCQ | Risque légal Quebec | 🟡 MOYENNE |
| **Scaling** | Cache en mémoire seulement | Limite multi-instance | 🟢 BASSE |
| **Intégrations** | Zéro intégrations tierces | Friction adoption | 🟢 BASSE |

---

## 🎯 STRATÉGIE LICORNE - PRIORISATION

### Principe de Priorisation (Score 0-10)

**Critères:**
1. **Impact Revenus** (0-3): Génère directement des revenus?
2. **Différenciation** (0-3): Unique vs concurrents?
3. **Retention** (0-2): Réduit churn?
4. **Effort** (0-2): Temps dev (inverse - moins d'effort = plus de points)

### 🏆 Features Priorisées (Score Total)

| # | Feature | Impact $ | Diff | Retention | Effort | **SCORE** | Phase |
|---|---------|----------|------|-----------|--------|-----------|-------|
| 1 | **Stripe Checkout Complet** | 3 | 0 | 2 | 2 | **7/10** | 1 |
| 2 | **Assistant IA Conversationnel** | 2 | 3 | 2 | 1 | **8/10** | 1 |
| 3 | **Extraction Factures Auto** | 2 | 2 | 2 | 2 | **8/10** | 1 |
| 4 | **Dashboard Admin & Analytics** | 2 | 1 | 1 | 2 | **6/10** | 2 |
| 5 | **Prévisions Financières IA** | 1 | 3 | 1 | 1 | **6/10** | 2 |
| 6 | **Workflow Approbations** | 1 | 2 | 2 | 1 | **6/10** | 2 |
| 7 | **Vérification RBQ/CCQ** | 1 | 2 | 1 | 2 | **6/10** | 3 |
| 8 | **Gestion Fournisseurs Avancée** | 1 | 1 | 1 | 2 | **5/10** | 3 |
| 9 | **Rapports PDF IA** | 1 | 1 | 1 | 2 | **5/10** | 3 |
| 10 | **Intégrations Tierces** | 2 | 2 | 1 | 0 | **5/10** | 4 |
| 11 | **Optimisation Coûts IA (Redis)** | 1 | 0 | 0 | 2 | **3/10** | 4 |

---

## 🚀 PHASE 1 - MVP LICORNE (4-6 semaines)

**Objectif:** Monétisation + Différenciation Unique + UX Exceptionnelle

### 1.1 Stripe Checkout Complet (1 semaine)

**Effort:** 🟡 Moyen (25-30h)
**Impact Revenus:** 🔥🔥🔥 CRITIQUE

#### A. Fichiers à Créer

```
src/app/(dashboard)/subscription/
├── checkout/
│   └── page.tsx                    # Page checkout Stripe
├── success/
│   └── page.tsx                    # Confirmation paiement
├── billing/
│   └── page.tsx                    # Gestion abonnement
└── plans/
    └── page.tsx                    # Comparaison plans

src/app/api/stripe/
├── checkout/route.ts               # Créer session checkout
├── portal/route.ts                 # Accès customer portal
├── webhooks/route.ts               # Traiter événements Stripe
└── usage/route.ts                  # Rapporter usage AI tokens

src/lib/stripe/
├── client.ts                       # Stripe client singleton
├── plans.ts                        # Définition plans/prix
└── helpers.ts                      # Fonctions utilitaires

supabase/migrations/
└── 005_add_stripe_complete.sql     # Nouveaux champs si nécessaire
```

#### B. Plans & Pricing

```typescript
// src/lib/stripe/plans.ts
export const PLANS = {
  free: {
    id: 'free',
    name: 'Essai Gratuit',
    price: 0,
    duration: '30 jours',
    features: [
      '3 projets maximum',
      '10 factures/mois',
      '100 documents',
      '50 000 tokens IA/mois',
      'Support email',
    ],
    limits: {
      projects: 3,
      invoices_per_month: 10,
      documents: 100,
      ai_tokens: 50_000,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 99,
    currency: 'CAD',
    interval: 'month',
    stripe_price_id: process.env.STRIPE_PRICE_ID_PRO,
    features: [
      'Projets illimités',
      'Factures illimitées',
      'Documents illimités',
      '1 000 000 tokens IA/mois',
      'Assistant IA conversationnel',
      'Analytics prédictifs',
      'Export comptable',
      'Support prioritaire',
    ],
    limits: {
      projects: Infinity,
      invoices_per_month: Infinity,
      documents: Infinity,
      ai_tokens: 1_000_000,
    },
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    currency: 'CAD',
    interval: 'month',
    stripe_price_id: process.env.STRIPE_PRICE_ID_ENTERPRISE,
    features: [
      'Tout du plan Pro',
      'Multi-organisations',
      '5 000 000 tokens IA/mois',
      'API access',
      'Intégrations personnalisées',
      'SLA 99.9%',
      'Support dédié',
    ],
    limits: {
      projects: Infinity,
      invoices_per_month: Infinity,
      documents: Infinity,
      ai_tokens: 5_000_000,
      organizations: Infinity,
    },
  },
}
```

#### C. Stripe Webhooks (CRITIQUE)

**Événements à Gérer:**

```typescript
// src/app/api/stripe/webhooks/route.ts
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const supabase = await createClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      // Mettre à jour subscription dans DB
      await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          stripe_subscription_id: session.subscription as string,
          stripe_customer_id: session.customer as string,
          current_period_start: new Date(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        })
        .eq('organization_id', session.metadata?.organization_id)

      // Mettre à jour profile
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          subscription_started_at: new Date(),
        })
        .eq('organization_id', session.metadata?.organization_id)

      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription

      await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000),
          current_period_end: new Date(subscription.current_period_end * 1000),
          cancel_at_period_end: subscription.cancel_at_period_end,
        })
        .eq('stripe_subscription_id', subscription.id)

      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
        })
        .eq('stripe_subscription_id', subscription.id)

      await supabase
        .from('profiles')
        .update({
          subscription_status: 'expired',
        })
        .eq('organization_id', (await supabase.from('subscriptions').select('organization_id').eq('stripe_subscription_id', subscription.id).single()).data?.organization_id)

      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice

      // Logger paiement réussi
      await supabase.from('activities').insert({
        organization_id: (await supabase.from('subscriptions').select('organization_id').eq('stripe_subscription_id', invoice.subscription).single()).data?.organization_id,
        action: 'payment_succeeded',
        description: `Paiement de ${invoice.amount_paid / 100} ${invoice.currency.toUpperCase()} reçu`,
        metadata: {
          invoice_id: invoice.id,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency,
        },
      })

      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice

      // Alerter l'utilisateur (TODO: email)
      await supabase.from('activities').insert({
        organization_id: (await supabase.from('subscriptions').select('organization_id').eq('stripe_subscription_id', invoice.subscription).single()).data?.organization_id,
        action: 'payment_failed',
        description: `Échec du paiement de ${invoice.amount_due / 100} ${invoice.currency.toUpperCase()}`,
        metadata: {
          invoice_id: invoice.id,
          amount: invoice.amount_due / 100,
          currency: invoice.currency,
          error: invoice.last_finalization_error?.message,
        },
      })

      break
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
```

#### D. Enforcement des Limites

```typescript
// src/lib/subscription/limits.ts
import { createClient } from '@/lib/supabase/server'
import { PLANS } from '@/lib/stripe/plans'

export async function checkLimit(
  organizationId: string,
  resource: 'projects' | 'invoices_per_month' | 'documents' | 'ai_tokens'
): Promise<{ allowed: boolean; limit: number; current: number; plan: string }> {
  const supabase = await createClient()

  // Get subscription info
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('organization_id', organizationId)
    .single()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan_name, ai_tokens_used, ai_tokens_limit')
    .eq('organization_id', organizationId)
    .single()

  const planName = subscription?.plan_name || 'free'
  const plan = PLANS[planName as keyof typeof PLANS]

  let current = 0

  switch (resource) {
    case 'projects':
      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
      current = projectCount || 0
      break

    case 'invoices_per_month':
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count: invoiceCount } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .gte('created_at', startOfMonth.toISOString())
      current = invoiceCount || 0
      break

    case 'documents':
      const { count: docCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
      current = docCount || 0
      break

    case 'ai_tokens':
      current = subscription?.ai_tokens_used || 0
      break
  }

  const limit = plan.limits[resource]
  const allowed = limit === Infinity || current < limit

  return { allowed, limit, current, plan: planName }
}

// Middleware pour vérifier limites avant actions
export async function enforceLimit(
  organizationId: string,
  resource: 'projects' | 'invoices_per_month' | 'documents' | 'ai_tokens'
): Promise<void> {
  const { allowed, limit, current, plan } = await checkLimit(organizationId, resource)

  if (!allowed) {
    throw new Error(
      `Limite atteinte: ${current}/${limit} ${resource} pour le plan ${plan}. Upgradez vers Pro pour continuer.`
    )
  }
}
```

#### E. Configuration Stripe

**Variables d'environnement:**
```bash
# .env.production
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Stripe Price IDs
STRIPE_PRICE_ID_PRO=price_xxx
STRIPE_PRICE_ID_ENTERPRISE=price_xxx
```

**Checklist Stripe:**
- [ ] Créer produits dans Stripe Dashboard
- [ ] Créer prix récurrents (monthly)
- [ ] Configurer webhook endpoint (https://structureclerk.ca/api/stripe/webhooks)
- [ ] Activer Customer Portal
- [ ] Tester mode test avant prod

---

### 1.2 Assistant IA Conversationnel (2 semaines)

**Effort:** 🟡 Moyen (35-40h)
**Impact Différenciation:** 🔥🔥🔥 UNIQUE

#### A. Architecture Assistant

```
src/components/chat/
├── ChatAssistant.tsx               # Composant principal (floating bubble)
├── ChatWindow.tsx                  # Fenêtre de chat
├── ChatMessage.tsx                 # Composant message
├── ChatInput.tsx                   # Input avec suggestions
└── ChatHistory.tsx                 # Historique conversations

src/app/api/chat/
├── route.ts                        # Endpoint principal chat
├── context/route.ts                # Récupérer contexte org
└── suggestions/route.ts            # Suggestions de questions

src/lib/ai/
├── chat-agent.ts                   # Agent conversationnel Claude
├── context-builder.ts              # Construire contexte pour Claude
└── query-parser.ts                 # Parser requêtes utilisateur

supabase/migrations/
└── 006_add_chat_system.sql         # Tables conversations
```

#### B. Tables Chat

```sql
-- 006_add_chat_system.sql
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT, -- Auto-généré par Claude
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB, -- sources, tokens, execution_time
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_chat_conversations_organization ON public.chat_conversations(organization_id);
CREATE INDEX idx_chat_conversations_user ON public.chat_conversations(user_id);
CREATE INDEX idx_chat_messages_conversation ON public.chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- RLS
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON public.chat_conversations FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create own conversations"
  ON public.chat_conversations FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view messages in own conversations"
  ON public.chat_messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM public.chat_conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own conversations"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.chat_conversations WHERE user_id = auth.uid()
    )
  );
```

#### C. Context Builder (CRITIQUE pour Qualité)

```typescript
// src/lib/ai/context-builder.ts
import { createClient } from '@/lib/supabase/server'

interface OrganizationContext {
  organization: {
    name: string
    tps_number: string
    tvq_number: string
  }
  stats: {
    total_clients: number
    total_projects: number
    total_invoices: number
    unpaid_invoices: number
    total_documents: number
    monthly_revenue: number
  }
  recent_activities: any[]
  projects_summary: any[]
  invoices_summary: any[]
}

export async function buildOrganizationContext(
  organizationId: string
): Promise<OrganizationContext> {
  const supabase = await createClient()

  // Organization info
  const { data: org } = await supabase
    .from('organizations')
    .select('name, tps_number, tvq_number')
    .eq('id', organizationId)
    .single()

  // Stats
  const { count: clientCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)

  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)

  const { count: invoiceCount } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)

  const { count: unpaidCount } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .in('status', ['draft', 'sent', 'overdue'])

  const { count: docCount } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)

  // Monthly revenue (current month)
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: invoices } = await supabase
    .from('invoices')
    .select('total')
    .eq('organization_id', organizationId)
    .eq('status', 'paid')
    .gte('paid_date', startOfMonth.toISOString())

  const monthlyRevenue = invoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0

  // Recent activities (last 10)
  const { data: activities } = await supabase
    .from('activities')
    .select('action, description, created_at')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(10)

  // Projects summary
  const { data: projects } = await supabase
    .from('projects')
    .select('name, status, budget, start_date, end_date')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(5)

  // Invoices summary (unpaid)
  const { data: unpaidInvoices } = await supabase
    .from('invoices')
    .select('invoice_number, client_id, total, due_date, status')
    .eq('organization_id', organizationId)
    .in('status', ['sent', 'overdue'])
    .order('due_date', { ascending: true })
    .limit(10)

  return {
    organization: {
      name: org?.name || '',
      tps_number: org?.tps_number || '',
      tvq_number: org?.tvq_number || '',
    },
    stats: {
      total_clients: clientCount || 0,
      total_projects: projectCount || 0,
      total_invoices: invoiceCount || 0,
      unpaid_invoices: unpaidCount || 0,
      total_documents: docCount || 0,
      monthly_revenue: monthlyRevenue,
    },
    recent_activities: activities || [],
    projects_summary: projects || [],
    invoices_summary: unpaidInvoices || [],
  }
}

export function formatContextForClaude(context: OrganizationContext): string {
  return `
# Contexte Organisationnel - ${context.organization.name}

## Informations Entreprise
- Nom: ${context.organization.name}
- TPS: ${context.organization.tps_number}
- TVQ: ${context.organization.tvq_number}

## Statistiques Globales
- Clients: ${context.stats.total_clients}
- Projets: ${context.stats.total_projects}
- Factures: ${context.stats.total_invoices} (dont ${context.stats.unpaid_invoices} impayées)
- Documents: ${context.stats.total_documents}
- Revenu ce mois: ${context.stats.monthly_revenue.toFixed(2)} CAD

## Projets Récents (Top 5)
${context.projects_summary.map(p => `- ${p.name} (${p.status}) - Budget: ${p.budget || 'N/A'} CAD`).join('\n')}

## Factures Impayées (Top 10)
${context.invoices_summary.map(i => `- #${i.invoice_number} - ${i.total} CAD - Échéance: ${i.due_date} (${i.status})`).join('\n')}

## Activités Récentes
${context.recent_activities.slice(0, 5).map(a => `- ${a.action}: ${a.description}`).join('\n')}
`.trim()
}
```

#### D. Chat Agent avec Claude

```typescript
// src/lib/ai/chat-agent.ts
import Anthropic from '@anthropic-ai/sdk'
import { buildOrganizationContext, formatContextForClaude } from './context-builder'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const SYSTEM_PROMPT = `Tu es l'assistant IA de StructureClerk, une plateforme de gestion pour entrepreneurs en construction au Québec.

# Ton Rôle
- Aider les entrepreneurs à gérer leur business efficacement
- Répondre aux questions sur leurs projets, clients, factures, finances
- Fournir des insights et recommandations basés sur leurs données
- Parler en français professionnel mais accessible
- Être concis mais complet

# Capacités
- Accès aux données de l'organisation (clients, projets, factures, documents)
- Calculs financiers (revenus, dépenses, projections)
- Recommandations business
- Aide à la conformité TPS/TVQ
- Résumés et rapports

# Limitations
- Tu ne peux PAS modifier les données (lecture seule)
- Tu ne peux PAS créer de factures ou projets (suggère à l'utilisateur de le faire)
- Tu ne peux PAS accéder aux données d'autres organisations

# Style de Réponse
- Utilise des emojis occasionnellement pour le ton 📊 💰 🚀
- Structure avec titres/listes pour lisibilité
- Cite des chiffres précis quand disponibles
- Propose des actions concrètes

# Important
- Si tu ne connais pas la réponse, dis-le honnêtement
- Si une action nécessite l'utilisateur, guide-le clairement
- Pour les calculs financiers, montre ton travail`

export async function chat(
  organizationId: string,
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<{
  response: string
  tokens: { input: number; output: number }
  sources?: string[]
}> {
  // Build context
  const context = await buildOrganizationContext(organizationId)
  const contextText = formatContextForClaude(context)

  // Prepare messages
  const messages: Anthropic.MessageParam[] = [
    {
      role: 'user',
      content: `${contextText}\n\n---\n\nQuestion de l'utilisateur: ${userMessage}`,
    },
    ...conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
  ]

  // Call Claude
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages,
  })

  const responseText = response.content[0].type === 'text'
    ? response.content[0].text
    : ''

  return {
    response: responseText,
    tokens: {
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
    },
    sources: ['organization_data'], // TODO: détailler sources
  }
}

// Exemples de questions supportées
export const SUGGESTED_QUESTIONS = [
  "Combien j'ai de factures impayées?",
  "Quel est mon revenu ce mois?",
  "Résumé du projet [nom]",
  "Quels clients n'ont pas payé?",
  "Combien j'ai dépensé en [catégorie]?",
  "Prévisions de trésorerie pour le mois prochain",
  "Liste mes projets actifs",
  "Statistiques de l'année",
]
```

#### E. API Chat Endpoint

```typescript
// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { chat } from '@/lib/ai/chat-agent'

export async function POST(request: NextRequest) {
  try {
    const { message, conversation_id } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 })
    }

    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Get organization
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id) {
      return NextResponse.json({ error: 'Organisation introuvable' }, { status: 404 })
    }

    // Create or get conversation
    let convId = conversation_id

    if (!convId) {
      const { data: newConv } = await supabase
        .from('chat_conversations')
        .insert({
          organization_id: profile.organization_id,
          user_id: user.id,
        })
        .select()
        .single()

      convId = newConv?.id
    }

    // Get conversation history
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true })
      .limit(20) // Keep last 20 messages for context

    // Save user message
    await supabase.from('chat_messages').insert({
      conversation_id: convId,
      role: 'user',
      content: message,
    })

    // Get AI response
    const { response, tokens } = await chat(
      profile.organization_id,
      message,
      messages || []
    )

    // Save assistant message
    await supabase.from('chat_messages').insert({
      conversation_id: convId,
      role: 'assistant',
      content: response,
      metadata: {
        tokens,
        model: 'claude-3-5-sonnet-20241022',
      },
    })

    // Log AI usage
    await supabase.rpc('log_ai_usage', {
      p_organization_id: profile.organization_id,
      p_user_id: user.id,
      p_operation: 'chat',
      p_tokens_input: tokens.input,
      p_tokens_output: tokens.output,
      p_model: 'claude-3-5-sonnet-20241022',
    })

    // Update conversation title (first message only)
    if (!conversation_id) {
      const title = message.slice(0, 50) + (message.length > 50 ? '...' : '')
      await supabase
        .from('chat_conversations')
        .update({ title })
        .eq('id', convId)
    }

    return NextResponse.json({
      conversation_id: convId,
      response,
      tokens,
    })
  } catch (error: any) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du traitement du message' },
      { status: 500 }
    )
  }
}
```

#### F. Composant Chat UI

```tsx
// src/components/chat/ChatAssistant.tsx
'use client'

import { useState } from 'react'
import { MessageCircle, X, Minimize2 } from 'lucide-react'
import ChatWindow from './ChatWindow'

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-brand-orange text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all hover:scale-110"
          aria-label="Ouvrir l'assistant IA"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 transition-all ${
            isMinimized
              ? 'bottom-6 right-6 w-80 h-16'
              : 'bottom-6 right-6 w-96 h-[600px] md:w-[450px]'
          }`}
        >
          {/* Header */}
          <div className="bg-brand-navy text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">Assistant IA</h3>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-blue-800 p-1 rounded"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-800 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          {!isMinimized && <ChatWindow />}
        </div>
      )}
    </>
  )
}
```

```tsx
// src/components/chat/ChatWindow.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Sparkles } from 'lucide-react'
import { SUGGESTED_QUESTIONS } from '@/lib/ai/chat-agent'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Bonjour! 👋 Je suis votre assistant IA StructureClerk. Posez-moi des questions sur vos projets, factures, clients ou finances!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim()
    if (!text || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversation_id: conversationId,
        }),
      })

      if (!response.ok) throw new Error('Erreur API')

      const data = await response.json()

      if (!conversationId) {
        setConversationId(data.conversation_id)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            "Désolé, une erreur s'est produite. Veuillez réessayer.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(600px-64px)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-brand-orange text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.role === 'assistant' && (
                <Sparkles className="w-4 h-4 inline mr-1 text-brand-orange" />
              )}
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString('fr-CA', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader2 className="w-5 h-5 animate-spin text-brand-orange" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions (show if no conversation yet) */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.slice(0, 3).map((question, i) => (
              <button
                key={i}
                onClick={() => handleSend(question)}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t p-4">
        <form
          onSubmit={e => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Posez votre question..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-brand-orange text-white p-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}
```

#### G. Intégration Dashboard

```tsx
// src/app/(dashboard)/layout.tsx
import ChatAssistant from '@/components/chat/ChatAssistant'

export default function DashboardLayout({ children }) {
  return (
    <div>
      {/* ... existing layout ... */}
      {children}

      {/* Add chat assistant to all dashboard pages */}
      <ChatAssistant />
    </div>
  )
}
```

---

### 1.3 Extraction Factures Automatique (1 semaine)

**Effort:** 🟡 Moyen (25-30h)
**Impact Différenciation:** 🔥🔥 HAUTE

#### A. Amélioration Extraction Factures

**Actuellement:** Extraction basique de champs (fournisseur, montant, date)
**Amélioration:** Pré-remplissage complet du formulaire de création de facture

#### B. Fichiers à Modifier/Créer

```
src/app/(dashboard)/invoices/
├── upload/
│   └── page.tsx                    # Page upload factures
└── [id]/
    └── review/page.tsx             # Review extraction avant save

src/app/api/invoices/
├── extract/route.ts                # Extraction + validation
└── create-from-extraction/route.ts # Créer facture depuis extraction

src/lib/ai/
└── invoice-extractor.ts            # Extracteur spécialisé factures

supabase/migrations/
└── 007_add_invoice_extraction.sql  # Table extraction_reviews
```

#### C. Prompt Claude Optimisé pour Factures

```typescript
// src/lib/ai/invoice-extractor.ts
import { callClaude, parseJSONResponse } from './client'

interface InvoiceExtraction {
  // Fournisseur
  supplier_name: string
  supplier_email?: string
  supplier_phone?: string
  supplier_address?: string

  // Facture
  invoice_number: string
  invoice_date: string // ISO format
  due_date?: string // ISO format

  // Montants
  subtotal: number
  tps_amount: number // 5%
  tvq_amount: number // 9.975%
  total: number

  // Items
  items: Array<{
    description: string
    quantity: number
    unit_price: number
    amount: number
  }>

  // Métadonnées
  payment_terms?: string
  notes?: string
  confidence: number // 0-1
}

const INVOICE_EXTRACTION_PROMPT = `Tu es un expert en extraction de données de factures québécoises.

# TÂCHE
Extrais TOUTES les informations de cette facture au format JSON.

# FORMAT DE SORTIE (JSON strict)
{
  "supplier_name": "Nom du fournisseur/émetteur",
  "supplier_email": "email@example.com ou null",
  "supplier_phone": "514-xxx-xxxx ou null",
  "supplier_address": "Adresse complète ou null",
  "invoice_number": "Numéro de facture",
  "invoice_date": "YYYY-MM-DD",
  "due_date": "YYYY-MM-DD ou null",
  "subtotal": 1000.00,
  "tps_amount": 50.00,
  "tvq_amount": 99.75,
  "total": 1149.75,
  "items": [
    {
      "description": "Description item",
      "quantity": 10,
      "unit_price": 100.00,
      "amount": 1000.00
    }
  ],
  "payment_terms": "Net 30 jours ou null",
  "notes": "Notes additionnelles ou null",
  "confidence": 0.95
}

# RÈGLES IMPORTANTES
1. **TPS = 5%** du subtotal (taxe fédérale)
2. **TVQ = 9.975%** du subtotal (taxe Québec)
3. Si taxes manquantes, calcule-les à partir du total
4. Si items manquants, crée UN item "Services" avec le subtotal
5. Dates au format ISO (YYYY-MM-DD)
6. Nombres avec 2 décimales
7. Si confiance < 0.7, marque les champs incertains avec "[?]"
8. Si fournisseur = organisation actuelle, c'est une ERREUR (c'est probablement un devis/soumission envoyé)

# VALIDATION
- total = subtotal + tps_amount + tvq_amount (±1$ tolérance)
- sum(items.amount) = subtotal (±1$ tolérance)
- invoice_number ne peut pas être vide
- invoice_date ne peut pas être vide
- supplier_name ne peut pas être vide

Réponds UNIQUEMENT avec le JSON, aucun texte avant/après.`

export async function extractInvoice(
  documentText: string,
  organizationName: string
): Promise<InvoiceExtraction> {
  const prompt = `${INVOICE_EXTRACTION_PROMPT}

# Organisation Actuelle
${organizationName}

# Texte de la Facture
${documentText}

JSON:`

  const response = await callClaude(prompt, {
    maxTokens: 2048,
    temperature: 0.1, // Low temperature for accuracy
  })

  const extraction = parseJSONResponse<InvoiceExtraction>(response)

  // Validation
  if (!extraction.invoice_number || !extraction.invoice_date || !extraction.supplier_name) {
    throw new Error('Extraction incomplète: champs obligatoires manquants')
  }

  // Check if supplier is same as organization (likely a quote, not invoice)
  if (extraction.supplier_name.toLowerCase().includes(organizationName.toLowerCase())) {
    throw new Error(
      'Le fournisseur semble être votre propre organisation. Ceci est probablement un devis/soumission que vous avez émis, pas une facture reçue.'
    )
  }

  // Validate math
  const calculatedTotal = extraction.subtotal + extraction.tps_amount + extraction.tvq_amount
  if (Math.abs(calculatedTotal - extraction.total) > 1) {
    console.warn('Total mismatch:', { calculatedTotal, extractedTotal: extraction.total })
  }

  return extraction
}
```

#### D. Page Upload Factures avec Drag & Drop

```tsx
// src/app/(dashboard)/invoices/upload/page.tsx
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'

export default function InvoiceUploadPage() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFile(droppedFile)
    }
  }, [])

  const handleFile = (file: File) => {
    // Validate file type
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      setError('Type de fichier non supporté. Utilisez PDF, PNG ou JPG.')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Fichier trop volumineux. Maximum 10MB.')
      return
    }

    setFile(file)
    setError(null)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsProcessing(true)
    setError(null)

    try {
      // Upload file
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/invoices/extract', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.error || 'Erreur lors de l\'upload')
      }

      const { extraction_id } = await uploadResponse.json()

      // Redirect to review page
      router.push(`/invoices/review/${extraction_id}`)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-navy mb-2">
          Importer une Facture
        </h1>
        <p className="text-gray-600">
          Uploadez une facture PDF ou image pour extraction automatique des données
        </p>
      </div>

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging
            ? 'border-brand-orange bg-orange-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <p className="font-semibold text-lg">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-sm text-brand-orange hover:underline"
            >
              Changer de fichier
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Glissez-déposez votre facture ici
            </p>
            <p className="text-sm text-gray-500 mb-4">
              ou
            </p>
            <label className="inline-block">
              <span className="px-6 py-3 bg-brand-orange text-white rounded-lg cursor-pointer hover:bg-orange-600 transition-colors">
                Choisir un fichier
              </span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFile(file)
                }}
              />
            </label>
            <p className="text-xs text-gray-400 mt-4">
              Formats supportés: PDF, PNG, JPG (max 10MB)
            </p>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Actions */}
      {file && !error && (
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={isProcessing}
          >
            Annuler
          </button>
          <button
            onClick={handleUpload}
            disabled={isProcessing}
            className="px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Extraction en cours...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Extraire les données
              </>
            )}
          </button>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-brand-navy mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Que fait l'extraction automatique?
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-brand-orange mt-1">✓</span>
            <span>Détecte le fournisseur (nom, email, téléphone, adresse)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-orange mt-1">✓</span>
            <span>Extrait le numéro de facture et les dates</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-orange mt-1">✓</span>
            <span>Calcule automatiquement TPS (5%) et TVQ (9.975%)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-orange mt-1">✓</span>
            <span>Liste tous les items avec quantités et prix</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-orange mt-1">✓</span>
            <span>Pré-remplit le formulaire pour validation rapide</span>
          </li>
        </ul>
        <p className="mt-4 text-xs text-gray-600">
          <strong>Note:</strong> Vous pourrez toujours modifier les données extraites avant de sauvegarder.
        </p>
      </div>
    </div>
  )
}
```

**Suite dans le prochain document...**

---

*Ce document fait 3000+ lignes. Je continue avec les phases 2-4 et les estimations de coûts dans un document séparé pour éviter la limite de tokens.*

Veux-tu que je continue avec:
1. Les autres features (Phase 2-4)
2. L'architecture complète des migrations SQL
3. Les estimations détaillées de coûts mensuels
4. Le plan de migration et de déploiement progressif?
