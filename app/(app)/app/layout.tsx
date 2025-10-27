import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Sora } from 'next/font/google';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import ChatbotDock from '@/components/ui/ChatbotDock';

// Font configuration
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

// Authentication check (simplified - in production use Clerk middleware)
async function checkAuth() {
  // This is a simplified check. In production, you would use Clerk's auth middleware
  const headersList = headers();
  const authHeader = headersList.get('authorization');

  // For now, we'll just check if there's a session cookie
  const sessionCookie = headersList.get('cookie');

  if (!sessionCookie?.includes('session')) {
    // Redirect to login if not authenticated
    redirect('/sign-in?redirectTo=/app');
  }

  return true;
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  await checkAuth();

  // Get messages for internationalization
  const messages = await getMessages();

  return (
    <html lang="en" className={`h-full ${inter.variable} ${sora.variable}`}>
      <body className="h-full bg-background font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen flex">
            {/* App Layout */}
            <div className="flex-1 flex flex-col">
              {/* Main Content */}
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
          </div>

          {/* Chatbot Dock - always available in app */}
          <ChatbotDock mode="productivity" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}