"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const services = [
  { icon: "🔧", title: "Repairs", desc: "Oil change, brakes, diagnostics, roadworthy certificates & pre-purchase inspections." },
  { icon: "🚗", title: "Rentals", desc: "Reliable cars for students, backpackers & workers. Weekly & monthly discounts." },
  { icon: "💰", title: "Used Cars", desc: "Quality inspected vehicles under $10K. First car? We help you choose." },
  { icon: "🔄", title: "Loan Vehicle", desc: "Free loan car while we fix yours. Stay mobile, no extra cost." },
];

const fleet = [
  { model: "Toyota Corolla", type: "Sedan", price: 40, available: true, best: "Student" },
  { model: "Mazda 3", type: "Hatchback", price: 42, available: true, best: "Economy" },
  { model: "Hyundai i30", type: "Hatchback", price: 38, available: true, best: "Budget" },
  { model: "Toyota Yaris", type: "City Car", price: 35, available: true, best: "City" },
  { model: "Honda Civic", type: "Sedan", price: 45, available: false, best: "Popular" },
  { model: "Mitsubishi Outlander", type: "SUV", price: 60, available: true, best: "Group" },
];

const usedCars = [
  { model: "Toyota Corolla 2012", price: "$6,500", km: "145,000", condition: "Excellent", badge: "Student Pick" },
  { model: "Mazda 3 2013", price: "$5,800", km: "132,000", condition: "Good", badge: "Best Value" },
  { model: "Hyundai Getz 2010", price: "$3,200", km: "180,000", condition: "Fair", badge: "Cheapest" },
  { model: "Holden Cruze 2014", price: "$4,900", km: "120,000", condition: "Good", badge: "Reliable" },
];

const faqs = [
  { q: "Can I rent with an international license?", a: "Yes. With a valid IDP (International Driving Permit). Minimum age 21." },
  { q: "Do you offer weekly discounts?", a: "Yes. Weekly rates are up to 30% cheaper than daily. Monthly rates even better." },
  { q: "What inspections do you offer?", a: "Roadworthy certificates (RWC) and pre-purchase inspections. We check everything." },
  { q: "Is the initial diagnosis free?", a: "Yes. We diagnose for free — you only pay for the repair." },
  { q: "Can first-time buyers get help?", a: "Absolutely. We guide students on choosing, inspecting, and registering their first car." },
];

