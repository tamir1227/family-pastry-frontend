// src/app/layout.tsx

import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Family Pastry',
  description: 'Гурилан бүтээгдэхүүний захиалгын систем',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body className={geist.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}