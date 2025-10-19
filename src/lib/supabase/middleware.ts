import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and supabase.auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Public routes - no auth required
  const publicRoutes = ['/login', '/signup', '/auth', '/']
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Redirect to login if not authenticated
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Check subscription status for authenticated users on protected routes
  if (user && !isPublicRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, trial_ends_at')
      .eq('id', user.id)
      .single()

    if (profile) {
      const isTrialExpired =
        profile.subscription_status === 'trial' &&
        profile.trial_ends_at &&
        new Date(profile.trial_ends_at) < new Date()

      const isSubscriptionInactive =
        profile.subscription_status !== 'trial' && profile.subscription_status !== 'active'

      // If subscription expired, redirect to subscription page (except for subscription page itself)
      if (
        (isTrialExpired || isSubscriptionInactive) &&
        !request.nextUrl.pathname.startsWith('/subscription')
      ) {
        const url = request.nextUrl.clone()
        url.pathname = '/subscription/expired'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
