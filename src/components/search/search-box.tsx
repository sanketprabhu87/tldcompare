"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchBox({ large }: { large?: boolean }) {
  const [q, setQ] = useState("");
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <form onSubmit={submit} className={large ? "mx-auto w-full max-w-2xl" : "w-full"}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Enter domain or keyword (e.g. mybrand or mybrand.com)"
            className={`w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none ring-brand-500 focus:ring-2 ${large ? "h-12" : "h-10"}`}
            aria-label="Domain search"
          />
        </div>
        <Button type="submit" size={large ? "lg" : "md"}>
          Search
        </Button>
      </div>
    </form>
  );
}
