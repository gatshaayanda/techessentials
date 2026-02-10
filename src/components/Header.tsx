// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Store,
  Cctv,
  Scale,
  MonitorSmartphone,
  Printer,
  Tag,
  MessageCircle,
  LogOut,
  Search,
  Radio,
  Wrench,
} from "lucide-react";

const WHATSAPP_NUMBER = "+26772545765";

const FACEBOOK_PAGE_PRIMARY = "https://www.facebook.com/techessentialz/";
const FACEBOOK_PAGE_SECONDARY = "https://www.facebook.com/techessentialsbw/";

const CLIENT_LOGIN_PATH = "/client/login";
const CLIENT_PORTAL_PATH = "/client/dashboard";

const nav = [
  { label: "Shop", href: "/", icon: <Store size={18} /> },
  { label: "POS Systems", href: "/c/pos", icon: <MonitorSmartphone size={18} /> },
  { label: "Scales", href: "/c/scales", icon: <Scale size={18} /> },
  { label: "CCTV", href: "/c/cctv", icon: <Cctv size={18} /> },
  { label: "Printers", href: "/c/printers", icon: <Printer size={18} /> },
  { label: "Accessories", href: "/c/accessories", icon: <Wrench size={18} /> },
  { label: "Deals", href: "/deals", icon: <Tag size={18} /> },
];

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const hasRole = (document.cookie || "")
      .split(";")
      .some((c) => c.trim().startsWith("role="));
    setAuthed(hasRole);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const close = () => setOpen(false);

  const onLogout = () => {
    try {
      document.cookie = `role=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      localStorage.removeItem("mkt_client_authed");
    } catch {}
    setAuthed(false);
    router.push("/");
  };

  const brand = useMemo(
    () => (
      <Link
        href="/"
        onClick={close}
        aria-label="Tech Essentials — Home"
        className="flex items-center gap-2.5 select-none"
        prefetch={false}
      >
        <span className="grid place-items-center h-9 w-9 rounded-xl border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <Radio size={18} className="text-[--brand-primary]" />
        </span>
        <span className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-[--foreground] whitespace-nowrap">
          Tech Essentials
        </span>
        <span className="hidden sm:inline text-xs md:text-sm font-semibold text-[--muted] whitespace-nowrap">
          POS • Scales • CCTV • WhatsApp Orders
        </span>
      </Link>
    ),
    []
  );

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    close();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <header className="w-full z-50 bg-[--background] text-[--foreground] border-b border-white/10 overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white text-black px-3 py-2 rounded"
      >
        Skip to content
      </a>

      {/* Top Row */}
      <div className="container flex items-center justify-between py-3 md:py-3.5 gap-3">
        {/* Brand */}
        {brand}

        {/* Desktop: Search */}
        <form
          onSubmit={onSearch}
          className="hidden md:flex flex-1 max-w-[520px] mx-4"
          role="search"
          aria-label="Search products"
        >
          <div className="w-full relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[--muted]"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search POS, scales, CCTV, printers…"
              className="input pl-10 pr-3 py-2.5"
            />
          </div>
        </form>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">


          <a
            href={waLink("Hi Tech Essentials 👋 I need help with POS / Scales / CCTV.")}
            className="btn btn-outline"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>

          <a
            href={FACEBOOK_PAGE_PRIMARY}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
            aria-label="Visit Facebook Page"
          >
            <Radio size={18} />
            Facebook
          </a>

          {!authed ? (
            <Link
              href={CLIENT_LOGIN_PATH}
              className="btn btn-primary"
              prefetch={false}
            >
              Admin Login
            </Link>
          ) : (
            <>
              <Link
                href={CLIENT_PORTAL_PATH}
                className="btn btn-outline"
                prefetch={false}
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="btn btn-outline"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className="md:hidden p-2 rounded-lg border border-white/10 bg-white/5 text-[--foreground]"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:block border-t border-white/10">
        <div className="container flex items-center gap-2 py-2">
          <nav className="flex items-center gap-1 flex-wrap" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`menu-link ${
                  isActive(item.href)
                    ? "bg-white/5 border border-white/10 text-[--foreground]"
                    : ""
                }`}
                prefetch={false}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${
          open ? "max-h-[85vh]" : "max-h-0"
        }`}
        aria-hidden={!open}
      >
        <div className="px-4 pb-4 pt-3 bg-[--background] border-t border-white/10">
          {/* Mobile Search */}
          <form onSubmit={onSearch} className="mb-3" role="search">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[--muted]"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products…"
                className="input pl-10 pr-3 py-2.5"
              />
            </div>
          </form>

          {/* Mobile Nav */}
          <div className="flex flex-col gap-2">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={close}
                className={`menu-link justify-between ${
                  isActive(item.href)
                    ? "bg-white/5 border border-white/10 text-[--foreground]"
                    : ""
                }`}
                prefetch={false}
              >
                <span className="inline-flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </span>
                <span className="text-[--muted]">›</span>
              </Link>
            ))}

            <div className="h-px bg-white/10 my-2" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[--muted]">
                Theme
              </span>
            </div>

            <div className="h-px bg-white/10 my-2" />

            <a
              href={waLink("Hi Tech Essentials 👋 I want to place an order.")}
              onClick={close}
              className="btn btn-primary w-full"
            >
              <MessageCircle size={18} />
              Order on WhatsApp
            </a>

            <a
              href={FACEBOOK_PAGE_PRIMARY}
              target="_blank"
              rel="noreferrer"
              onClick={close}
              className="btn btn-outline w-full"
            >
              <Radio size={18} />
              Facebook
            </a>

            <a
              href={FACEBOOK_PAGE_SECONDARY}
              target="_blank"
              rel="noreferrer"
              onClick={close}
              className="btn btn-outline w-full"
            >
              <Radio size={18} />
              Facebook (Alt)
            </a>

            {!authed ? (
              <Link
                href={CLIENT_LOGIN_PATH}
                onClick={close}
                className="btn btn-outline w-full"
                prefetch={false}
              >
                Admin Login
              </Link>
            ) : (
              <>
                <Link
                  href={CLIENT_PORTAL_PATH}
                  onClick={close}
                  className="btn btn-outline w-full"
                  prefetch={false}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    onLogout();
                  }}
                  className="btn btn-outline w-full"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}

            <div className="h-px bg-white/10 my-2" />

            <a
              href={`tel:${WHATSAPP_NUMBER.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 text-[--muted] text-sm"
            >
              <MessageCircle size={16} />
              +267 72 545 765
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
