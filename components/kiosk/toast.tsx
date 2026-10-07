"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

export type ToastTone = "ok" | "error" | "info";
type ToastState = { message: string; tone: ToastTone; visible: boolean };

/** One toast at a time; a new message replaces the current one. */
export function useToast() {
  const [toast, setToast] = useState<ToastState>({ message: "", tone: "info", visible: false });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string, tone: ToastTone = "info") => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ message, tone, visible: true });
    timer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2400);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return { toast, show };
}

export function Toast({ toast }: { toast: ToastState }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed bottom-6 left-1/2 z-50 flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-full bg-slate-900 px-5 py-3 text-base font-semibold sm:px-6 sm:py-3.5 sm:text-lg text-white shadow-lg transition-all duration-200",
        toast.visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      )}
    >
      {toast.tone === "error" ? (
        <CircleAlert className="size-5 shrink-0 text-red-400" aria-hidden />
      ) : (
        <Check className="size-5 shrink-0 text-green-400" strokeWidth={3} aria-hidden />
      )}
      <span>{toast.message}</span>
    </div>
  );
}
