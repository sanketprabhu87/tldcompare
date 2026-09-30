"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBox({ large = false }: { large?: boolean }) {
  const [q, setQ] = useState("");
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <form onSubmit={onSubmit} className={large ? "w-full max-w-2xl mx-auto" : "w-full"}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Enter domain or keyword (e.g. example, mybusiness.com)"
            className={large ? "h-12 pl-10 text-base" : "pl-10"}
            aria-label="Domain search"
          />
        </div>
        <Button type="submit" size={large ? "lg" : "default"} className={large ? "h-12 px-6" : ""}>
          Search Domains
        </Button>
      </div>
      {large && (
        <p className="mt-2 text-sm text-muted-foreground text-center">
          Examples: example.com · mybusiness · ai startup
        </p>
      )}
    </form>
  );
}
