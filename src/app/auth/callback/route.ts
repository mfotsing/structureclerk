import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { data } = await supabase.auth.exchangeCodeForSession(code)
    
    // Check if this is a password reset flow
    if (data?.user && requestUrl.searchParams.get('type') === 'recovery') {
      return NextResponse.redirect(new URL('/reset-password', request.url))
    }
  }

  // Redirect to next URL or dashboard
  const redirectUrl = next || '/dashboard'
  return NextResponse.redirect(new URL(redirectUrl, request.url))
}
