"use client";

import { login } from "@/app/actions/auth";
import { useActionState } from "react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Вход в систему
        </h1>
        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Пароль
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {state?.error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {state.error}
            </div>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 font-medium disabled:opacity-50"
          >
            {pending ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
