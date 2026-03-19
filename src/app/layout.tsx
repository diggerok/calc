import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Калькулятор жалюзи и штор",
  description: "Расчёт стоимости жалюзи, рулонных штор и римских штор",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 font-sans">
        <Header />
        <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
