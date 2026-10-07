"use client";

import { useEffect, useRef, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

import {
  cartLines,
  defaultStock,
  linesTotal,
  productById,
  type Cart,
  type PaymentMethod,
  type Receipt,
  type Stock,
} from "@/lib/pos/products";
import { loadStock, nextTxnNumber, peekTxnNumber, saveStock } from "@/lib/pos/storage";
import { cn } from "@/lib/utils";
import { CardScreen } from "./card-screen";
import { CashScreen } from "./cash-screen";
import { MethodScreen } from "./method-screen";
import { QrScreen } from "./qr-screen";
import { ReceiptScreen, SuccessScreen } from "./result-screens";
import { ReviewScreen } from "./review-screen";
import { SelectScreen, type CategoryFilter } from "./select-screen";
import { Toast, useToast } from "./toast";
import { TopBar, type StepState } from "./top-bar";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

/** Flow: Select → Review → Method → Cash | QR | Card → Success → Receipt → (New Transaction) */
type Screen = "select" | "review" | "method" | "cash" | "qr" | "card" | "success" | "receipt";

const STEP: Record<Screen, StepState> = {
  select: { active: 0, done: 0 },
  review: { active: 1, done: 1 },
  method: { active: 2, done: 2 },
  cash: { active: 2, done: 2 },
  qr: { active: 2, done: 2 },
  card: { active: 2, done: 2 },
  success: { active: null, done: 3 },
  receipt: { active: 3, done: 3 },
};

export function Kiosk() {
  const [screen, setScreen] = useState<Screen>("select");
  const [cart, setCart] = useState<Cart>({});
  const [stock, setStock] = useState<Stock>(defaultStock);
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [qr, setQr] = useState({ seed: 1, reference: "" });
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const { toast, show: notify } = useToast();
  const mainRef = useRef<HTMLElement>(null);

  // Saved stock lives in localStorage, which only exists in the browser.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setStock(loadStock()), []);

  // Every screen starts at the top.
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [screen]);

  const lines = cartLines(cart);
  const total = linesTotal(lines);
  const count = lines.reduce((sum, l) => sum + l.qty, 0);

  // ---------- Cart ----------
  const addItem = (id: number) => {
    const p = productById(id);
    if (!p) return;
    const available = stock[id] ?? 0;
    if (available <= 0) return notify(`${p.name} is sold out`, "error");
    const next = (cart[id] ?? 0) + 1;
    if (next > available) {
      return notify(`Insufficient stock: only ${available} ${p.name} available`, "error");
    }
    setCart({ ...cart, [id]: next });
    notify(`Product added — ${p.name}`, "ok");
  };

  const removeItem = (id: number) => {
    const rest = { ...cart };
    delete rest[id];
    setCart(rest);
    notify(`Item removed — ${productById(id)?.name}`, "info");
  };

  const changeQty = (id: number, delta: number) => {
    const p = productById(id);
    if (!p) return;
    const next = (cart[id] ?? 0) + delta;
    if (delta > 0 && next > (stock[id] ?? 0)) {
      return notify(`Insufficient stock: only ${stock[id] ?? 0} ${p.name} available`, "error");
    }
    if (next <= 0) return removeItem(id); // quantity never goes negative
    setCart({ ...cart, [id]: next });
    notify(`${p.name} quantity: ${next}`, "info");
  };

  // ---------- Navigation ----------
  const goReview = () => {
    if (lines.length === 0) return notify("Please add at least one item", "error");
    setScreen("review");
  };

  const chooseMethod = (method: PaymentMethod) => {
    if (method === "QR Payment") {
      const now = new Date();
      setQr({ seed: now.getTime() + total, reference: peekTxnNumber(now) });
      setScreen("qr");
    } else {
      setScreen(method === "Cash" ? "cash" : "card");
    }
  };

  // ---------- Payment ----------
  const completeTransaction = (method: PaymentMethod, paid: number) => {
    // Last safety checks: an invalid payment must never create a receipt.
    if (lines.length === 0 || paid < total) {
      return notify("Payment could not be completed", "error");
    }
    const short = lines.find((l) => l.qty > (stock[l.id] ?? 0));
    if (short) return notify(`Insufficient stock for ${short.name}`, "error");

    // Deduct stock only after a successful payment.
    const nextStock = { ...stock };
    lines.forEach((l) => (nextStock[l.id] -= l.qty));
    setStock(nextStock);
    saveStock(nextStock);

    const now = new Date();
    setReceipt({
      txn: nextTxnNumber(now),
      date: now,
      lines, // a snapshot: clearing the cart later cannot change the receipt
      total,
      method,
      paid,
      change: paid - total,
    });
    setScreen("success");
    notify("Transaction completed successfully", "ok");
  };

  const newTransaction = () => {
    setCart({});
    setReceipt(null);
    setCategory("All");
    setQr({ seed: 1, reference: "" });
    setScreen("select");
    notify("New transaction started — previous order cleared", "ok");
  };

  return (
    <div
      className={cn(
        jakarta.className,
        "flex min-h-dvh flex-1 flex-col bg-kiosk text-slate-900 antialiased select-none lg:h-dvh lg:min-h-0",
      )}
    >
      <TopBar step={STEP[screen]} />
      <main ref={mainRef} className="flex flex-1 flex-col lg:min-h-0 lg:overflow-y-auto">
        {screen === "select" && (
          <SelectScreen
            cart={cart}
            stock={stock}
            lines={lines}
            total={total}
            count={count}
            category={category}
            onCategory={setCategory}
            onAdd={addItem}
            onChangeQty={changeQty}
            onRemove={removeItem}
            onProceed={goReview}
          />
        )}
        {screen === "review" && (
          <ReviewScreen
            lines={lines}
            total={total}
            count={count}
            onBack={() => setScreen("select")} // cart is preserved
            onContinue={() => setScreen("method")}
          />
        )}
        {screen === "method" && (
          <MethodScreen total={total} onChoose={chooseMethod} onBack={() => setScreen("review")} />
        )}
        {screen === "cash" && (
          <CashScreen
            total={total}
            onPay={(paid) => completeTransaction("Cash", paid)}
            onError={(message) => notify(message, "error")}
            onBack={() => setScreen("method")}
          />
        )}
        {screen === "qr" && (
          <QrScreen
            total={total}
            seed={qr.seed}
            reference={qr.reference}
            onConfirm={() => completeTransaction("QR Payment", total)}
            onBack={() => setScreen("method")}
          />
        )}
        {screen === "card" && (
          <CardScreen
            total={total}
            onComplete={() => completeTransaction("Credit/Debit Card", total)}
            onBack={() => setScreen("method")}
          />
        )}
        {screen === "success" && receipt && (
          <SuccessScreen receipt={receipt} onViewReceipt={() => setScreen("receipt")} />
        )}
        {screen === "receipt" && receipt && (
          <ReceiptScreen receipt={receipt} onNewTransaction={newTransaction} />
        )}
      </main>
      <Toast toast={toast} />
    </div>
  );
}
