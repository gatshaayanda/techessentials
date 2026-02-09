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
      <section className="container py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">New Product</h1>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
          <input
            className="form-input w-full"
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          />

          <select
            className="form-input w-full"
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

          <input
            className="form-input w-full"
            placeholder="Brand (optional)"
            value={form.brand}
            onChange={(e) => setForm((s) => ({ ...s, brand: e.target.value }))}
          />

          <input
            className="form-input w-full"
            placeholder="Price (e.g. 3500)"
            value={form.price}
            onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isDeal}
              onChange={(e) =>
                setForm((s) => ({ ...s, isDeal: e.target.checked }))
              }
            />
            This is a deal
          </label>

          {form.isDeal && (
            <input
              className="form-input w-full"
              placeholder="Deal price"
              value={form.dealPrice}
              onChange={(e) =>
                setForm((s) => ({ ...s, dealPrice: e.target.value }))
              }
            />
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) =>
                setForm((s) => ({ ...s, inStock: e.target.checked }))
              }
            />
            In stock
          </label>

          {/* ✅ UploadThing (correct generics for your version) */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Upload image</div>

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

            {form.imageUrl && (
              <div className="text-xs opacity-70 break-all">
                Current image URL: {form.imageUrl}
              </div>
            )}
          </div>

          {/* Manual URL */}
          <input
            className="form-input w-full"
            placeholder="Or paste image URL"
            value={form.imageUrl}
            onChange={(e) =>
              setForm((s) => ({ ...s, imageUrl: e.target.value }))
            }
          />

          <textarea
            className="form-input w-full"
            rows={4}
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) =>
              setForm((s) => ({ ...s, description: e.target.value }))
            }
          />

          <div className="flex gap-3 pt-2">
            <button
              disabled={saving}
              onClick={save}
              className="px-4 py-2 rounded-lg bg-[--brand-primary] hover:opacity-90 transition text-sm font-semibold"
            >
              {saving ? "Saving…" : "Save"}
            </button>

            <button
              onClick={() => history.back()}
              className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
