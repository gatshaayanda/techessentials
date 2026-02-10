// src/components/LogoMkt.tsx
"use client";

import type React from "react";

type Props = React.SVGProps<SVGSVGElement>;

/**
 * Logo — Tech Essentials wordmark + Hex "te" mark
 * - Flat, professional (no glow / shimmer / spin)
 * - Matches the real Tech Essentials logo (hex + te + node)
 * - Reads clean on light OR dark backgrounds
 */
export default function LogoMkt(props: Props) {
  return (
    <svg
      viewBox="0 0 520 64"
      role="img"
      aria-label="Tech Essentials Logo"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={props.className || ""}
    >
      <defs>
        <linearGradient id="teGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-primary)" />
          <stop offset="100%" stopColor="var(--brand-secondary)" />
        </linearGradient>

        <linearGradient id="teInner" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.60)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.22)" />
        </linearGradient>
      </defs>

      {/* Mark (left) */}
      <g transform="translate(18,8)">
        {/* Hex outline */}
        <path
          d="M32 4.5
             L52.2 16.2
             V43.8
             L32 55.5
             L11.8 43.8
             V16.2
             Z"
          fill="none"
          stroke="url(#teGrad)"
          strokeWidth="4.2"
          strokeLinejoin="round"
        />

        {/* Inner rim */}
        <path
          d="M32 8
             L49.2 18
             V42
             L32 52
             L14.8 42
             V18
             Z"
          fill="none"
          stroke="url(#teInner)"
          strokeWidth="1.1"
          strokeLinejoin="round"
          opacity="0.65"
        />

        {/* "te" monogram */}
        {/* t */}
        <path
          d="M23.5 21.5
             h6.2
             v3.2
             h-1.8
             v15.0
             c0 2.7 1.6 4.1 4.4 4.1
             h1.0
             v3.3
             h-1.8
             c-5.1 0-7.9-2.6-7.9-7.4
             v-15.0
             h-2.0
             v-3.2
             z"
          fill="url(#teGrad)"
        />

        {/* e */}
        <path
          d="M38.8 26.4
             c5.7 0 9.2 3.5 9.2 8.9
             c0 0.7-0.1 1.6-0.2 2.3
             H36.8
             c0.5 2.5 2.4 4.0 5.1 4.0
             c1.8 0 3.4-0.5 4.7-1.5
             l1.5 2.7
             c-1.8 1.4-4.3 2.2-6.8 2.2
             c-5.9 0-9.7-3.7-9.7-9.4
             c0-5.6 3.9-9.2 9.2-9.2
             z
             M36.7 34.6
             H44.5
             c-0.2-2.4-2.0-4.0-4.5-4.0
             c-2.4 0-4.0 1.6-4.3 4.0
             z"
          fill="url(#teGrad)"
        />

        {/* Small node square */}
        <rect
          x="48.7"
          y="27.7"
          width="6.1"
          height="6.1"
          rx="1.4"
          fill="none"
          stroke="url(#teGrad)"
          strokeWidth="2.0"
        />
      </g>

      {/* Wordmark */}
      <text
        x="108"
        y="40"
        fill="var(--foreground)"
        fontFamily="var(--font-sans)"
        fontWeight="900"
        fontSize="22"
        letterSpacing="0.2"
      >
        Tech Essentials
      </text>

      {/* Sub-label */}
      <text
        x="108"
        y="56"
        fill="var(--muted)"
        fontFamily="var(--font-sans)"
        fontWeight="700"
        fontSize="11"
        letterSpacing="1.7"
      >
        POS • SCALES • CCTV • ACCESSORIES
      </text>
    </svg>
  );
}
