import { ArrowLeft, ArrowRight } from "lucide-react";

import { peso } from "@/lib/pos/money";
import type { CartLine } from "@/lib/pos/products";
import { KioskButton, ScreenContainer } from "./ui";

type Props = {
  lines: CartLine[];
  total: number;
  count: number;
  onBack: () => void;
  onContinue: () => void;
};

export function ReviewScreen({ lines, total, count, onBack, onContinue }: Props) {
  return (
    <ScreenContainer className="max-w-[1080px]">
      <h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">Review your order</h1>
      <p className="mt-2 text-lg text-slate-600">
        Check your items before paying. Tap Back to make changes — your items stay in the cart.
      </p>

      <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full">
          <thead className="bg-slate-50 text-sm font-semibold tracking-wider text-slate-600 uppercase">
            <tr>
              <th scope="col" className="px-5 py-4 text-left sm:px-8">
                Product
              </th>
              <th scope="col" className="px-3 py-4 text-center">
                <span className="sm:hidden">Qty</span>
                <span className="hidden sm:inline">Quantity</span>
              </th>
              <th scope="col" className="hidden px-3 py-4 text-right sm:table-cell">
                Unit price
              </th>
              <th scope="col" className="px-5 py-4 text-right sm:px-8">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody className="text-lg sm:text-xl">
            {lines.map((l) => (
              <tr key={l.id} className="border-t border-slate-200">
                <td className="px-5 py-5 sm:px-8">
                  <div className="font-semibold">{l.name}</div>
                  <div className="text-sm text-slate-500 tabular-nums sm:hidden">
                    {peso(l.unit)} each
                  </div>
                </td>
                <td className="px-3 py-5 text-center font-bold tabular-nums">{l.qty}</td>
                <td className="hidden px-3 py-5 text-right text-slate-500 tabular-nums sm:table-cell">
                  {peso(l.unit)}
                </td>
                <td className="px-5 py-5 text-right font-extrabold tabular-nums sm:px-8">
                  {peso(l.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between gap-4 border-t border-orange-200 bg-orange-50 px-5 py-6 sm:px-8">
          <div>
            <div className="text-xl font-bold">Total Amount</div>
            <div className="text-slate-600">
              {count} {count === 1 ? "item" : "items"}
            </div>
          </div>
          <div className="text-4xl font-extrabold tracking-tight text-orange-800 tabular-nums sm:text-5xl">
            {peso(total)}
          </div>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2.6fr)]">
        <KioskButton variant="outline" onClick={onBack} className="order-last sm:order-none">
          <ArrowLeft aria-hidden />
          Back
        </KioskButton>
        <KioskButton onClick={onContinue}>
          Continue to Payment
          <ArrowRight aria-hidden />
        </KioskButton>
      </div>
    </ScreenContainer>
  );
}
