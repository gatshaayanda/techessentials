// src/components/LogoMkt.tsx
"use client";

import type React from "react";

type Props = React.SVGProps<SVGSVGElement>;

/**
 * Logo — Tech Essentials wordmark + secure tech core mark
 * - Clean corporate blue gradient
 * - Slow shimmer sweep
 * - Gentle float on the mark
 * - Bold, trustworthy wordmark
 */
export default function LogoMkt(props: Props) {
  return (
    <svg
      viewBox="0 0 420 64"
      role="img"
      aria-label="Tech Essentials Logo"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={`logo-fade ${props.className || ""}`}
    >
      <defs>
        {/* Brand gradient */}
        <linearGradient id="teGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-primary)" />
          <stop offset="60%" stopColor="var(--brand-secondary)" />
          <stop offset="100%" stopColor="var(--brand-primary)" />
        </linearGradient>

        {/* Soft inner glow */}
        <radialGradient id="teGlow" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
          <stop offset="35%" stopColor="rgba(14,165,233,0.42)" />
          <stop offset="75%" stopColor="rgba(11,94,215,0.26)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Moving shimmer highlight */}
        <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.9)">
            <animate
              attributeName="offset"
              values="-1; 2"
              dur="9s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        <mask id="shineMask">
          <rect width="420" height="64" fill="url(#shine)" />
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
          stroke="url(#teGrad)"
          strokeWidth="2"
          strokeDasharray="7 6"
          className="spin-slow"
        />
        {/* Core */}
        <circle cx="0" cy="0" r="13" fill="url(#teGrad)" />
        <circle cx="0" cy="0" r="18" fill="url(#teGlow)" opacity="0.6" />

        {/* Shimmer sweep */}
        <circle
          cx="0"
          cy="0"
          r="13"
          fill="url(#shine)"
          mask="url(#shineMask)"
          opacity="0.28"
        />

        {/* Nodes */}
        <circle cx="-14" cy="-6" r="2" fill="var(--brand-primary)" />
        <circle cx="12" cy="-10" r="2" fill="var(--brand-secondary)" />
        <circle cx="14" cy="10" r="2" fill="var(--brand-primary)" />
      </g>

      {/* Wordmark */}
      <text
        x="78"
        y="41"
        fill="url(#teGrad)"
        fontFamily="var(--font-sans)"
        fontWeight="800"
        fontSize="26"
        letterSpacing="0.9"
        className="tracking-text"
      >
        Tech Essentials
      </text>

      {/* Sub-label */}
      <text
        x="78"
        y="56"
        fill="rgba(15,23,42,0.55)"
        fontFamily="var(--font-sans)"
        fontWeight="700"
        fontSize="11"
        letterSpacing="2.0"
      >
        POS • SCALES • CCTV • WHATSAPP ORDERS
      </text>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        .float {
          animation: float 6s cubic-bezier(0.45, 0, 0.25, 1) infinite;
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
          animation: spin 10s linear infinite;
        }

        .drop-glow {
          filter: drop-shadow(0 0 10px rgba(11, 94, 215, 0.16))
            drop-shadow(0 0 16px rgba(14, 165, 233, 0.12));
          transition: filter 0.8s ease;
        }
        .drop-glow:hover {
          filter: drop-shadow(0 0 14px rgba(11, 94, 215, 0.28))
            drop-shadow(0 0 22px rgba(14, 165, 233, 0.2));
        }

        @keyframes textReveal {
          0% {
            opacity: 0;
            letter-spacing: 0.18em;
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            letter-spacing: 0.06em;
            transform: translateY(0);
          }
        }
        .tracking-text {
          animation: textReveal 1.05s cubic-bezier(0.45, 0, 0.25, 1) forwards;
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
