import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "default" | "lg" | "full";
}) {
  const sizes = {
    sm: "max-w-3xl",
    default: "max-w-6xl",
    lg: "max-w-7xl",
    full: "max-w-none",
  };
  return (
    <div className={cn("mx-auto w-full px-6 md:px-10", sizes[size], className)}>
      {children}
    </div>
  );
}
