"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const services = [
  { icon: "\uD83D\uDD27", title: "Repairs", desc: "Oil change, brakes, diagnostics, log book services & pre-purchase inspections." },
  { icon: "\uD83D\uDE97", title: "Rentals", desc: "Reliable cars for students, backpackers & workers. Weekly & monthly discounts." },
  { icon: "\uD83D\uDCB0", title: "Used Cars", desc: "Quality inspected vehicles under $10K. First car? We help you choose." },
  { icon: "\uD83D\uDD04", title: "Loan Vehicle", desc: "Free loan car while we fix yours. Stay mobile, no extra cost." },
];

const faqs = [
  { q: "Can I rent with an international license?", a: "Yes. With a valid IDP (International Driving Permit). Minimum age 21." },
  { q: "Do you offer weekly discounts?", a: "Yes. Weekly rates up to 30% cheaper. Monthly rates even better." },
  { q: "What services do you offer?", a: "Log book services, pre-purchase inspections, repairs, rentals & used cars." },
  { q: "Is the initial diagnosis free?", a: "Yes. We diagnose for free \u2014 you only pay for the repair." },
  { q: "Can first-time buyers get help?", a: "Absolutely. We guide students on choosing, inspecting, and registering their first car." },
];

const fallbackImg = "/logo.png";

