// src/app/layout.tsx
import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/AdminHubLoader";
import ChatWidget from "@/components/ChatWidget";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/* Fonts — Tech Essentials (POS / Scales / CCTV) */
const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tech Essentials — POS, Scales & CCTV Solutions",
  description:
    "Affordable POS packages, price computing scales, and CCTV installation solutions for tuckshops, supermarkets, restaurants, butcheries, and general dealers. Order via WhatsApp.",
  applicationName: "Tech Essentials",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <head>
      </head>

      <body className="antialiased bg-[--background] text-[--foreground] font-sans">
        {/* Loader — fixed overlay, outside layout flow */}
        <Loader />

        <AnalyticsProvider>
          {/* App shell */}
          <div className="min-h-screen flex flex-col">
            <div className="sticky top-0 z-40 bg-[--background]/80 backdrop-blur border-b border-[--border]">
              <Header />
            </div>

            <main className="flex-1">{children}</main>

            <Footer />
          </div>

          <ChatWidget />
          <Analytics />
          <SpeedInsights />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
