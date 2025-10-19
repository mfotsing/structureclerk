# 🤖 StructureClerk - Fonctionnalités IA

Documentation complète des fonctionnalités d'intelligence artificielle intégrées à StructureClerk.

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture IA](#architecture-ia)
3. [Fonctionnalités](#fonctionnalités)
4. [API Endpoints](#api-endpoints)
5. [Utilisation](#utilisation)
6. [Coûts et Optimisations](#coûts-et-optimisations)
7. [Configuration](#configuration)

---

## Vue d'ensemble

StructureClerk utilise **Anthropic Claude 3.5 Sonnet** pour offrir des fonctionnalités d'IA de pointe adaptées au secteur de la construction au Québec.

### Caractéristiques principales

- ✅ **Upload universel** - PDF, DOCX, images (OCR), texte
- ✅ **Analyse automatique** - Classification et extraction de données
- ✅ **Résumés intelligents** - Contrats, rapports, documents complexes
- ✅ **Génération de réponses** - Appels d'offres professionnels
- ✅ **Création de documents** - Contrats, factures, devis
- ✅ **Optimisation des coûts** - Caching sémantique et chunking
- ✅ **Québec-friendly** - TPS/TVQ, français québécois, secteur construction

---

## Architecture IA

### Structure des modules

```
src/lib/ai/
├── client.ts              # Client Anthropic avec caching
├── document-processor.ts  # Extraction de texte (PDF, DOCX, OCR)
└── services.ts            # Services IA métier
```

### Flux de traitement

```
┌─────────────────┐
│  Upload Fichier │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Extraction     │  ← pdf-parse, mammoth, tesseract.js
│  Texte          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Classification │  ← Claude 3.5 Sonnet
│  (Type de doc)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Extraction     │  ← Claude 3.5 Sonnet
│  Champs         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Résumé (opt.)  │  ← Claude 3.5 Sonnet
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Sauvegarde DB  │
└─────────────────┘
```

---

## Fonctionnalités

### 1. Upload et Analyse Automatique

#### Formats supportés

- **PDF** - Extraction avec `pdf-parse`
- **DOCX** - Extraction avec `mammoth`
- **Images** (PNG, JPG) - OCR avec `tesseract.js` (français + anglais)
- **Texte** - UTF-8

#### Types de documents détectés

- **Contrat** - Accords, obligations, durée
- **Facture** - Montants, TPS/TVQ, items
- **Devis/Soumission** - Estimation, items, délais
- **Appel d'offres** - Exigences, critères
- **Licence** - Permis RBQ, certificats
- **Autre** - Non classifié

#### Exemple d'utilisation

```typescript
// Frontend - Upload
const formData = new FormData()
formData.append('file', file)
formData.append('project_id', projectId)

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
})

const result = await response.json()
// {
//   success: true,
//   document: { id, name, type_detecte, ai_summary, ai_metadata },
//   analysis: { classification, extraction, summary }
// }
```

### 2. Classification de Documents

Détecte automatiquement le type de document avec un score de confiance.

```json
{
  "type_document": "facture",
  "confidence": 0.95,
  "champs_cles": {
    "fournisseur": "Construction ABC",
    "montant_total": 15000,
    "tps": 750,
    "tvq": 1496.25
  }
}
```

### 3. Extraction de Champs

#### Pour une facture québécoise

```json
{
  "fields": {
    "fournisseur": "Construction XYZ Inc.",
    "numero_facture": "INV-2025-001",
    "date_facture": "2025-01-15",
    "montant_ht": 10000.00,
    "tps": 500.00,
    "tvq": 997.50,
    "total_ttc": 11497.50,
    "client": "Ville de Montréal",
    "items": [
      {
        "description": "Main d'oeuvre",
        "quantite": 40,
        "prix_unitaire": 75.00,
        "total": 3000.00
      }
    ]
  },
  "confidence": 0.92
}
```

#### Pour un contrat

```json
{
  "fields": {
    "partie_a": "Entreprise ABC",
    "partie_b": "Client XYZ",
    "objet": "Construction d'un immeuble résidentiel",
    "date_debut": "2025-02-01",
    "date_fin": "2025-12-31",
    "montant_total": 500000.00,
    "garanties": ["Garantie légale 1 an", "Garantie matériaux 5 ans"],
    "obligations_principales": [
      "Livraison conforme aux plans",
      "Respect des délais"
    ]
  }
}
```

### 4. Résumé de Contrats

Génère un résumé structuré en 6-10 phrases maximum.

```json
{
  "summary": "Contrat de construction entre ABC et XYZ pour la réalisation d'un immeuble résidentiel. Durée: 11 mois (févr-déc 2025). Montant total: 500 000$. Paiements échelonnés selon l'avancement. Garanties standard incluses.",
  "parties": ["Entreprise ABC", "Client XYZ"],
  "duree": "11 mois",
  "montants": ["500 000$ total", "Échelonné selon avancement"],
  "clauses_risque": [
    "Pénalités de retard: 500$/jour",
    "Résiliation possible en cas de force majeure"
  ]
}
```

### 5. Génération de Réponses aux Appels d'Offres

Crée une réponse professionnelle structurée.

#### Input

```typescript
{
  document_id: "uuid-du-document-appel-offres",
  project_id: "uuid-du-projet",
  company_profile: {
    name: "Construction Pro Inc.",
    specialties: ["Résidentiel", "Commercial", "Rénovation"],
    experience_years: 15,
    recent_projects: ["Projet A", "Projet B"]
  }
}
```

#### Output

```
# Réponse à l'Appel d'Offres - [Titre]

## 1. Résumé des exigences
- Exigence 1
- Exigence 2
- ...

## 2. Présentation de l'entreprise
Construction Pro Inc. est une entreprise spécialisée dans...

## 3. Approche et méthodologie
Notre approche pour ce projet consiste à...

## 4. Livrables proposés
- Livrable 1
- Livrable 2

## 5. Planning sommaire
Phase 1: ...
Phase 2: ...

## 6. Ressources mobilisées
Équipe de 10 personnes...

## 7. Pièces justificatives à joindre
- Licence RBQ
- Attestation d'assurance
- ...
```

### 6. Génération de Documents

Crée des documents à partir de templates et de données.

#### Exemple: Facture

```typescript
POST /api/documents/generate
{
  "template_type": "facture",
  "data": {
    "numero": "FAC-2025-001",
    "client": "Client ABC",
    "date": "2025-01-20",
    "items": [
      { "description": "Item 1", "quantite": 10, "prix": 100 }
    ]
  },
  "save_to_storage": true,
  "project_id": "uuid"
}
```

---

## API Endpoints

### Upload et Analyse

#### `POST /api/upload`

Upload universel avec analyse IA automatique.

**Body (multipart/form-data):**
- `file`: File (PDF, DOCX, image, texte)
- `project_id` (optionnel): UUID
- `client_id` (optionnel): UUID

**Response:**
```json
{
  "success": true,
  "job_id": "uuid",
  "document": {
    "id": "uuid",
    "name": "contrat.pdf",
    "type_detecte": "contrat",
    "ai_confidence": 0.95,
    "ai_summary": "Résumé...",
    "ai_metadata": {}
  },
  "analysis": {
    "classification": {},
    "extraction": {},
    "summary": {}
  }
}
```

#### `GET /api/upload?job_id=xxx`

Récupère le statut d'un job d'upload.

**Response:**
```json
{
  "job_id": "uuid",
  "status": "completed",
  "stage": "completed",
  "progress": 100,
  "document_id": "uuid"
}
```

### Résumé

#### `POST /api/documents/[id]/summarize`

Génère un résumé intelligent d'un document.

**Body (optionnel):**
```json
{
  "force": false  // Force re-génération même si résumé existe
}
```

**Response:**
```json
{
  "success": true,
  "cached": false,
  "summary": {
    "summary": "Résumé...",
    "parties": [],
    "duree": "...",
    "montants": [],
    "clauses_risque": []
  },
  "tokens_used": 1234,
  "execution_time_ms": 2500
}
```

### Appels d'Offres

#### `POST /api/tender-responses/generate`

Génère une réponse professionnelle à un appel d'offres.

**Body:**
```json
{
  "document_id": "uuid",
  "project_id": "uuid",
  "company_profile": {
    "name": "Entreprise",
    "specialties": ["..."],
    "experience_years": 10,
    "recent_projects": ["..."]
  }
}
```

**Response:**
```json
{
  "success": true,
  "tender_response": {
    "id": "uuid",
    "title": "Réponse - ...",
    "generated_content": "...",
    "status": "draft"
  },
  "tokens_used": 3456,
  "execution_time_ms": 5000
}
```

### Génération de Documents

#### `POST /api/documents/generate`

Génère un document à partir d'un template.

**Body:**
```json
{
  "template_type": "contrat | facture | devis",
  "data": {},
  "save_to_storage": true,
  "project_id": "uuid",
  "client_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "document_id": "uuid",
  "content": "...",
  "template_type": "contrat",
  "tokens_used": 2000
}
```

### Export de Données

#### `POST /api/export`

Exporte toutes les données de l'utilisateur (RGPD).

**Body:**
```json
{
  "export_type": "full_backup | documents_only | invoices_only | data_only"
}
```

**Response:**
```json
{
  "success": true,
  "export_job_id": "uuid",
  "download_url": "https://...",
  "expires_at": "2025-01-21T10:00:00Z",
  "file_size": 1234567,
  "stats": {
    "clients": 10,
    "projects": 5,
    "invoices": 20
  }
}
```

#### `GET /api/export?job_id=xxx`

Récupère le statut d'un export.

### Suppression de Compte

#### `DELETE /api/account/delete`

Supprime le compte et toutes les données (RGPD).

**Body:**
```json
{
  "reason": "...",
  "export_data_first": true,
  "confirm_email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Compte supprimé",
  "stats": {},
  "export_job_id": "uuid"
}
```

---

## Coûts et Optimisations

### Modèle utilisé

**Claude 3.5 Sonnet (claude-3-5-sonnet-20241022)**
- Input: ~$3.00 / 1M tokens
- Output: ~$15.00 / 1M tokens

### Optimisations implémentées

#### 1. Caching sémantique

Cache les réponses pendant 1 heure pour éviter les appels redondants.

```typescript
// Automatique dans le client
const result = await callClaude(prompt, text, { useCache: true })
```

#### 2. Chunking intelligent

Pour les documents > 8000 caractères, découpe en chunks et résume par parties.

```typescript
// src/lib/ai/client.ts:185
export async function summarizeLongText(text: string, maxChunkSize = 8000)
```

#### 3. Limites de tokens

Chaque opération a un `maxTokens` optimisé:
- Classification: 1000 tokens
- Extraction facture: 2000 tokens
- Résumé contrat: 1500 tokens
- Génération document: 3000 tokens

#### 4. Logging et monitoring

Tous les appels IA sont loggés dans `ai_usage_logs`:

```sql
SELECT
  operation,
  COUNT(*) as calls,
  SUM(tokens_total) as total_tokens,
  SUM(cost_estimate) as total_cost
FROM ai_usage_logs
WHERE organization_id = 'xxx'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY operation;
```

### Estimation de coûts

**Scénario typique (1 mois):**
- 100 documents uploadés → 300K tokens (~$5)
- 20 résumés de contrats → 100K tokens (~$2)
- 5 réponses appels d'offres → 50K tokens (~$1)
- **Total estimé: ~$8-10 / mois / utilisateur**

---

## Configuration

### Variables d'environnement

```env
# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

### Abonnement

- **Essai gratuit**: 30 jours automatique
- **Plan Pro**: 99$ CAD / mois
- **Limite de tokens**: 1M / mois (configurable)

### Base de données

Migration automatique via:

```bash
# Supabase CLI
supabase db push

# Ou appliquer manuellement
psql -f supabase/migrations/002_add_ai_features.sql
```

---

## Sécurité et Conformité

### RGPD

- ✅ Export complet des données
- ✅ Suppression complète du compte
- ✅ Audit trail des suppressions
- ✅ Consentement explicite

### Multi-tenant

- Isolation par `organization_id`
- Row Level Security (RLS) sur toutes les tables
- Vérification de l'abonnement à chaque requête

### Validation

- Vérification des types MIME
- Limite de taille: 50MB par fichier
- Sanitisation du texte extrait
- Rate limiting (à implémenter)

---

## Support

Pour toute question sur les fonctionnalités IA:

- 📧 Email: support@structureclerk.ca
- 📖 Documentation: https://structureclerk.ca/docs
- 🐛 Issues: https://github.com/mfotsing/structureclerk/issues

---

**🏗️ Fait avec ❤️ pour les entrepreneurs en construction du Québec**
