"use client";

import Link from "next/link";
import Image from "next/image";
import { logout } from "@/app/actions/auth";

interface HeaderProps {
  userName?: string;
  userRole?: string;
}

export default function Header({ userName, userRole }: HeaderProps) {
  return (
    <header style={{ backgroundColor: "#1B3054" }} className="text-white shadow-lg">
      <div className="max-w-[1600px] mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/calc" className="flex items-center gap-3">
          <Image src="/logo-amigo.svg" alt="AMIGO" width={140} height={48} />
          <span className="text-sm font-light text-blue-200 hidden sm:block">Калькулятор</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/calc" className="hover:text-blue-200 transition-colors">
            Калькуляторы
          </Link>
          <Link href="/combined" className="hover:text-blue-200 transition-colors">
            Сборный
          </Link>
          <Link href="/history" className="hover:text-blue-200 transition-colors">
            История
          </Link>
          {userRole === "admin" && (
            <>
              <Link href="/analytics" className="hover:text-blue-200 transition-colors">
                Аналитика
              </Link>
              <Link href="/admin" className="hover:text-amber-200 text-amber-300 transition-colors">
                Менеджеры
              </Link>
            </>
          )}
          {userName && (
            <span className="text-blue-300 ml-2">{userName}</span>
          )}
          <form action={logout}>
            <button
              type="submit"
              className="text-blue-300 hover:text-white transition-colors ml-2"
            >
              Выйти
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
