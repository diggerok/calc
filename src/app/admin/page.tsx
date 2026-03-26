"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    if (res.ok) {
      setUsers(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role: "manager" }),
    });
    if (res.ok) {
      setName("");
      setEmail("");
      setPassword("");
      fetchUsers();
    } else {
      const data = await res.json();
      setError(data.error || "Ошибка создания");
    }
  };

  const handleDelete = async (id: string, userName: string) => {
    if (!confirm(`Удалить менеджера ${userName}?`)) return;
    const res = await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      fetchUsers();
    } else {
      const data = await res.json();
      alert(data.error || "Ошибка удаления");
    }
  };

  if (loading) return <div className="text-center py-10">Загрузка...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Управление менеджерами
      </h1>

      {/* Форма создания */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          Добавить менеджера
        </h2>
        <form onSubmit={handleCreate} className="flex gap-3 items-end flex-wrap">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Имя</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="px-3 py-2 border border-slate-300 rounded-lg"
              placeholder="Екатерина"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="px-3 py-2 border border-slate-300 rounded-lg"
              placeholder="manager@amigo.ru"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Пароль</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="text"
              required
              className="px-3 py-2 border border-slate-300 rounded-lg"
              placeholder="пароль"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 font-medium"
          >
            Создать
          </button>
        </form>
        {error && (
          <div className="text-red-600 text-sm mt-2 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Список */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-600">
              <th className="px-4 py-3 text-left">Имя</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Роль</th>
              <th className="px-4 py-3 text-left">Создан</th>
              <th className="px-4 py-3 text-center">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-slate-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      u.role === "admin"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {u.role === "admin" ? "Админ" : "Менеджер"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(u.createdAt).toLocaleDateString("ru-RU")}
                </td>
                <td className="px-4 py-3 text-center">
                  {u.role !== "admin" && (
                    <button
                      onClick={() => handleDelete(u.id, u.name)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Удалить
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
