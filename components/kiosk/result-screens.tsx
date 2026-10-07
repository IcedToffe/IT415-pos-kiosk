import { Check, Plus, Printer, ReceiptText } from "lucide-react";

import { peso } from "@/lib/pos/money";
import { STORE_NAME, type Receipt } from "@/lib/pos/products";
import { cn } from "@/lib/utils";
import { KioskButton, ScreenContainer } from "./ui";


export function SuccessScreen({
  receipt,
  onViewReceipt,
}: {
  receipt: Receipt;
  onViewReceipt: () => void;
}) {
  const rows: { label: string; value: string; className?: string }[] = [
    { label: "Payment method", value: receipt.method },
    { label: "Transaction amount", value: peso(receipt.total) },
    { label: "Amount paid", value: peso(receipt.paid) },
    { label: "Change", value: peso(receipt.change), className: "text-2xl text-green-700" },
  ];

  return (
    <ScreenContainer className="max-w-[800px]">
      <div className="rounded-3xl border border-slate-200 bg-white px-5 py-10 text-center sm:px-12">
        <span className="mx-auto flex size-[104px] items-center justify-center rounded-full bg-green-700 sm:size-[118px]">
          <Check className="size-14 text-white" strokeWidth={3} aria-hidden />
        </span>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-green-800 sm:text-[44px]">
          Payment Successful
        </h1>
        <p className="mt-1 text-xl text-slate-600">Transaction completed successfully. Thank you!</p>

        <dl className="mt-8 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 text-left text-lg">
          <div className="flex items-center justify-between gap-4 bg-slate-50 px-5 py-4 sm:px-6">
            <dt className="text-slate-600">Transaction No.</dt>
            <dd className="font-mono text-xl font-semibold">{receipt.txn}</dd>
          </div>
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <dt className="text-slate-600">{r.label}</dt>
              <dd className={cn("font-bold tabular-nums", r.className)}>{r.value}</dd>
            </div>
          ))}
        </dl>

        <KioskButton onClick={onViewReceipt} className="mt-6">
          <ReceiptText aria-hidden />
          View Receipt
        </KioskButton>
      </div>
    </ScreenContainer>
  );
}

function formatReceiptDate(d: Date) {
  const date = d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${date} · ${time}`;
}

const Divider = () => <div className="my-4 border-t border-dashed border-slate-400" />;

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("flex justify-between gap-4", className)}>
      <span>{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

export function ReceiptScreen({
  receipt,
  onNewTransaction,
}: {
  receipt: Receipt;
  onNewTransaction: () => void;
}) {
  return (
    <ScreenContainer className="grid max-w-[1100px] items-center gap-8 lg:grid-cols-[490px_minmax(0,1fr)] lg:gap-14">
      <article
        id="receipt"
        aria-label="Digital receipt"
        className="rounded-md bg-white px-6 py-8 font-mono text-[15px] text-slate-900 shadow-[0_8px_30px_rgba(15,23,42,0.08)] sm:px-8"
      >
        <h2 className="text-center text-xl font-bold tracking-wide">{STORE_NAME}</h2>
        <p className="mt-1 text-center text-sm text-slate-600">
          Self-Service Kiosk · Official Digital Receipt
        </p>
        <Divider />
        <div className="space-y-1">
          <Row label="Transaction No." value={receipt.txn} className="font-semibold" />
          <Row label="Date" value={formatReceiptDate(receipt.date)} />
        </div>
        <Divider />
        <div className="flex justify-between text-xs text-slate-600">
          <span>ITEM</span>
          <span>SUBTOTAL</span>
        </div>
        <ul className="mt-3 space-y-3">
          {receipt.lines.map((l) => (
            <li key={l.id}>
              <Row label={l.name} value={peso(l.subtotal)} className="font-semibold" />
              <div className="text-slate-600">
                {l.qty} × {peso(l.unit)}
              </div>
            </li>
          ))}
        </ul>
        <Divider />
        <Row label="TOTAL" value={peso(receipt.total)} className="text-xl font-bold" />
        <div className="mt-3 space-y-1">
          <Row label="Payment method" value={receipt.method} />
          <Row label="Amount paid" value={peso(receipt.paid)} />
          <Row label="Change" value={peso(receipt.change)} />
          <div className="flex justify-between gap-4">
            <span>Status</span>
            <span className="font-semibold text-green-700">Payment Successful</span>
          </div>
        </div>
        <div className="mt-10 border-t border-dashed border-slate-400 pt-4 text-center text-sm">
          Thank you for your purchase!
        </div>
      </article>

      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">Your receipt</h1>
        <p className="mt-3 max-w-md text-lg text-slate-600">
          Keep this for your records. Tap New Transaction when you are done — your order and
          payment details will be cleared.
        </p>
        <div className="mt-7 max-w-md space-y-4">
          <KioskButton onClick={onNewTransaction}>
            <Plus aria-hidden />
            New Transaction
          </KioskButton>
          <KioskButton variant="outline" size="md" onClick={() => window.print()}>
            <Printer aria-hidden />
            Print Receipt
          </KioskButton>
        </div>
        <p className="mt-4 max-w-md text-sm text-slate-600">
          Printing is optional — the digital receipt is your proof of payment.
        </p>
      </div>
    </ScreenContainer>
  );
}
