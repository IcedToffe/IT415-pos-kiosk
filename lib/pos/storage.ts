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

const pad = (n: number, length = 2) => String(n).padStart(length, "0");

/** Local date and time of the sale as YYYYMMDD-HHMMSS. */
const stamp = (d: Date) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
  `-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;

const lastTxn = () => parseInt(safeGet(COUNTER_KEY) ?? "", 10) || 0;

/** Reference shown on the QR screen, before the payment is confirmed. */
export const qrReference = (now: Date) => `QR-${stamp(now)}`;

/**
 * Reserves and returns a unique transaction number, e.g. TXN-20261007-184512-0001.
 * The date and time keep it unique even when the saved counter restarts
 * (new browser, private window, cleared storage).
 */
export function nextTxnNumber(now: Date) {
  const n = lastTxn() + 1;
  safeSet(COUNTER_KEY, String(n));
  return `TXN-${stamp(now)}-${pad(n, 4)}`;
}
