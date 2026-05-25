import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

interface Booking {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  date: string;
  time: string;
  description: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

async function readBookings(): Promise<Booking[]> {
  try {
    if (!existsSync(BOOKINGS_FILE)) return [];
    const raw = await readFile(BOOKINGS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeBookings(bookings: Booking[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, service, date, time, description } = body;

    if (!name?.trim() || !phone?.trim() || !date || !service) {
      return NextResponse.json({ error: "Name, phone, date and service required" }, { status: 400 });
    }

    const bookings = await readBookings();
    const booking: Booking = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      service,
      date,
      time: time || "09:00",
      description: description?.trim() || "",
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    bookings.push(booking);
    await writeBookings(bookings);

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        date: booking.date,
        time: booking.time,
        service: booking.service,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    // Public: return available slots for next 7 days
    const bookings = await readBookings();
    const today = new Date();
    const slots: Record<string, string[]> = {};
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split("T")[0];
      if (d.getDay() === 0) continue;
      const dayBookings = bookings.filter(b => b.date === key && b.status !== "cancelled");
      const times = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
      slots[key] = times.filter(t => !dayBookings.some(b => b.time === t));
    }
    return NextResponse.json({ slots });
  }

  // Admin: return all bookings
  const bookings = await readBookings();
  bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json({ bookings });
}

export async function PATCH(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await req.json();
  const bookings = await readBookings();
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  bookings[idx].status = status || bookings[idx].status;
  await writeBookings(bookings);
  return NextResponse.json({ success: true });
}
