import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");
const JOBS_FILE = path.join(DATA_DIR, "jobs.json");

interface Booking {
  id: string; name: string; phone: string; email?: string;
  vehicleMake?: string; vehicleModel?: string; vehicleYear?: number; vehiclePlate?: string;
  service: string; serviceName?: string; date: string; time: string; description: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

async function readJSON(file: string): Promise<any[]> {
  try {
    if (!existsSync(file)) return [];
    return JSON.parse(await readFile(file, "utf-8"));
  } catch { return []; }
}

async function writeJSON(file: string, data: any[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(file, JSON.stringify(data, null, 2));
}

const SERVICE_LABELS: Record<string, string> = {
  "oil-change": "Oil Change", "brake-service": "Brake Service", battery: "Battery",
  diagnostics: "Diagnostics", logbook: "Log Book", "pre-purchase": "Pre-Purchase",
  tire: "Tire", "ac-service": "AC", clutch: "Clutch", "timing-belt": "Timing Belt",
  transmission: "Transmission", roadworthy: "Roadworthy", rental: "Rental",
  "used-car": "Used Car", other: "Other",
};

async function notifyBooking(b: Booking) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const isRental = b.service === "rental" || b.service === "used-car";
  const to = isRental
    ? (process.env.BOOKING_TO_RENTALS || "rentals@gcmotors-workshop.com")
    : (process.env.BOOKING_TO_REPAIRS || "repairs@gcmotors-workshop.com");
  const from = process.env.RESEND_FROM || "GCMotors Workshop <bookings@gcmotors-workshop.com>";
  const label = SERVICE_LABELS[b.service] || b.service;
  const vehicle = [b.vehicleMake, b.vehicleModel, b.vehicleYear ? `(${b.vehicleYear})` : "", b.vehiclePlate]
    .filter(Boolean).join(" ");
  const rows = ([
    ["Name", b.name], ["Phone", b.phone], ["Email", b.email || "—"],
    ["Service", label], ["Date", `${b.date} ${b.time}`],
    ["Vehicle", vehicle || "—"], ["Notes", b.description || "—"],
  ] as [string, string][]).map(([k, v]) =>
    `<tr><td style="padding:6px 12px;color:#64748b">${k}</td><td style="padding:6px 12px;font-weight:600">${v}</td></tr>`).join("");
  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto">
    <h2 style="color:#0f766e">New booking · GCMotors Workshop</h2>
    <p style="color:#475569">${isRental ? "Rental" : "Repairs/Services"} request from the website.</p>
    <table style="border-collapse:collapse;width:100%">${rows}</table>
  </div>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: [to], reply_to: b.email || undefined,
        subject: `New booking · ${label} · ${b.name} · ${b.date} ${b.time}`, html,
      }),
    });
    if (!res.ok) console.error("Resend error", res.status, await res.text());
  } catch (e) { console.error("notifyBooking failed", e); }
}

const ADMIN_PIN = process.env.GC_ADMIN_PIN || "";
const isAdmin = (auth: string | null) =>
  auth === `Bearer ${process.env.CRON_SECRET}` || auth === `Bearer ${ADMIN_PIN}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, vehicleMake, vehicleModel, vehicleYear, vehiclePlate, service, date, time, description } = body;

    if (!name?.trim() || !phone?.trim() || !date) {
      return NextResponse.json({ error: "Name, phone and date required" }, { status: 400 });
    }

    const bookings = await readJSON(BOOKINGS_FILE);
    const booking: Booking = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      vehicleMake: vehicleMake?.trim(), vehicleModel: vehicleModel?.trim(),
      vehicleYear: vehicleYear ? Number(vehicleYear) : undefined, vehiclePlate: vehiclePlate?.trim(),
      service: service || "other",
      date, time: time || "09:00", description: description?.trim() || "",
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    bookings.push(booking);
    await writeJSON(BOOKINGS_FILE, bookings);
    await notifyBooking(booking);

    return NextResponse.json({
      success: true,
      booking: { id: booking.id, date: booking.date, time: booking.time, service: booking.service },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!isAdmin(auth)) {
    const bookings = await readJSON(BOOKINGS_FILE);
    const today = new Date();
    const slots: Record<string, string[]> = {};
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split("T")[0];
      if (d.getDay() === 0) continue;
      const dayBookings = bookings.filter((b: Booking) => b.date === key && b.status !== "cancelled");
      const times = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
      slots[key] = times.filter(t => !dayBookings.some((b: Booking) => b.time === t));
    }
    return NextResponse.json({ slots });
  }

  const bookings = await readJSON(BOOKINGS_FILE);
  bookings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json({ bookings });
}

export async function PATCH(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!isAdmin(auth)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  const bookings = await readJSON(BOOKINGS_FILE);
  const idx = bookings.findIndex((b: any) => b.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  bookings[idx].status = status || bookings[idx].status;

  if (status === "confirmed" || status === "in-progress") {
    const jobs = await readJSON(JOBS_FILE);
    if (!jobs.some((j: any) => j.bookingId === id)) {
      jobs.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        bookingId: id,
        status: status === "in-progress" ? "in-progress" : "pending",
        assignedTo: "", notes: "", parts: [],
        createdAt: new Date().toISOString(),
      });
      await writeJSON(JOBS_FILE, jobs);
    }
  }

  await writeJSON(BOOKINGS_FILE, bookings);
  return NextResponse.json({ success: true });
}
