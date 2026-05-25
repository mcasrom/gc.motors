"use client";

import { useState, useEffect } from "react";

interface Booking {
  id: string; name: string; phone: string; email?: string;
  service: string; date: string; time: string; description: string;
  status: string; createdAt: string;
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [filter, setFilter] = useState("today");

  useEffect(() => {
    if (!authed) return;
    fetch("/api/book", {
      headers: { Authorization: `Bearer ${password}` },
    }).then(r => r.json()).then(d => setBookings(d.bookings || []));
  }, [authed]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/book", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${password}` },
      body: JSON.stringify({ id, status }),
    });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <form onSubmit={(e) => { e.preventDefault(); setAuthed(true); }} className="bg-white p-8 rounded-2xl">
          <h1 className="text-xl font-bold mb-4">GC Auto Admin</h1>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="PIN" className="w-full px-4 py-3 border rounded-xl mb-4" />
          <button className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold">Enter</button>
        </form>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const filtered = filter === "today" ? bookings.filter(b => b.date === today)
    : filter === "upcoming" ? bookings.filter(b => b.date >= today && b.status !== "cancelled" && b.status !== "completed")
    : bookings;

  const services: Record<string, string> = { repair: "🔧 Repair", rental: "🚗 Rental", "used-car": "💰 Used Car", both: "🔄 Multiple" };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">GC Auto — Agenda</h1>
        <div className="flex gap-2 mb-6">
          {["today", "upcoming", "all"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${filter === f ? "bg-teal-600 text-white" : "bg-white text-slate-600 border"}`}>
              {f === "today" ? "📅 Hoy" : f === "upcoming" ? "📋 Próximas" : "📦 Todas"}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="text-slate-400 text-center py-12">Sin reservas</p>
        ) : (
          <div className="space-y-3">
            {filtered.map(b => (
              <div key={b.id} className="bg-white rounded-2xl p-5 border shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold">{b.name}</span>
                    <span className="text-slate-400 ml-2">· {b.phone}</span>
                    {b.email && <span className="text-slate-400 ml-2">· {b.email}</span>}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    b.status === "confirmed" ? "bg-blue-100 text-blue-700"
                    : b.status === "completed" ? "bg-green-100 text-green-700"
                    : b.status === "cancelled" ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                  }`}>{b.status}</span>
                </div>
                <div className="text-sm text-slate-600 space-y-1">
                  <p><span className="font-medium">{services[b.service] || b.service}</span> · {b.date} · {b.time}</p>
                  {b.description && <p className="text-slate-400 text-xs">{b.description}</p>}
                </div>
                <div className="flex gap-2 mt-3">
                  {b.status === "confirmed" && (
                    <button onClick={() => updateStatus(b.id, "completed")}
                      className="px-4 py-1.5 bg-green-600 text-white rounded-full text-xs font-medium hover:bg-green-700">✅ Completado</button>
                  )}
                  {b.status !== "cancelled" && b.status !== "completed" && (
                    <button onClick={() => updateStatus(b.id, "cancelled")}
                      className="px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-medium hover:bg-red-200">✕ Cancelar</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
