"use client";

import Link from "next/link";
import { logout } from "@/app/actions/auth";

interface HeaderProps {
  userName?: string;
  userRole?: string;
}

export default function Header({ userName, userRole }: HeaderProps) {
  return (
    <header className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/calc" className="text-xl font-bold">
          Калькулятор жалюзи
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/calc" className="hover:text-blue-300">
            Калькуляторы
          </Link>
          <Link href="/history" className="hover:text-blue-300">
            История
          </Link>
          {userRole === "admin" && (
            <Link href="/admin" className="hover:text-yellow-300 text-yellow-400">
              Менеджеры
            </Link>
          )}
          {userName && (
            <span className="text-slate-400 ml-2">{userName}</span>
          )}
          <form action={logout}>
            <button
              type="submit"
              className="text-slate-400 hover:text-white ml-2"
            >
              Выйти
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
