"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      {/* soft background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-25 bg-[--brand-primary]" />
        <div className="absolute -bottom-24 right-1/2 translate-x-1/2 h-[26rem] w-[26rem] rounded-full blur-3xl opacity-20 bg-[--brand-secondary]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden"
      >
        {/* top accent bar */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[--brand-primary] via-[--brand-secondary] to-[--brand-primary]" />

        <div className="p-7 sm:p-8 space-y-5">
          <div className="text-center space-y-1">
            <div className="mx-auto h-12 w-12 rounded-2xl flex items-center justify-center border border-white/10 bg-white/5">
              <span className="text-xl">⚡</span>
            </div>

            <div className="text-[1.6rem] sm:text-3xl font-extrabold tracking-tight">
              iHub
            </div>

            <p className="text-sm text-white/70">Admin Login</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/70">
              Admin Password
            </label>

            <input
              type="password"
              placeholder="Enter admin password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/30 text-white placeholder:text-white/35 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[--brand-secondary]/60 focus:border-transparent"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl py-3 text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.99]"
            style={{
              background:
                "linear-gradient(135deg, var(--brand-secondary), var(--brand-primary))",
            }}
          >
            Login
          </button>

          {error && (
            <p className="text-red-400 text-center text-sm font-medium">
              {error}
            </p>
          )}

          <p className="text-[11px] text-center text-white/45">
            Protected access • For iHub admins only
          </p>
        </div>
      </form>
    </main>
  );
}
