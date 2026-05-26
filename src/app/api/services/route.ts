import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "services.json");
    const raw = await readFile(filePath, "utf-8");
    return NextResponse.json({ services: JSON.parse(raw) });
  } catch {
    return NextResponse.json({ services: [] });
  }
}
