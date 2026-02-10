// src/components/Footer.tsx
"use client";

import Link from "next/link";
import {
  MessageCircle,
  Facebook,
  MapPin,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";

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
    <footer className="mt-16 bg-[--surface] text-[--foreground] border-t border-[--border]">
      {/* Top CTA strip (clean, not shiny) */}
      <div className="bg-[--surface-2] border-b border-[--border]">
        <div className="container py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">
              Need a quote for POS, Scales, or CCTV?
            </p>
            <p className="text-xs text-[--muted] mt-1">
              Message us what you need and we’ll confirm package, installation,
              and delivery options.
            </p>
          </div>

          <a
            href={waLink(
              "Hi Tech Essentials 👋 Please quote me for:\n\n1) \n\nLocation: \nInstall needed? (Yes/No): "
            )}
            className="btn btn-primary"
          >
            <MessageCircle size={18} />
            Get a Quote on WhatsApp
          </a>
        </div>
      </div>

      <div className="container grid gap-10 sm:grid-cols-2 lg:grid-cols-4 py-12 text-sm">
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
            accessories. Practical gear for shops and small businesses.
          </p>

          <div className="mt-4 grid gap-2 text-xs text-[--muted]">
            <div className="inline-flex items-center gap-2">
              <ShieldCheck size={16} className="text-[--brand-primary]" />
              Tested packages, clear pricing
            </div>
            <div className="inline-flex items-center gap-2">
              <Wrench size={16} className="text-[--brand-primary]" />
              Installation support (where applicable)
            </div>
          </div>
        </section>

        {/* Contact */}
        <section aria-labelledby="footer-contact">
          <h4
            id="footer-contact"
            className="text-lg font-bold text-[--foreground] mb-2"
          >
            Contact
          </h4>

          <ul className="space-y-3 text-[--muted]">
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

            <li className="inline-flex items-center gap-2">
              <Phone size={18} />
              <span>Calls: +267 72 545 765</span>
            </li>

            <li className="inline-flex items-center gap-2">
              <MapPin size={18} />
              <span>Botswana (Delivery / Install by arrangement)</span>
            </li>

            <li className="pt-1">
              <a
                href={FACEBOOK_PAGE_PRIMARY}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:underline"
              >
                <Facebook size={18} />
                Facebook: techessentialz
              </a>
              <span className="block text-xs text-[--muted-2] mt-1">
                or
              </span>
              <a
                href={FACEBOOK_PAGE_SECONDARY}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:underline mt-1"
              >
                <Facebook size={18} />
                Facebook: techessentialsbw
              </a>
            </li>
          </ul>
        </section>

        {/* Quick Links */}
        <nav aria-labelledby="footer-links">
          <h4
            id="footer-links"
            className="text-lg font-bold text-[--foreground] mb-2"
          >
            Browse
          </h4>

          <ul className="space-y-2 text-[--muted]">
            <li>
              <Link href="/" className="hover:underline">
                Home / Shop
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

        {/* How it works */}
        <section aria-labelledby="footer-info">
          <h4
            id="footer-info"
            className="text-lg font-bold text-[--foreground] mb-2"
          >
            How orders work
          </h4>

          <ol className="space-y-2 text-[--muted] list-decimal list-inside">
            <li>Browse packages & pricing.</li>
            <li>Tap WhatsApp to request a quote or order.</li>
            <li>We confirm stock, delivery/installation, and payment.</li>
          </ol>

          <div className="mt-4 rounded-2xl border border-[--border] bg-[--surface-2] p-4">
            <p className="text-[--foreground] font-semibold">For installs</p>
            <p className="text-[--muted] mt-1 text-sm">
              Send your location + what you want installed (CCTV points / POS
              terminals / scale type). If you can, include a photo of the shop
              counter/area.
            </p>
          </div>
        </section>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-[--border]">
        <div className="container py-4 flex flex-col md:flex-row justify-between text-xs text-[--muted] gap-2">
          <div>&copy; {year} Tech Essentials. All rights reserved.</div>
          <div>Prices may change based on stock and supplier availability.</div>
        </div>
      </div>
    </footer>
  );
}
