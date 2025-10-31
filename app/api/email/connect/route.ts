import { NextRequest, NextResponse } from 'next/server';

// Email provider configurations
const EMAIL_PROVIDERS = {
  gmail: {
    authUrl: 'https://accounts.google.com/oauth/authorize',
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    clientId: process.env.GOOGLE_CLIENT_ID,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/email/callback/gmail`,
  },
  outlook: {
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    scopes: [
      'https://graph.microsoft.com/Mail.Read',
      'https://graph.microsoft.com/Mail.ReadWrite',
      'https://graph.microsoft.com/User.Read',
    ],
    clientId: process.env.MICROSOFT_CLIENT_ID,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/email/callback/outlook`,
  },
  yahoo: {
    authUrl: 'https://api.login.yahoo.com/oauth2/request_auth',
    scopes: ['mail-r', 'mail-w'],
    clientId: process.env.YAHOO_CLIENT_ID,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/email/callback/yahoo`,
  },
  icloud: {
    authUrl: 'https://idmsa.apple.com/appleauth/auth/authorize',
    scopes: ['mail'],
    clientId: process.env.ICLOUD_CLIENT_ID,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/email/callback/icloud`,
  },
  proton: {
    authUrl: 'https://account.proton.me/api/oauth/authorize',
    scopes: ['mail'],
    clientId: process.env.PROTON_CLIENT_ID,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/email/callback/proton`,
  },
};

export async function POST(req: NextRequest) {
  try {
    const { provider, config } = await req.json();

    if (!provider || !EMAIL_PROVIDERS[provider as keyof typeof EMAIL_PROVIDERS]) {
      return NextResponse.json({
        error: 'Invalid email provider'
      }, { status: 400 });
    }

    const providerConfig = EMAIL_PROVIDERS[provider as keyof typeof EMAIL_PROVIDERS];

    // Generate OAuth state for security
    const state = generateState();

    // Store state in session/cookie for validation during callback
    // In production, you'd use a secure session store
    const stateCookie = `oauth_state_${state}`;

    // Build authorization URL
    const authUrl = buildAuthUrl(provider, providerConfig, state, config);

    // Set secure HTTP-only cookie with state
    const response = NextResponse.json({
      authUrl,
      state,
    });

    response.cookies.set(stateCookie, JSON.stringify({
      provider,
      timestamp: Date.now(),
      config,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
    });

    return response;

  } catch (error) {
    console.error('Email connection error:', error);
    return NextResponse.json({
      error: 'Failed to initiate email connection'
    }, { status: 500 });
  }
}

// Generate secure random state
function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Build OAuth authorization URL
function buildAuthUrl(provider: string, config: any, state: string, userConfig?: any): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    state,
    access_type: 'offline', // For refresh tokens
    prompt: 'consent',
  });

  // Provider-specific parameters
  switch (provider) {
    case 'google':
      params.append('include_granted_scopes', 'true');
      break;
    case 'microsoft':
      params.append('response_mode', 'query');
      break;
    case 'yahoo':
      params.append('language', 'en-us');
      break;
  }

  // Add user config parameters for IMAP connections
  if (provider === 'imap' && userConfig) {
    params.append('imap_host', userConfig.host);
    params.append('imap_port', userConfig.port.toString());
    params.append('imap_secure', userConfig.secure.toString());
  }

  return `${config.authUrl}?${params.toString()}`;
}

// Handle OAuth callback (for when user returns from provider)
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app/inbox?error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app/inbox?error=missing_parameters`);
  }

  try {
    // Validate state from cookie
    const stateCookie = `oauth_state_${state}`;
    const stateData = req.cookies.get(stateCookie);

    if (!stateData) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app/inbox?error=invalid_state`);
    }

    const { provider, config } = JSON.parse(stateData.value);

    // Exchange authorization code for access token
    const tokens = await exchangeCodeForTokens(provider, code, state);

    // Get user profile information
    const profile = await getUserProfile(provider, tokens.access_token);

    // Store connection in database
    const connection = await storeEmailConnection({
      provider,
      email: profile.email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      settings: {
        syncInterval: 300, // 5 minutes
        autoCategorize: true,
        aiProcessing: true,
        ...config,
      },
    });

    // Clear state cookie
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app/inbox?success=true`);
    response.cookies.delete(stateCookie);

    return response;

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app/inbox?error=callback_failed`);
  }
}

// Exchange authorization code for access tokens
async function exchangeCodeForTokens(provider: string, code: string, state: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}> {
  const providerConfig = EMAIL_PROVIDERS[provider as keyof typeof EMAIL_PROVIDERS];

  switch (provider) {
    case 'gmail':
      return exchangeGoogleCode(code);
    case 'outlook':
      return exchangeMicrosoftCode(code);
    default:
      throw new Error(`Token exchange not implemented for ${provider}`);
  }
}

// Exchange Google authorization code
async function exchangeGoogleCode(code: string): Promise<any> {
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
      redirect_uri: EMAIL_PROVIDERS.gmail.redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange Google code');
  }

  return response.json();
}

// Exchange Microsoft authorization code
async function exchangeMicrosoftCode(code: string): Promise<any> {
  const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID!,
      client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: EMAIL_PROVIDERS.outlook.redirectUri,
      scope: EMAIL_PROVIDERS.outlook.scopes.join(' '),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange Microsoft code');
  }

  return response.json();
}

// Get user profile from provider
async function getUserProfile(provider: string, accessToken: string): Promise<{
  email: string;
  name?: string;
  picture?: string;
}> {
  switch (provider) {
    case 'gmail':
      const gmailResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!gmailResponse.ok) throw new Error('Failed to get Gmail profile');
      return gmailResponse.json();

    case 'outlook':
      const outlookResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!outlookResponse.ok) throw new Error('Failed to get Outlook profile');
      const data = await outlookResponse.json();
      return {
        email: data.mail || data.userPrincipalName,
        name: data.displayName,
      };

    default:
      throw new Error(`Profile fetch not implemented for ${provider}`);
  }
}

// Store email connection in database
async function storeEmailConnection(connectionData: {
  provider: string;
  email: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  settings: any;
}): Promise<any> {
  // In a real implementation, you'd store this in your database
  // For now, return a mock connection
  return {
    id: `conn_${Date.now()}`,
    ...connectionData,
    status: 'connected',
    createdAt: new Date().toISOString(),
    lastSync: new Date().toISOString(),
  };
}