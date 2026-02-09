// src/components/Footer.tsx
"use client";

import Link from "next/link";
import { MessageCircle, Radio } from "lucide-react";

const WHATSAPP_NUMBER = "+26772545765";

const FACEBOOK_PAGE_PRIMARY = "https://www.facebook.com/techessentialz/";
const FACEBOOK_PAGE_SECONDARY = "https://www.facebook.com/techessentialsbw/";

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 text-[--foreground] bg-[--background] relative overflow-hidden">
      {/* Subtle brand shimmer line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[--brand-primary]/35 via-[--brand-secondary]/55 to-[--brand-primary]/35 animate-neonflow" />

      <div className="container grid gap-10 sm:grid-cols-2 lg:grid-cols-4 py-12 text-sm relative z-10">
        {/* Brand */}
        <section aria-labelledby="footer-brand">
          <h4
            id="footer-brand"
            className="text-lg font-extrabold tracking-tight text-[--foreground] mb-2"
          >
            Tech Essentials
          </h4>
          <p className="text-[--muted] leading-relaxed">
            POS systems, price computing scales, CCTV packages, and business
            accessories. Browse deals and order directly on WhatsApp.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="badge">POS</span>
            <span className="badge">Scales</span>
            <span className="badge">CCTV</span>
            <span className="badge">Printers</span>
            <span className="badge">Accessories</span>
          </div>
        </section>

        {/* WhatsApp + Facebook */}
        <section aria-labelledby="footer-contact">
          <h4
            id="footer-contact"
            className="text-lg font-bold text-[--foreground] mb-2"
          >
            Contact
          </h4>

          <ul className="space-y-2 text-[--muted]">
            <li>
              <a
                href={waLink(
                  "Hi Tech Essentials 👋 I want to ask about POS / Scales / CCTV prices."
                )}
                className="inline-flex items-center gap-2 hover:underline"
              >
                <MessageCircle size={18} />
                WhatsApp: +267 72 545 765
              </a>
            </li>

            <li>
              <a
                href={FACEBOOK_PAGE_PRIMARY}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:underline"
              >
                <Radio size={18} />
                Facebook: techessentialz
              </a>
            </li>

            <li>
              <a
                href={FACEBOOK_PAGE_SECONDARY}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:underline"
              >
                <Radio size={18} />
                Facebook: techessentialsbw
              </a>
            </li>
          </ul>

          <div className="mt-4">
            <a
              href={waLink(
                "Hi Tech Essentials 👋 I want to order:\n\n1) \n2) \n\nDelivery location: \nName: "
              )}
              className="btn btn-primary w-full"
            >
              <MessageCircle size={18} />
              Order on WhatsApp
            </a>
          </div>
        </section>

        {/* Quick Links */}
        <nav aria-labelledby="footer-links">
          <h4
            id="footer-links"
            className="text-lg font-bold text-[--foreground] mb-2"
          >
            Quick Links
          </h4>

          <ul className="space-y-2 text-[--muted]">
            <li>
              <Link href="/" className="hover:underline">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/c/pos" className="hover:underline">
                POS Systems
              </Link>
            </li>
            <li>
              <Link href="/c/scales" className="hover:underline">
                Scales
              </Link>
            </li>
            <li>
              <Link href="/c/cctv" className="hover:underline">
                CCTV
              </Link>
            </li>
            <li>
              <Link href="/c/printers" className="hover:underline">
                Printers
              </Link>
            </li>
            <li>
              <Link href="/c/accessories" className="hover:underline">
                Accessories
              </Link>
            </li>
            <li>
              <Link href="/deals" className="hover:underline">
                Deals
              </Link>
            </li>
          </ul>
        </nav>

        {/* Info */}
        <section aria-labelledby="footer-info">
          <h4
            id="footer-info"
            className="text-lg font-bold text-[--foreground] mb-2"
          >
            How Orders Work
          </h4>

          <p className="text-[--muted] leading-relaxed">
            Browse packages and prices on the website, then tap “Order on
            WhatsApp” to send your list. We’ll confirm availability, delivery or
            installation options, and payment details on WhatsApp.
          </p>

          <div className="mt-4 card">
            <div className="card-inner">
              <p className="text-[--foreground] font-semibold">Tip</p>
              <p className="text-[--muted] mt-1">
                For installations (CCTV / POS setup), send your location and a
                photo of the shop layout if possible.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-[--border] relative z-10">
        <div className="container py-4 flex flex-col md:flex-row justify-between text-xs text-[--muted] gap-2">
          <div>&copy; {year} Tech Essentials. All rights reserved.</div>
          <div>Prices may change based on stock and supplier availability.</div>
        </div>
      </div>

      {/* Footer animation */}
      <style jsx global>{`
        @keyframes neonflow {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-neonflow {
          background-size: 200% 200%;
          animation: neonflow 7s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
}
