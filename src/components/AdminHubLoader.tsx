// src/components/AdminHubLoader.tsx
"use client";

import { useEffect, useState } from "react";

export default function AdminHubLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fade = setTimeout(() => setFading(true), 2300);
    const hide = setTimeout(() => setVisible(false), 3100);
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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-[1200ms] ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background: "#020617", // solid, fully opaque
        isolation: "isolate", // 🔥 critical fix
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Icon */}
      <div className="relative h-28 w-28 mb-6">
        {/* Reflection */}
        <svg
          viewBox="0 0 64 64"
          className="absolute inset-0 opacity-20 blur-sm scale-y-[-1] translate-y-8"
        >
          <rect
            x="10"
            y="10"
            width="44"
            height="44"
            rx="8"
            fill="rgba(96,165,250,0.6)"
          />
        </svg>

        {/* Main icon */}
        <svg
          viewBox="0 0 64 64"
          width="112"
          height="112"
          className="animate-float drop-glow"
        >
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="35%" r="55%">
              <stop offset="0%" stopColor="#93c5fd">
                <animate
                  attributeName="offset"
                  values="0;0.4;0"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#2563eb" />
            </radialGradient>
          </defs>

          <rect
            x="10"
            y="10"
            width="44"
            height="44"
            rx="10"
            fill="url(#hubGlow)"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="1.4"
          />

          {/* Circuit lines */}
          <path
            d="M22 32h20"
            stroke="rgba(11,18,32,0.9)"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M32 22v20"
            stroke="rgba(11,18,32,0.85)"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="uppercase tracking-[0.28em] text-[1.4rem] sm:text-[1.6rem] fade-in-text font-bold">
        Tech Essentials
      </div>

      {/* Tagline */}
      <div className="text-xs sm:text-sm mt-2 text-[--brand-accent] tracking-widest fade-in-delayed">
        pos • scales • cctv • accessories
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1.5 bg-white/10 overflow-hidden rounded-full mt-8">
        <span
          className="block h-full w-1/3 shimmer"
          style={{
            background: "linear-gradient(90deg,#2563eb,#60a5fa,#2563eb)",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-150%);
          }
          50% {
            transform: translateX(30%);
          }
          100% {
            transform: translateX(150%);
          }
        }
        .shimmer {
          animation: shimmer 2.2s cubic-bezier(0.45, 0, 0.25, 1) infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-float {
          animation: float 4.5s cubic-bezier(0.45, 0, 0.25, 1) infinite;
        }

        .drop-glow {
          filter: drop-shadow(0 0 12px rgba(96, 165, 250, 0.35))
            drop-shadow(0 0 22px rgba(2, 6, 23, 0.35));
          transition: filter 1s ease;
        }

        @keyframes fadeInText {
          0% {
            opacity: 0;
            letter-spacing: 0.35em;
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            letter-spacing: 0.18em;
            transform: translateY(0);
          }
        }
        .fade-in-text {
          animation: fadeInText 1.6s cubic-bezier(0.45, 0, 0.25, 1) forwards;
        }
        .fade-in-delayed {
          opacity: 0;
          animation: fadeInText 1.6s cubic-bezier(0.45, 0, 0.25, 1) 0.5s
            forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
