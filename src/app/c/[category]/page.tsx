"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";

const WHATSAPP_NUMBER = "+26778768259";
const CHANNEL_URL = "https://whatsapp.com/channel/0029Vb6s2BE3LdQZJGmxQf1W";

type Category = "phones" | "laptops" | "gadgets" | "clothing" | "shoes";

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
  const phone = WHATSAPP_NUMBER.replace("+", "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

const VALID_CATEGORIES: Category[] = ["phones", "laptops", "gadgets", "clothing", "shoes"];

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const raw = (params?.category || "").toLowerCase();
  const category = (VALID_CATEGORIES.includes(raw as Category) ? raw : "phones") as Category;

  const label = useMemo(() => {
    const map: Record<Category, string> = {
      phones: "Phones",
      laptops: "Laptops",
      gadgets: "Gadgets",
      clothing: "Clothing",
      shoes: "Shoes",
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

        // ✅ no orderBy → no composite index required
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

    return () => {
      alive = false;
    };
  }, [category]);

  return (
    <main id="main" className="bg-[--background] text-[--foreground]">
      <section className="container py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{label}</h1>
            <p className="text-sm text-white/70 mt-1">Browse items and tap “Order on WhatsApp”.</p>
          </div>

          <div className="flex gap-2">
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition text-sm font-semibold"
            >
              Follow WhatsApp Channel
            </a>
            <a
              href={waLink("Hi iHub! I want to ask about products.")}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[--brand-primary] hover:opacity-90 transition text-sm font-semibold"
            >
              WhatsApp iHub
            </a>
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">Loading…</div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-white/80">No items listed here yet. Check back soon.</p>
              <div className="mt-4 flex justify-center gap-2">
                <Link
                  href="/deals"
                  className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition text-sm font-semibold"
                >
                  View Deals
                </Link>
                <a
                  href={waLink(`Hi iHub! Do you have any ${label.toLowerCase()} available?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[--brand-primary] hover:opacity-90 transition text-sm font-semibold"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => {
                const price = p.isDeal && p.dealPrice ? p.dealPrice : p.price;
                const hasDeal = p.isDeal && p.dealPrice && p.dealPrice < p.price;

                const msg = [
                  "Hi iHub!",
                  `I want to order: ${p.name}`,
                  p.brand ? `Brand: ${p.brand}` : "",
                  `Price: P${price}`,
                  hasDeal ? `(Deal: was P${p.price})` : "",
                  "Please confirm availability and how to proceed.",
                ]
                  .filter(Boolean)
                  .join("\n");

                return (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/10 transition"
                  >
                    <div className="relative aspect-[4/3] bg-black/30">
                      <Image src={p.imageUrl || "/placeholder.png"} alt={p.name} fill className="object-cover" />
                      {!p.inStock && (
                        <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold bg-black/60 border border-white/20">
                          Out of stock
                        </div>
                      )}
                      {hasDeal && (
                        <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-semibold bg-[--brand-primary]">
                          Deal
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-base">{p.name}</div>
                          {p.brand && <div className="text-xs text-white/60 mt-1">{p.brand}</div>}
                        </div>

                        <div className="text-right">
                          {hasDeal ? (
                            <>
                              <div className="text-sm line-through text-white/50">P{p.price}</div>
                              <div className="text-lg font-bold">P{p.dealPrice}</div>
                            </>
                          ) : (
                            <div className="text-lg font-bold">P{p.price}</div>
                          )}
                        </div>
                      </div>

                      {p.description && (
                        <p className="text-sm text-white/70 mt-3 line-clamp-3">{p.description}</p>
                      )}

                      <div className="mt-4 flex gap-2">
                        <a
                          href={waLink(msg)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center px-4 py-2 rounded-lg bg-[--brand-primary] hover:opacity-90 transition text-sm font-semibold"
                        >
                          Order on WhatsApp
                        </a>
                        <a
                          href={CHANNEL_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition text-sm font-semibold"
                        >
                          Channel
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
