import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get authenticated user (optional - contact form works for anonymous users too)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Log contact form submission in database for tracking
    const { error: dbError } = await supabase.from('contact_submissions').insert({
      user_id: user?.id || null,
      name,
      email,
      subject,
      message,
      created_at: new Date().toISOString(),
    })

    if (dbError) {
      console.error('Error logging contact submission:', dbError)
      // Don't fail the request if logging fails
    }

    // Send email using Supabase Edge Function or external service
    // For now, we'll use a simple approach with SendGrid/Resend/Nodemailer
    // You'll need to configure this based on your email service

    // Since we don't have email service configured yet, we'll just return success
    // In production, you would integrate with SendGrid, Resend, or AWS SES here

    // Example with fetch to an email service:
    /*
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: 'info@structureclerk.ca' }],
          subject: `[Contact Form] ${subject}`,
        }],
        from: { email: 'noreply@structureclerk.ca' },
        content: [{
          type: 'text/plain',
          value: `
Nouveau message de contact

Nom: ${name}
Email: ${email}
Sujet: ${subject}

Message:
${message}
          `.trim()
        }]
      })
    })
    */

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