export default function Home() {
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", service: "repair", date: "", time: "", description: "" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [bookingSent, setBookingSent] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingData, setBookingData] = useState<any>(null);
  const [slots, setSlots] = useState<Record<string, string[]>>({});
  const [selectedDate, setSelectedDate] = useState("");

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    setLoading(true);
    setChatResponse("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput }),
      });
      const data = await res.json();
      setChatResponse(data.reply || "Contact us at +61 7 1234 5678");
    } catch {
      setChatResponse("Describe your issue and we'll help you out.");
    }
    setLoading(false);
  };

  const loadSlots = async () => {
    try {
      const res = await fetch("/api/book");
      const data = await res.json();
      setSlots(data.slots || {});
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");
    setBookingData(null);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setBookingData(data.booking);
        setForm({ name: "", phone: "", service: "repair", date: "", time: "", description: "" });
        setSelectedDate("");
        loadSlots();
      } else {
        setBookingError(data.error || "Error. Llama al +61 7 1234 5678");
      }
    } catch {
      setBookingError("Error de conexión. Llama al +61 7 1234 5678");
    }
  };

  useEffect(() => { loadSlots(); }, []);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] font-body text-[var(--color-foreground)]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
          <a href="#" className="flex items-center gap-2">
            <Image src="/logo.png" alt="GC Auto" width={38} height={29} className="object-contain" />
            <span className="text-lg font-bold text-[var(--color-primary)]">GC Auto</span>
          </a>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#services" className="hover:text-[var(--color-primary)]">Services</a>
            <a href="#fleet" className="hover:text-[var(--color-primary)]">Rentals</a>
            <a href="#used-cars" className="hover:text-[var(--color-primary)]">Buy</a>
            <a href="#chat" className="hover:text-[var(--color-primary)]">AI Chat</a>
            <a href="#contact" className="hover:text-[var(--color-primary)]">Contact</a>
          </div>
          <a href="#contact" className="bg-[var(--color-primary)] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors">
            Book Now
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        <Image src="/banner.png" alt="GC Auto Gold Coast" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Your Trusted Auto Hub in Gold Coast
          </h1>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto drop-shadow">
            Repairs · Rentals · Used Cars — for students, backpackers & locals.
            AI diagnosis, fair prices, no surprises.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#contact" className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-full font-semibold hover:bg-[var(--color-primary-dark)] transition-colors shadow-lg">
              Book a Repair
            </a>
            <a href="#fleet" className="bg-white/90 text-slate-800 px-8 py-3 rounded-full font-semibold hover:bg-white transition-colors shadow-lg">
              Rent a Car
            </a>
            <a href="#used-cars" className="bg-[var(--color-accent)] text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors shadow-lg">
              Browse Used Cars
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-amber-500">6+</div>
            <div className="text-sm text-slate-300">Fleet Vehicles</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-500">500+</div>
            <div className="text-sm text-slate-300">Repairs Done</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-500">4.8★</div>
            <div className="text-sm text-slate-300">Customer Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-500">100+</div>
            <div className="text-sm text-slate-300">Cars Sold</div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">What We Offer</h2>
          <p className="text-center text-slate-500 mb-12 max-w-xl mx-auto">Three businesses, one mission: keep you moving in Gold Coast.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Workshop services detail */}
          <div className="mt-12 bg-white rounded-2xl p-8 border border-stone-100">
            <h3 className="font-semibold text-xl mb-4">🔧 Workshop Services</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "Oil Change", "Brake Service", "Battery Replacement",
                "Full Diagnostics", "Roadworthy Certificate", "Pre-Purchase Inspection",
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-700 bg-stone-50 rounded-xl px-4 py-3 text-sm">
                  <span className="text-teal-600">✓</span> {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fleet */}
      <section id="fleet" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Rental Fleet</h2>
          <p className="text-center text-slate-500 mb-4">Perfect for students, backpackers & temporary workers.</p>
          <p className="text-center text-sm text-slate-400 mb-10">Weekly discounts up to 30% · Monthly rates available · No deposit for students</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fleet.map((car, i) => (
              <div key={i} className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{car.model}</h3>
                    <p className="text-slate-500 text-sm">{car.type}</p>
                  </div>
                  {car.available ? (
                    <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs font-medium">Available</span>
                  ) : (
                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-medium">Rented</span>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-bold text-[var(--color-primary)]">${car.price}</span>
                  <span className="text-slate-400 text-sm">/day</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">Best for: {car.best}</p>
                <button disabled={!car.available} className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  car.available
                    ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                    : "bg-stone-200 text-stone-400 cursor-not-allowed"
                }`}>
                  {car.available ? "Rent Now" : "Unavailable"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Used Cars */}
      <section id="used-cars" className="py-16 px-4 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Used Cars for Sale</h2>
          <p className="text-center text-slate-500 mb-4">Inspected, verified & ready to drive. First car? We guide you through registration, insurance & roadworthy.</p>
          <p className="text-center text-sm text-slate-400 mb-10">Prices from $3,200 · Financing available · Student-friendly</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {usedCars.map((car, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded">{car.badge}</span>
                  <span className="text-xs text-slate-400">{car.km} km</span>
                </div>
                <h3 className="font-semibold text-lg mb-1">{car.model}</h3>
                <p className="text-sm text-slate-500 mb-3">{car.condition}</p>
                <div className="text-2xl font-bold text-[var(--color-primary)] mb-4">{car.price}</div>
                <button className="w-full bg-slate-800 text-white py-2 rounded-lg font-medium hover:bg-slate-900 transition-colors">
                  Inquire
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-slate-400">More vehicles available. Contact us for the full list.</p>
          </div>
        </div>
      </section>

      {/* AI Chat */}
      <section id="chat" className="py-16 px-4 bg-gradient-to-b from-stone-50 to-teal-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">AI Assistant</h2>
          <p className="text-center text-slate-600 mb-8">Describe your issue or question — we'll help you right away.</p>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <div className="mb-4 min-h-[120px] bg-stone-50 rounded-xl p-4">
              {loading ? (
                <p className="text-slate-400">Analyzing...</p>
              ) : chatResponse ? (
                <p className="text-slate-700">{chatResponse}</p>
              ) : (
                <p className="text-slate-400 text-sm">
                  Try: &quot;Car won&apos;t start&quot; · &quot;Brake noise&quot; · &quot;How to rent for a month&quot; · &quot;Buying my first car&quot;
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Describe your problem or question..."
                className="flex-1 px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
                onKeyDown={(e) => e.key === "Enter" && handleChat()}
              />
              <button
                onClick={handleChat}
                disabled={loading}
                className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-medium hover:bg-[var(--color-primary-dark)] disabled:opacity-50 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Laura M.", text: "Perfect for international students. They helped with my first car purchase — inspection, paperwork, everything.", stars: "⭐⭐⭐⭐⭐", type: "Student" },
              { name: "Carlos G.", text: "Rented for a month while working holiday. Great rates and the car was super reliable.", stars: "⭐⭐⭐⭐⭐", type: "Backpacker" },
              { name: "Sarah K.", text: "Diagnosed my engine issue in minutes. Fair price and done same day.", stars: "⭐⭐⭐⭐", type: "Local" },
            ].map((t, i) => (
              <div key={i} className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                <div className="text-amber-400 mb-2">{t.stars}</div>
                <p className="text-slate-600 mb-3 text-sm">&ldquo;{t.text}&rdquo;</p>
                <div className="flex justify-between items-center">
                  <p className="font-medium text-sm">{t.name}</p>
                  <span className="text-xs text-[var(--color-primary)] bg-teal-50 px-2 py-0.5 rounded">{t.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 bg-slate-800 text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="border border-slate-600 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-700 transition-colors"
                >
                  <span className="font-medium">{f.q}</span>
                  <span className="text-amber-500">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && <div className="px-6 pb-4 text-slate-300 text-sm">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Booking */}
      <section id="contact" className="py-16 px-4">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Get in Touch</h2>
          <p className="text-center text-slate-600 mb-8">Book a repair, rent a car, or inquire about a vehicle. We respond within minutes.</p>
          {bookingData ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Booking Confirmed!</h3>
              <p className="text-green-700 mb-1">{bookingData.date} at {bookingData.time}</p>
              <p className="text-green-600 text-sm">We'll send a reminder to your phone.</p>
              <button onClick={() => setBookingData(null)}
                className="mt-6 text-sm text-green-700 underline">Book another</button>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone / WhatsApp</label>
              <input type="tel" required value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Service</label>
              <select value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="repair">🔧 Repair</option>
                <option value="rental">🚗 Rental</option>
                <option value="used-car">💰 Used Car</option>
                <option value="both">🔄 Multiple</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input type="date" required value={form.date}
                onChange={(e) => { setForm({ ...form, date: e.target.value }); setSelectedDate(e.target.value); }}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            {form.date && slots[form.date] && slots[form.date].length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Available Times</label>
                <div className="grid grid-cols-2 gap-2">
                  {slots[form.date].map(t => (
                    <button key={t} type="button" onClick={() => setForm({ ...form, time: t })}
                      className={`py-2 rounded-xl text-sm font-medium border transition-colors ${
                        form.time === t ? "bg-teal-600 text-white border-teal-600" : "bg-white text-slate-600 border-stone-200 hover:border-teal-400"
                      }`}>{t}</button>
                  ))}
                </div>
              </div>
            )}
            {form.date && slots[form.date] && slots[form.date].length === 0 && (
              <p className="text-sm text-amber-600">No available times for this date. Pick another day.</p>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Describe your issue (optional)</label>
              <textarea value={form.description} rows={2}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-[var(--color-primary)] resize-none"
              />
            </div>
            {bookingError && <p className="text-red-600 text-sm">{bookingError}</p>}
            <button type="submit" disabled={!form.date || !form.time}
              className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-semibold hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
            >
              {!form.time ? "Select a time" : "✅ Confirm Booking"}
            </button>
          </form>
          )}
          <div className="text-center mt-6 text-sm text-slate-500">
            <p>📍 Gold Coast, Queensland, Australia</p>
            <p>📞 +61 7 1234 5678 · ✉️ info@gcauto.com.au</p>
            <p className="mt-2">🇪🇸 Hablamos español · 🇧🇷 Falamos português</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-900 text-slate-400 text-sm text-center">
        <div className="max-w-6xl mx-auto">
          <p>📍 Gold Coast, Queensland, Australia</p>
          <p className="mt-2">📞 +61 7 1234 5678 · ✉️ info@gcauto.com.au</p>
          <p className="mt-2 text-xs text-slate-500">🇪🇸 Hablamos español · 🇧🇷 Falamos português · 🧳 Student & backpacker friendly</p>
          <p className="mt-4 text-xs text-slate-600">© 2026 GC Auto | Gold Coast</p>
        </div>
      </footer>
    </div>
  );
}
