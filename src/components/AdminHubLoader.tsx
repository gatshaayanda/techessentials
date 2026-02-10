// src/components/AdminHubLoader.tsx
"use client";

import { useEffect, useState } from "react";

export default function AdminHubLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fade = setTimeout(() => setFading(true), 1600);
    const hide = setTimeout(() => setVisible(false), 2300);
    return () => {
      clearTimeout(fade);
      clearTimeout(hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="Loading Tech Essentials"
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-[700ms] ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background:
          "radial-gradient(900px 600px at 25% 15%, rgba(25,211,197,0.18), transparent 55%), radial-gradient(900px 600px at 80% 35%, rgba(26,108,255,0.18), transparent 60%), #070b12",
        isolation: "isolate",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div className="w-full max-w-md px-6">
        <div className="rounded-2xl border border-[--border] bg-[--surface] shadow-[0_22px_70px_rgba(0,0,0,0.65)] overflow-hidden">
          <div className="px-6 pt-6 pb-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="h-11 w-11 rounded-xl border border-[--border] bg-[--surface-2] grid place-items-center"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 64 64" width="26" height="26">
                    <defs>
                      <linearGradient id="teBlue" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="var(--brand-primary)" />
                        <stop offset="100%" stopColor="var(--brand-secondary)" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M32 10 52 22v20L32 54 12 42V22z"
                      fill="none"
                      stroke="url(#teBlue)"
                      strokeWidth="4"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M24 33h16"
                      stroke="rgba(232,238,249,0.95)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M32 25v16"
                      stroke="rgba(232,238,249,0.95)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div>
                  <div className="text-lg sm:text-xl font-extrabold tracking-tight text-[--foreground]">
                    Tech Essentials
                  </div>
                  <div className="text-xs sm:text-sm text-[--muted] mt-0.5">
                    POS • Scales • CCTV • Accessories
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-extrabold px-3 py-1 rounded-full border border-[--border] bg-[--surface-2] text-[--foreground]">
                Loading…
              </div>
            </div>

            <p className="mt-4 text-sm text-[--muted]">
              Preparing catalog and packages.
            </p>

            <div className="mt-5 h-2.5 rounded-full bg-[--surface-2] overflow-hidden border border-[--border]">
              <div className="h-full w-[42%] progress" />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-[--muted-2]">
              <span>Fetching products</span>
              <span>Almost ready</span>
            </div>
          </div>

          <div className="px-6 py-4 bg-[--surface-2] border-t border-[--border]">
            <div className="text-[11px] text-[--muted]">
              Tip: Message us on WhatsApp for a quick quote.
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bar {
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
        .progress {
          background: linear-gradient(
            90deg,
            var(--brand-primary),
            var(--brand-secondary),
            var(--brand-primary)
          );
          animation: bar 1.25s cubic-bezier(0.45, 0, 0.25, 1) infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .progress {
            animation: none !important;
            transform: translateX(0) !important;
            width: 60% !important;
          }
        }
      `}</style>
    </div>
  );
}
