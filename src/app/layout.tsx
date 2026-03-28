import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import ToastContainer from "@/components/Toast";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Калькулятор жалюзи и штор",
  description: "Расчёт стоимости жалюзи, рулонных штор и римских штор",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans" style={{ backgroundColor: "#F5F8FB" }}>
        {session && (
          <Header userName={session.name} userRole={session.role} />
        )}
        <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 py-6" style={{ backgroundColor: "#F5F8FB" }}>
          {children}
        </main>
        <ToastContainer />
      </body>
    </html>
  );
}
