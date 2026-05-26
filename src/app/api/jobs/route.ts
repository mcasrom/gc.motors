import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const JOBS_FILE = path.join(DATA_DIR, "jobs.json");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

const ADMIN_PIN = "2026";
const isAdmin = (auth: string | null) =>
  auth === `Bearer ${process.env.CRON_SECRET}` || auth === `Bearer ${ADMIN_PIN}`;

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

export async function GET(req: NextRequest) {
  if (!isAdmin(req.headers.get("authorization")))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const jobs = await readJSON(JOBS_FILE);
  const bookings = await readJSON(BOOKINGS_FILE);

  const enriched = jobs.map((job: any) => {
    const booking = bookings.find((b: any) => b.id === job.bookingId);
    return { ...job, booking: booking || null };
  });

  enriched.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  return NextResponse.json({ jobs: enriched });
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req.headers.get("authorization")))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, status, assignedTo, notes, parts, labors } = body;
  const jobs = await readJSON(JOBS_FILE);
  const idx = jobs.findIndex((j: any) => j.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (status) jobs[idx].status = status;
  if (assignedTo !== undefined) jobs[idx].assignedTo = assignedTo;
  if (notes !== undefined) jobs[idx].notes = notes;
  if (parts !== undefined) jobs[idx].parts = parts;
  if (labors !== undefined) jobs[idx].labors = labors;

  await writeJSON(JOBS_FILE, jobs);
  return NextResponse.json({ success: true });
}
