import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MDRRMO',
  description: 'Created by g-coder',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body
        className={`flex h-screen w-full items-center justify-center ${inter.className}`}
      >
        {children}
      </body>
    </html>
  );
}
