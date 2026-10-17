import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/AppLayout";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Oomisha360 — Farm Management & Agricultural Intelligence Platform",
  description: "Know Your Farm. Control Your Costs. Grow Your Profits. Precision agricultural management for Ethiopia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="bg-[#F5F0E8] text-[#1A1A2E] antialiased selection:bg-[#2D6A4F] selection:text-white">
        <AppProvider>
          <AppLayout>{children}</AppLayout>
        </AppProvider>
      </body>
    </html>
  );
}
