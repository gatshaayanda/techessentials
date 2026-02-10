"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";
import { MessageCircle, BadgeCheck, ArrowLeft } from "lucide-react";

const WHATSAPP_NUMBER = "+26772545765";
const FACEBOOK_PAGE_PRIMARY = "https://www.facebook.com/techessentialz/";
const FACEBOOK_PAGE_SECONDARY = "https://www.facebook.com/techessentialsbw/";

type Category = "pos" | "scales" | "cctv" | "printers" | "accessories";

type Product = {
  id: string;
  name: string;
  category: Category;
  brand?: string;
  price: number;
  dealPrice?: number | null;
  isDeal: boolean;
  inStock: boolean;
  imageUrl: string;
  description?: string | null;
};

function waLink(text: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

const VALID_CATEGORIES: Category[] = ["pos", "scales", "cctv", "printers", "accessories"];

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const raw = (params?.category || "").toLowerCase();
  const category = (VALID_CATEGORIES.includes(raw as Category) ? raw : "pos") as Category;

  const label = useMemo(() => {
    const map: Record<Category, string> = {
      pos: "POS Systems",
      scales: "Scales",
      cctv: "CCTV Packages",
      printers: "Receipt Printers",
      accessories: "Accessories",
    };
    return map[category];
  }, [category]);

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const q = query(collection(firestore, "products"), where("category", "==", category));
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Product[];
        if (alive) setItems(data);
      } catch (e) {
        console.error("Load category products failed:", e);
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [category]);

  return (
    <main id="main" className="bg-[--background] text-[--foreground]">
      <section className="container py-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Link href="/" className="btn btn-outline">
                <ArrowLeft size={18} /> Home
              </Link>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{label}</h1>
                <p className="text-sm text-[--muted] mt-1">
                  Browse packages and request a quote via WhatsApp.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <a className="btn btn-outline" href={FACEBOOK_PAGE_PRIMARY} target="_blank" rel="noreferrer">Facebook</a>
              <a className="btn btn-outline" href={FACEBOOK_PAGE_SECONDARY} target="_blank" rel="noreferrer">Facebook (Alt)</a>
              <a
                className="btn btn-primary"
                href={waLink(`Hi Tech Essentials! I’m browsing ${label}. Please help with options and pricing.`)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={18} />
                WhatsApp Quote
              </a>
            </div>
          </div>

          <div className="panel-soft p-5">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div className="font-extrabold">How this works</div>
              <div className="text-sm text-[--muted]">
                Pick an item → tap WhatsApp → we confirm availability, delivery, and payment.
              </div>
              <div className="inline-flex items-center gap-2 text-sm font-extrabold text-[--brand-primary]">
                <BadgeCheck size={16} /> Fast confirmation
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7">
          {loading ? (
            <div className="panel p-8">Loading…</div>
          ) : items.length === 0 ? (
            <div className="panel p-10 text-center">
              <div className="text-xl font-extrabold">No items listed yet</div>
              <p className="text-[--muted] mt-2">Message us and we’ll quote based on your needs.</p>
              <div className="mt-4 flex justify-center gap-2 flex-wrap">
                <Link href="/deals" className="btn btn-outline">View Deals</Link>
                <a
                  className="btn btn-primary"
                  href={waLink(`Hi Tech Essentials! Do you have any ${label.toLowerCase()} available? Please share options and prices.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => {
                const price = p.isDeal && p.dealPrice ? p.dealPrice : p.price;
                const hasDeal = p.isDeal && p.dealPrice && p.dealPrice < p.price;

                const msg = [
                  "Hi Tech Essentials!",
                  `I want to order / request a quote: ${p.name}`,
                  p.brand ? `Brand: ${p.brand}` : "",
                  `Price: P${price}`,
                  hasDeal ? `(Deal: was P${p.price})` : "",
                  "Please confirm availability and how to proceed.",
                ].filter(Boolean).join("\n");

                return (
                  <div key={p.id} className="panel overflow-hidden">
                    <div className="relative aspect-[16/10] bg-[--surface-2]">
                      <Image src={p.imageUrl || "/placeholder.png"} alt={p.name} fill className="object-cover" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {!p.inStock && <span className="tag">Out of stock</span>}
                        {hasDeal && <span className="tag" style={{ color: "var(--brand-primary)" }}>Deal</span>}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="font-extrabold text-lg leading-snug">{p.name}</div>
                      <div className="text-sm text-[--muted] mt-1">{p.brand || label}</div>

                      {p.description && (
                        <p className="text-sm text-[--muted] mt-3 line-clamp-3">{p.description}</p>
                      )}

                      <div className="mt-4 flex items-end justify-between gap-3">
                        <div>
                          {hasDeal ? (
                            <div className="flex items-baseline gap-2">
                              <div className="text-sm line-through text-[--muted-2]">P{p.price}</div>
                              <div className="text-xl font-extrabold">P{p.dealPrice}</div>
                            </div>
                          ) : (
                            <div className="text-xl font-extrabold">P{p.price}</div>
                          )}
                          <div className="text-xs text-[--muted-2] mt-1">Prices may change based on supplier availability.</div>
                        </div>

                        <a className="btn btn-primary" href={waLink(msg)} target="_blank" rel="noreferrer">
                          <MessageCircle size={18} />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
