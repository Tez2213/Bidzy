import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClientProvider } from "@/components/ClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bidzy - Digital Bidding Platform",
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
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
