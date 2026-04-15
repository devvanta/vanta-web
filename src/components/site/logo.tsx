import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`font-display text-2xl tracking-tight text-text-primary ${className ?? ""}`}
    >
      vanta<span className="text-gold">.</span>
    </Link>
  );
}
