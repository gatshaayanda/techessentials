// src/components/LogoMktMark.tsx
"use client";

import type React from "react";

type Props = React.SVGProps<SVGSVGElement>;

/**
 * iHub Mark — Tech Orb
 * - Neon brand gradient (blue → purple → green)
 * - Slow shimmer sweep
 * - Gentle breathing pulse
 * - Clean rim + subtle depth shadow
 */
export default function LogoMktMark(props: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="iHub Mark"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={`hub-pulse ${props.className || ""}`}
    >
      <defs>
        {/* Base neon gradient */}
        <linearGradient id="hubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-primary)" />
          <stop offset="55%" stopColor="var(--brand-accent)" />
          <stop offset="100%" stopColor="var(--brand-secondary)" />
        </linearGradient>

        {/* Inner glow */}
        <radialGradient id="hubGlow" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="25%" stopColor="rgba(168,85,247,0.55)" />
          <stop offset="60%" stopColor="rgba(37,99,235,0.35)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Soft shimmer sweep */}
        <linearGradient id="sweep" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="45%" stopColor="rgba(255,255,255,0.85)">
            <animate
              attributeName="offset"
              values="-1; 2"
              dur="7.5s"
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
      <circle cx="32" cy="32" r="18" fill="#000" opacity="0.22" />

      {/* Orb */}
      <g mask="url(#sweepMask)">
        <circle cx="32" cy="32" r="18" fill="url(#hubGrad)" />
      </g>

      {/* Glow bloom */}
      <circle cx="32" cy="32" r="26" fill="url(#hubGlow)" opacity="0.75" />

      {/* Rim */}
      <circle
        cx="32"
        cy="32"
        r="18"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="0.9"
      />

      {/* Circuit ring */}
      <circle
        cx="32"
        cy="32"
        r="24"
        fill="none"
        stroke="url(#hubGrad)"
        strokeWidth="1.6"
        strokeDasharray="7 6"
        className="spin-slow"
        opacity="0.9"
      />

      {/* Nodes */}
      <circle cx="14" cy="22" r="2" fill="var(--brand-primary)" opacity="0.95" />
      <circle cx="50" cy="18" r="2" fill="var(--brand-accent)" opacity="0.95" />
      <circle cx="52" cy="46" r="2" fill="var(--brand-secondary)" opacity="0.95" />
      <circle cx="18" cy="50" r="2" fill="var(--brand-primary)" opacity="0.95" />

      <style jsx>{`
        @keyframes pulseSoft {
          0%,
          100% {
            transform: scale(1);
            filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.26))
              drop-shadow(0 0 16px rgba(168, 85, 247, 0.18))
              drop-shadow(0 0 18px rgba(52, 211, 153, 0.12));
          }
          50% {
            transform: scale(1.05);
            filter: drop-shadow(0 0 14px rgba(96, 165, 250, 0.38))
              drop-shadow(0 0 22px rgba(168, 85, 247, 0.24))
              drop-shadow(0 0 26px rgba(52, 211, 153, 0.18));
          }
        }
        .hub-pulse {
          animation: pulseSoft 5.2s cubic-bezier(0.45, 0, 0.25, 1) infinite;
          transform-origin: center;
          transition: filter 0.8s ease;
        }
        .hub-pulse:hover {
          filter: drop-shadow(0 0 16px rgba(96, 165, 250, 0.44))
            drop-shadow(0 0 26px rgba(168, 85, 247, 0.28))
            drop-shadow(0 0 32px rgba(52, 211, 153, 0.22));
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
          animation: spin 8s linear infinite;
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
