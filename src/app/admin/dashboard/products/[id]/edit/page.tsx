"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";

type Category = "phones" | "laptops" | "gadgets" | "clothing" | "shoes";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "phones" as Category,
    brand: "",
    price: "",
    dealPrice: "",
    isDeal: false,
    inStock: true,
    imageUrl: "",
    description: "",
  });

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        if (!id) return;

        setLoading(true);
        const ref = doc(firestore, "products", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) throw new Error("Not found");

        const p = snap.data() as any;
        if (!alive) return;

        setForm({
          name: p.name ?? "",
          category: (p.category ?? "phones") as Category,
          brand: p.brand ?? "",
          price: String(p.price ?? ""),
          dealPrice: p.dealPrice ? String(p.dealPrice) : "",
          isDeal: !!p.isDeal,
          inStock: !!p.inStock,
          imageUrl: p.imageUrl ?? "",
          description: p.description ?? "",
        });
      } catch (e) {
        console.error("Load product failed:", e);
        alert("Could not load product.");
        router.push("/admin/dashboard/products");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id, router]);

  const save = async () => {
    if (!id) return;

    if (!form.name.trim()) return alert("Name required");

    const price = Number(form.price);
    if (!Number.isFinite(price)) return alert("Valid price required");

    const dealPrice = form.dealPrice ? Number(form.dealPrice) : null;
    if (form.isDeal && form.dealPrice && !Number.isFinite(dealPrice)) {
      return alert("Valid deal price required");
    }

    setSaving(true);
    try {
      await updateDoc(doc(firestore, "products", id), {
        name: form.name.trim(),
        category: form.category,
        brand: form.brand.trim() || null,
        price,
        dealPrice: form.isDeal ? dealPrice : null,
        isDeal: !!form.isDeal,
        inStock: !!form.inStock,
        imageUrl: form.imageUrl.trim() || "/placeholder.png",
        description: form.description.trim() || null,
        updatedAt: serverTimestamp(),
      });

      router.push("/admin/dashboard/products");
    } catch (e) {
      console.error("Update failed:", e);
      alert("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-[--background] text-[--foreground]">
        <section className="container py-10 max-w-3xl">
          <div className="card">
            <div className="card-inner">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="badge">Admin • Edit</div>
                  <div className="mt-2 text-xl font-extrabold tracking-tight">
                    Loading product…
                  </div>
                  <div className="mt-1 text-sm text-[--muted]">
                    Fetching details from Firestore.
                  </div>
                </div>
                <div className="h-10 w-10 rounded-xl border border-[--border] bg-[--surface-2] animate-pulse" />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-11 rounded-xl border border-[--border] bg-[--surface-2] animate-pulse"
                  />
                ))}
                <div className="sm:col-span-2 h-28 rounded-xl border border-[--border] bg-[--surface-2] animate-pulse" />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[--background] text-[--foreground]">
      <section className="container py-10 max-w-3xl">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="badge">Admin • Edit</div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
              Edit Product
            </h1>
            <p className="mt-2 text-sm text-[--muted]">
              Update item details, stock, and pricing. Changes go live in the
              public catalog.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => history.back()}
              className="btn btn-outline"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="mt-6 card">
          <div className="card-inner space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold">Product name</label>
              <input
                className="input"
                placeholder="e.g. POS Package (Touch + Printer + Drawer)"
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              />
            </div>

            {/* Category + Brand */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold">Category</label>
                <select
                  className="input"
                  value={form.category}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      category: e.target.value as Category,
                    }))
                  }
                >
                  <option value="phones">Phones</option>
                  <option value="laptops">Laptops</option>
                  <option value="gadgets">Gadgets</option>
                  <option value="clothing">Clothing</option>
                  <option value="shoes">Shoes</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">
                  Brand <span className="muted">(optional)</span>
                </label>
                <input
                  className="input"
                  placeholder="e.g. Hikvision / Dahua / HP"
                  value={form.brand}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, brand: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Price + Stock */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold">Price</label>
                <input
                  className="input"
                  inputMode="numeric"
                  placeholder="e.g. 3500"
                  value={form.price}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, price: e.target.value }))
                  }
                />
                <div className="text-xs text-[--muted-2]">
                  Enter numbers only (P is added automatically).
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Stock status</label>
                <div className="flex items-center justify-between rounded-xl border border-[--border] bg-[--surface-2] px-4 py-3">
                  <div>
                    <div className="font-bold text-sm">In stock</div>
                    <div className="text-xs text-[--muted]">
                      Turn off if item is currently unavailable.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, inStock: e.target.checked }))
                    }
                    className="h-5 w-5 accent-[--brand-primary]"
                    aria-label="In stock"
                  />
                </div>
              </div>
            </div>

            {/* Deal */}
            <div className="rounded-xl border border-[--border] bg-[--surface-2] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-extrabold">Deal / Promo</div>
                  <div className="text-sm text-[--muted]">
                    Mark as a deal and set a promotional price.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.isDeal}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, isDeal: e.target.checked }))
                  }
                  className="h-5 w-5 accent-[--brand-primary]"
                  aria-label="This is a deal"
                />
              </div>

              {form.isDeal && (
                <div className="mt-4 space-y-2">
                  <label className="text-sm font-bold">Deal price</label>
                  <input
                    className="input"
                    inputMode="numeric"
                    placeholder="e.g. 2999"
                    value={form.dealPrice}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, dealPrice: e.target.value }))
                    }
                  />
                </div>
              )}
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-sm font-bold">
                Image URL <span className="muted">(optional)</span>
              </label>
              <input
                className="input"
                placeholder="https://... (or leave blank to use /placeholder.png)"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((s) => ({ ...s, imageUrl: e.target.value }))
                }
              />
              <div className="text-xs text-[--muted-2] break-all">
                {form.imageUrl
                  ? `Current: ${form.imageUrl}`
                  : "No image URL set — will fallback to /placeholder.png"}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold">
                Description <span className="muted">(optional)</span>
              </label>
              <textarea
                className="input"
                rows={5}
                placeholder="Add specs, what's included, warranty notes, installation info, etc."
                value={form.description}
                onChange={(e) =>
                  setForm((s) => ({ ...s, description: e.target.value }))
                }
              />
            </div>

            {/* Bottom actions */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={() => history.back()}
                className="btn btn-outline"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
