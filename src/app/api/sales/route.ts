import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SALES_FILE = path.join(DATA_DIR, "sales.json");
const ADMIN_PIN = "2026";

interface SaleCar {
  id: string; model: string; year: number; km: string;
  price: number; condition: string; badge: string;
  description: string; status: string; createdAt: string; image?: string;
}

async function readSales(): Promise<SaleCar[]> {
  try {
    if (!existsSync(SALES_FILE)) return [];
    return JSON.parse(await readFile(SALES_FILE, "utf-8"));
  } catch { return []; }
}

async function writeSales(cars: SaleCar[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(SALES_FILE, JSON.stringify(cars, null, 2));
}

function isAdmin(auth: string | null): boolean {
  return auth === `Bearer ${process.env.CRON_SECRET}` || auth === `Bearer ${ADMIN_PIN}`;
}

export async function GET(req: NextRequest) {
  const sales = await readSales();
  const auth = req.headers.get("authorization");
  if (isAdmin(auth)) return NextResponse.json({ sales });
  return NextResponse.json({ sales: sales.filter(c => c.status === "available") });
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req.headers.get("authorization")))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.model?.trim()) return NextResponse.json({ error: "Model required" }, { status: 400 });
  const sales = await readSales();
  const car: SaleCar = {
    id: Date.now().toString(36),
    model: body.model.trim(),
    year: Number(body.year) || new Date().getFullYear(),
    km: body.km || "0",
    price: Number(body.price) || 0,
    condition: body.condition || "Good",
    badge: body.badge || "",
    description: body.description || "",
    status: body.status || "available",
    createdAt: new Date().toISOString(),
    image: body.image || "",
  };
  sales.push(car);
  await writeSales(sales);
  return NextResponse.json({ success: true, car });
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req.headers.get("authorization")))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  let sales = await readSales();
  sales = sales.map(c => c.id === body.id ? { ...c, ...body, id: c.id } : c);
  await writeSales(sales);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req.headers.get("authorization")))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  let sales = await readSales();
  sales = sales.filter(c => c.id !== id);
  await writeSales(sales);
  return NextResponse.json({ success: true });
}
