import { NextRequest, NextResponse } from "next/server";
import { appendFile, mkdir } from "fs/promises";
import path from "path";

const DIR = path.join(process.cwd(), "data");
const FILE = path.join(DIR, "events.jsonl");
// Eventos de conversión permitidos (first-party, sin PII).
const ALLOWED = new Set(["click_whatsapp", "click_call", "booking_submit", "view_fleet"]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = String(body?.event || "");
    if (!ALLOWED.has(event)) return NextResponse.json({ ok: false }, { status: 400 });
    const meta = body?.meta && typeof body.meta === "object" ? body.meta : {};
    const rec = {
      ts: new Date().toISOString(),
      event,
      meta,
      ref: (req.headers.get("referer") || "").slice(0, 200),
      ua: (req.headers.get("user-agent") || "").slice(0, 120),
    };
    await mkdir(DIR, { recursive: true });
    await appendFile(FILE, JSON.stringify(rec) + "\n");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
