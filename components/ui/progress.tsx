"use client";

import { cn } from "@/lib/utils";

type ProgressProps = {
  className?: string;
  value: number | null;
  max?: number;
};

function Progress({ className, value, max = 100 }: ProgressProps) {
  const safeValue = value === null ? 0 : Math.min(Math.max(value, 0), max);
  const percentage = max > 0 ? (safeValue / max) * 100 : 0;

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value ?? undefined}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted",
        className,
      )}
    >
      <div
        data-slot="progress-indicator"
        className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export { Progress };
