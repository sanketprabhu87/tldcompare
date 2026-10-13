import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "demo" | "live" | "success" | "warn";
  className?: string;
}) {
  const tones = {
    default: "bg-slate-100 text-slate-700",
    demo: "bg-violet-100 text-violet-800",
    live: "bg-emerald-100 text-emerald-800",
    success: "bg-green-100 text-green-800",
    warn: "bg-amber-100 text-amber-800",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}
