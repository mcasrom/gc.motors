import { NextRequest, NextResponse } from "next/server";
import { adminGuard } from "@/lib/ratelimit";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "data");
const EVENTS = path.join(DIR, "events.jsonl");
const ADMIN_PIN = process.env.GC_ADMIN_PIN || "";
const isAdmin = (auth: string | null) =>
  auth === `Bearer ${process.env.CRON_SECRET}` || auth === `Bearer ${ADMIN_PIN}`;

export async function GET(req: NextRequest) {
  const _gate = adminGuard(req, isAdmin);
  if (_gate) return _gate;
  try {
    if (!existsSync(EVENTS)) return NextResponse.json({ total: 0, by_event: {}, by_day: [] });
    const lines = (await readFile(EVENTS, "utf-8")).split("\n").filter(Boolean);
    const byEvent: Record<string, number> = {};
    const byDay: Record<string, Record<string, number>> = {};
    for (const ln of lines) {
      try {
        const r = JSON.parse(ln);
        const d = String(r.ts || "").slice(0, 10);
        const ev = String(r.event || "?");
        byEvent[ev] = (byEvent[ev] || 0) + 1;
        byDay[d] = byDay[d] || {};
        byDay[d][ev] = (byDay[d][ev] || 0) + 1;
      } catch { /* línea corrupta */ }
    }
    const days = Object.keys(byDay).sort().slice(-14).map((d) => ({ date: d, counts: byDay[d] }));
    return NextResponse.json({ total: lines.length, by_event: byEvent, by_day: days });
  } catch {
    return NextResponse.json({ total: 0, by_event: {}, by_day: [] });
  }
}
