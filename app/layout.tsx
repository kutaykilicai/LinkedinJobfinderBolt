import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { CompareTray } from '@/components/jobs/CompareTray';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JobFinder - Kutay Kılıç',
  description: 'Modern job finder app for IT Audit and Security roles',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white antialiased`}>
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
        <CompareTray />
      </body>
    </html>
  );
}