import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextAUthProvider } from './providers.tsx';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bidzy",
  description: "Find and bid on logistics projects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <NextAUthProvider>
      {children}
      </NextAUthProvider>
        
      </body>
    </html>
  );
}
