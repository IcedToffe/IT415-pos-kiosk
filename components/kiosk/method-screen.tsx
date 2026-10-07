import { ArrowLeft, Banknote, CreditCard, QrCode, type LucideIcon } from "lucide-react";

import { peso } from "@/lib/pos/money";
import type { PaymentMethod } from "@/lib/pos/products";
import { cn } from "@/lib/utils";
import { KioskButton, methodTone, ScreenContainer } from "./ui";

const METHODS: {
  method: PaymentMethod;
  label: string;
  description: string;
  icon: LucideIcon;
  tone: keyof typeof methodTone;
}[] = [
  {
    method: "Cash",
    label: "Cash",
    description: "Enter the amount you are paying. Change is computed for you.",
    icon: Banknote,
    tone: "cash",
  },
  {
    method: "QR Payment",
    label: "QR Payment",
    description: "Scan with a supported e-wallet or banking app.",
    icon: QrCode,
    tone: "qr",
  },
  {
    method: "Credit/Debit Card",
    label: "Credit / Debit Card",
    description: "Tap, insert, or swipe your card at the reader.",
    icon: CreditCard,
    tone: "card",
  },
];

type Props = {
  total: number;
  onChoose: (method: PaymentMethod) => void;
  onBack: () => void;
};

export function MethodScreen({ total, onChoose, onBack }: Props) {
  return (
    <ScreenContainer className="max-w-[1200px]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">
            How would you like to pay?
          </h1>
          <p className="mt-2 text-lg text-slate-600">Tap one of the options below.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-right">
          <div className="text-sm font-semibold tracking-wider text-slate-600 uppercase">
            Amount due
          </div>
          <div className="text-4xl font-extrabold tracking-tight text-orange-800 tabular-nums sm:text-[40px]">
            {peso(total)}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
        {METHODS.map(({ method, label, description, icon: Icon, tone }) => (
          <button
            key={method}
            type="button"
            onClick={() => onChoose(method)}
            className="flex items-center gap-5 rounded-3xl border-2 border-slate-200 bg-white p-5 text-left transition outline-none hover:border-slate-300 focus-visible:ring-4 focus-visible:ring-orange-700/30 active:scale-[0.99] md:flex-col md:gap-0 md:px-7 md:py-12 md:text-center"
          >
            <span
              className={cn(
                "flex size-20 shrink-0 items-center justify-center rounded-full md:size-36",
                methodTone[tone],
              )}
            >
              <Icon className="size-10 md:size-16" strokeWidth={1.75} aria-hidden />
            </span>
            <span>
              <span className="block text-2xl leading-tight font-bold md:mt-8 md:text-[34px]">
                {label}
              </span>
              <span className="mt-1 block text-slate-600 md:mt-4 md:text-lg">{description}</span>
            </span>
          </button>
        ))}
      </div>

      <KioskButton variant="outline" onClick={onBack} className="mt-8 sm:w-auto sm:px-14">
        <ArrowLeft aria-hidden />
        Back to Order
      </KioskButton>
    </ScreenContainer>
  );
}
