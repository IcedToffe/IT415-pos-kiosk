"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, CreditCard, LoaderCircle, Nfc } from "lucide-react";

import { peso } from "@/lib/pos/money";
import { cn } from "@/lib/utils";
import { AmountCard, KioskButton, ScreenContainer, ScreenTitle } from "./ui";

const PROCESSING_MS = 2000;

type Props = {
  total: number;
  onComplete: () => void;
  onBack: () => void;
};

export function CardScreen({ total, onComplete, onBack }: Props) {
  const [processing, setProcessing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancel the simulated payment if the screen goes away mid-way.
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const process = () => {
    if (processing) return; // blocks double-submits
    setProcessing(true);
    timer.current = setTimeout(onComplete, PROCESSING_MS);
  };

  return (
    <ScreenContainer className="grid max-w-[1180px] items-center gap-8 lg:min-h-full lg:grid-cols-[460px_minmax(0,1fr)] lg:gap-12">
      <div
        className="flex justify-center rounded-3xl border border-slate-200 bg-white px-6 pt-14 pb-10 sm:py-16"
        aria-hidden
      >
        <div className="relative h-[340px] w-[210px] rounded-[28px] bg-slate-800 sm:h-[400px] sm:w-[230px]">
          <div className="mx-5 mt-5 rounded-xl bg-slate-900 px-4 py-5">
            <div className="font-mono text-xs tracking-widest text-sky-300">
              {processing ? "PROCESSING" : "READY"}
            </div>
            <div className="mt-1 text-2xl font-bold text-white tabular-nums">{peso(total)}</div>
          </div>
          <Nfc className="mx-auto mt-10 size-12 text-sky-300" />
          <div className="absolute bottom-5 left-1/2 h-2 w-32 -translate-x-1/2 rounded-full bg-slate-900" />
          <div
            className={cn(
              "absolute -top-8 -right-16 h-[124px] w-[196px] rotate-[-12deg] rounded-xl bg-violet-700 p-4 shadow-xl transition-transform duration-500",
              processing && "translate-y-6",
            )}
          >
            <div className="h-7 w-9 rounded-md bg-yellow-400" />
            <div className="mt-4 font-mono text-sm tracking-[0.2em] text-white/90">
              •••• •••• ••••
            </div>
            <div className="font-mono text-sm text-white/90">4821</div>
          </div>
        </div>
      </div>

      <div>
        <ScreenTitle icon={<CreditCard aria-hidden />} tone="card">
          Credit / Debit Card
        </ScreenTitle>
        <AmountCard label="Amount due" value={peso(total)} emphasis className="mt-6" />
        <p className="mt-6 text-xl font-bold">Please tap, insert, or swipe your card.</p>

        {processing && (
          <div
            role="status"
            className="mt-4 rounded-2xl border border-violet-300 bg-violet-50 px-6 py-4 text-violet-800"
          >
            <div className="flex items-center gap-3 text-lg font-bold">
              <LoaderCircle className="size-6 animate-spin" aria-hidden />
              Processing payment…
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white">
              <div className="h-full animate-progress rounded-full bg-violet-600" />
            </div>
            <p className="mt-3 text-sm">Do not remove your card until the payment is complete.</p>
          </div>
        )}

        <div className="mt-7 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <KioskButton
            variant="outline"
            onClick={onBack}
            disabled={processing}
            className="order-last sm:order-none"
          >
            <ArrowLeft aria-hidden />
            Back
          </KioskButton>
          <KioskButton
            onClick={process}
            aria-disabled={processing}
            className={cn(processing && "cursor-wait bg-orange-800 hover:bg-orange-800")}
          >
            Process Payment
          </KioskButton>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Simulated payment — no real card is charged. The amount paid will equal the total, with
          ₱0.00 change.
        </p>
      </div>
    </ScreenContainer>
  );
}
