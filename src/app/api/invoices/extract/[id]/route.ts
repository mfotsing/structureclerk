/**
 * API: Get and Update Extracted Invoice
 * GET /api/invoices/extract/[id] - Get extraction details
 * PATCH /api/invoices/extract/[id] - Update extraction data
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
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

    // Get extracted invoice
    const { data: extractedInvoice, error } = await supabase
      .from('extracted_invoices')
      .select('*')
      .eq('id', id)
      .eq('organization_id', profile.organization_id)
      .single()

    if (error || !extractedInvoice) {
      return NextResponse.json({ error: 'Extraction introuvable' }, { status: 404 })
    }

    return NextResponse.json({ extracted_invoice: extractedInvoice })
  } catch (error: any) {
    console.error('[GET Extract] Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

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

    // Update extracted invoice
    const { data: updated, error } = await supabase
      .from('extracted_invoices')
      .update({
        invoice_number: body.invoice_number,
        invoice_date: body.invoice_date,
        due_date: body.due_date,
        vendor_name: body.vendor_name,
        vendor_email: body.vendor_email,
        vendor_phone: body.vendor_phone,
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone,
        subtotal: body.subtotal,
        tps_amount: body.tps_amount,
        tvq_amount: body.tvq_amount,
        total: body.total,
        payment_terms: body.payment_terms,
        notes: body.notes,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq('id', id)
      .eq('organization_id', profile.organization_id)
      .select()
      .single()

    if (error || !updated) {
      console.error('[PATCH Extract] Error:', error)
      return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 })
    }

    // Log activity
    await supabase.from('activities').insert({
      organization_id: profile.organization_id,
      user_id: user.id,
      action: 'invoice_extraction_updated',
      description: `Extraction facture révisée: ${body.invoice_number || id}`,
      metadata: { extracted_invoice_id: id },
    })

    return NextResponse.json({ extracted_invoice: updated })
  } catch (error: any) {
    console.error('[PATCH Extract] Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
