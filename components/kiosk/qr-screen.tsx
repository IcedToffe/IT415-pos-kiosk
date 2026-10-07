import { ArrowLeft, Check, QrCode } from "lucide-react";

import { peso } from "@/lib/pos/money";
import { QR_CELL, QR_MODULES, qrCells } from "@/lib/pos/qr";
import { AmountCard, KioskButton, ScreenContainer, ScreenTitle } from "./ui";

type Props = {
  total: number;
  /** Seed for the generated pattern, so each order shows a different code. */
  seed: number;
  reference: string;
  onConfirm: () => void;
  onBack: () => void;
};

export function QrScreen({ total, seed, reference, onConfirm, onBack }: Props) {
  const size = QR_MODULES * QR_CELL;
  const steps = [
    "Scan the QR code using your supported payment application.",
    `Check that the amount is ${peso(total)} and approve it in your app.`,
    "Tap Confirm Payment below.",
  ];

  return (
    <ScreenContainer className="grid max-w-[1180px] items-center gap-8 lg:min-h-full lg:grid-cols-[460px_minmax(0,1fr)] lg:gap-12">
      <div className="flex flex-col items-center rounded-3xl border border-slate-200 bg-white p-6 sm:p-10">
        <div className="rounded-xl border-2 border-dashed border-slate-300 p-4">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            role="img"
            aria-label="Simulated payment QR code"
            shapeRendering="crispEdges"
            className="size-56 sm:size-[280px]"
          >
            <rect width={size} height={size} fill="#fff" />
            <g className="fill-slate-900">
              {qrCells(seed).map(({ x, y }) => (
                <rect
                  key={`${x}-${y}`}
                  x={x * QR_CELL}
                  y={y * QR_CELL}
                  width={QR_CELL}
                  height={QR_CELL}
                />
              ))}
            </g>
          </svg>
        </div>
        <p className="mt-4 font-semibold text-slate-600">Ref: QR-{reference}</p>
      </div>

      <div>
        <ScreenTitle icon={<QrCode aria-hidden />} tone="qr">
          QR Payment
        </ScreenTitle>
        <AmountCard label="Amount to pay" value={peso(total)} emphasis className="mt-6" />

        <ol className="mt-6 space-y-4">
          {steps.map((text, i) => (
            <li key={i} className="flex items-center gap-4 text-lg">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-900 font-bold text-white">
                {i + 1}
              </span>
              {text}
            </li>
          ))}
        </ol>

        <div className="mt-7 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <KioskButton variant="outline" onClick={onBack} className="order-last sm:order-none">
            <ArrowLeft aria-hidden />
            Back
          </KioskButton>
          <KioskButton onClick={onConfirm}>
            <Check aria-hidden />
            Confirm Payment
          </KioskButton>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Simulated payment — the amount paid will equal the total, with ₱0.00 change.
        </p>
      </div>
    </ScreenContainer>
  );
}
