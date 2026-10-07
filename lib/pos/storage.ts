import { PRODUCTS, type Stock } from "./products";

const COUNTER_KEY = "pos_txn_counter";
const STOCK_KEY = "pos_stock";

const safeGet = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
};

/** Saved stock, falling back to each product's starting stock. Client-only. */
export function loadStock(): Stock {
  let saved: Record<string, unknown> | null = null;
  try {
    saved = JSON.parse(safeGet(STOCK_KEY) ?? "null");
  } catch {
    saved = null;
  }
  return Object.fromEntries(
    PRODUCTS.map((p) => {
      const value = saved?.[p.id];
      return [p.id, Number.isInteger(value) ? (value as number) : p.stock];
    }),
  );
}

export const saveStock = (stock: Stock) => safeSet(STOCK_KEY, JSON.stringify(stock));

const formatTxn = (n: number, year: number) =>
  `TXN-${year}-${String(n).padStart(5, "0")}`;

const lastTxn = () => parseInt(safeGet(COUNTER_KEY) ?? "", 10) || 0;

/** The number the next completed transaction will get, without reserving it. */
export const peekTxnNumber = (now: Date) => formatTxn(lastTxn() + 1, now.getFullYear());

/** Reserves and returns a unique, sequential transaction number. */
export function nextTxnNumber(now: Date) {
  const n = lastTxn() + 1;
  safeSet(COUNTER_KEY, String(n));
  return formatTxn(n, now.getFullYear());
}
