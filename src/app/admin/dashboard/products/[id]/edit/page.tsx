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
        router.push("/admin/products");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id, router]);

  const save = async () => {
    if (!form.name.trim()) return alert("Name required");
    const price = Number(form.price);
    if (!Number.isFinite(price)) return alert("Valid price required");

    const dealPrice = form.dealPrice ? Number(form.dealPrice) : null;
    if (form.isDeal && form.dealPrice && !Number.isFinite(dealPrice))
      return alert("Valid deal price required");

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

    router.push("/admin/products");
  };

  if (loading) {
    return (
      <main className="bg-[--background] text-[--foreground]">
        <section className="container py-10 max-w-2xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            Loading…
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[--background] text-[--foreground]">
      <section className="container py-10 max-w-2xl">
        <h1 className="text-3xl font-bold">Edit Product</h1>

        <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
          <input
            className="w-full form-input"
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          />

          <select
            className="w-full form-input"
            value={form.category}
            onChange={(e) => setForm((s) => ({ ...s, category: e.target.value as Category }))}
          >
            <option value="phones">Phones</option>
            <option value="laptops">Laptops</option>
            <option value="gadgets">Gadgets</option>
            <option value="clothing">Clothing</option>
            <option value="shoes">Shoes</option>
          </select>

          <input
            className="w-full form-input"
            placeholder="Brand (optional)"
            value={form.brand}
            onChange={(e) => setForm((s) => ({ ...s, brand: e.target.value }))}
          />

          <input
            className="w-full form-input"
            placeholder="Price (e.g. 3500)"
            value={form.price}
            onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isDeal}
              onChange={(e) => setForm((s) => ({ ...s, isDeal: e.target.checked }))}
            />
            This is a deal
          </label>

          {form.isDeal && (
            <input
              className="w-full form-input"
              placeholder="Deal price (e.g. 2999)"
              value={form.dealPrice}
              onChange={(e) => setForm((s) => ({ ...s, dealPrice: e.target.value }))}
            />
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm((s) => ({ ...s, inStock: e.target.checked }))}
            />
            In stock
          </label>

          <input
            className="w-full form-input"
            placeholder="Image URL (optional)"
            value={form.imageUrl}
            onChange={(e) => setForm((s) => ({ ...s, imageUrl: e.target.value }))}
          />

          <textarea
            className="w-full form-input"
            placeholder="Description (optional)"
            rows={4}
            value={form.description}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
          />

          <div className="flex gap-2 pt-2">
            <button
              onClick={save}
              className="px-4 py-2 rounded-lg bg-[--brand-primary] hover:opacity-90 transition text-sm font-semibold"
            >
              Save
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
