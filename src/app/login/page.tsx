"use client";

import { login } from "@/app/actions/auth";
import { useActionState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1B3054 0%, #2a4a7f 50%, #1B3054 100%)" }}>
      {/* Декоративный полукруг */}
      <div className="absolute top-0 right-0 pointer-events-none" style={{ width: "400px", height: "400px", borderRadius: "50%", backgroundColor: "#DAEBF5", opacity: 0.08, transform: "translate(30%, -30%)" }} />
      <div className="absolute bottom-0 left-0 pointer-events-none" style={{ width: "500px", height: "500px", borderRadius: "50%", backgroundColor: "#DAEBF5", opacity: 0.05, transform: "translate(-30%, 30%)" }} />

      <div className="relative bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image src="/logo-amigo.svg" alt="AMIGO Design Boutique" width={220} height={75} />
        </div>
        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#1B3054" }}>
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:outline-none transition-all"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#1B3054" }}>
              Пароль
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:outline-none transition-all"
            />
          </div>
          {state?.error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {state.error}
            </div>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 text-white rounded-lg font-semibold disabled:opacity-50 transition-all hover:opacity-90"
            style={{ backgroundColor: "#1B3054" }}
          >
            {pending ? "Вход..." : "Войти"}
          </button>
        </form>
        <p className="text-center text-xs text-slate-400 mt-6">AMIGO Design Boutique</p>
      </div>
    </div>
  );
}
