// src/components/LogoMkt.tsx
"use client";

import type React from "react";

type Props = React.SVGProps<SVGSVGElement>;

/**
 * Logo — iHub wordmark + tech orb mark
 * - Neon tech gradient (blue → purple → green)
 * - Slow shimmer sweep
 * - Gentle float on the orb
 * - Clean, bold wordmark
 */
export default function LogoMkt(props: Props) {
  return (
    <svg
      viewBox="0 0 320 64"
      role="img"
      aria-label="iHub Logo"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={`logo-fade ${props.className || ""}`}
    >
      <defs>
        {/* Brand gradient */}
        <linearGradient id="hubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-primary)" />
          <stop offset="55%" stopColor="var(--brand-accent)" />
          <stop offset="100%" stopColor="var(--brand-secondary)" />
        </linearGradient>

        {/* Soft inner glow */}
        <radialGradient id="hubGlow" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="30%" stopColor="rgba(168,85,247,0.55)" />
          <stop offset="70%" stopColor="rgba(37,99,235,0.35)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Moving shimmer highlight */}
        <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.9)">
            <animate
              attributeName="offset"
              values="-1; 2"
              dur="7.5s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        <mask id="shineMask">
          <rect width="320" height="64" fill="url(#shine)" />
        </mask>
      </defs>

      {/* Mark */}
      <g transform="translate(40,32)" className="float drop-glow">
        {/* Outer ring */}
        <circle
          cx="0"
          cy="0"
          r="20"
          fill="none"
          stroke="url(#hubGrad)"
          strokeWidth="2"
          strokeDasharray="7 5"
          className="spin-slow"
        />
        {/* Orb */}
        <circle cx="0" cy="0" r="13" fill="url(#hubGrad)" />
        <circle cx="0" cy="0" r="18" fill="url(#hubGlow)" opacity="0.65" />

        {/* Shimmer sweep */}
        <circle
          cx="0"
          cy="0"
          r="13"
          fill="url(#shine)"
          mask="url(#shineMask)"
          opacity="0.35"
        />

        {/* Nodes */}
        <circle cx="-14" cy="-6" r="2" fill="var(--brand-primary)" />
        <circle cx="12" cy="-10" r="2" fill="var(--brand-accent)" />
        <circle cx="14" cy="10" r="2" fill="var(--brand-secondary)" />
      </g>

      {/* Wordmark */}
      <text
        x="78"
        y="41"
        fill="url(#hubGrad)"
        fontFamily="var(--font-sans)"
        fontWeight="800"
        fontSize="28"
        letterSpacing="1.5"
        className="tracking-text"
      >
        iHub
      </text>

      {/* Sub-label */}
      <text
        x="78"
        y="56"
        fill="rgba(231,234,240,0.65)"
        fontFamily="var(--font-sans)"
        fontWeight="700"
        fontSize="11"
        letterSpacing="2.2"
      >
        TECH • GADGETS • WHATSAPP ORDERS
      </text>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .float {
          animation: float 5.2s cubic-bezier(0.45, 0, 0.25, 1) infinite;
          transform-origin: center;
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
          transform-origin: 0px 0px;
          animation: spin 7.5s linear infinite;
        }

        .drop-glow {
          filter: drop-shadow(0 0 12px rgba(96, 165, 250, 0.22))
            drop-shadow(0 0 18px rgba(168, 85, 247, 0.16))
            drop-shadow(0 0 22px rgba(52, 211, 153, 0.12));
          transition: filter 0.8s ease;
        }
        .drop-glow:hover {
          filter: drop-shadow(0 0 16px rgba(96, 165, 250, 0.36))
            drop-shadow(0 0 26px rgba(168, 85, 247, 0.24))
            drop-shadow(0 0 30px rgba(52, 211, 153, 0.2));
        }

        @keyframes textReveal {
          0% {
            opacity: 0;
            letter-spacing: 0.2em;
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            letter-spacing: 0.06em;
            transform: translateY(0);
          }
        }
        .tracking-text {
          animation: textReveal 1.1s cubic-bezier(0.45, 0, 0.25, 1) forwards;
        }

        @keyframes fadeInLogo {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .logo-fade {
          animation: fadeInLogo 0.6s ease-in forwards;
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
