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
import { Plus, Trash2, Pencil, Tag } from "lucide-react";
import { useSearchParams } from "next/navigation";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  dealPrice?: number;
  isDeal: boolean;
  inStock: boolean;
  updatedAt?: any;
};

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const cat = (searchParams.get("cat") || "").toLowerCase();

  const load = async () => {
    setLoading(true);
    try {
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
  }, []);

  const filtered = useMemo(() => {
    if (!cat) return items;

    if (cat === "deals") return items.filter((p) => p.isDeal);

    return items.filter((p) => (p.category || "").toLowerCase() === cat);
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

  return (
    <main className="bg-[--background] text-[--foreground]">
      <section className="container py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Products {cat ? `• ${cat}` : ""}
            </h1>
            <p className="text-sm text-white/70 mt-1">
              Add, edit, delete products for the public store.
            </p>
          </div>

          <Link
            href="/admin/dashboard/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[--brand-primary] hover:opacity-90 transition text-sm font-semibold"
          >
            <Plus size={18} /> New Product
          </Link>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              No products yet. Click “New Product”.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.keys(grouped)
                .sort()
                .map((catKey) => (
                  <div
                    key={catKey}
                    className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
                  >
                    <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                      <div className="font-semibold capitalize">{catKey}</div>
                      <button
                        onClick={load}
                        className="text-xs px-3 py-1 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 transition"
                      >
                        Refresh
                      </button>
                    </div>

                    <div className="divide-y divide-white/10">
                      {grouped[catKey].map((p) => (
                        <div
                          key={p.id}
                          className="px-5 py-4 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              {p.name}
                              {p.isDeal && <Tag size={16} className="opacity-80" />}
                              {!p.inStock && (
                                <span className="text-xs px-2 py-0.5 rounded bg-black/40 border border-white/15">
                                  out of stock
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-white/70">
                              Price: P{p.price}
                              {p.isDeal && p.dealPrice
                                ? ` • Deal: P${p.dealPrice}`
                                : ""}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/dashboard/products/${p.id}/edit`}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition text-sm"
                            >
                              <Pencil size={16} /> Edit
                            </Link>
                            <button
                              onClick={() => onDelete(p.id)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition text-sm"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
