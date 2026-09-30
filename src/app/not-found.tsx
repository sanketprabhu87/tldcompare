import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <p className="text-sm font-medium text-muted-foreground mb-2">404</p>
      <h1 className="text-3xl font-bold mb-3">Page not found</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        This page may have been moved, removed, or never existed.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/tlds">Browse TLDs</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/search">Domain search</Link>
        </Button>
      </div>
    </div>
  );
}
