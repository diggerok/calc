"use client";

import { useEffect, useState, useCallback } from "react";

interface ToastMessage {
  id: number;
  text: string;
  type: "success" | "error" | "info";
}

let toastId = 0;
let addToastFn: ((text: string, type?: "success" | "error" | "info") => void) | null = null;

export function showToast(text: string, type: "success" | "error" | "info" = "success") {
  addToastFn?.(text, type);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((text: string, type: "success" | "error" | "info" = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => { addToastFn = null; };
  }, [addToast]);

  if (toasts.length === 0) return null;

  const colors = {
    success: { bg: "#1B3054", text: "white" },
    error: { bg: "#dc2626", text: "white" },
    info: { bg: "#2a4a7f", text: "white" },
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-toast-in px-5 py-3 rounded-lg shadow-lg text-sm font-medium min-w-[250px]"
          style={{ backgroundColor: colors[toast.type].bg, color: colors[toast.type].text }}
        >
          {toast.type === "success" && "✓ "}
          {toast.type === "error" && "✕ "}
          {toast.text}
        </div>
      ))}
    </div>
  );
}
