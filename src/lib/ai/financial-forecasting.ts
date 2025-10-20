import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface FinancialForecast {
  current_month: {
    revenue: number
    expenses: number
    net_cashflow: number
  }
  forecasts: {
    '30_days': {
      revenue: number
      expenses: number
      net_cashflow: number
      confidence: number
    }
    '60_days': {
      revenue: number
      expenses: number
      net_cashflow: number
      confidence: number
    }
    '90_days': {
      revenue: number
      expenses: number
      net_cashflow: number
      confidence: number
    }
  }
  insights: string[]
  alerts: Array<{
    type: 'warning' | 'danger' | 'info'
    message: string
  }>
  recommendations: string[]
}

const FORECASTING_PROMPT = `Tu es un expert en analyse financière pour entreprises de construction au Québec.

# TÂCHE
Analyse l'historique financier fourni et génère des prévisions de trésorerie pour 30, 60 et 90 jours.

# CONTEXTE
- Secteur: Construction au Québec
- Taxes: TPS 5% + TVQ 9.975%
- Saisonnalité: Construction ralentit en hiver (nov-mars)

# ANALYSE REQUISE
1. **Tendances**: Identifier patterns dans revenus/dépenses
2. **Saisonnalité**: Ajuster pour la saison actuelle
3. **Anomalies**: Détecter dépenses inhabituelles
4. **Risques**: Identifier risques de trésorerie
5. **Opportunités**: Suggérer optimisations

# FORMAT DE SORTIE (JSON)
{
  "current_month": {
    "revenue": 50000,
    "expenses": 35000,
    "net_cashflow": 15000
  },
  "forecasts": {
    "30_days": {
      "revenue": 52000,
      "expenses": 36000,
      "net_cashflow": 16000,
      "confidence": 0.85
    },
    "60_days": {
      "revenue": 54000,
      "expenses": 37000,
      "net_cashflow": 17000,
      "confidence": 0.70
    },
    "90_days": {
      "revenue": 56000,
      "expenses": 38000,
      "net_cashflow": 18000,
      "confidence": 0.55
    }
  },
  "insights": [
    "Revenus en croissance de 15% vs mois précédent",
    "Dépenses matériaux en hausse de 20% (attention)",
    "Factures impayées: 3 clients, total 12,500$"
  ],
  "alerts": [
    {
      "type": "warning",
      "message": "3 factures en retard (12,500$) - Relancer clients"
    },
    {
      "type": "danger",
      "message": "Trésorerie négative prévue dans 60 jours sans action"
    }
  ],
  "recommendations": [
    "Relancer les 3 clients avec factures en retard",
    "Négocier délais paiement fournisseur X",
    "Réduire achats matériaux de 10% si possible"
  ]
}

# RÈGLES
- Confidence diminue avec le temps (30j=0.85, 60j=0.70, 90j=0.55)
- Ajuster pour saisonnalité (hiver = -20% revenus construction)
- Alerts: warning si cashflow < 10k, danger si < 0
- Recommendations: max 5, actionnables
- Insights: max 10, basés sur données réelles

Réponds UNIQUEMENT avec le JSON, aucun texte avant/après.`

/**
 * Get season for seasonal adjustment
 */
function getSeason(date: Date): string {
  const month = date.getMonth() + 1 // 1-12
  if (month >= 11 || month <= 3) return 'Hiver (construction ralentie)'
  if (month >= 4 && month <= 6) return 'Printemps (reprise)'
  if (month >= 7 && month <= 9) return 'Été (pic activité)'
  return 'Automne (haute saison)'
}

/**
 * Generate financial forecast using AI
 */
export async function generateFinancialForecast(
  organizationId: string
): Promise<FinancialForecast> {
  const supabase = await createClient()

  // Get historical data (last 12 months)
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

  // Revenue (paid invoices)
  const { data: invoices } = await supabase
    .from('invoices')
    .select('total, paid_date, issue_date, status, due_date, client_id')
    .eq('organization_id', organizationId)
    .gte('issue_date', twelveMonthsAgo.toISOString())
    .order('issue_date', { ascending: true })

  // Calculate monthly revenue
  const monthlyRevenue: Record<string, number> = {}
  invoices
    ?.filter(i => i.status === 'paid' && i.paid_date)
    .forEach((inv: any) => {
      const month = new Date(inv.paid_date).toISOString().slice(0, 7) // YYYY-MM
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + inv.total
    })

  // Unpaid invoices
  const unpaidInvoices = invoices?.filter(i =>
    ['sent', 'overdue'].includes(i.status)
  ) || []

  // Expenses (documents marked as invoices from suppliers)
  const { data: supplierInvoices } = await supabase
    .from('documents')
    .select('ai_metadata, created_at')
    .eq('organization_id', organizationId)
    .eq('type_detecte', 'facture')
    .gte('created_at', twelveMonthsAgo.toISOString())

  const monthlyExpenses: Record<string, number> = {}
  supplierInvoices?.forEach((doc: any) => {
    const metadata = doc.ai_metadata as any
    if (metadata?.montant) {
      const month = new Date(doc.created_at).toISOString().slice(0, 7)
      monthlyExpenses[month] = (monthlyExpenses[month] || 0) + metadata.montant
    }
  })

  // Current month
  const currentMonth = new Date().toISOString().slice(0, 7)
  const currentRevenue = monthlyRevenue[currentMonth] || 0
  const currentExpenses = monthlyExpenses[currentMonth] || 0

  // Build context for Claude
  const context = `
# Données Financières - 12 Derniers Mois

## Revenus Mensuels
${Object.entries(monthlyRevenue)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([month, revenue]) => `- ${month}: ${revenue.toFixed(2)} CAD`)
  .join('\n') || '- Aucune donnée'}

## Dépenses Mensuelles
${Object.entries(monthlyExpenses)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([month, expenses]) => `- ${month}: ${expenses.toFixed(2)} CAD`)
  .join('\n') || '- Aucune donnée'}

## Mois Actuel (${currentMonth})
- Revenus: ${currentRevenue.toFixed(2)} CAD
- Dépenses: ${currentExpenses.toFixed(2)} CAD
- Cashflow Net: ${(currentRevenue - currentExpenses).toFixed(2)} CAD

## Factures Impayées
- Nombre: ${unpaidInvoices.length}
- Total: ${unpaidInvoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(2)} CAD
- Plus ancienne: ${unpaidInvoices[0]?.due_date || 'N/A'}

## Contexte Temporel
- Date actuelle: ${new Date().toISOString().slice(0, 10)}
- Saison: ${getSeason(new Date())}
  `.trim()

  const prompt = `${FORECASTING_PROMPT}

${context}

JSON:`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: FORECASTING_PROMPT,
      messages: [
        {
          role: 'user',
          content: context,
        },
      ],
    })

    const responseText = response.content[0].type === 'text'
      ? response.content[0].text
      : ''

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from response')
    }

    const forecast: FinancialForecast = JSON.parse(jsonMatch[0])

    // Log AI usage
    await supabase.rpc('log_ai_usage', {
      p_organization_id: organizationId,
      p_user_id: null, // System-level operation
      p_operation: 'financial_forecast',
      p_tokens_input: response.usage.input_tokens,
      p_tokens_output: response.usage.output_tokens,
      p_model: 'claude-3-5-sonnet-20241022',
    })

    return forecast
  } catch (error) {
    console.error('Financial forecasting error:', error)
    throw new Error('Failed to generate financial forecast')
  }
}
