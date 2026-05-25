import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FLEET_FILE = path.join(DATA_DIR, "fleet.json");
const ADMIN_PIN = "2026";

interface Car {
  id: string; model: string; type: string; price: number;
  available: boolean; best: string;
}

async function readFleet(): Promise<Car[]> {
  try {
    if (!existsSync(FLEET_FILE)) return [];
    return JSON.parse(await readFile(FLEET_FILE, "utf-8"));
  } catch { return []; }
}

async function writeFleet(cars: Car[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(FLEET_FILE, JSON.stringify(cars, null, 2));
}

function isAdmin(auth: string | null): boolean {
  return auth === `Bearer ${process.env.CRON_SECRET}` || auth === `Bearer ${ADMIN_PIN}`;
}

export async function GET(req: NextRequest) {
  const fleet = await readFleet();
  const auth = req.headers.get("authorization");
  if (isAdmin(auth)) return NextResponse.json({ fleet });
  return NextResponse.json({ fleet: fleet.filter(c => c.available) });
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req.headers.get("authorization")))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.model?.trim()) return NextResponse.json({ error: "Model required" }, { status: 400 });
  const fleet = await readFleet();
  const car: Car = {
    id: Date.now().toString(36),
    model: body.model.trim(), type: body.type || "Sedan",
    price: Number(body.price) || 0, available: body.available !== false,
    best: body.best || "",
  };
  fleet.push(car);
  await writeFleet(fleet);
  return NextResponse.json({ success: true, car });
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req.headers.get("authorization")))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  let fleet = await readFleet();
  fleet = fleet.map(c => c.id === body.id ? { ...c, ...body, id: c.id } : c);
  await writeFleet(fleet);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req.headers.get("authorization")))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  let fleet = await readFleet();
  fleet = fleet.filter(c => c.id !== id);
  await writeFleet(fleet);
  return NextResponse.json({ success: true });
}
