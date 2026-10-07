"use client";

import { useState } from "react";
import { ArrowLeft, Banknote, CircleAlert, Delete } from "lucide-react";

import { checkCashPayment, parseAmount, peso, type PaymentError } from "@/lib/pos/money";
import { cn } from "@/lib/utils";
import { AmountCard, KioskButton, ScreenContainer, ScreenTitle } from "./ui";

const QUICK_AMOUNTS = [20000, 50000, 100000]; // ₱200, ₱500, ₱1,000 in centavos
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"] as const;
const MAX_LENGTH = 9;

type Props = {
  total: number;
  onPay: (paidCents: number) => void;
  onError: (message: string) => void;
  onBack: () => void;
};

export function CashScreen({ total, onPay, onError, onBack }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<PaymentError | null>(null);
  /** After a quick amount, the next keypad digit starts a fresh number. */
  const [replaceOnType, setReplaceOnType] = useState(false);

  const parsed = parseAmount(value);
  const paidCents = parsed.ok ? parsed.cents : null;
  const change = paidCents !== null && paidCents >= total ? paidCents - total : null;

  const update = (next: string, fromQuick = false) => {
    setValue(next);
    setError(null);
    setReplaceOnType(fromQuick);
  };

  const pressKey = (key: (typeof KEYS)[number]) => {
    if (key === "clear") return update("");
    if (key === "back") return update(replaceOnType ? "" : value.slice(0, -1));
    const base = replaceOnType ? "" : value;
    if (/\.\d{2}$/.test(base) || base.length >= MAX_LENGTH) return;
    update(base === "0" ? key : base + key);
  };

  const pay = () => {
    const result = checkCashPayment(value, total);
    if (!result.ok) {
      setError({ title: result.title, detail: result.detail });
      onError(result.title.replace(/\.$/, ""));
      return; // stay on this screen: no receipt, no stock change
    }
    onPay(result.cents);
  };

  const quick = [
    { label: "Exact", cents: total },
    ...QUICK_AMOUNTS.map((cents) => ({ label: peso(cents).replace(/\.00$/, ""), cents })),
  ];

  return (
    <ScreenContainer className="grid max-w-[1220px] gap-8 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-10">
      <div>
        <ScreenTitle icon={<Banknote aria-hidden />} tone="cash">
          Cash Payment
        </ScreenTitle>

        <AmountCard label="Total amount" value={peso(total)} className="mt-6" />

        <label htmlFor="cash-amount" className="mt-6 block text-lg font-semibold">
          Amount paid
        </label>
        <div
          className={cn(
            "mt-2 flex h-20 items-center rounded-2xl border-2 bg-white px-6 focus-within:ring-4",
            error
              ? "border-red-700 focus-within:ring-red-700/20"
              : "border-slate-900 focus-within:ring-orange-700/20",
          )}
        >
          <span className="text-3xl font-extrabold sm:text-[40px]" aria-hidden>
            ₱
          </span>
          <input
            id="cash-amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            value={value}
            onChange={(e) => update(e.target.value.replace(/[^\d.,]/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && pay()}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "cash-error" : undefined}
            className="w-full min-w-0 bg-transparent text-3xl font-extrabold tabular-nums outline-none select-text placeholder:text-slate-300 sm:text-[40px]"
          />
        </div>

        {error && (
          <div
            id="cash-error"
            role="alert"
            className="mt-5 flex gap-3 rounded-2xl border border-red-300 bg-red-50 px-6 py-4 text-red-800"
          >
            <CircleAlert className="mt-0.5 size-6 shrink-0" aria-hidden />
            <div>
              <div className="text-lg font-bold">{error.title}</div>
              <div>{error.detail}</div>
            </div>
          </div>
        )}

        <div className="mt-5 text-base font-semibold text-slate-600">Quick amounts</div>
        <div className="mt-2 grid grid-cols-4 gap-2 sm:gap-3">
          {quick.map((q) => {
            const selected = paidCents === q.cents;
            return (
              <button
                key={q.label}
                type="button"
                aria-pressed={selected}
                onClick={() => update((q.cents / 100).toFixed(2), true)}
                className={cn(
                  "h-16 rounded-xl border text-base font-bold transition-colors outline-none focus-visible:ring-4 focus-visible:ring-orange-700/30 sm:text-lg",
                  selected
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white hover:bg-slate-50",
                )}
              >
                {q.label}
              </button>
            );
          })}
        </div>

        {change !== null ? (
          <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border-2 border-green-300 bg-green-50 px-6 py-5 text-green-800">
            <div>
              <div className="text-xl font-bold">Change</div>
              <div className="text-sm tabular-nums">
                {peso(paidCents!)} − {peso(total)}
              </div>
            </div>
            <div className="text-4xl font-extrabold tracking-tight tabular-nums sm:text-[44px]">
              {peso(change)}
            </div>
          </div>
        ) : (
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-100 px-6 py-5 text-slate-500">
            <span className="text-xl font-bold">Change</span>
            <span className="text-3xl font-bold" aria-label="Not yet calculated">
              —
            </span>
          </div>
        )}
      </div>

      <div>
        <div className="grid grid-cols-3 gap-3">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => pressKey(key)}
              aria-label={key === "back" ? "Backspace" : key === "clear" ? "Clear amount" : key}
              className={cn(
                "flex h-16 items-center justify-center rounded-2xl border border-slate-200 text-3xl font-bold transition-colors outline-none focus-visible:ring-4 focus-visible:ring-orange-700/30 sm:h-20 lg:h-[108px]",
                key === "clear" || key === "back"
                  ? "bg-slate-100 text-2xl hover:bg-slate-200"
                  : "bg-white hover:bg-slate-50 active:bg-slate-100",
              )}
            >
              {key === "back" ? (
                <Delete className="size-8" aria-hidden />
              ) : key === "clear" ? (
                "Clear"
              ) : (
                key
              )}
            </button>
          ))}
        </div>
        <KioskButton onClick={pay} className="mt-4">
          Pay Now
        </KioskButton>
        <KioskButton variant="outline" size="md" onClick={onBack} className="mt-4">
          <ArrowLeft aria-hidden />
          Change payment method
        </KioskButton>
      </div>
    </ScreenContainer>
  );
}
