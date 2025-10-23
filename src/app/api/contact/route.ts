import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

    const { name, email, subject, message } = await request.json()

    // Enhanced validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Length validation
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: 'Le nom doit contenir entre 2 et 100 caractères' },
        { status: 400 }
      )
    }

    if (subject.length < 5 || subject.length > 200) {
      return NextResponse.json(
        { error: 'Le sujet doit contenir entre 5 et 200 caractères' },
        { status: 400 }
      )
    }

    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        { error: 'Le message doit contenir entre 10 et 2000 caractères' },
        { status: 400 }
      )
    }

    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      )
    }

    // XSS sanitization - escape HTML in text fields
    const sanitizeInput = (input: string): string => {
      return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .trim()
    }

    const sanitizedName = sanitizeInput(name)
    const sanitizedSubject = sanitizeInput(subject)
    const sanitizedMessage = sanitizeInput(message)

    const supabase = await createClient()

    // Get authenticated user (optional - contact form works for anonymous users too)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Log contact form submission in database for tracking
    const { error: dbError } = await supabase.from('contact_submissions').insert({
      user_id: user?.id || null,
      name: sanitizedName,
      email,
      subject: sanitizedSubject,
      message: sanitizedMessage,
      created_at: new Date().toISOString(),
    })

    if (dbError) {
      console.error('Error logging contact submission:', dbError)
      // Don't fail the request if logging fails
    }

    // Send email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY)

    try {
      await resend.emails.send({
        from: 'noreply@structureclerk.ca',
        to: 'info@structureclerk.ca',
        subject: `[Contact Form] ${sanitizedSubject}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0F3B5F; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
    .field { margin-bottom: 20px; }
    .label { font-weight: bold; color: #0F3B5F; }
    .value { margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid #F59E0B; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #64748B; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📧 Nouveau message de contact - StructureClerk</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">👤 Nom :</div>
        <div class="value">${sanitizedName}</div>
      </div>
      <div class="field">
        <div class="label">📧 Email :</div>
        <div class="value"><a href="mailto:${email}">${email}</a></div>
      </div>
      <div class="field">
        <div class="label">📌 Sujet :</div>
        <div class="value">${sanitizedSubject}</div>
      </div>
      <div class="field">
        <div class="label">💬 Message :</div>
        <div class="value">${sanitizedMessage.replace(/\n/g, '<br>')}</div>
      </div>
      <p style="margin-top: 30px; padding: 15px; background-color: #FEF3C7; border-left: 3px solid #F59E0B;">
        <strong>💡 Action requise :</strong> Répondez directement à <a href="mailto:${email}">${email}</a>
      </p>
    </div>
    <div class="footer">
      © 2025 StructureClerk • Propulsé par <a href="https://techvibes.ca">Techvibes</a>
    </div>
  </div>
</body>
</html>
        `.trim(),
      })
    } catch (emailError: any) {
      console.error('Error sending email with Resend:', emailError)
      // Don't fail the request if email fails - at least we logged it in the database
      return NextResponse.json({
        success: true,
        message:
          'Message enregistré avec succès. Nous vous répondrons sous peu.',
        warning: 'Email delivery may be delayed',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Message envoyé avec succès. Nous vous répondrons sous peu.',
    })
  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
