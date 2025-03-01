import { Inter } from "next/font/google";
import "./globals.css";

// Initialize the font properly
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Bidzy",
  description: "Place your shipping bids with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-zinc-900">{children}</body>
    </html>
  );
}
