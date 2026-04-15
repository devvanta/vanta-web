import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-[0.2em] transition-colors duration-200 cursor-pointer active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-gold text-black hover-real:brightness-110 shadow-[0_0_0_1px_rgba(255,211,0,0.12)]",
  ghost:
    "bg-transparent text-text-primary hover-real:bg-card border border-white/10",
  outline:
    "bg-transparent text-text-primary border border-gold/15 hover-real:border-gold/40 hover-real:text-gold",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
};

type Props = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & (
  | { href: string; onClick?: never; type?: never }
  | { href?: never; onClick?: () => void; type?: "button" | "submit" }
);

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  onClick,
  type,
}: Props) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
