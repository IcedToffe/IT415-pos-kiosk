import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const STEPS = ["Order", "Review", "Payment", "Receipt"] as const;

export type StepState = {
  /** Index of the highlighted step, or null between steps (Payment Successful). */
  active: number | null;
  /** How many steps are finished. */
  done: number;
};

export function TopBar({ step }: { step: StepState }) {
  return (
    <header className="bg-slate-900 text-white">
      <div className="flex h-[84px] items-center justify-between gap-4 px-4 sm:px-8">
        <div className="flex items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-xl bg-orange-700 text-lg font-extrabold">
            CS
          </span>
          <div className="hidden leading-tight sm:block">
            <div className="text-xl font-bold">Campus Store</div>
            <div className="text-sm text-slate-300">Self-service kiosk</div>
          </div>
        </div>

        <ol className="flex gap-1.5 sm:gap-2" aria-label="Progress">
          {STEPS.map((label, i) => {
            const isActive = step.active === i;
            const isDone = i < step.done && !isActive;
            return (
              <li
                key={label}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex h-10 items-center gap-1 rounded-full px-3 text-sm font-semibold whitespace-nowrap sm:px-4 sm:text-base",
                  isActive && "bg-white text-slate-900",
                  isDone && "bg-slate-800 text-white",
                  !isActive && !isDone && "border border-slate-700 text-slate-400",
                )}
              >
                {isDone ? (
                  <Check className="size-4" strokeWidth={3} aria-label="Done:" />
                ) : (
                  <span>{i + 1}</span>
                )}
                <span className={cn(!isActive && "hidden md:inline")}>{label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </header>
  );
}
