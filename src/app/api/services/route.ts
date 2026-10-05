import { NextRequest, NextResponse } from "next/server";
import { adminGuard } from "@/lib/ratelimit";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "services.json");
const ADMIN_PIN = process.env.GC_ADMIN_PIN || "";

interface Service {
  id: string; name: string; duration: number; price: number; icon?: string;
}

function isAdmin(auth: string | null): boolean {
  return auth === `Bearer ${process.env.CRON_SECRET}` || auth === `Bearer ${ADMIN_PIN}`;
}

async function readServices(): Promise<Service[]> {
  try {
    if (!existsSync(FILE)) return [];
    return JSON.parse(await readFile(FILE, "utf-8"));
  } catch { return []; }
}

async function writeServices(items: Service[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(FILE, JSON.stringify(items, null, 2));
}

function slugify(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "service";
}

function sanitize(items: unknown): Service[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter((s: any) => s && typeof s.name === "string" && s.name.trim())
    .map((s: any) => ({
      id: typeof s.id === "string" && s.id.trim() ? s.id.trim() : slugify(s.name),
      name: s.name.trim(),
      duration: Number.isFinite(+s.duration) ? Math.max(0, Math.round(+s.duration)) : 60,
      price: Number.isFinite(+s.price) ? Math.max(0, +s.price) : 0,
      icon: typeof s.icon === "string" && s.icon ? s.icon : "\uD83D\uDD27",
    }));
}

export async function GET() {
  return NextResponse.json({ services: await readServices() });
}

export async function PUT(req: NextRequest) {
  const _gate = adminGuard(req, isAdmin);
  if (_gate) return _gate;
  const body = await req.json();
  const services = sanitize(body.services);
  if (!services.length) return NextResponse.json({ error: "No services" }, { status: 400 });
  await writeServices(services);
  return NextResponse.json({ success: true, services });
}
