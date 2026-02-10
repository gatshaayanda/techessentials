// src/components/LogoMktMark.tsx
"use client";

import type React from "react";

type Props = React.SVGProps<SVGSVGElement>;

/**
 * Tech Essentials Mark — Hex + "te" monogram
 * - Flat + professional (no shimmer / glow / spin)
 * - Matches the real Tech Essentials logo shape
 * - Uses brand gradient tokens
 */
export default function LogoMktMark(props: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="Tech Essentials Mark"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={props.className || ""}
    >
      <defs>
        <linearGradient id="teGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-primary)" />
          <stop offset="100%" stopColor="var(--brand-secondary)" />
        </linearGradient>

        {/* For light backgrounds: subtle inner stroke */}
        <linearGradient id="teInner" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.65)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.25)" />
        </linearGradient>
      </defs>

      {/* Hex outline (brand) */}
      <path
        d="M32 6.5
           L52.2 18.2
           V45.8
           L32 57.5
           L11.8 45.8
           V18.2
           Z"
        fill="none"
        stroke="url(#teGrad)"
        strokeWidth="4.2"
        strokeLinejoin="round"
      />

      {/* Inner subtle rim (adds polish, still flat) */}
      <path
        d="M32 10
           L49.2 20
           V44
           L32 54
           L14.8 44
           V20
           Z"
        fill="none"
        stroke="url(#teInner)"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.6"
      />

      {/* "te" monogram (flat, rounded) */}
      {/* t */}
      <path
        d="M24.5 22.5
           h5.5
           v3.2
           h-1.6
           v15.1
           c0 2.8 1.6 4.3 4.4 4.3
           h0.8
           v3.3
           h-1.6
           c-5 0-7.8-2.7-7.8-7.6
           v-15.1
           h-1.7
           v-3.2
           z"
        fill="url(#teGrad)"
      />

      {/* e (rounded open "e") */}
      <path
        d="M38.3 27.2
           c5.8 0 9.4 3.6 9.4 9.1
           c0 0.7-0.1 1.6-0.2 2.3
           H36.2
           c0.5 2.6 2.4 4.1 5.2 4.1
           c1.8 0 3.4-0.5 4.8-1.5
           l1.6 2.7
           c-1.9 1.5-4.3 2.3-6.9 2.3
           c-6 0-9.9-3.8-9.9-9.6
           c0-5.7 3.9-9.4 9.3-9.4
           z
           M36.1 35.2
           H44
           c-0.2-2.5-2.1-4.1-4.6-4.1
           c-2.4 0-4.1 1.6-4.4 4.1
           z"
        fill="url(#teGrad)"
      />

      {/* Little square node (like the logo) */}
      <rect
        x="48.2"
        y="28.2"
        width="6.2"
        height="6.2"
        rx="1.4"
        fill="none"
        stroke="url(#teGrad)"
        strokeWidth="2.1"
      />
    </svg>
  );
}
