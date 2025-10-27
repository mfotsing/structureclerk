import { NextRequest, NextResponse } from 'next/server';

interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Check for OAuth errors
    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/app/integrations?error=${encodeURIComponent(error)}`
      );
    }

    // Verify state parameter
    const storedState = req.cookies.get('gdrive_oauth_state')?.value;
    if (!state || state !== storedState) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/app/integrations?error=invalid_state`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/app/integrations?error=no_code`
      );
    }

    // Exchange authorization code for access token
    const tokenResponse = await exchangeCodeForToken(code);

    if (!tokenResponse.access_token) {
      throw new Error('Failed to obtain access token');
    }

    // Get user info from Google
    const userInfo = await getGoogleUserInfo(tokenResponse.access_token);

    // In a real implementation, you would:
    // 1. Verify the user is authenticated
    // 2. Store the integration in your database
    // 3. Associate it with the user's account

    console.log('Google Drive integration successful:', {
      email: userInfo.email,
      hasRefreshToken: !!tokenResponse.refresh_token,
    });

    // Clear state cookie
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/app/integrations?success=gdrive`
    );
    response.cookies.delete('gdrive_oauth_state');

    return response;

  } catch (error) {
    console.error('Google Drive callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/app/integrations?error=callback_failed`
    );
  }
}

async function exchangeCodeForToken(code: string): Promise<GoogleTokenResponse> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/integrations/gdrive/callback`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get user info: ${response.status}`);
  }

  return response.json();
}