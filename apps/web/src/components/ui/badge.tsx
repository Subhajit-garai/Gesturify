import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "neon";
}

function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-cyan-500/10 text-cyan-300 border border-cyan-500/30",
    secondary: "border-transparent bg-slate-800 text-slate-300 border border-slate-700",
    destructive: "border-transparent bg-rose-500/10 text-rose-300 border border-rose-500/30",
    outline: "text-slate-200 border border-slate-700",
    success: "border-transparent bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
    neon: "border-transparent bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-200 border border-cyan-400/40",
  }[variant];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantStyles,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
