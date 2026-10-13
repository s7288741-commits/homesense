import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HomeSense — Intelligent Household Replenishment",
  description:
    "HomeSense remembers what your household uses, predicts what will run low, and prepares an intelligent shopping plan. AI recommends, human approves.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="h-full font-sans selection:bg-violet-500/30 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
