"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Booking {
  id: string; name: string; phone: string; email?: string;
  vehicleMake?: string; vehicleModel?: string; vehicleYear?: number; vehiclePlate?: string;
  service: string; date: string; time: string; description: string;
  status: string; createdAt: string;
}

interface Job {
  id: string; bookingId: string; status: string; assignedTo: string;
  notes: string; parts: any[]; labors?: any[]; createdAt: string;
  booking: Booking | null;
}

interface Car { id: string; model: string; type: string; price: number; available: boolean; best: string; image?: string; }
interface SaleCar { id: string; model: string; year: number; km: string; price: number; condition: string; badge: string; description: string; status: string; createdAt: string; image?: string; }

const services: Record<string, string> = {
  "oil-change": "Oil Change", "brake-service": "Brake Service", battery: "Battery",
  diagnostics: "Diagnostics", logbook: "Log Book", "pre-purchase": "Pre-Purchase",
  tire: "Tire", "ac-service": "AC", clutch: "Clutch", "timing-belt": "Timing Belt",
  transmission: "Transmission", roadworthy: "Roadworthy", rental: "Rental",
  "used-car": "Used Car", other: "Other",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const ADMIN_PIN = "2026";
  const headers = { Authorization: `Bearer ${password}`, "Content-Type": "application/json" };
  const [tab, setTab] = useState("agenda");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("today");
  const [filterService, setFilterService] = useState("");
  const [jobTab, setJobTab] = useState("pending");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [jobNotes, setJobNotes] = useState("");

  const [fleet, setFleet] = useState<Car[]>([]);
  const [editCar, setEditCar] = useState<Partial<Car>>({});
  const [showForm, setShowForm] = useState(false);
  const [sales, setSales] = useState<SaleCar[]>([]);
  const [editSale, setEditSale] = useState<Partial<SaleCar>>({});
  const [showSaleForm, setShowSaleForm] = useState(false);

  const [searchPhone, setSearchPhone] = useState("");
  const [customerData, setCustomerData] = useState<any>(null);
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/book", { headers }).then(r => r.json()).then(d => setBookings(d.bookings || []));
    fetch("/api/jobs", { headers }).then(r => r.json()).then(d => setJobs(d.jobs || []));
    fetch("/api/fleet", { headers }).then(r => r.json()).then(d => setFleet(d.fleet || []));
    fetch("/api/sales", { headers }).then(r => r.json()).then(d => setSales(d.sales || []));
  }, [authed]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/book", { method: "PATCH", headers, body: JSON.stringify({ id, status }) });
    const r = await fetch("/api/book", { headers });
    setBookings((await r.json()).bookings || []);
    const jr = await fetch("/api/jobs", { headers });
    setJobs((await jr.json()).jobs || []);
  };

  const updateJob = async (id: string, data: any) => {
    await fetch("/api/jobs", { method: "PATCH", headers, body: JSON.stringify({ id, ...data }) });
    const r = await fetch("/api/jobs", { headers });
    setJobs((await r.json()).jobs || []);
  };

  const searchCustomer = async () => {
    if (!searchPhone.trim()) return;
    const r = await fetch(`/api/customer/${encodeURIComponent(searchPhone.trim())}`, { headers });
    const d = await r.json();
    setCustomerData(d.customer);
    setCustomerBookings(d.bookings || []);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${password}` }, body: fd });
    return (await res.json()).url || "";
  };

  const saveCar = async () => {
    if (!editCar.model?.trim()) return;
    await fetch("/api/fleet", { method: editCar.id ? "PUT" : "POST", headers, body: JSON.stringify(editCar) });
    const r = await fetch("/api/fleet", { headers });
    setFleet((await r.json()).fleet || []);
    setShowForm(false); setEditCar({});
  };

  const deleteCar = async (id: string) => {
    await fetch("/api/fleet", { method: "DELETE", headers, body: JSON.stringify({ id }) });
    setFleet(prev => prev.filter(c => c.id !== id));
  };

  const saveSale = async () => {
    if (!editSale.model?.trim()) return;
    await fetch("/api/sales", { method: editSale.id ? "PUT" : "POST", headers, body: JSON.stringify(editSale) });
    const r = await fetch("/api/sales", { headers });
    setSales((await r.json()).sales || []);
    setShowSaleForm(false); setEditSale({});
  };

  const deleteSale = async (id: string) => {
    await fetch("/api/sales", { method: "DELETE", headers, body: JSON.stringify({ id }) });
    setSales(prev => prev.filter(c => c.id !== id));
  };

  if (!authed) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={(e) => { e.preventDefault(); password === ADMIN_PIN && setAuthed(true); }} className="bg-white p-8 rounded-2xl">
        <h1 className="text-xl font-bold mb-4">GC Motors Admin</h1>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="PIN" className="w-full px-4 py-3 border rounded-xl mb-4" />
        <button className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold">Enter</button>
      </form>
    </div>
  );

  const today = new Date().toISOString().split("T")[0];

  let filtered = filter === "today" ? bookings.filter(b => b.date === today)
    : filter === "upcoming" ? bookings.filter(b => b.date >= today && b.status !== "cancelled" && b.status !== "completed")
    : bookings;
  if (filterService) filtered = filtered.filter(b => b.service === filterService);
  filtered.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const jobFiltered = jobs.filter(j => jobTab === "all" ? true : j.status === jobTab);

  const statusColor = (s: string) =>
    s === "confirmed" ? "bg-blue-100 text-blue-700" : s === "completed" ? "bg-green-100 text-green-700" : s === "cancelled" ? "bg-red-100 text-red-700" : s === "in-progress" ? "bg-amber-100 text-amber-700" : "bg-yellow-100 text-yellow-700";

  const tabBtn = (key: string, label: string) => (
    <button onClick={() => setTab(key)} className={`text-lg font-bold ${tab === key ? "text-teal-600" : "text-slate-400"}`}>{label}</button>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex gap-4 mb-6 flex-wrap">
          {tabBtn("agenda", "Agenda")}
          {tabBtn("jobs", "Taller")}
          {tabBtn("fleet", "Flota")}
          {tabBtn("sales", "Venta")}
          {tabBtn("customers", "Clientes")}
        </div>

        {tab === "agenda" && (
          <>
            <div className="flex gap-2 mb-4 flex-wrap">
              {["today", "upcoming", "all"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${filter === f ? "bg-teal-600 text-white" : "bg-white text-slate-600 border"}`}>
                  {f === "today" ? "Hoy" : f === "upcoming" ? "Próximas" : "Todas"}
                </button>
              ))}
              <select value={filterService} onChange={e => setFilterService(e.target.value)} className="ml-auto px-3 py-2 border rounded-xl text-sm bg-white">
                <option value="">Todos servicios</option>
                {Object.entries(services).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              {filtered.map(b => (
                <div key={b.id} className="bg-white rounded-2xl p-4 border shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold">{b.name}</span>
                      <a href={`tel:${b.phone}`} className="text-teal-600 ml-2 text-sm hover:underline">{b.phone}</a>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(b.status)}`}>{b.status}</span>
                  </div>
                  <div className="text-sm text-slate-600 space-y-0.5">
                    <div><span className="font-medium">{services[b.service] || b.service}</span> · {b.date} · {b.time}</div>
                    {(b.vehicleMake || b.vehicleModel) && (
                      <div className="text-slate-500">{b.vehicleMake} {b.vehicleModel} {b.vehicleYear ? `(${b.vehicleYear})` : ""}{b.vehiclePlate ? ` · ${b.vehiclePlate}` : ""}</div>
                    )}
                    {b.description && <div className="text-slate-400 italic text-xs">{b.description}</div>}
                  </div>
                  <div className="flex gap-2 mt-3">
                    {b.status === "confirmed" && <button onClick={() => updateStatus(b.id, "in-progress")} className="px-4 py-1.5 bg-amber-600 text-white rounded-full text-xs font-medium">En taller</button>}
                    {b.status === "in-progress" && <button onClick={() => updateStatus(b.id, "completed")} className="px-4 py-1.5 bg-green-600 text-white rounded-full text-xs font-medium">Completado</button>}
                    {b.status !== "cancelled" && b.status !== "completed" && <button onClick={() => updateStatus(b.id, "cancelled")} className="px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">Cancelar</button>}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <p className="text-slate-400 text-center py-12">Sin reservas</p>}
            </div>
          </>
        )}

        {tab === "jobs" && (
          <>
            <div className="flex gap-2 mb-4">
              {["pending", "in-progress", "completed", "all"].map(f => (
                <button key={f} onClick={() => setJobTab(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${jobTab === f ? "bg-teal-600 text-white" : "bg-white text-slate-600 border"}`}>
                  {f === "pending" ? "Pendientes" : f === "in-progress" ? "En curso" : f === "completed" ? "Completados" : "Todos"}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {jobFiltered.map(job => {
                const b = job.booking;
                return (
                  <div key={job.id} className="bg-white rounded-2xl p-4 border shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-semibold">{b?.name || "Unknown"}</span>
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(job.status)}`}>{job.status}</span>
                        {job.assignedTo && <span className="ml-2 text-xs text-slate-400">Mecánico: {job.assignedTo}</span>}
                      </div>
                      <span className="text-sm text-slate-400">{b?.date} {b?.time}</span>
                    </div>
                    {b && <div className="text-sm text-slate-500 mb-2">{services[b.service] || b.service} · {b.vehicleMake} {b.vehicleModel} {b.vehiclePlate ? `(${b.vehiclePlate})` : ""}</div>}

                    <button onClick={() => { setExpandedJob(expandedJob === job.id ? null : job.id); setJobNotes(job.notes || ""); }}
                      className="text-xs text-teal-600 hover:underline mb-2 block">
                      {expandedJob === job.id ? "Cerrar" : "Detalles +"}
                    </button>

                    {expandedJob === job.id && (
                      <div className="bg-stone-50 rounded-xl p-4 space-y-3 mb-2">
                        <div className="flex gap-2 flex-wrap">
                          <select value={job.assignedTo} onChange={e => updateJob(job.id, { assignedTo: e.target.value })}
                            className="px-3 py-1.5 border rounded-lg text-sm bg-white">
                            <option value="">Asignar mecánico</option>
                            <option value="Mike">Mike</option>
                            <option value="Carlos">Carlos</option>
                            <option value="Dave">Dave</option>
                          </select>
                          <select value={job.status} onChange={e => updateJob(job.id, { status: e.target.value })}
                            className="px-3 py-1.5 border rounded-lg text-sm bg-white">
                            <option value="pending">Pendiente</option>
                            <option value="in-progress">En curso</option>
                            <option value="completed">Completado</option>
                          </select>
                        </div>
                        <textarea value={jobNotes} onChange={e => setJobNotes(e.target.value)} placeholder="Notas del mecánico..."
                          rows={3} className="w-full px-3 py-2 border rounded-lg text-sm resize-none" />
                        <button onClick={() => updateJob(job.id, { notes: jobNotes })}
                          className="px-4 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-medium">Guardar notas</button>
                      </div>
                    )}
                  </div>
                );
              })}
              {jobFiltered.length === 0 && <p className="text-slate-400 text-center py-12">Sin trabajos</p>}
            </div>
          </>
        )}

        {tab === "customers" && (
          <>
            <div className="flex gap-2 mb-6">
              <input value={searchPhone} onChange={e => setSearchPhone(e.target.value)} placeholder="Buscar por teléfono..."
                className="flex-1 px-4 py-3 border rounded-xl text-sm" onKeyDown={e => e.key === "Enter" && searchCustomer()} />
              <button onClick={searchCustomer} className="px-6 py-3 bg-teal-600 text-white rounded-xl text-sm font-medium">Buscar</button>
            </div>
            {customerData && (
              <div className="bg-white rounded-2xl p-6 border shadow-sm mb-4">
                <h3 className="font-bold text-lg mb-2">{customerData.name}</h3>
                <div className="text-sm text-slate-600 space-y-1">
                  <p>Teléfono: {customerData.phone}</p>
                  {customerData.email && <p>Email: {customerData.email}</p>}
                  <p>Reservas totales: {customerData.totalBookings}</p>
                  <p>Última visita: {customerData.lastVisit}</p>
                  {customerData.vehicles.length > 0 && <p>Vehículos: {customerData.vehicles.join(", ")}</p>}
                </div>
                <h4 className="font-semibold mt-4 mb-2">Historial de reservas</h4>
                <div className="space-y-2">
                  {customerBookings.map(b => (
                    <div key={b.id} className="bg-stone-50 rounded-xl p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{b.date} {b.time}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(b.status)}`}>{b.status}</span>
                      </div>
                      <div className="text-slate-500">{services[b.service] || b.service} · {b.vehicleMake} {b.vehicleModel}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {tab === "fleet" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Flota ({fleet.length})</h2>
              <button onClick={() => { setEditCar({ model: "", type: "Sedan", price: 0, available: true, best: "" }); setShowForm(true); }}
                className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium">+ Añadir</button>
            </div>
            {showForm && (
              <div className="bg-white rounded-2xl p-5 border shadow-sm mb-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input value={editCar.model || ""} onChange={e => setEditCar({ ...editCar, model: e.target.value })} placeholder="Modelo" className="px-3 py-2 border rounded-xl text-sm" />
                  <input value={editCar.type || ""} onChange={e => setEditCar({ ...editCar, type: e.target.value })} placeholder="Tipo" className="px-3 py-2 border rounded-xl text-sm" />
                  <input type="number" value={editCar.price ?? ""} onChange={e => setEditCar({ ...editCar, price: Number(e.target.value) })} placeholder="Precio/día" className="px-3 py-2 border rounded-xl text-sm" />
                  <input value={editCar.best || ""} onChange={e => setEditCar({ ...editCar, best: e.target.value })} placeholder="Para quién" className="px-3 py-2 border rounded-xl text-sm" />
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editCar.available !== false} onChange={e => setEditCar({ ...editCar, available: e.target.checked })} /> Disponible</label>
                </div>
                <div className="flex items-center gap-3">
                  {editCar.image && <Image src={editCar.image} alt="" width={80} height={60} className="rounded-lg object-cover" />}
                  <label className="px-4 py-2 bg-stone-100 text-slate-600 rounded-xl text-sm cursor-pointer">{editCar.image ? "Cambiar foto" : "Subir foto"}
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; f && setEditCar({ ...editCar, image: await uploadImage(f) }); }} />
                  </label>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveCar} className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium">Guardar</button>
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-stone-100 text-slate-600 rounded-xl text-sm">Cancelar</button>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {fleet.map(c => (
                <div key={c.id} className="bg-white rounded-2xl p-4 border shadow-sm flex items-center gap-4">
                  <div className="w-20 h-16 relative flex-shrink-0 rounded-lg overflow-hidden bg-stone-100">
                    <Image src={c.image || "/logo.png"} alt={c.model} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">{c.model}</span>
                    <span className="text-slate-400 text-sm ml-2">{c.type}</span>
                    <span className="text-teal-600 font-medium ml-3">${c.price}/d</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${c.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{c.available ? "Disponible" : "No"}</span>
                    {c.best && <span className="ml-2 text-xs text-slate-400">· {c.best}</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditCar(c); setShowForm(true); }} className="text-sm text-teal-600">Editar</button>
                    <button onClick={() => deleteCar(c.id)} className="text-sm text-red-500">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "sales" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">En Venta ({sales.length})</h2>
              <button onClick={() => { setEditSale({ model: "", year: new Date().getFullYear(), km: "", price: 0, condition: "Good", badge: "", status: "available" }); setShowSaleForm(true); }}
                className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium">+ Añadir</button>
            </div>
            {showSaleForm && (
              <div className="bg-white rounded-2xl p-5 border shadow-sm mb-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input value={editSale.model || ""} onChange={e => setEditSale({ ...editSale, model: e.target.value })} placeholder="Modelo" className="px-3 py-2 border rounded-xl text-sm" />
                  <input type="number" value={editSale.year || ""} onChange={e => setEditSale({ ...editSale, year: Number(e.target.value) })} placeholder="Año" className="px-3 py-2 border rounded-xl text-sm" />
                  <input value={editSale.km || ""} onChange={e => setEditSale({ ...editSale, km: e.target.value })} placeholder="Km" className="px-3 py-2 border rounded-xl text-sm" />
                  <input type="number" value={editSale.price ?? ""} onChange={e => setEditSale({ ...editSale, price: Number(e.target.value) })} placeholder="Precio" className="px-3 py-2 border rounded-xl text-sm" />
                  <input value={editSale.condition || ""} onChange={e => setEditSale({ ...editSale, condition: e.target.value })} placeholder="Estado" className="px-3 py-2 border rounded-xl text-sm" />
                  <input value={editSale.badge || ""} onChange={e => setEditSale({ ...editSale, badge: e.target.value })} placeholder="Badge" className="px-3 py-2 border rounded-xl text-sm" />
                  <select value={editSale.status || "available"} onChange={e => setEditSale({ ...editSale, status: e.target.value })} className="px-3 py-2 border rounded-xl text-sm">
                    <option value="available">Disponible</option>
                    <option value="pending">Pendiente</option>
                    <option value="sold">Vendido</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  {editSale.image && <Image src={editSale.image} alt="" width={80} height={60} className="rounded-lg object-cover" />}
                  <label className="px-4 py-2 bg-stone-100 text-slate-600 rounded-xl text-sm cursor-pointer">{editSale.image ? "Cambiar foto" : "Subir foto"}
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; f && setEditSale({ ...editSale, image: await uploadImage(f) }); }} />
                  </label>
                </div>
                <textarea value={editSale.description || ""} onChange={e => setEditSale({ ...editSale, description: e.target.value })} placeholder="Descripción" rows={2} className="w-full px-3 py-2 border rounded-xl text-sm" />
                <div className="flex gap-2">
                  <button onClick={saveSale} className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium">Guardar</button>
                  <button onClick={() => setShowSaleForm(false)} className="px-4 py-2 bg-stone-100 text-slate-600 rounded-xl text-sm">Cancelar</button>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {sales.map(c => (
                <div key={c.id} className="bg-white rounded-2xl p-4 border shadow-sm flex items-center gap-4">
                  <div className="w-20 h-16 relative flex-shrink-0 rounded-lg overflow-hidden bg-stone-100">
                    <Image src={c.image || "/logo.png"} alt={c.model} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">{c.model}</span>
                    <span className="text-slate-400 text-sm ml-2">{c.year} · {c.km} km</span>
                    <span className="text-teal-600 font-medium ml-3">${c.price.toLocaleString()}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${c.condition === "Excellent" ? "bg-green-100 text-green-700" : c.condition === "Good" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>{c.condition}</span>
                    {c.badge && <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">{c.badge}</span>}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${c.status === "available" ? "bg-green-100 text-green-700" : c.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{c.status}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditSale(c); setShowSaleForm(true); }} className="text-sm text-teal-600">Editar</button>
                    <button onClick={() => deleteSale(c.id)} className="text-sm text-red-500">Eliminar</button>
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
