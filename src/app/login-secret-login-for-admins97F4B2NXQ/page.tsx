"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LogoMktMark from "@/components/LogoMktMark";

export default function LoginPage() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      const { error: msg } = await res.json().catch(() => ({ error: "" }));
      setError(msg || "Login failed");
      setPw("");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[--background] text-[--foreground] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-[--border] bg-[--surface] shadow-[0_22px_60px_rgba(11,18,32,0.12)] overflow-hidden"
      >
        {/* clean top bar (not neon) */}
        <div className="h-[3px] w-full bg-[--brand-primary]" />

        <div className="p-7 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl border border-[--border] bg-[--surface-2] grid place-items-center">
              <LogoMktMark className="h-7 w-7" />
            </div>

            <div className="leading-tight">
              <div className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Tech Essentials
              </div>
              <div className="text-xs sm:text-sm text-[--muted] font-semibold">
                Admin Login • POS • Scales • CCTV • Accessories
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[--border]" />

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[--muted]">
              Admin Password
            </label>

            <input
              type="password"
              placeholder="Enter admin password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="input"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>

          {error && (
            <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-600 font-semibold">
              {error}
            </div>
          )}

          <p className="text-[11px] text-[--muted-2] text-center">
            Protected access • For Tech Essentials admins only
          </p>
        </div>
      </form>
    </main>
  );
}
