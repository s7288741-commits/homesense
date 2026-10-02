import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HomeSense — Intelligent Household Replenishment",
  description:
    "HomeSense remembers what your household uses, predicts what will run low, and prepares an intelligent shopping plan. AI recommends, you decide.",
  keywords: [
    "household management",
    "smart shopping",
    "inventory tracking",
    "grocery planning",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="flex h-full bg-[#07070b] font-sans text-white">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col pl-[260px] transition-all duration-300">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-6 py-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
