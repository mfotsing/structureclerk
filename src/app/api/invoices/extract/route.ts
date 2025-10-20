/**
 * Invoice Extraction API
 * POST /api/invoices/extract
 * Upload invoice file and extract data with AI
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractInvoiceData } from '@/lib/ai/invoice-extraction'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
]

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // =========================================================================
    // 1. Authentication & Authorization
    // =========================================================================
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

    // =========================================================================
    // 2. Parse Multipart Form Data
    // =========================================================================
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Fichier requis' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Fichier trop volumineux (max ${MAX_FILE_SIZE / 1024 / 1024} MB)` },
        { status: 400 }
      )
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Type de fichier non supporté. Types acceptés: PDF, JPEG, PNG, WEBP, DOCX`,
          allowed_types: ALLOWED_MIME_TYPES,
        },
        { status: 400 }
      )
    }

    console.log(`[Extract API] Processing ${file.name} (${file.type}, ${file.size} bytes)`)

    // =========================================================================
    // 3. Create Extraction Job
    // =========================================================================
    const { data: job, error: jobError } = await supabase
      .from('extraction_jobs')
      .insert({
        organization_id: profile.organization_id,
        user_id: user.id,
        job_type: 'invoice',
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        status: 'pending',
      })
      .select()
      .single()

    if (jobError || !job) {
      console.error('[Extract API] Job creation error:', jobError)
      return NextResponse.json(
        { error: 'Erreur création job extraction' },
        { status: 500 }
      )
    }

    console.log(`[Extract API] Created job ${job.id}`)

    // =========================================================================
    // 4. Upload File to Supabase Storage (Optional - for audit trail)
    // =========================================================================
    let storagePath: string | null = null

    try {
      const fileBuffer = await file.arrayBuffer()
      const fileName = `${profile.organization_id}/${job.id}/${file.name}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, fileBuffer, {
          contentType: file.type,
          upsert: false,
        })

      if (!uploadError && uploadData) {
        storagePath = uploadData.path
        console.log(`[Extract API] Uploaded to storage: ${storagePath}`)

        // Update job with storage path
        await supabase
          .from('extraction_jobs')
          .update({ storage_path: storagePath })
          .eq('id', job.id)
      }
    } catch (uploadError) {
      console.warn('[Extract API] Storage upload failed (non-critical):', uploadError)
    }

    // =========================================================================
    // 5. Update Job Status to Processing
    // =========================================================================
    await supabase.rpc('update_extraction_job_status', {
      p_job_id: job.id,
      p_status: 'processing',
    })

    // =========================================================================
    // 6. Extract Invoice Data with AI
    // =========================================================================
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const extractionResult = await extractInvoiceData(fileBuffer, file.name, file.type)

    console.log(
      `[Extract API] Extraction ${extractionResult.success ? 'SUCCESS' : 'FAILED'} (${extractionResult.processing_time_ms}ms)`
    )

    // =========================================================================
    // 7. Handle Extraction Failure
    // =========================================================================
    if (!extractionResult.success || !extractionResult.data) {
      await supabase.rpc('update_extraction_job_status', {
        p_job_id: job.id,
        p_status: 'failed',
        p_error_message: extractionResult.error || 'Extraction failed',
        p_tokens_used: {
          input: extractionResult.tokens.input,
          output: extractionResult.tokens.output,
        },
        p_processing_time_ms: extractionResult.processing_time_ms,
      })

      return NextResponse.json(
        {
          success: false,
          job_id: job.id,
          error: extractionResult.error,
          processing_time_ms: Date.now() - startTime,
        },
        { status: 422 }
      )
    }

    // =========================================================================
    // 8. Save Extracted Data
    // =========================================================================
    const extractedData = extractionResult.data

    const { data: extractedInvoice, error: extractedError } = await supabase
      .from('extracted_invoices')
      .insert({
        extraction_job_id: job.id,
        organization_id: profile.organization_id,
        user_id: user.id,

        // Invoice info
        invoice_number: extractedData.invoice_number,
        invoice_date: extractedData.invoice_date,
        due_date: extractedData.due_date,

        // Vendor
        vendor_name: extractedData.vendor_name,
        vendor_email: extractedData.vendor_email,
        vendor_phone: extractedData.vendor_phone,
        vendor_address: extractedData.vendor_address,
        vendor_tps: extractedData.vendor_tps,
        vendor_tvq: extractedData.vendor_tvq,

        // Customer
        customer_name: extractedData.customer_name,
        customer_email: extractedData.customer_email,
        customer_phone: extractedData.customer_phone,

        // Financial
        subtotal: extractedData.subtotal,
        tps_amount: extractedData.tps_amount,
        tvq_amount: extractedData.tvq_amount,
        total: extractedData.total,

        // Items
        line_items: extractedData.line_items,

        // Payment
        payment_terms: extractedData.payment_terms,
        payment_method: extractedData.payment_method,
        notes: extractedData.notes,

        // Confidence
        confidence_score: extractedData.confidence_score,
        field_confidence: extractedData.field_confidence,
        needs_review: extractedData.confidence_score < 0.85, // Auto-flag low confidence
      })
      .select()
      .single()

    if (extractedError || !extractedInvoice) {
      console.error('[Extract API] Error saving extracted invoice:', extractedError)
      await supabase.rpc('update_extraction_job_status', {
        p_job_id: job.id,
        p_status: 'failed',
        p_error_message: 'Failed to save extracted data',
      })

      return NextResponse.json(
        { error: 'Erreur sauvegarde données extraites' },
        { status: 500 }
      )
    }

    // =========================================================================
    // 9. Update Job Status to Completed
    // =========================================================================
    await supabase.rpc('update_extraction_job_status', {
      p_job_id: job.id,
      p_status: 'completed',
      p_extracted_data: extractedData,
      p_confidence_score: extractedData.confidence_score,
      p_tokens_used: {
        input: extractionResult.tokens.input,
        output: extractionResult.tokens.output,
      },
      p_processing_time_ms: extractionResult.processing_time_ms,
    })

    // =========================================================================
    // 10. Log AI Usage
    // =========================================================================
    await supabase.rpc('log_ai_usage', {
      p_organization_id: profile.organization_id,
      p_user_id: user.id,
      p_operation: 'invoice_extraction',
      p_tokens_input: extractionResult.tokens.input,
      p_tokens_output: extractionResult.tokens.output,
      p_model: 'claude-3-5-sonnet-20241022',
    })

    // =========================================================================
    // 11. Log Activity
    // =========================================================================
    await supabase.from('activities').insert({
      organization_id: profile.organization_id,
      user_id: user.id,
      action: 'invoice_extracted',
      description: `Facture extraite: ${extractedData.invoice_number || file.name} (confiance: ${Math.round(extractedData.confidence_score * 100)}%)`,
      metadata: {
        job_id: job.id,
        extracted_invoice_id: extractedInvoice.id,
        confidence_score: extractedData.confidence_score,
        file_name: file.name,
      },
    })

    // =========================================================================
    // 12. Return Success Response
    // =========================================================================
    const totalTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      job_id: job.id,
      extracted_invoice_id: extractedInvoice.id,
      extracted_data: extractedData,
      confidence_score: extractedData.confidence_score,
      needs_review: extractedInvoice.needs_review,
      tokens: extractionResult.tokens,
      processing_time_ms: totalTime,
      message:
        extractedData.confidence_score >= 0.85
          ? 'Extraction réussie avec haute confiance'
          : 'Extraction réussie - Révision recommandée',
    })
  } catch (error: any) {
    console.error('[Extract API] Unexpected error:', error)
    return NextResponse.json(
      {
        error: 'Erreur serveur lors de l\'extraction',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
