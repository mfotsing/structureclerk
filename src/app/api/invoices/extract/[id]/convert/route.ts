/**
 * API: Convert Extracted Invoice to Actual Invoice
 * POST /api/invoices/extract/[id]/convert
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id) {
      return NextResponse.json({ error: 'Organisation introuvable' }, { status: 404 })
    }

    // Check if extraction exists and belongs to org
    const { data: extraction } = await supabase
      .from('extracted_invoices')
      .select('*')
      .eq('id', id)
      .eq('organization_id', profile.organization_id)
      .single()

    if (!extraction) {
      return NextResponse.json({ error: 'Extraction introuvable' }, { status: 404 })
    }

    // Check if already converted
    if (extraction.converted_to_invoice_id) {
      return NextResponse.json(
        {
          error: 'Cette extraction a déjà été convertie en facture',
          invoice_id: extraction.converted_to_invoice_id,
        },
        { status: 400 }
      )
    }

    // Call database function to convert
    const { data: result, error: convertError } = await supabase.rpc(
      'convert_extracted_invoice_to_invoice',
      {
        p_extracted_invoice_id: id,
      }
    )

    if (convertError) {
      console.error('[Convert] Error:', convertError)
      return NextResponse.json(
        { error: 'Erreur lors de la conversion' },
        { status: 500 }
      )
    }

    const invoiceId = result as string

    return NextResponse.json({
      success: true,
      invoice_id: invoiceId,
      message: 'Facture créée avec succès depuis extraction',
    })
  } catch (error: any) {
    console.error('[Convert] Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
