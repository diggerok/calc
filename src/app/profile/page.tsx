"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/Toast";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [kpEmail, setKpEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setName(data.name || "");
        setEmail(data.email || "");
        setKpEmail(data.kpEmail || "");
        setPhone(data.phone || "");
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, kpEmail }),
    });
    if (res.ok) {
      showToast("Профиль сохранён!");
    } else {
      showToast("Ошибка сохранения", "error");
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto mt-12 text-center text-slate-400">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-12">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Мой профиль</h1>
      <p className="text-sm text-slate-500 mb-6">
        Эти данные будут автоматически подставляться в коммерческие предложения.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Имя
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ваше имя"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Email для КП
          </label>
          <input
            type="email"
            value={kpEmail}
            onChange={(e) => setKpEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="email для коммерческих предложений"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Телефон
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+7 (___) ___-__-__"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-6 px-6 py-2 text-white rounded-lg hover:opacity-90 font-medium transition-all"
        style={{ backgroundColor: "#1B3054" }}
      >
        Сохранить
      </button>
    </div>
  );
}
