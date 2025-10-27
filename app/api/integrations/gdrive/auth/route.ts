import { NextRequest, NextResponse } from 'next/server';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL}/api/integrations/gdrive/callback`;

// Google OAuth scopes for Google Drive
const SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
].join(' ');

export async function GET(req: NextRequest) {
  try {
    // Check if Google credentials are configured
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'Google Drive integration is not configured' },
        { status: 500 }
      );
    }

    // Generate state parameter for CSRF protection
    const state = Math.random().toString(36).substring(2, 15);

    // Store state in session/cookie (simplified - in production use proper session management)
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', SCOPES);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('access_type', 'offline'); // For refresh token
    authUrl.searchParams.set('prompt', 'consent'); // Force consent screen

    // Set state cookie (in production, use secure, httpOnly cookies)
    const response = NextResponse.redirect(authUrl.toString());
    response.cookies.set('gdrive_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
    });

    return response;

  } catch (error) {
    console.error('Google Drive auth error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Google Drive authentication' },
      { status: 500 }
    );
  }
}