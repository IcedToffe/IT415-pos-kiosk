/** All money is stored in centavos (integers) to avoid floating-point errors. */

export const peso = (centavos: number) =>
  "₱" +
  (centavos / 100).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export type ParsedAmount =
  | { ok: true; cents: number }
  | { ok: false; message: string };

export function parseAmount(raw: string): ParsedAmount {
  const s = String(raw).trim().replace(/^₱/, "").replace(/,/g, "");
  if (s === "") return { ok: false, message: "Please enter the amount paid." };
  if (!/^\d+(\.\d{1,2})?$/.test(s)) {
    return {
      ok: false,
      message: "Invalid amount. Please enter a positive number (e.g. 200.00).",
    };
  }
  const cents = Math.round(parseFloat(s) * 100);
  if (cents <= 0) {
    return { ok: false, message: "Invalid amount. Amount must be greater than ₱0.00." };
  }
  return { ok: true, cents };
}
