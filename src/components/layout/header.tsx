"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "/tlds", label: "TLDs" },
  { href: "/search", label: "Search" },
  { href: "/compare", label: "Compare" },
  { href: "/registrars", label: "Registrars" },
  { href: "/calculator", label: "Cost Calculator" },
  { href: "/setup", label: "Website Setup" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          <span className="text-brand-600">TLD</span> Compare
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-slate-600 hover:text-slate-900">
              {n.label}
            </Link>
          ))}
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="border-t px-4 py-3 md:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="block py-2 text-sm" onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
