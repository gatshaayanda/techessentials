// src/components/LogoMktMark.tsx
"use client";

import type React from "react";

type Props = React.SVGProps<SVGSVGElement>;

/**
 * Tech Essentials Mark — Secure Tech Core
 * - Clean corporate blue gradient
 * - Subtle shimmer sweep (trust, reliability)
 * - Gentle pulse (not flashy)
 * - Precision rim + signal nodes
 */
export default function LogoMktMark(props: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="Tech Essentials Mark"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={`te-pulse ${props.className || ""}`}
    >
      <defs>
        {/* Brand gradient */}
        <linearGradient id="teGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-primary)" />
          <stop offset="60%" stopColor="var(--brand-secondary)" />
          <stop offset="100%" stopColor="var(--brand-primary)" />
        </linearGradient>

        {/* Inner glow */}
        <radialGradient id="teGlow" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="30%" stopColor="rgba(14,165,233,0.45)" />
          <stop offset="65%" stopColor="rgba(11,94,215,0.28)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Subtle shimmer sweep */}
        <linearGradient id="sweep" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="45%" stopColor="rgba(255,255,255,0.85)">
            <animate
              attributeName="offset"
              values="-1; 2"
              dur="9s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        <mask id="sweepMask">
          <rect width="64" height="64" fill="url(#sweep)" />
        </mask>
      </defs>

      {/* Depth shadow */}
      <circle cx="32" cy="32" r="18" fill="#000" opacity="0.18" />

      {/* Core */}
      <g mask="url(#sweepMask)">
        <circle cx="32" cy="32" r="18" fill="url(#teGrad)" />
      </g>

      {/* Glow */}
      <circle cx="32" cy="32" r="26" fill="url(#teGlow)" opacity="0.65" />

      {/* Precision rim */}
      <circle
        cx="32"
        cy="32"
        r="18"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="0.9"
      />

      {/* Signal ring */}
      <circle
        cx="32"
        cy="32"
        r="24"
        fill="none"
        stroke="var(--brand-secondary)"
        strokeWidth="1.4"
        strokeDasharray="6 7"
        className="spin-slow"
        opacity="0.85"
      />

      {/* Signal nodes */}
      <circle cx="14" cy="22" r="2" fill="var(--brand-primary)" />
      <circle cx="50" cy="18" r="2" fill="var(--brand-secondary)" />
      <circle cx="52" cy="46" r="2" fill="var(--brand-primary)" />
      <circle cx="18" cy="50" r="2" fill="var(--brand-secondary)" />

      <style jsx>{`
        @keyframes pulseSoft {
          0%,
          100% {
            transform: scale(1);
            filter: drop-shadow(0 0 8px rgba(11, 94, 215, 0.22))
              drop-shadow(0 0 14px rgba(14, 165, 233, 0.16));
          }
          50% {
            transform: scale(1.04);
            filter: drop-shadow(0 0 12px rgba(11, 94, 215, 0.32))
              drop-shadow(0 0 20px rgba(14, 165, 233, 0.24));
          }
        }

        .te-pulse {
          animation: pulseSoft 6s cubic-bezier(0.45, 0, 0.25, 1) infinite;
          transform-origin: center;
        }

        .te-pulse:hover {
          filter: drop-shadow(0 0 14px rgba(11, 94, 215, 0.4))
            drop-shadow(0 0 22px rgba(14, 165, 233, 0.3));
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .spin-slow {
          transform-origin: 32px 32px;
          animation: spin 10s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </svg>
  );
}
