import { NextResponse } from "next/server";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

// Guard anti-fuerza-bruta del panel admin. PM2 corre en fork_mode (una instancia),
// asi que el estado en memoria por proceso es suficiente; si se escala, migrar a
// un almacen compartido. Persiste en disco para sobrevivir reinicios.
type Bucket = { fail: number; until: number };
const STATE = path.join(process.cwd(), "data", ".ratelimit.json");
const MAX_FAILS = 10;
const LOCK_MS = 15 * 60 * 1000;

function load(): Record<string, Bucket> {
  try {
    const j = JSON.parse(readFileSync(STATE, "utf-8"));
    return j && typeof j === "object" ? j : {};
  } catch {
    return {};
  }
}

function save(obj: Record<string, Bucket>) {
  try {
    mkdirSync(path.dirname(STATE), { recursive: true });
    writeFileSync(STATE, JSON.stringify(obj));
  } catch {
    /* si no se puede escribir, seguimos solo en memoria */
  }
}

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

// Devuelve una respuesta (429/401) si hay que parar, o null si el admin es valido.
export function adminGuard(req: Request, isAdmin: (a: string | null) => boolean): NextResponse | null {
  const ip = clientIp(req);
  const state = load();
  const b = state[ip] || { fail: 0, until: 0 };
  if (b.until > Date.now()) {
    return NextResponse.json({ error: "Too many attempts, try later" }, { status: 429 });
  }
  if (!isAdmin(req.headers.get("authorization"))) {
    b.fail += 1;
    if (b.fail >= MAX_FAILS) {
      b.until = Date.now() + LOCK_MS;
      b.fail = 0;
    }
    state[ip] = b;
    save(state);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (b.fail || b.until) {
    state[ip] = { fail: 0, until: 0 };
    save(state);
  }
  return null;
}
