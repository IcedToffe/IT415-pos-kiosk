import {
  ArrowRight,
  Coffee,
  Cookie,
  CupSoda,
  Grid2x2,
  Milk,
  Minus,
  Plus,
  Sandwich,
  ShoppingCart,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import { peso } from "@/lib/pos/money";
import {
  CATEGORIES,
  PRODUCTS,
  type Cart,
  type CartLine,
  type Category,
  type Stock,
} from "@/lib/pos/products";
import { cn } from "@/lib/utils";
import { KioskButton } from "./ui";

/** Icon and tile colours per product (presentation only, kept out of the data). */
const VISUAL: Record<number, { icon: LucideIcon; tile: string }> = {
  1: { icon: Coffee, tile: "bg-orange-100 text-orange-800" },
  2: { icon: Sandwich, tile: "bg-yellow-100 text-amber-800" },
  3: { icon: CupSoda, tile: "bg-red-100 text-red-800" },
  4: { icon: Cookie, tile: "bg-[#f4ebdf] text-amber-900" },
  5: { icon: Milk, tile: "bg-blue-100 text-blue-700" },
  6: { icon: Grid2x2, tile: "bg-[#ece3dd] text-[#5b3a29]" },
};

export type CategoryFilter = "All" | Category;

const itemCount = (n: number) => `${n} ${n === 1 ? "item" : "items"}`;

type Props = {
  cart: Cart;
  stock: Stock;
  lines: CartLine[];
  total: number;
  count: number;
  category: CategoryFilter;
  onCategory: (c: CategoryFilter) => void;
  onAdd: (id: number) => void;
  onChangeQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onProceed: () => void;
};

export function SelectScreen(props: Props) {
  const { cart, stock, category, onCategory, onAdd } = props;
  const products = PRODUCTS.filter((p) => category === "All" || p.category === category);

  return (
    <div className="grid lg:h-full lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_440px]">
      <section className="px-4 py-6 sm:px-8 sm:py-7 lg:min-h-0 lg:overflow-y-auto">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[28px] font-bold tracking-tight sm:text-[32px]">
            Tap a product to add it
          </h1>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {(["All", ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => onCategory(c)}
                className={cn(
                  "h-12 rounded-full border px-6 text-base font-semibold transition-colors outline-none focus-visible:ring-4 focus-visible:ring-orange-700/30",
                  category === c
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white hover:border-slate-300",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => {
            const { icon: Icon, tile } = VISUAL[p.id];
            const inCart = cart[p.id] ?? 0;
            const soldOut = (stock[p.id] ?? 0) <= 0;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onAdd(p.id)}
                aria-label={`${p.name}, ${peso(p.price)}${inCart ? `, ${inCart} in order` : ""}${soldOut ? ", sold out" : ""}`}
                aria-disabled={soldOut}
                className={cn(
                  "relative flex flex-col rounded-2xl border-2 bg-white p-3 text-left transition outline-none select-none focus-visible:ring-4 focus-visible:ring-orange-700/30 active:scale-[0.98] sm:p-[18px]",
                  inCart ? "border-orange-700" : "border-slate-200 hover:border-slate-300",
                  soldOut && "cursor-not-allowed opacity-50 active:scale-100",
                )}
              >
                <span
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-xl sm:aspect-[223/218]",
                    tile,
                  )}
                >
                  {soldOut ? (
                    <span className="text-lg font-bold">Sold out</span>
                  ) : (
                    <Icon className="size-12 sm:size-14" strokeWidth={1.75} aria-hidden />
                  )}
                </span>
                {inCart > 0 && (
                  <span className="absolute top-2 right-2 flex size-9 items-center justify-center rounded-full bg-orange-700 text-base font-bold text-white sm:top-3 sm:right-3">
                    {inCart}
                  </span>
                )}
                <span className="mt-3 flex flex-wrap items-baseline justify-between gap-x-2 sm:mt-4">
                  <span className="text-lg leading-tight font-semibold sm:text-[22px]">
                    {p.name}
                  </span>
                  <span className="text-lg font-extrabold whitespace-nowrap text-orange-700 tabular-nums sm:text-[22px]">
                    {peso(p.price)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <OrderPanel {...props} />
    </div>
  );
}

function OrderPanel({ lines, total, count, onChangeQty, onRemove, onProceed }: Props) {
  return (
    <aside className="flex flex-col border-t border-slate-200 bg-white px-4 py-6 sm:px-7 lg:min-h-0 lg:border-t-0 lg:border-l">
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="text-[26px] font-bold tracking-tight">Your Order</h2>
        <span className="text-base text-slate-500">{itemCount(count)}</span>
      </div>

      {lines.length === 0 ? (
        <div className="flex min-h-[240px] flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
          <span className="flex size-[90px] items-center justify-center rounded-full bg-slate-100">
            <ShoppingCart className="size-9 text-slate-500" aria-hidden />
          </span>
          <p className="mt-5 text-xl font-bold">Your order is empty</p>
          <p className="mt-2 max-w-64 text-slate-500">
            Tap a product on the left to add it to your order.
          </p>
        </div>
      ) : (
        <ul className="-mx-1 flex-1 space-y-3 px-1 lg:min-h-0 lg:overflow-y-auto">
          {lines.map((l) => (
            <li key={l.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xl font-semibold">{l.name}</div>
                  <div className="text-sm text-slate-500 tabular-nums">{peso(l.unit)} each</div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(l.id)}
                  aria-label={`Remove ${l.name}`}
                  className="flex size-11 items-center justify-center rounded-lg bg-red-100 text-red-700 transition-colors outline-none hover:bg-red-200 focus-visible:ring-4 focus-visible:ring-red-700/30"
                >
                  <Trash2 className="size-5" aria-hidden />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onChangeQty(l.id, -1)}
                    aria-label={`Decrease ${l.name}`}
                    className="flex size-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 transition-colors outline-none hover:bg-slate-100 focus-visible:ring-4 focus-visible:ring-orange-700/30"
                  >
                    <Minus className="size-5" strokeWidth={2.5} aria-hidden />
                  </button>
                  <span className="w-8 text-center text-xl font-bold tabular-nums" aria-live="polite">
                    {l.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onChangeQty(l.id, 1)}
                    aria-label={`Increase ${l.name}`}
                    className="flex size-12 items-center justify-center rounded-lg bg-slate-900 text-white transition-colors outline-none hover:bg-slate-800 focus-visible:ring-4 focus-visible:ring-orange-700/30"
                  >
                    <Plus className="size-5" strokeWidth={2.5} aria-hidden />
                  </button>
                </div>
                <span className="text-xl font-extrabold tabular-nums">{peso(l.subtotal)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 border-t-2 border-dashed border-slate-200 pt-5">
        <div className="mb-4 flex items-baseline justify-between">
          <span className="text-xl font-semibold">Total</span>
          <span className="text-4xl font-extrabold tracking-tight tabular-nums sm:text-[44px]">
            {peso(total)}
          </span>
        </div>
        <KioskButton onClick={onProceed} disabled={lines.length === 0}>
          Proceed to Payment
          <ArrowRight aria-hidden />
        </KioskButton>
      </div>
    </aside>
  );
}
