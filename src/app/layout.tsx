
import "./globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bidzy - Shipping Request Platform",
  description: "Create and manage shipping requests and bids",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
