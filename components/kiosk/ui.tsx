import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/** Large touch-target button used for every primary/secondary action in the kiosk. */
export const kioskButton = cva(
  "inline-flex w-full items-center justify-center gap-3 rounded-2xl font-bold transition-colors outline-none select-none focus-visible:ring-4 focus-visible:ring-orange-700/30 disabled:cursor-not-allowed [&_svg]:size-6 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-orange-700 text-white hover:bg-orange-800 active:bg-orange-900 disabled:bg-slate-200 disabled:text-slate-500",
        outline:
          "border-2 border-slate-900 bg-white text-slate-900 hover:bg-slate-50 active:bg-slate-100 disabled:border-slate-300 disabled:text-slate-400",
      },
      size: {
        lg: "min-h-[72px] px-8 text-xl",
        md: "min-h-16 px-6 text-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "lg" },
  },
);

export function KioskButton({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ComponentProps<"button"> & VariantProps<typeof kioskButton>) {
  return (
    <button type={type} className={cn(kioskButton({ variant, size }), className)} {...props} />
  );
}

export const methodTone = {
  cash: "bg-green-100 text-green-800",
  qr: "bg-blue-100 text-blue-700",
  card: "bg-violet-100 text-violet-700",
} as const;

/** Page heading with the payment method's icon tile, as on the payment screens. */
export function ScreenTitle({
  icon,
  tone,
  children,
}: {
  icon: ReactNode;
  tone: keyof typeof methodTone;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <span
        className={cn(
          "flex size-14 shrink-0 items-center justify-center rounded-2xl [&_svg]:size-7",
          methodTone[tone],
        )}
      >
        {icon}
      </span>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{children}</h1>
    </div>
  );
}

/** "Total amount ₱175.00" card shown at the top of each payment screen. */
export function AmountCard({
  label,
  value,
  emphasis = false,
  className,
}: {
  label: string;
  value: string;
  /** Orange amount, used where the amount is the call to action (QR, card). */
  emphasis?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5",
        className,
      )}
    >
      <span className="text-lg font-semibold text-slate-600">{label}</span>
      <span
        className={cn(
          "text-3xl font-extrabold tracking-tight tabular-nums sm:text-[40px]",
          emphasis && "text-orange-800",
        )}
      >
        {value}
      </span>
    </div>
  );
}

/** Centred content column for every screen except item selection. */
export function ScreenContainer({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full px-5 py-8 sm:px-8 lg:py-10", className)}>{children}</div>
  );
}
