"use client";

import { useEffect, useState } from "react";
import OrderFormGeneric from "@/components/order-forms/OrderFormGeneric";

export default function OrderPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("order-data");
    if (raw) {
      setData(JSON.parse(raw));
    }
  }, []);

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto mt-12 text-center text-slate-400">
        Нет данных для бланка заказа. Создайте заказ из калькулятора.
      </div>
    );
  }

  return <OrderFormGeneric data={data} />;
}
