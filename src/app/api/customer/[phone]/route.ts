import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ phone: string }> }
) {
  const { phone } = await params;
  if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

  try {
    if (!existsSync(BOOKINGS_FILE)) return NextResponse.json({ bookings: [], customer: null });
    const raw = await readFile(BOOKINGS_FILE, "utf-8");
    const all = JSON.parse(raw);
    const customerBookings = all.filter((b: any) => b.phone === phone);
    const customer = customerBookings.length > 0 ? {
      name: customerBookings[0].name,
      phone: customerBookings[0].phone,
      email: customerBookings[0].email || "",
      totalBookings: customerBookings.length,
      lastVisit: customerBookings.sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0].date,
      vehicles: [...new Set(customerBookings
        .filter((b: any) => b.vehicleMake || b.vehicleModel)
        .map((b: any) => `${b.vehicleMake || ""} ${b.vehicleModel || ""}`.trim())
      )],
    } : null;

    return NextResponse.json({ bookings: customerBookings, customer });
  } catch {
    return NextResponse.json({ bookings: [], customer: null });
  }
}
