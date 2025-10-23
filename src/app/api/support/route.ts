import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message, type } = body

    // Validation des données
    if (!name || !email || !subject || !message || !type) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    // TODO: Vérification reCAPTCHA ici
    // const recaptchaResponse = body['g-recaptcha-response']
    // const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY
    // ...

    // Simulation de l'envoi d'email ou de la sauvegarde en base de données
    // Dans un environnement de production, vous pourriez:
    // 1. Envoyer un email via SendGrid, Resend, ou autre service
    // 2. Sauvegarder dans une base de données (Supabase, etc.)
    // 3. Intégrer avec un helpdesk (Zendesk, Intercom, etc.)

    console.log('Nouvelle demande de support reçue:', {
      name,
      email,
      subject,
      message,
      type,
      timestamp: new Date().toISOString()
    })

    // Simulation d'un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json(
      { message: 'Demande de support envoyée avec succès' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur lors du traitement de la demande de support:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}