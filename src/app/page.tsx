"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { firestore } from "@/utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

/* ───────────────── TYPES ───────────────── */

type Highlight = {
  id: string;
  imageUrl: string;
  title: string;
  desc: string;
  showOnHome: boolean;
  order: number;
  isHero?: boolean;
};

type Product = {
  id: string;
  name: string;
  category: string;
  brand?: string;
  price: number;
  dealPrice?: number | null;
  isDeal: boolean;
  inStock: boolean;
  imageUrl: string;
  description?: string | null;
};

/* ───────────────── CONSTANTS ───────────────── */

const WHATSAPP_NUMBER = "+26772545765";

const FACEBOOK_PAGE_PRIMARY = "https://www.facebook.com/techessentialz/";
const FACEBOOK_PAGE_SECONDARY = "https://www.facebook.com/techessentialsbw/";

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/* ───────────────── PAGE ───────────────── */

export default function HomePage() {
  const [hero, setHero] = useState<Highlight | null>(null);
  const [gallery, setGallery] = useState<Highlight[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        /* HIGHLIGHTS */
        const hsnap = await getDocs(collection(firestore, "highlights"));
        const hdata = hsnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as Highlight[];

        setHero(hdata.find((h) => h.isHero) || null);
        setGallery(hdata.filter((h) => h.showOnHome && !h.isHero).slice(0, 4));

        /* PRODUCTS */
        const psnap = await getDocs(collection(firestore, "products"));
        const pdata = psnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as Product[];

        setProducts(pdata.slice(0, 8));
      } catch (e) {
        console.error("Home load failed:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="bg-[--background] text-[--foreground] overflow-hidden">
      {/* ───────── HERO ───────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6">
        {hero?.imageUrl && (
          <Image
            src={hero.imageUrl}
            alt="Hero"
            fill
            priority
            className="object-cover opacity-35"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/95" />

        <div className="relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/10 text-xs">
            <Sparkles size={14} />
            POS • Scales • CCTV • Printers • Accessories
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-extrabold">
            Tech Essentials
            <span className="block text-xl md:text-2xl text-white/70 mt-3">
              Quotes + Fast WhatsApp Ordering
            </span>
          </h1>

          <p className="mt-5 text-white/70 max-w-2xl mx-auto">
            Browse packages, request a quote, and order instantly on WhatsApp.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={waLink("Hi Tech Essentials! I want to request a quote / place an order.")}
              className="px-7 py-3 rounded-full bg-white/10 border border-white/15 hover:bg-white/20 transition"
            >
              Order on WhatsApp
            </a>

            <Link
              href="/c/pos"
              className="px-7 py-3 rounded-full bg-blue-700 hover:brightness-110 transition"
            >
              Browse Packages
            </Link>

            <a
              href={FACEBOOK_PAGE_PRIMARY}
              target="_blank"
              rel="noreferrer"
              className="px-7 py-3 rounded-full border border-white/15 hover:bg-white/10 transition"
            >
              Facebook
            </a>

            <a
              href={FACEBOOK_PAGE_SECONDARY}
              target="_blank"
              rel="noreferrer"
              className="px-7 py-3 rounded-full border border-white/15 hover:bg-white/10 transition"
            >
              Facebook (Alt)
            </a>
          </div>
        </div>
      </section>

      {/* ───────── FEATURED PRODUCTS ───────── */}
      <section className="py-20 px-6">
        <div className="container">
          <h2 className="text-3xl font-extrabold mb-3">Featured Packages</h2>
          <p className="text-white/60 mb-10">Latest items added by admin.</p>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] bg-white/10 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
              No products yet.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => {
                const price = p.isDeal && p.dealPrice ? p.dealPrice : p.price;

                return (
                  <Link
                    key={p.id}
                    href={`/c/${p.category}`}
                    className="rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/10 transition"
                  >
                    <div className="relative aspect-[4/3] bg-black/30">
                      <Image
                        src={p.imageUrl || "/placeholder.png"}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                      {!p.inStock && (
                        <div className="absolute top-3 left-3 text-xs px-2 py-1 bg-black/70 rounded">
                          Out of stock
                        </div>
                      )}
                      {p.isDeal && (
                        <div className="absolute top-3 right-3 text-xs px-2 py-1 bg-blue-700 rounded">
                          Deal
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="font-semibold line-clamp-1">{p.name}</div>
                      <div className="text-sm text-white/60 mt-1">
                        {p.brand || p.category}
                      </div>
                      <div className="mt-3 text-lg font-bold">P{price}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ───────── TRUST STRIP ───────── */}
      <section className="py-16 px-6 bg-white/5">
        <div className="container grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: <ShieldCheck size={18} />,
              title: "Trusted supply",
              desc: "Availability confirmed before payment.",
            },
            {
              icon: <Truck size={18} />,
              title: "Delivery / installation",
              desc: "Collection, delivery, or installation arranged.",
            },
            {
              icon: <MessageCircle size={18} />,
              title: "Fast WhatsApp support",
              desc: "Quotes, recommendations, and setup guidance.",
            },
          ].map((i) => (
            <div
              key={i.title}
              className="rounded-xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-center gap-2 font-semibold">
                {i.icon} {i.title}
              </div>
              <p className="text-sm text-white/65 mt-2">{i.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
