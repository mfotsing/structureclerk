import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const {
      fullName,
      email,
      phone,
      companySize,
      answers,
      score,
      category,
      completedAt
    } = await request.json()

    // Validation
    if (!fullName || !email || !score || !category) {
      return NextResponse.json(
        { error: 'Données manquantes requises' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get IP for tracking
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

    // Sanitize inputs to prevent XSS
    const sanitizeInput = (input: string): string => {
      return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .trim()
    }

    const sanitizedName = sanitizeInput(fullName)
    const sanitizedPhone = phone ? sanitizeInput(phone) : null
    const sanitizedCompanySize = companySize ? sanitizeInput(companySize) : null

    // Save scorecard data to database
    const { data, error } = await supabase
      .from('scorecard_submissions')
      .insert({
        full_name: sanitizedName,
        email,
        phone: sanitizedPhone,
        company_size: sanitizedCompanySize,
        answers,
        score,
        category,
        completed_at: completedAt || new Date().toISOString(),
        ip_address: ip,
        user_agent: request.headers.get('user-agent') || null,
        referrer: request.headers.get('referer') || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving scorecard submission:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde des données' },
        { status: 500 }
      )
    }

    // Determine lead qualification based on score and admin time
    let leadQualification = 'cold'
    if (answers.adminTime) {
      if (answers.adminTime.includes('plus de 20 heures')) {
        leadQualification = 'hot'
      } else if (answers.adminTime.includes('10-20 heures')) {
        leadQualification = 'warm'
      } else if (answers.adminTime.includes('5-10 heures')) {
        leadQualification = 'medium'
      }
    }

    // Update lead status in existing system if user exists
    if (data) {
      await supabase
        .from('lead_tracking')
        .upsert({
          email,
          last_scorecard_id: data.id,
          qualification: leadQualification,
          last_interaction: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        })
    }

    // Send notification email (optional)
    try {
      // Vous pouvez intégrer Resend ici pour envoyer une notification
      console.log('Scorecard submission saved:', {
        id: data.id,
        email,
        score,
        category,
        qualification: leadQualification
      })
    } catch (emailError) {
      console.error('Error sending notification:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      submissionId: data.id,
      qualification: leadQualification,
      message: 'Scorecard enregistré avec succès'
    })

  } catch (error: any) {
    console.error('Scorecard submission error:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')

    let query = supabase
      .from('scorecard_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching scorecard submissions:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des données' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data,
      total: count || 0,
      limit,
      offset
    })

  } catch (error: any) {
    console.error('Scorecard fetch error:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}