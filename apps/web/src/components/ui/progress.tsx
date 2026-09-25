import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0 to 100
  indicatorColor?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, indicatorColor, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-slate-800 border border-slate-700/60",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full w-full flex-1 transition-all duration-300 rounded-full",
          indicatorColor ||
            "bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  )
);
Progress.displayName = "Progress";

export { Progress };
