export const CATEGORIES = ["Drinks", "Food", "Snacks"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Product = {
  id: number;
  name: string;
  /** Price in centavos. */
  price: number;
  category: Category;
  /** Starting stock before any saved inventory is loaded. */
  stock: number;
};

export const STORE_NAME = "CAMPUS STORE POS";

export const PRODUCTS: Product[] = [
  { id: 1, name: "Coffee", price: 4500, category: "Drinks", stock: 30 },
  { id: 2, name: "Sandwich", price: 5000, category: "Food", stock: 25 },
  { id: 3, name: "Soft Drink", price: 3500, category: "Drinks", stock: 40 },
  { id: 4, name: "Cookies", price: 2500, category: "Snacks", stock: 35 },
  { id: 5, name: "Bottled Water", price: 2000, category: "Drinks", stock: 50 },
  { id: 6, name: "Chocolate", price: 2500, category: "Snacks", stock: 30 },
];

export const productById = (id: number) => PRODUCTS.find((p) => p.id === id);

/** { productId: quantity } */
export type Cart = Record<number, number>;
/** { productId: remaining } */
export type Stock = Record<number, number>;

export type CartLine = {
  id: number;
  name: string;
  qty: number;
  unit: number;
  subtotal: number;
};

export const defaultStock = (): Stock =>
  Object.fromEntries(PRODUCTS.map((p) => [p.id, p.stock]));

export function cartLines(cart: Cart): CartLine[] {
  return Object.entries(cart).flatMap(([key, qty]) => {
    const p = productById(Number(key));
    if (!p) return [];
    return [{ id: p.id, name: p.name, qty, unit: p.price, subtotal: p.price * qty }];
  });
}

export const linesTotal = (lines: CartLine[]) =>
  lines.reduce((sum, l) => sum + l.subtotal, 0);

export type PaymentMethod = "Cash" | "QR Payment" | "Credit/Debit Card";

export type Receipt = {
  txn: string;
  date: Date;
  lines: CartLine[];
  total: number;
  method: PaymentMethod;
  paid: number;
  change: number;
};
