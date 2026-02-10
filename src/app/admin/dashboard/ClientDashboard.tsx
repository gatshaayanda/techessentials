'use client';

import { useRouter } from 'next/navigation';
import {
  Monitor,
  Scale,
  Cctv,
  Printer,
  Usb,
  Tag,
  LogOut,
  Package,
  Image as ImageIcon,
} from 'lucide-react';

export default function ClientDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    router.replace('/login');
  };

  const sections = [
    {
  title: "Manage Highlights",
  desc: "Update homepage hero image + home gallery tiles.",
  icon: <ImageIcon size={22} />,
  href: "/admin/dashboard/highlights",
},

    {
      title: 'Manage POS Systems',
      desc: 'Add, edit, and update POS packages, prices, and stock.',
      icon: <Monitor size={22} />,
      href: '/admin/dashboard/products?cat=pos',
    },
    {
      title: 'Manage Scales',
      desc: 'Price computing scales, label scales, pole displays, and more.',
      icon: <Scale size={22} />,
      href: '/admin/dashboard/products?cat=scales',
    },
    {
      title: 'Manage CCTV Packages',
      desc: 'Cameras, DVR/NVR kits, storage options, and installation bundles.',
      icon: <Cctv size={22} />,
      href: '/admin/dashboard/products?cat=cctv',
    },
    {
      title: 'Manage Printers',
      desc: 'Receipt printers, label printers, and compatible POS printing gear.',
      icon: <Printer size={22} />,
      href: '/admin/dashboard/products?cat=printers',
    },
    {
      title: 'Manage Accessories',
      desc: 'Scanners, cash drawers, cables, adapters, and other add-ons.',
      icon: <Usb size={22} />,
      href: '/admin/dashboard/products?cat=accessories',
    },
    {
      title: 'Manage Deals',
      desc: 'Mark items as deals & set promo pricing.',
      icon: <Tag size={22} />,
      href: '/admin/dashboard/products?cat=deals',
    },
    {
      title: 'All Products',
      desc: 'View everything across all categories.',
      icon: <Package size={22} />,
      href: '/admin/dashboard/products',
    },
  ];

  return (
    <main className="min-h-screen bg-[--background] text-[--foreground] px-6 py-12 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          Tech Essentials Admin
        </h1>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition text-sm font-semibold"
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Sections */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((s) => (
          <button
            key={s.title}
            onClick={() => router.push(s.href)}
            className="p-6 rounded-2xl text-left border border-white/10 bg-white/5 hover:bg-white/10 transition shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3 mb-3 text-[--brand-secondary]">
              {s.icon}
              <h2 className="text-lg font-semibold text-[--foreground]">
                {s.title}
              </h2>
            </div>
            <p className="text-sm text-white/70">{s.desc}</p>
          </button>
        ))}
      </section>

      {/* Metrics (static placeholders — keep wiring unchanged) */}
      <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ['POS', '—'],
          ['CCTV', '—'],
          ['Deals', '—'],
        ].map(([label, value]) => (
          <div
            key={label as string}
            className="border border-white/10 bg-white/5 p-5 rounded-2xl text-center"
          >
            <div className="text-xs uppercase text-white/60 tracking-wide">
              {label}
            </div>
            <div className="text-3xl font-bold">{value}</div>
          </div>
        ))}
      </section>
    </main>
  );
}
