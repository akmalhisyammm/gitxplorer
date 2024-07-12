import '@/styles/globals.css';

import { Noto_Sans as FontSans } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import NextTopLoader from 'nextjs-toploader';

import {
  APP_NAME,
  APP_DESCRIPTION,
  APP_URL,
  APP_AUTHOR,
} from '@/constants/app';
import { ModeToggle } from '@/components/mode-toggle';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

import type { Metadata } from 'next';

type RootLayoutProps = {
  children: React.ReactNode;
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: APP_URL,
    siteName: APP_NAME,
    type: 'website',
  },
  twitter: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    card: 'summary_large_image',
    creator: '@akmalhisyammm',
  },
  authors: {
    name: APP_AUTHOR,
    url: APP_URL,
  },
  keywords: ['git', 'github', 'repository', 'explorer'],
  creator: APP_AUTHOR,
  publisher: APP_AUTHOR,
  generator: 'Next.js',
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />

      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader color="#4078c0" showSpinner={false} />

          <header className="sticky top-0 z-50 shadow-sm bg-background/80 backdrop-blur-md">
            <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="GitXplorer"
                  width={32}
                  height={32}
                />
                <span className="text-lg font-semibold">GitXplorer</span>
              </Link>
              <ModeToggle />
            </div>
          </header>

          <main className="container p-4 mx-auto md:px-6">{children}</main>

          <footer className="container px-4 py-8 mx-auto md:px-6">
            <p className="text-center">
              &copy; {new Date().getFullYear()} &bull;{' '}
              <Link
                href="https://akmalhisyam.my.id"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {APP_AUTHOR}
              </Link>
            </p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
