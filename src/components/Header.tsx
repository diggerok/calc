"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/calc" className="text-xl font-bold">
          Калькулятор жалюзи
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/calc" className="hover:text-blue-300">
            Калькуляторы
          </Link>
          <Link href="/history" className="hover:text-blue-300">
            История
          </Link>
        </nav>
      </div>
    </header>
  );
}
