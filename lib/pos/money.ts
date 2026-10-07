/** All money is stored in centavos (integers) to avoid floating-point errors. */

export const peso = (centavos: number) =>
  "₱" +
  (centavos / 100).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/** Largest cash amount the kiosk accepts: ₱100,000.00. */
export const MAX_CASH = 10_000_000;

export type PaymentError = { title: string; detail: string };

export type ParsedAmount = { ok: true; cents: number } | ({ ok: false } & PaymentError);

/** Validates what the customer typed as the amount paid. */
export function parseAmount(raw: string): ParsedAmount {
  const s = String(raw).trim().replace(/^₱/, "").replace(/,/g, "");
  if (s === "") {
    return {
      ok: false,
      title: "Enter the amount paid.",
      detail: "Tap a quick amount or use the keypad.",
    };
  }
  if (s.startsWith("-")) {
    return { ok: false, title: "Invalid amount.", detail: "Amount cannot be negative." };
  }
  if (!/^\d+(\.\d{1,2})?$/.test(s)) {
    return {
      ok: false,
      title: "Invalid amount.",
      detail: "Please enter a positive number, e.g. 200.00.",
    };
  }
  const cents = Math.round(parseFloat(s) * 100);
  if (cents <= 0) {
    return { ok: false, title: "Invalid amount.", detail: "Amount must be greater than ₱0.00." };
  }
  if (cents > MAX_CASH) {
    return {
      ok: false,
      title: "Invalid amount.",
      detail: `Amount is too large. The maximum is ${peso(MAX_CASH)}.`,
    };
  }
  return { ok: true, cents };
}

/** Cash rule from the exam: reject anything below the total; exact payment is valid. */
export function checkCashPayment(raw: string, total: number): ParsedAmount {
  const parsed = parseAmount(raw);
  if (!parsed.ok) return parsed;
  if (parsed.cents < total) {
    return {
      ok: false,
      title: "Insufficient payment.",
      detail: `Please enter at least ${peso(total)}. You are short by ${peso(total - parsed.cents)}.`,
    };
  }
  return parsed;
}
