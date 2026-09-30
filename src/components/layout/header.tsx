"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/tlds", label: "TLDs" },
  { href: "/search", label: "Domain Search" },
  { href: "/registrars", label: "Registrars" },
  { href: "/cheapest-domain-extensions", label: "Cheapest" },
  { href: "/promo-codes", label: "Promo Codes" },
  { href: "/compare", label: "Compare" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="text-primary">TLD</span>Compare
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
            <Link href="/search" aria-label="Search">
              <Search className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/api/v1/tlds">API</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <div className={cn("md:hidden border-t", open ? "block" : "hidden")}>
        <nav className="container mx-auto flex flex-col gap-1 px-4 py-3">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm hover:bg-accent" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
