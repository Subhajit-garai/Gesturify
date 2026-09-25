import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "neon"
    | "emerald";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const variantStyles = {
      default:
        "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/25 active:scale-95",
      destructive:
        "bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30",
      outline:
        "border border-slate-700 bg-surface-dark hover:bg-slate-800 text-slate-200 hover:text-white",
      secondary:
        "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700/60",
      ghost:
        "hover:bg-slate-800 text-slate-400 hover:text-slate-200",
      link:
        "text-cyan-400 underline-offset-4 hover:underline",
      neon:
        "bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 active:scale-95",
      emerald:
        "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30",
    }[variant];

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-lg px-3 text-xs",
      lg: "h-12 rounded-2xl px-6 text-base",
      icon: "h-10 w-10",
    }[size];

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles, sizeStyles, className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
