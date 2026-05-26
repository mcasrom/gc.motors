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

const ADMIN_PIN = "2026";
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
