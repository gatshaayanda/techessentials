"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

type Category = "phones" | "laptops" | "gadgets" | "clothing" | "shoes";
type UploadedFile = { url?: string } | null | undefined;

export default function NewProductPage() {
  const router = useRouter();
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

  const save = async () => {
    if (!form.name.trim()) return alert("Product name required");

    const price = Number(form.price);
    if (!Number.isFinite(price)) return alert("Valid price required");

    const dealPrice = form.dealPrice ? Number(form.dealPrice) : null;
    if (form.isDeal && form.dealPrice && !Number.isFinite(dealPrice)) {
      return alert("Valid deal price required");
    }

    setSaving(true);
    try {
      await addDoc(collection(firestore, "products"), {
        name: form.name.trim(),
        category: form.category,
        brand: form.brand.trim() || null,
        price,
        dealPrice: form.isDeal ? dealPrice : null,
        isDeal: !!form.isDeal,
        inStock: !!form.inStock,
        imageUrl: form.imageUrl.trim() || "/placeholder.png",
        description: form.description.trim() || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        admin_id: "admin",
      });

      router.push("/admin/dashboard/products");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="bg-[--background] text-[--foreground]">
      <section className="container py-10 max-w-3xl">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="badge mb-3">Admin • Create</div>
            <h1 className="text-3xl font-extrabold tracking-tight">New Product</h1>
            <p className="mt-2 text-sm text-[--muted]">
              Add an item to the public catalog. Use UploadThing or paste an image URL.
            </p>
          </div>

          <div className="flex gap-2">
            <button onClick={() => history.back()} className="btn btn-outline">
              Cancel
            </button>
            <button disabled={saving} onClick={save} className="btn btn-primary">
              {saving ? "Saving…" : "Save Product"}
            </button>
          </div>
        </div>

        {/* Form Card */}
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
                    setForm((s) => ({ ...s, category: e.target.value as Category }))
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
                  onChange={(e) => setForm((s) => ({ ...s, brand: e.target.value }))}
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
                  onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
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
                    onChange={(e) => setForm((s) => ({ ...s, inStock: e.target.checked }))}
                    className="h-5 w-5 accent-[--brand-primary]"
                    aria-label="In stock"
                  />
                </div>
              </div>
            </div>

            {/* Deal toggle + Deal price */}
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
                  onChange={(e) => setForm((s) => ({ ...s, isDeal: e.target.checked }))}
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
                    onChange={(e) => setForm((s) => ({ ...s, dealPrice: e.target.value }))}
                  />
                </div>
              )}
            </div>

            {/* Upload */}
            <div className="rounded-xl border border-[--border] bg-[--surface] p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-extrabold">Product image</div>
                  <div className="text-sm text-[--muted]">
                    Upload an image, or paste a URL below.
                  </div>
                </div>

                <div className="shrink-0">
                  <UploadButton<OurFileRouter, "fileUploader">
                    endpoint="fileUploader"
                    onClientUploadComplete={(res) => {
                      const first: UploadedFile = Array.isArray(res) ? res[0] : null;
                      const url = first?.url;
                      if (url) setForm((s) => ({ ...s, imageUrl: url }));
                    }}
                    onUploadError={(error: Error) => {
                      alert(`Upload failed: ${error.message}`);
                    }}
                  />
                </div>
              </div>

              {form.imageUrl ? (
                <div className="mt-3 text-xs text-[--muted-2] break-all">
                  Current image URL: <span className="text-[--foreground]">{form.imageUrl}</span>
                </div>
              ) : (
                <div className="mt-3 text-xs text-[--muted-2]">
                  No image yet — will fallback to <span className="text-[--foreground]">/placeholder.png</span>.
                </div>
              )}
            </div>

            {/* Manual URL */}
            <div className="space-y-2">
              <label className="text-sm font-bold">
                Image URL <span className="muted">(optional)</span>
              </label>
              <input
                className="input"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) => setForm((s) => ({ ...s, imageUrl: e.target.value }))}
              />
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
              <button onClick={() => history.back()} className="btn btn-outline" disabled={saving}>
                Cancel
              </button>
              <button onClick={save} className="btn btn-primary" disabled={saving}>
                {saving ? "Saving…" : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
