// src/components/Footer.tsx
"use client";

import Link from "next/link";
import { MessageCircle, Radio } from "lucide-react";

const WHATSAPP_NUMBER = "+26778768259";
const WHATSAPP_CHANNEL =
  "https://whatsapp.com/channel/0029Vb6s2BE3LdQZJGmxQf1W";

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 text-[--foreground] bg-[--background] relative overflow-hidden">
      {/* Subtle neon shimmer line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[--brand-primary]/30 via-[--brand-accent]/60 to-[--brand-secondary]/30 animate-neonflow" />

      <div className="container grid gap-10 sm:grid-cols-2 lg:grid-cols-4 py-12 text-sm relative z-10">
        {/* Brand */}
        <section aria-labelledby="footer-brand">
          <h4
            id="footer-brand"
            className="text-lg font-extrabold tracking-tight text-[--foreground] mb-2"
          >
            iHub
          </h4>
          <p className="text-[--muted] leading-relaxed">
            Tech & gadgets store. Browse prices for phones, laptops, and gadgets.
            We also help you order clothing and shoes.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="badge">Phones</span>
            <span className="badge">Laptops</span>
            <span className="badge">Gadgets</span>
            <span className="badge">Clothing</span>
            <span className="badge">Shoes</span>
          </div>
        </section>

        {/* WhatsApp + Channel */}
        <section aria-labelledby="footer-contact">
          <h4
            id="footer-contact"
            className="text-lg font-bold text-[--foreground] mb-2"
          >
            WhatsApp
          </h4>

          <ul className="space-y-2 text-[--muted]">
            <li>
              <a
                href={waLink("Hi iHub 👋 I want to ask about prices / place an order.")}
                className="inline-flex items-center gap-2 hover:underline"
              >
                <MessageCircle size={18} />
                Chat: {WHATSAPP_NUMBER}
              </a>
            </li>

            <li>
              <a
                href={WHATSAPP_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:underline"
              >
                <Radio size={18} />
                Follow our WhatsApp Channel
              </a>
            </li>
          </ul>

          <div className="mt-4">
            <a
              href={waLink(
                "Hi iHub 👋 I want to order:\n\n1) \n2) \n\nDelivery location: \nName: "
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
              <Link href="/c/phones" className="hover:underline">
                Phones
              </Link>
            </li>
            <li>
              <Link href="/c/laptops" className="hover:underline">
                Laptops
              </Link>
            </li>
            <li>
              <Link href="/c/gadgets" className="hover:underline">
                Gadgets
              </Link>
            </li>
            <li>
              <Link href="/c/clothing" className="hover:underline">
                Clothing
              </Link>
            </li>
            <li>
              <Link href="/c/shoes" className="hover:underline">
                Shoes
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
            Browse prices on the website, then tap “Order on WhatsApp” to send
            your list. We’ll confirm availability, delivery options, and payment
            details on WhatsApp.
          </p>

          <div className="mt-4 card">
            <div className="card-inner">
              <p className="text-[--foreground] font-semibold">Tip</p>
              <p className="text-[--muted] mt-1">
                Send a screenshot or product link when asking for something not
                listed (clothing/shoes).
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-[--border] relative z-10">
        <div className="container py-4 flex flex-col md:flex-row justify-between text-xs text-[--muted] gap-2">
          <div>&copy; {year} iHub. All rights reserved.</div>
          <div>Prices may change based on supplier availability.</div>
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
