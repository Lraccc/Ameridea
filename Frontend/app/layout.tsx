import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ameridea Health Insurance',
  description: 'Your comprehensive health insurance management platform',
  icons: {
    icon: '/images/ameridea-logo.png',
    shortcut: '/images/ameridea-logo.png',
    apple: '/images/ameridea-logo.png',
  },
  openGraph: {
    title: 'Ameridea Health Insurance',
    description: 'Your comprehensive health insurance management platform',
    images: [
      {
        url: '/images/ameridea-logo.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ameridea Health Insurance',
    description: 'Your comprehensive health insurance management platform',
    images: [
      {
        url: '/images/ameridea-logo.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
