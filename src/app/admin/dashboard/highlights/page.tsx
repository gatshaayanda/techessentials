"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Plus, Trash2, RefreshCw } from "lucide-react";

type Highlight = {
  id: string;
  title: string;
  desc: string;
  imageUrl: string;
  order: number;
  showOnHome: boolean;
  isHero?: boolean;
  updatedAt?: any;
};

type UploadedFile = { url?: string } | null | undefined;

function pretty(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

export default function HighlightsAdminPage() {
  const [items, setItems] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingNew, setSavingNew] = useState(false);

  // New highlight draft
  const [draft, setDraft] = useState({
    title: "New Highlight",
    desc: "Enter description…",
    imageUrl: "",
    showOnHome: false,
    isHero: false,
  });

  const heroId = useMemo(
    () => items.find((x) => !!x.isHero)?.id || null,
    [items]
  );

  const load = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(firestore, "highlights"),
        orderBy("order", "asc")
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as Highlight[];
      setItems(data);
    } catch (e) {
      console.error("Highlights load failed:", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createHighlight = async () => {
    if (!draft.imageUrl.trim()) {
      alert("Please upload an image (or paste an image URL).");
      return;
    }

    setSavingNew(true);
    try {
      const nextOrder =
        items.length > 0
          ? Math.max(...items.map((x) => Number(x.order) || 0)) + 1
          : 1;

      const ref = await addDoc(collection(firestore, "highlights"), {
        title: draft.title.trim() || "New Highlight",
        desc: draft.desc.trim() || "",
        imageUrl: draft.imageUrl.trim(),
        order: nextOrder,
        showOnHome: !!draft.showOnHome,
        isHero: !!draft.isHero,
        admin_id: "admin",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // If new one is hero, unset others (local + firestore)
      if (draft.isHero) {
        const others = items.filter((x) => x.id !== ref.id && x.isHero);
        for (const o of others) {
          await updateDoc(doc(firestore, "highlights", o.id), {
            isHero: false,
            updatedAt: serverTimestamp(),
          });
        }
      }

      // Update local state without reload
      const newItem: Highlight = {
        id: ref.id,
        title: draft.title.trim() || "New Highlight",
        desc: draft.desc.trim() || "",
        imageUrl: draft.imageUrl.trim(),
        order: nextOrder,
        showOnHome: !!draft.showOnHome,
        isHero: !!draft.isHero,
      };

      setItems((prev) => {
        const cleared =
          draft.isHero ? prev.map((p) => ({ ...p, isHero: false })) : prev;
        return [...cleared, newItem].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      });

      setDraft({
        title: "New Highlight",
        desc: "Enter description…",
        imageUrl: "",
        showOnHome: false,
        isHero: false,
      });
    } catch (e) {
      console.error("Create highlight failed:", e);
      alert("Failed to create highlight.");
    } finally {
      setSavingNew(false);
    }
  };

  const updateField = async (id: string, patch: Partial<Highlight>) => {
    const current = items.find((x) => x.id === id);
    if (!current) return;

    // skip if nothing actually changes
    const keys = Object.keys(patch) as (keyof Highlight)[];
    if (keys.every((k) => (current as any)[k] === (patch as any)[k])) return;

    try {
      // If turning hero ON: unset all others
      if (patch.isHero === true) {
        const others = items.filter((x) => x.id !== id && x.isHero);
        for (const o of others) {
          await updateDoc(doc(firestore, "highlights", o.id), {
            isHero: false,
            updatedAt: serverTimestamp(),
          });
        }
        setItems((prev) =>
          prev.map((x) => (x.id === id ? { ...x, ...patch } : { ...x, isHero: false }))
        );
      } else {
        setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
      }

      await updateDoc(doc(firestore, "highlights", id), {
        ...patch,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("Update failed:", e);
      alert("Update failed. Check console.");
      // reload state from firestore (truth)
      load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this highlight?")) return;
    try {
      await deleteDoc(doc(firestore, "highlights", id));
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Delete failed. Check console.");
    }
  };

  return (
    <main className="bg-[--background] text-[--foreground]">
      <section className="container py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="badge mb-3">Admin • Highlights</div>
            <h1 className="text-3xl font-extrabold tracking-tight">Manage Highlights</h1>
            <p className="mt-2 text-sm text-[--muted]">
              These power the homepage hero image and any home gallery. Set exactly one item as <b>Hero</b>.
            </p>
            {heroId ? (
              <p className="mt-2 text-xs text-[--muted-2]">
                Current Hero ID: <span className="text-[--foreground]">{heroId}</span>
              </p>
            ) : (
              <p className="mt-2 text-xs text-[--muted-2]">
                No hero set yet — homepage will fallback to <span className="text-[--foreground]">/placeholder.png</span>.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={load} className="btn btn-outline">
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>

        {/* Create card */}
        <div className="mt-7 card">
          <div className="card-inner space-y-4">
            <div className="flex items-center gap-2 font-extrabold">
              <Plus size={18} /> Add new highlight
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold">Title</label>
                <input
                  className="input"
                  value={draft.title}
                  onChange={(e) => setDraft((s) => ({ ...s, title: e.target.value }))}
                  placeholder="e.g. CCTV Packages & Installations"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Image</label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-[--muted]">
                    Upload with UploadThing or paste a URL below.
                  </div>

                  <UploadButton<OurFileRouter, "fileUploader">
                    endpoint="fileUploader"
                    onClientUploadComplete={(res) => {
                      const first: UploadedFile = Array.isArray(res) ? res[0] : null;
                      const url = first?.url;
                      if (url) setDraft((s) => ({ ...s, imageUrl: url }));
                    }}
                    onUploadError={(error: Error) => {
                      alert(`Upload failed: ${error.message}`);
                    }}
                  />
                </div>

                <input
                  className="input"
                  value={draft.imageUrl}
                  onChange={(e) => setDraft((s) => ({ ...s, imageUrl: e.target.value }))}
                  placeholder="https://..."
                />

                {draft.imageUrl ? (
                  <div className="text-xs text-[--muted-2] break-all">
                    Current: <span className="text-[--foreground]">{draft.imageUrl}</span>
                  </div>
                ) : (
                  <div className="text-xs text-[--muted-2]">
                    No image yet — required to save.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Description</label>
              <textarea
                className="input"
                rows={3}
                value={draft.desc}
                onChange={(e) => setDraft((s) => ({ ...s, desc: e.target.value }))}
                placeholder="Short caption shown on hero card."
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-5 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[--brand-primary]"
                    checked={draft.showOnHome}
                    onChange={(e) =>
                      setDraft((s) => ({ ...s, showOnHome: e.target.checked }))
                    }
                  />
                  Show on Home gallery
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[--brand-primary]"
                    checked={draft.isHero}
                    onChange={(e) => setDraft((s) => ({ ...s, isHero: e.target.checked }))}
                  />
                  Set as Hero
                </label>
              </div>

              <button
                onClick={createHighlight}
                disabled={savingNew}
                className="btn btn-primary"
              >
                {savingNew ? "Saving…" : "Create Highlight"}
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="mt-8">
          {loading ? (
            <div className="card">
              <div className="card-inner">Loading highlights…</div>
            </div>
          ) : items.length === 0 ? (
            <div className="card">
              <div className="card-inner">
                No highlights yet. Create one above to control the homepage image.
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div key={item.id} className="card overflow-hidden">
                  <div className="relative aspect-[4/3] bg-[--surface-2]">
                    {/* use img to avoid next/image domain config issues for admin */}
                    <img
                      src={item.imageUrl || "/placeholder.png"}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {item.isHero ? <span className="tag">Hero</span> : null}
                      {item.showOnHome ? <span className="tag">Home</span> : null}
                    </div>
                  </div>

                  <div className="card-inner space-y-3">
                    <input
                      className="input"
                      value={item.title}
                      onChange={(e) => updateField(item.id, { title: e.target.value })}
                    />

                    <textarea
                      className="input"
                      rows={3}
                      value={item.desc}
                      onChange={(e) => updateField(item.id, { desc: e.target.value })}
                    />

                    <input
                      className="input"
                      value={item.imageUrl}
                      onChange={(e) => updateField(item.id, { imageUrl: e.target.value })}
                      placeholder="Image URL"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-[--brand-primary]"
                          checked={!!item.showOnHome}
                          onChange={(e) =>
                            updateField(item.id, { showOnHome: e.target.checked })
                          }
                        />
                        Show on Home
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-[--brand-primary]"
                          checked={!!item.isHero}
                          onChange={(e) => updateField(item.id, { isHero: e.target.checked })}
                        />
                        Set as Hero
                      </label>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-[--muted]">Order:</span>
                        <input
                          type="number"
                          className="input"
                          style={{ width: 90, padding: "10px 12px" }}
                          value={pretty(Number(item.order))}
                          onChange={(e) =>
                            updateField(item.id, { order: pretty(Number(e.target.value)) })
                          }
                        />
                      </div>

                      <button
                        onClick={() => remove(item.id)}
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
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