export default function Home() {
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", service: "oil-change",
    vehicleMake: "", vehicleModel: "", vehicleYear: "", vehiclePlate: "",
    date: "", time: "", description: "",
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [bookingSent, setBookingSent] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingData, setBookingData] = useState<any>(null);
  const [slots, setSlots] = useState<Record<string, string[]>>({});
  const [serviceCatalog, setServiceCatalog] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [fleetData, setFleetData] = useState<any[]>([]);
  const [saleData, setSaleData] = useState<any[]>([]);
  const [rentalDays, setRentalDays] = useState(1);
  const [selectedCar, setSelectedCar] = useState<string>("");
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/services").then(r => r.json()).then(d => setServiceCatalog(d.services || [])).catch(() => {});
    fetch("/api/book").then(r => r.json()).then(d => setSlots(d.slots || {})).catch(() => {});
    fetch("/api/fleet").then(r => r.json()).then(d => setFleetData(d.fleet || [])).catch(() => {});
    fetch("/api/sales").then(r => r.json()).then(d => setSaleData(d.sales || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const svc = serviceCatalog.find((s: any) => s.id === form.service);
    setSelectedService(svc || null);
  }, [form.service, serviceCatalog]);

  const handleRent = (car: any) => {
    setForm({ ...form, service: "rental", description: `Interested in: ${car.model} (${car.type}) - $${car.price}/day` });
    setSelectedCar(car.model);
    setRentalDays(1);
    setTimeout(() => contactRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    setLoading(true); setChatResponse("");
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: chatInput }) });
      setChatResponse((await res.json()).reply || "Contact us at +61 7 1234 5678");
    } catch { setChatResponse("Describe your issue and we'll help you out."); }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(""); setBookingData(null);
    const extra = form.service === "rental" ? ` · Rental: ${selectedCar} · Days: ${rentalDays}` : "";
    try {
      const res = await fetch("/api/book", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, description: form.description + extra, vehicleYear: form.vehicleYear ? Number(form.vehicleYear) : undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingData(data.booking);
        setForm({ name: "", phone: "", email: "", service: "oil-change", vehicleMake: "", vehicleModel: "", vehicleYear: "", vehiclePlate: "", date: "", time: "", description: "" });
        const sr = await fetch("/api/book");
        setSlots((await sr.json()).slots || {});
      } else setBookingError(data.error || "Error. Call +61 7 1234 5678");
    } catch { setBookingError("Connection error. Call +61 7 1234 5678"); }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] font-body text-[var(--color-foreground)]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
          <a href="#" className="flex items-center gap-2">
            <Image src="/logo.png" alt="GC Motors" width={38} height={29} className="object-contain" />
            <span className="text-lg font-bold text-[var(--color-primary)]">GC Motors</span>
          </a>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#services" className="hover:text-[var(--color-primary)]">Services</a>
            <a href="#fleet" className="hover:text-[var(--color-primary)]">Rentals</a>
            <a href="#used-cars" className="hover:text-[var(--color-primary)]">Buy</a>
            <a href="/about" className="hover:text-[var(--color-primary)]">About</a>
            <a href="#chat" className="hover:text-[var(--color-primary)]">AI Chat</a>
            <a href="#contact" className="hover:text-[var(--color-primary)]">Contact</a>
          </div>
          <a href="#contact" className="bg-[var(--color-primary)] text-white px-5 py-2 rounded-full text-sm font-medium">Book Now</a>
        </div>
      </nav>

      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        <Image src="/banner.png" alt="GC Motors Gold Coast" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">Your Trusted Auto Hub in Gold Coast</h1>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto drop-shadow">Repairs · Rentals · Used Cars — for students, backpackers & locals. AI diagnosis, fair prices, no surprises.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#contact" className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-full font-semibold">Book a Repair</a>
            <a href="#fleet" className="bg-white/90 text-slate-800 px-8 py-3 rounded-full font-semibold">Rent a Car</a>
            <a href="#used-cars" className="bg-[var(--color-accent)] text-white px-8 py-3 rounded-full font-semibold">Browse Used Cars</a>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div><div className="text-3xl font-bold text-amber-500">{fleetData.length}+</div><div className="text-sm text-slate-300">Fleet Vehicles</div></div>
          <div><div className="text-3xl font-bold text-amber-500">500+</div><div className="text-sm text-slate-300">Repairs Done</div></div>
          <div><div className="text-3xl font-bold text-amber-500">4.8★</div><div className="text-sm text-slate-300">Customer Rating</div></div>
          <div><div className="text-3xl font-bold text-amber-500">100+</div><div className="text-sm text-slate-300">Cars Sold</div></div>
        </div>
      </section>

      <section id="services" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">What We Offer</h2>
          <p className="text-center text-slate-500 mb-12 max-w-xl mx-auto">Three businesses, one mission: keep you moving in Gold Coast.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md">
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 bg-white rounded-2xl p-8 border border-stone-100">
            <h3 className="font-semibold text-xl mb-4">Workshop Services</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {serviceCatalog.filter((s: any) => !["rental", "used-car", "other"].includes(s.id)).map((s: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-slate-700 bg-stone-50 rounded-xl px-4 py-3 text-sm">
                  <span><span className="text-teal-600">✓</span> {s.name}</span>
                  <span className="text-teal-600 font-medium">${s.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="fleet" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Rental Fleet</h2>
          <p className="text-center text-slate-500 mb-4">Perfect for students, backpackers & temporary workers.</p>
          <p className="text-center text-sm text-slate-400 mb-10">Weekly discounts up to 30% · Monthly rates available</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fleetData.map((car, i) => (
              <div key={car.id || i} className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
                <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden bg-stone-200">
                  <Image src={car.image || fallbackImg} alt={car.model} fill className="object-cover" />
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div><h3 className="font-semibold text-lg">{car.model}</h3><p className="text-slate-500 text-sm">{car.type}</p></div>
                  {car.available ? <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs font-medium">Available</span> : <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-medium">Rented</span>}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-bold text-[var(--color-primary)]">${car.price}</span>
                  <span className="text-slate-400 text-sm">/day</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">Best for: {car.best}</p>
                <button disabled={!car.available} onClick={() => handleRent(car)}
                  className={`w-full py-2 rounded-lg font-medium ${car.available ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]" : "bg-stone-200 text-stone-400 cursor-not-allowed"}`}>
                  {car.available ? "Rent Now" : "Unavailable"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="used-cars" className="py-16 px-4 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Used Cars for Sale</h2>
          <p className="text-center text-slate-500 mb-4">Inspected, verified & ready to drive.</p>
          <p className="text-center text-sm text-slate-400 mb-10">Prices from $3,200 · Financing available</p>
          {saleData.length === 0 ? <p className="text-center text-slate-400 py-12">No vehicles available right now. Check back soon.</p> : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleData.map((car, i) => (
                <div key={car.id || i} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md">
                  <div className="relative w-full h-36 mb-4 rounded-xl overflow-hidden bg-stone-200">
                    <Image src={car.image || fallbackImg} alt={car.model} fill className="object-cover" />
                  </div>
                  <div className="flex justify-between items-start mb-3">
                    {car.badge && <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded">{car.badge}</span>}
                    <span className="text-xs text-slate-400">{car.km} km</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{car.model}</h3>
                  <p className="text-sm text-slate-500 mb-3">{car.condition}</p>
                  <div className="text-2xl font-bold text-[var(--color-primary)] mb-4">${car.price?.toLocaleString()}</div>
                  <a href="#contact" className="block w-full bg-slate-800 text-white py-2 rounded-lg font-medium text-center">Inquire</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="chat" className="py-16 px-4 bg-gradient-to-b from-stone-50 to-teal-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">AI Assistant</h2>
          <p className="text-center text-slate-600 mb-8">Describe your issue — we'll help you right away.</p>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <div className="mb-4 min-h-[120px] bg-stone-50 rounded-xl p-4">
              {loading ? <p className="text-slate-400">Analyzing...</p> : chatResponse ? <p className="text-slate-700">{chatResponse}</p> : <p className="text-slate-400 text-sm">Try: "Car won't start" · "Brake noise" · "How to rent for a month"</p>}
            </div>
            <div className="flex gap-2">
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Describe your problem..." className="flex-1 px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-[var(--color-primary)]" onKeyDown={e => e.key === "Enter" && handleChat()} />
              <button onClick={handleChat} disabled={loading} className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50">Send</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Laura M.", text: "Perfect for international students. They helped with my first car purchase.", stars: "⭐⭐⭐⭐⭐", type: "Student" },
              { name: "Carlos G.", text: "Rented for a month while working holiday. Great rates.", stars: "⭐⭐⭐⭐⭐", type: "Backpacker" },
              { name: "Sarah K.", text: "Diagnosed my engine issue in minutes. Fair price.", stars: "⭐⭐⭐⭐", type: "Local" },
            ].map((t, i) => (
              <div key={i} className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                <div className="text-amber-400 mb-2">{t.stars}</div>
                <p className="text-slate-600 mb-3 text-sm">“{t.text}”</p>
                <div className="flex justify-between items-center"><p className="font-medium text-sm">{t.name}</p><span className="text-xs text-[var(--color-primary)] bg-teal-50 px-2 py-0.5 rounded">{t.type}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-800 text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">FAQs</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="border border-slate-600 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-700">
                  <span className="font-medium">{f.q}</span><span className="text-amber-500">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && <div className="px-6 pb-4 text-slate-300 text-sm">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" ref={contactRef} className="py-16 px-4">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Book Online</h2>
          <p className="text-center text-slate-600 mb-8">We respond within minutes.</p>
          {bookingData ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Booking Confirmed!</h3>
              <p className="text-green-700 mb-1">{bookingData.date} at {bookingData.time}</p>
              <button onClick={() => setBookingData(null)} className="mt-6 text-sm text-green-700 underline">Book another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone / WhatsApp *</label>
                  <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-[var(--color-primary)]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Service *</label>
                <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-[var(--color-primary)]">
                  {serviceCatalog.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.icon} {s.name} {s.price > 0 ? `($${s.price})` : ""}</option>
                  ))}
                </select>
                {selectedService && selectedService.price > 0 && (
                  <p className="text-xs text-teal-600 mt-1">From ${selectedService.price} AUD · ~{selectedService.duration} min</p>
                )}
              </div>

              {form.service === "rental" && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-medium text-teal-800">Rental Request</p>
                  <div>
                    <label className="block text-sm font-medium mb-1">Car interested in</label>
                    <input type="text" value={selectedCar} onChange={e => setSelectedCar(e.target.value)} placeholder="Which car?"
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Rental duration (days)</label>
                    <input type="number" min={1} max={90} value={rentalDays} onChange={e => setRentalDays(Math.max(1, Number(e.target.value)))}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]" />
                  </div>
                  <p className="text-xs text-teal-600">Need a valid IDP (International Driving Permit). Minimum age 21.</p>
                </div>
              )}

              <div className="border-t border-stone-100 pt-4">
                <p className="text-sm font-medium text-slate-700 mb-3">Your Vehicle (optional but recommended)</p>
                <div className="grid grid-cols-2 gap-3">
                  <input value={form.vehicleMake} onChange={e => setForm({ ...form, vehicleMake: e.target.value })} placeholder="Make (Toyota, Mazda...)" className="px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]" />
                  <input value={form.vehicleModel} onChange={e => setForm({ ...form, vehicleModel: e.target.value })} placeholder="Model (Corolla, 3...)" className="px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]" />
                  <input type="number" value={form.vehicleYear} onChange={e => setForm({ ...form, vehicleYear: e.target.value })} placeholder="Year" className="px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]" />
                  <input value={form.vehiclePlate} onChange={e => setForm({ ...form, vehiclePlate: e.target.value })} placeholder="Plate (optional)" className="px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date *</label>
                  <input type="date" required value={form.date} onChange={e => { setForm({ ...form, date: e.target.value }); }}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  {form.date && slots[form.date] && slots[form.date].length > 0 ? (
                    <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-[var(--color-primary)] bg-white">
                      <option value="">Select time</option>
                      {slots[form.date].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  ) : (
                    <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-[var(--color-primary)]" />
                  )}
                </div>
              </div>
              {form.date && slots[form.date] && slots[form.date].length === 0 && (
                <p className="text-sm text-amber-600">No available times for this date. Pick another day.</p>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Describe your issue (optional)</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-[var(--color-primary)] resize-none" />
              </div>

              {bookingError && <p className="text-red-600 text-sm">{bookingError}</p>}
              <button type="submit" disabled={!form.date || !form.time}
                className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-semibold disabled:opacity-50">
                {!form.time ? "Select a time" : "Confirm Booking"}
              </button>
            </form>
          )}
          <div className="text-center mt-6 text-sm text-slate-500">
            <p>Gold Coast, Queensland, Australia</p>
            <p>+61 7 1234 5678 · info@gcauto.com.au</p>
            <p className="mt-2">Hablo español · Falo portugues</p>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 bg-slate-900 text-slate-400 text-sm text-center">
        <p>Gold Coast, Queensland, Australia</p>
        <p className="mt-2">+61 7 1234 5678 · info@gcauto.com.au</p>
        <p className="mt-2 text-xs">&copy; 2026 GC Motors | Gold Coast</p>
      </footer>
    </div>
  );
}
