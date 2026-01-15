import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';
import { AuthProvider } from '@/src/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'АлёГараж',
  description: 'Социальная сеть АлёГараж',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
