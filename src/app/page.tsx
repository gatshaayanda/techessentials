"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ShieldCheck, Truck, MessageCircle, Wrench, Camera, Printer, Cpu } from "lucide-react";
import { firestore } from "@/utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

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

const WHATSAPP_NUMBER = "+26772545765";
const FACEBOOK_PAGE_PRIMARY = "https://www.facebook.com/techessentialz/";
const FACEBOOK_PAGE_SECONDARY = "https://www.facebook.com/techessentialsbw/";

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

const CATS = [
  { href: "/c/pos", title: "POS Systems", desc: "Complete POS bundles for retail & restaurants.", icon: <Cpu size={18} /> },
  { href: "/c/scales", title: "Scales", desc: "Reliable weighing solutions for shops & warehouses.", icon: <Wrench size={18} /> },
  { href: "/c/cctv", title: "CCTV", desc: "Security camera packages + setup options.", icon: <Camera size={18} /> },
  { href: "/c/printers", title: "Printers", desc: "Receipt printers & printing accessories.", icon: <Printer size={18} /> },
];

export default function HomePage() {
  const [hero, setHero] = useState<Highlight | null>(null);
  const [gallery, setGallery] = useState<Highlight[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const hsnap = await getDocs(collection(firestore, "highlights"));
        const hdata = hsnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Highlight[];

        setHero(hdata.find((h) => h.isHero) || null);
        setGallery(hdata.filter((h) => h.showOnHome && !h.isHero).slice(0, 6));

        const psnap = await getDocs(collection(firestore, "products"));
        const pdata = psnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Product[];

        setProducts(pdata.slice(0, 8));
      } catch (e) {
        console.error("Home load failed:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="bg-[--background] text-[--foreground]">
      {/* TOP STRIP */}
      <div className="border-b border-[--border]">
        <div className="container py-3 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-sm">
          <div className="flex items-center gap-2 text-[--muted]">
            <Sparkles size={16} />
            Commercial POS • Scales • CCTV • Printers • Accessories
          </div>

          <div className="flex flex-wrap gap-2">
            <a className="btn btn-ghost" href={FACEBOOK_PAGE_PRIMARY} target="_blank" rel="noreferrer">
              Facebook
            </a>
            <a className="btn btn-ghost" href={FACEBOOK_PAGE_SECONDARY} target="_blank" rel="noreferrer">
              Facebook (Alt)
            </a>
            <a className="btn btn-primary" href={waLink("Hi Tech Essentials! I want to request a quote / place an order.")}>
              <MessageCircle size={18} />
              WhatsApp: +267 72 545 765
            </a>
          </div>
        </div>
      </div>

      {/* HERO (two-column, B2B) */}
      <section className="container py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
          <div className="panel p-6 md:p-8">
            <div className="kicker">Business-ready equipment • Clear pricing • Fast support</div>

            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Tech Essentials
              <span className="block text-[--muted] text-base sm:text-lg md:text-xl font-bold mt-3">
                POS systems, scales, CCTV packages and accessories — order or request a quote on WhatsApp.
              </span>
            </h1>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a className="btn btn-primary w-full" href={waLink("Hi Tech Essentials! Please send me POS / CCTV / Scales package options and prices.")}>
                <MessageCircle size={18} />
                Request a Quote
              </a>

              <Link className="btn btn-outline w-full" href="/c/pos">
                Browse Packages
              </Link>
            </div>

            <div className="divider my-6" />

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="panel-soft p-4">
                <div className="font-extrabold">POS Bundles</div>
                <div className="text-sm text-[--muted] mt-1">Starter → pro setups.</div>
              </div>
              <div className="panel-soft p-4">
                <div className="font-extrabold">CCTV</div>
                <div className="text-sm text-[--muted] mt-1">Secure your business.</div>
              </div>
              <div className="panel-soft p-4">
                <div className="font-extrabold">Scales</div>
                <div className="text-sm text-[--muted] mt-1">Accurate + durable.</div>
              </div>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="panel overflow-hidden">
            <div className="relative h-full min-h-[320px]">
              <Image
                src={hero?.imageUrl || "/placeholder.png"}
                alt={hero?.title || "Tech Essentials"}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(11,94,215,0.12), rgba(14,165,233,0.10), rgba(255,255,255,0.0))" }} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="panel p-4">
                  <div className="font-extrabold">{hero?.title || "Packages & Equipment"}</div>
                  <div className="text-sm text-[--muted] mt-1">
                    {hero?.desc || "Ask for availability and installation options on WhatsApp."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="container pb-10">
        <h2 className="text-2xl font-extrabold">Browse by Category</h2>
        <p className="text-[--muted] mt-1">Choose a category to view packages and pricing.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATS.map((c) => (
            <Link key={c.href} href={c.href} className="panel p-5 hover:translate-y-[-1px] transition">
              <div className="flex items-center gap-2 text-[--brand-primary] font-extrabold">
                <span className="grid place-items-center h-9 w-9 rounded-xl bg-[--surface-2] border border-[--border]">
                  {c.icon}
                </span>
                {c.title}
              </div>
              <p className="mt-2 text-sm text-[--muted]">{c.desc}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[--brand-primary]">
                View packages <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container pb-12">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold">Featured Packages</h2>
            <p className="text-[--muted] mt-1">Latest items added by admin.</p>
          </div>
          <Link href="/c/pos" className="btn btn-outline">View all</Link>
        </div>

        <div className="mt-5">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="panel h-[220px] animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="panel p-8 text-center">
              <div className="font-extrabold">No items yet</div>
              <p className="text-[--muted] mt-2">Add products in admin to show them here.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => {
                const price = p.isDeal && p.dealPrice ? p.dealPrice : p.price;
                const hasDeal = p.isDeal && p.dealPrice && p.dealPrice < p.price;

                return (
                  <Link key={p.id} href={`/c/${p.category}`} className="panel overflow-hidden hover:translate-y-[-1px] transition">
                    <div className="relative aspect-[4/3] bg-[--surface-2]">
                      <Image src={p.imageUrl || "/placeholder.png"} alt={p.name} fill className="object-cover" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {!p.inStock && <span className="tag">Out of stock</span>}
                        {hasDeal && <span className="tag" style={{ color: "var(--brand-primary)" }}>Deal</span>}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="font-extrabold line-clamp-2">{p.name}</div>
                      <div className="text-sm text-[--muted] mt-1">{p.brand || p.category}</div>

                      <div className="mt-3 flex items-baseline justify-between gap-3">
                        {hasDeal ? (
                          <div className="flex items-baseline gap-2">
                            <div className="text-sm line-through text-[--muted-2]">P{p.price}</div>
                            <div className="text-lg font-extrabold">P{p.dealPrice}</div>
                          </div>
                        ) : (
                          <div className="text-lg font-extrabold">P{p.price}</div>
                        )}

                        <a
                          className="btn btn-primary"
                          href={waLink(`Hi Tech Essentials! I want to order / request a quote:\n\nItem: ${p.name}\nCategory: ${p.category}\nPrice: P${price}\n\nPlease confirm availability and how to proceed.`)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-t border-[--border]">
        <div className="container py-10 grid gap-4 md:grid-cols-3">
          {[
            { icon: <ShieldCheck size={18} />, title: "Verified availability", desc: "We confirm stock before payment." },
            { icon: <Truck size={18} />, title: "Delivery options", desc: "Collection or delivery arranged." },
            { icon: <Wrench size={18} />, title: "Support & guidance", desc: "We help you choose the right setup." },
          ].map((i) => (
            <div key={i.title} className="panel p-5">
              <div className="flex items-center gap-2 font-extrabold">
                <span className="grid place-items-center h-9 w-9 rounded-xl bg-[--surface-2] border border-[--border] text-[--brand-primary]">
                  {i.icon}
                </span>
                {i.title}
              </div>
              <p className="text-sm text-[--muted] mt-2">{i.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
