import './globals.css';
import type { Metadata } from 'next';
import { FramerMotionLayout } from '@/components/FramerMotionLayout';
import { Inter } from 'next/font/google';
import { Providers } from '@/redux/Providers';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PageProvider } from '@/contexts/PageContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Smart Fin Corporate News',
  description: 'Investors & Politics News Portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 antialiased font-sans transition-colors overflow-x-hidden ${inter.className}`}>
        <div className="flex flex-col min-h-screen">
          <Providers>
            <ThemeProvider>
              <PageProvider>
                <ProtectedRoute>
                  <Header />
                  <FramerMotionLayout>
                    <main className="flex-1 bg-gray-50 dark:bg-gray-900">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                        {children}
                      </div>
                    </main>
                  </FramerMotionLayout>
                </ProtectedRoute>
              </PageProvider>
            </ThemeProvider>
          </Providers>
        </div>
      </body>
    </html>
  );
}
