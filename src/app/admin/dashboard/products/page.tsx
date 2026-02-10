"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";
import {
  Plus,
  Trash2,
  Pencil,
  Tag,
  RefreshCw,
  Store,
  Scale,
  Cctv,
  Printer,
  PlugZap,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

type Category = "pos" | "scales" | "cctv" | "printers" | "accessories";

type Product = {
  id: string;
  name: string;
  category: Category | string;
  price: number;
  dealPrice?: number | null;
  isDeal: boolean;
  inStock: boolean;
  updatedAt?: any;
};

const CAT_UI: Record<Category, { label: string; icon: React.ReactNode }> = {
  pos: { label: "POS Systems", icon: <Store size={16} /> },
  scales: { label: "Scales", icon: <Scale size={16} /> },
  cctv: { label: "CCTV", icon: <Cctv size={16} /> },
  printers: { label: "Printers", icon: <Printer size={16} /> },
  accessories: { label: "Accessories", icon: <PlugZap size={16} /> },
};

function safeCat(x: string): Category | null {
  const v = (x || "").trim().toLowerCase();
  if (v === "pos") return "pos";
  if (v === "scales") return "scales";
  if (v === "cctv") return "cctv";
  if (v === "printers") return "printers";
  if (v === "accessories") return "accessories";
  return null;
}

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const rawCat = (searchParams.get("cat") || "").toLowerCase(); // pos/scales/cctv/printers/accessories/deals
  const cat = rawCat === "deals" ? "deals" : safeCat(rawCat);

  const load = async () => {
    setLoading(true);
    try {
      // NOTE: orderBy(updatedAt) requires that field exists for all docs.
      // If some docs don't have updatedAt yet, add it or remove orderBy.
      const q = query(
        collection(firestore, "products"),
        orderBy("updatedAt", "desc")
      );
      const snap = await getDocs(q);
      setItems(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Product[]
      );
    } catch (e) {
      console.error("Admin products load failed:", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!cat) return items;
    if (cat === "deals") return items.filter((p) => !!p.isDeal);
    return items.filter(
      (p) => (p.category || "").toLowerCase() === (cat as string)
    );
  }, [items, cat]);

  const grouped = useMemo(() => {
    const map: Record<string, Product[]> = {};
    for (const p of filtered) {
      const k = (p.category || "other").toLowerCase();
      map[k] = map[k] || [];
      map[k].push(p);
    }
    return map;
  }, [filtered]);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteDoc(doc(firestore, "products", id));
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Delete failed. Check console.");
    }
  };

  const pageTitle =
    cat === "deals"
      ? "Products • Deals"
      : cat
      ? `Products • ${CAT_UI[cat].label}`
      : "Products";

  return (
    <main className="bg-[--background] text-[--foreground]">
      <section className="container py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 badge mb-3">
              Admin • Catalog
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight">
              {pageTitle}
            </h1>

            <p className="mt-2 text-sm text-[--muted]">
              Manage Tech Essentials catalog items (POS, scales, CCTV, printers,
              accessories).
            </p>

            {/* Category pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/admin/dashboard/products" className="menu-link">
                All
              </Link>

              {(
                Object.keys(CAT_UI) as Array<keyof typeof CAT_UI>
              ).map((k) => (
                <Link
                  key={k}
                  href={`/admin/dashboard/products?cat=${k}`}
                  className="menu-link"
                  style={
                    cat === k
                      ? {
                          background: "rgba(11,94,215,0.08)",
                          borderColor: "rgba(11,94,215,0.25)",
                          color: "var(--foreground)",
                        }
                      : undefined
                  }
                >
                  <span className="opacity-90">{CAT_UI[k].icon}</span>
                  {CAT_UI[k].label}
                </Link>
              ))}

              <Link
                href="/admin/dashboard/products?cat=deals"
                className="menu-link"
                style={
                  cat === "deals"
                    ? {
                        background: "rgba(11,94,215,0.08)",
                        borderColor: "rgba(11,94,215,0.25)",
                        color: "var(--foreground)",
                      }
                    : undefined
                }
              >
                <Tag size={16} /> Deals
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={load} className="btn btn-outline">
              <RefreshCw size={16} />
              Refresh
            </button>

            <Link href="/admin/dashboard/products/new" className="btn btn-primary">
              <Plus size={18} /> New Product
            </Link>
          </div>
        </div>

        {/* Body */}
        <div className="mt-8">
          {loading ? (
            <div className="card">
              <div className="card-inner">
                <div className="text-sm text-[--muted]">Loading products…</div>
                <div className="mt-4 h-2.5 rounded-full bg-[--surface-2] overflow-hidden border border-[--border]">
                  <div
                    className="h-full w-[45%]"
                    style={{
                      background:
                        "linear-gradient(90deg,var(--brand-primary),var(--brand-secondary),var(--brand-primary))",
                      animation: "teBar 1.35s cubic-bezier(0.45,0,0.25,1) infinite",
                    }}
                  />
                </div>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="card">
              <div className="card-inner">
                <div className="text-lg font-extrabold">No items yet</div>
                <p className="mt-1 text-sm text-[--muted]">
                  Click <span className="font-semibold">New Product</span> to add your first listing.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.keys(grouped)
                .sort()
                .map((catKey) => (
                  <div key={catKey} className="card overflow-hidden">
                    {/* Group header */}
                    <div className="px-5 py-4 border-b border-[--border] bg-[--surface] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="font-extrabold">
                          {(CAT_UI[safeCat(catKey) as Category]?.label) ||
                            catKey.toUpperCase()}
                        </div>
                        <span className="badge">{grouped[catKey].length} item(s)</span>
                      </div>

                      <Link
                        href={`/admin/dashboard/products?cat=${catKey}`}
                        className="menu-link text-sm"
                      >
                        Filter view
                      </Link>
                    </div>

                    {/* Items */}
                    <div className="divide-y divide-[--border] bg-[--surface]">
                      {grouped[catKey].map((p) => {
                        const hasDeal =
                          p.isDeal &&
                          typeof p.dealPrice === "number" &&
                          p.dealPrice < p.price;

                        return (
                          <div
                            key={p.id}
                            className="px-5 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                          >
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="font-bold truncate">{p.name}</div>

                                {p.isDeal && (
                                  <span className="badge">
                                    <Tag size={14} /> Deal
                                  </span>
                                )}

                                {!p.inStock && (
                                  <span
                                    className="badge"
                                    style={{
                                      borderColor: "rgba(239,68,68,0.30)",
                                      background: "rgba(239,68,68,0.08)",
                                      color: "rgba(239,68,68,0.95)",
                                    }}
                                  >
                                    Out of stock
                                  </span>
                                )}
                              </div>

                              <div className="mt-1 text-sm text-[--muted]">
                                <span className="font-semibold text-[--foreground]">Price:</span>{" "}
                                P{p.price}
                                {hasDeal ? (
                                  <>
                                    {" "}
                                    <span className="text-[--muted]">•</span>{" "}
                                    <span className="font-semibold text-[--foreground]">
                                      Deal:
                                    </span>{" "}
                                    P{p.dealPrice}
                                  </>
                                ) : null}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin/dashboard/products/${p.id}/edit`}
                                className="btn btn-outline"
                              >
                                <Pencil size={16} /> Edit
                              </Link>

                              <button
                                onClick={() => onDelete(p.id)}
                                className="btn"
                                style={{
                                  background: "rgba(239,68,68,0.10)",
                                  borderColor: "rgba(239,68,68,0.25)",
                                  color: "rgba(239,68,68,0.95)",
                                  borderWidth: 1,
                                  borderStyle: "solid",
                                }}
                              >
                                <Trash2 size={16} /> Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      <style jsx global>{`
        @keyframes teBar {
          0% {
            transform: translateX(-55%);
          }
          50% {
            transform: translateX(10%);
          }
          100% {
            transform: translateX(105%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
