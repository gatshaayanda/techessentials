// src/app/layout.tsx
import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/AdminHubLoader";
import ChatWidget from "@/components/ChatWidget";
import ThemeHydrationScript from "@/components/ThemeHydrationScript";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/* Fonts — iHub tech/retail vibe */
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
  title: "iHub — Tech, Gadgets, Phones & Laptops",
  description:
    "Shop phones, laptops, gadgets, and accessories. View prices and place orders directly via WhatsApp. Clothing and shoes available on request.",
  applicationName: "iHub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <head>
        <ThemeHydrationScript />
      </head>

      <body className="antialiased bg-[--background] text-[--foreground] font-sans">
        {/* Loader — fixed overlay, outside layout flow */}
        <Loader />

        <AnalyticsProvider>
          {/* App shell */}
          <div className="min-h-screen flex flex-col">
            <div className="sticky top-0 z-40 bg-[--background]/80 backdrop-blur border-b border-white/10">
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
