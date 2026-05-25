"use client";

import { useState, useEffect } from "react";

interface Booking {
  id: string; name: string; phone: string; email?: string;
  service: string; date: string; time: string; description: string;
  status: string; createdAt: string;
}

interface Car {
  id: string; model: string; type: string; price: number;
  available: boolean; best: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const ADMIN_PIN = "2026";
  const [tab, setTab] = useState("agenda");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("today");
  const [fleet, setFleet] = useState<Car[]>([]);
  const [editCar, setEditCar] = useState<Partial<Car>>({});
  const [showForm, setShowForm] = useState(false);

  const headers = { Authorization: `Bearer ${password}`, "Content-Type": "application/json" };

  useEffect(() => {
    if (!authed) return;
    fetch("/api/book", { headers }).then(r => r.json()).then(d => setBookings(d.bookings || []));
    fetch("/api/fleet", { headers }).then(r => r.json()).then(d => setFleet(d.fleet || []));
  }, [authed]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/book", { method: "PATCH", headers, body: JSON.stringify({ id, status }) });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const saveCar = async () => {
    if (!editCar.model?.trim()) return;
    const method = editCar.id ? "PUT" : "POST";
    const url = editCar.id ? "/api/fleet" : "/api/fleet";
    await fetch(url, { method, headers, body: JSON.stringify(editCar) });
    const r = await fetch("/api/fleet", { headers });
    setFleet((await r.json()).fleet || []);
    setShowForm(false);
    setEditCar({});
  };

  const deleteCar = async (id: string) => {
    await fetch("/api/fleet", { method: "DELETE", headers, body: JSON.stringify({ id }) });
    setFleet(prev => prev.filter(c => c.id !== id));
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <form onSubmit={(e) => { e.preventDefault(); if (password === ADMIN_PIN) setAuthed(true); }} className="bg-white p-8 rounded-2xl">
          <h1 className="text-xl font-bold mb-4">GC Auto Admin</h1>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="PIN" className="w-full px-4 py-3 border rounded-xl mb-4" />
          {password && password !== ADMIN_PIN && <p className="text-red-500 text-sm mb-2">Wrong PIN</p>}
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
        <div className="flex gap-4 mb-6">
          <button onClick={() => setTab("agenda")} className={`text-lg font-bold ${tab === "agenda" ? "text-teal-600" : "text-slate-400"}`}>📅 Agenda</button>
          <button onClick={() => setTab("fleet")} className={`text-lg font-bold ${tab === "fleet" ? "text-teal-600" : "text-slate-400"}`}>🚗 Flota</button>
        </div>

        {tab === "agenda" && (
          <>
            <div className="flex gap-2 mb-6">
              {["today", "upcoming", "all"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${filter === f ? "bg-teal-600 text-white" : "bg-white text-slate-600 border"}`}>
                  {f === "today" ? "📅 Hoy" : f === "upcoming" ? "📋 Próximas" : "📦 Todas"}
                </button>
              ))}
            </div>
            {filtered.length === 0 ? <p className="text-slate-400 text-center py-12">Sin reservas</p>
            : <div className="space-y-3">{filtered.map(b => (
              <div key={b.id} className="bg-white rounded-2xl p-5 border shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div><span className="font-semibold">{b.name}</span><span className="text-slate-400 ml-2">· {b.phone}</span></div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${b.status === "confirmed" ? "bg-blue-100 text-blue-700" : b.status === "completed" ? "bg-green-100 text-green-700" : b.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{b.status}</span>
                </div>
                <div className="text-sm text-slate-600"><span className="font-medium">{services[b.service] || b.service}</span> · {b.date} · {b.time}</div>
                <div className="flex gap-2 mt-3">
                  {b.status === "confirmed" && <button onClick={() => updateStatus(b.id, "completed")} className="px-4 py-1.5 bg-green-600 text-white rounded-full text-xs font-medium">✅ Completado</button>}
                  {b.status !== "cancelled" && b.status !== "completed" && <button onClick={() => updateStatus(b.id, "cancelled")} className="px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">✕ Cancelar</button>}
                </div>
              </div>
            ))}</div>}
          </>
        )}

        {tab === "fleet" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Flota ({fleet.length})</h2>
              <button onClick={() => { setEditCar({ model: "", type: "Sedan", price: 0, available: true, best: "" }); setShowForm(true); }}
                className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium">+ Añadir coche</button>
            </div>

            {showForm && (
              <div className="bg-white rounded-2xl p-5 border shadow-sm mb-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input value={editCar.model || ""} onChange={e => setEditCar({ ...editCar, model: e.target.value })} placeholder="Modelo" className="px-3 py-2 border rounded-xl text-sm" />
                  <input value={editCar.type || ""} onChange={e => setEditCar({ ...editCar, type: e.target.value })} placeholder="Tipo" className="px-3 py-2 border rounded-xl text-sm" />
                  <input type="number" value={editCar.price ?? ""} onChange={e => setEditCar({ ...editCar, price: Number(e.target.value) })} placeholder="Precio/día AUD" className="px-3 py-2 border rounded-xl text-sm" />
                  <input value={editCar.best || ""} onChange={e => setEditCar({ ...editCar, best: e.target.value })} placeholder="Para quién" className="px-3 py-2 border rounded-xl text-sm" />
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editCar.available !== false} onChange={e => setEditCar({ ...editCar, available: e.target.checked })} /> Disponible</label>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveCar} className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium">Guardar</button>
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-stone-100 text-slate-600 rounded-xl text-sm">Cancelar</button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {fleet.map(c => (
                <div key={c.id} className="bg-white rounded-2xl p-4 border shadow-sm flex items-center justify-between">
                  <div>
                    <span className="font-medium">{c.model}</span>
                    <span className="text-slate-400 text-sm ml-2">{c.type}</span>
                    <span className="text-teal-600 font-medium ml-3">${c.price}/d</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${c.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{c.available ? "Disponible" : "No disponible"}</span>
                    {c.best && <span className="ml-2 text-xs text-slate-400">· {c.best}</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditCar(c); setShowForm(true); }} className="text-sm text-teal-600 hover:underline">Editar</button>
                    <button onClick={() => deleteCar(c.id)} className="text-sm text-red-500 hover:underline">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
