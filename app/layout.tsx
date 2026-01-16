import type { Metadata } from 'next';
import './globals.scss';
import { AuthProvider } from '@/src/contexts/AuthContext';

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
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
