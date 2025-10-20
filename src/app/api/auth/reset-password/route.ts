import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Adresse email requise' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Send password reset email via Supabase Auth
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`,
    })

    if (error) {
      console.error('Password reset error:', error)
      // Don't reveal if email exists or not for security
      // Always return success to prevent email enumeration
    }

    // Always return success (even if email doesn't exist)
    // This prevents attackers from discovering valid emails
    return NextResponse.json({
      message: 'Si cette adresse email existe, vous recevrez un lien de réinitialisation.',
    })
  } catch (error: any) {
    console.error('Reset password API error:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'envoi de l\'email' },
      { status: 500 }
    )
  }
}
