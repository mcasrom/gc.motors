import { NextRequest, NextResponse } from "next/server";
import { appendFile, mkdir } from "fs/promises";
import path from "path";

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const DIR = path.join(process.cwd(), "data");
const LOG = path.join(DIR, "chat.jsonl");

// Rate-limit simple en memoria: máx 12 mensajes / 5 min por IP.
const HITS: Map<string, number[]> = new Map();
const WINDOW_MS = 5 * 60 * 1000;
const MAX = 12;
function limited(ip: string): boolean {
  const now = Date.now();
  const arr = (HITS.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  HITS.set(ip, arr);
  return arr.length > MAX;
}

const DISCLAIMER =
  "\n\n— Indicative only, not a quote. Exact prices and availability are on the price list or via WhatsApp.";

const DIAGNOSIS_PROMPT = `You are a friendly mechanic assistant for GCMotors Workshop (Gold Coast, QLD, Australia).
Help the customer understand a possible cause and which service is likely relevant.
Do NOT give firm prices and do NOT confirm availability: at most a rough INDICATIVE range, and tell them the exact price is on the price list or via WhatsApp. Never promise a booking time.
Respond in the SAME language as the customer (English or Spanish). Clear, professional, brief (max 3 sentences).`;

export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  if (limited(ip)) {
    return NextResponse.json(
      { reply: "Too many messages. Please use WhatsApp: https://wa.me/61481268633" },
      { status: 429 });
  }
  try {
    const body = await req.json();
    const raw = String(body?.message || "").trim();
    if (!raw) return NextResponse.json({ reply: "Please describe your issue." });
    const message = raw.slice(0, 500);

    let reply: string;
    if (!OPENAI_KEY) {
      reply = diagnoseFallback(message);
    } else {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: DIAGNOSIS_PROMPT },
            { role: "user", content: message },
          ],
          max_tokens: 200,
        }),
      });
      const data = await r.json();
      reply = data.choices?.[0]?.message?.content || diagnoseFallback(message);
    }

    // Registro revisable por el taller (sin otras cabeceras ni IP).
    try {
      await mkdir(DIR, { recursive: true });
      await appendFile(LOG, JSON.stringify({ ts: new Date().toISOString(), message, reply }) + "\n");
    } catch { /* log opcional */ }

    return NextResponse.json({ reply: reply + DISCLAIMER });
  } catch {
    return NextResponse.json({ reply: "⚠️ Error. Please call +61 481 268 633 or use WhatsApp." });
  }
}

function diagnoseFallback(message: string): string {
  const m = message.toLowerCase();
  const es = /[áéíóúñ¿¡]/i.test(m) || m.includes("freno") || m.includes("aceite") || m.includes("ruido");
  const l = (en: string, es_: string) => (es ? es_ : en);
  const CTA = (en: string, es_: string) => l(en + " For a quote, see the price list or WhatsApp.", es_ + " Para el precio, mira la tabla o WhatsApp.");

  if (m.includes("brake") || m.includes("freno") || m.includes("noise") || m.includes("ruido") || m.includes("stopping") || m.includes("frenar")) {
    return CTA("Possible worn brake pads — we confirm on inspection.", "Posible desgaste de pastillas de freno: lo confirmamos al inspeccionar.");
  }
  if (m.includes("start") || m.includes("battery") || m.includes("batería") || m.includes("won't start") || m.includes("no arranca")) {
    return CTA("Possible flat or weak battery.", "Posible batería descargada o débil.");
  }
  if (m.includes("oil") || m.includes("aceite") || m.includes("leak") || m.includes("pérdida") || m.includes("burning") || m.includes("quema")) {
    return CTA("Possible oil leak or low oil level.", "Posible pérdida de aceite o nivel bajo.");
  }
  if (m.includes("engine") || m.includes("motor") || m.includes("hot") || m.includes("caliente") || m.includes("overheat") || m.includes("sobrecalienta")) {
    return l("Possible overheating. URGENT: call +61 481 268 633 now.",
             "Posible sobrecalentamiento. URGENTE: llama ahora al +61 481 268 633.");
  }
  if (m.includes("tire") || m.includes("neumático") || m.includes("puncture") || m.includes("pinchazo") || m.includes("flat") || m.includes("desinflado")) {
    return CTA("Possible puncture or low tyre pressure.", "Posible pinchazo o presión baja.");
  }
  if (m.includes("steering") || m.includes("dirección") || m.includes("wheel") || m.includes("rueda") || m.includes("pull") || m.includes("tira")) {
    return CTA("Possible wheel alignment or power-steering issue.", "Posible alineación o problema de dirección.");
  }
  if (m.includes("clutch") || m.includes("embrague") || m.includes("gear") || m.includes("marcha") || m.includes("shift") || m.includes("cambio")) {
    return CTA("Possible clutch issue.", "Posible problema de embrague.");
  }
  if (m.includes("ac") || m.includes("aire") || m.includes("air") || m.includes("heat") || m.includes("calefacción") || m.includes("cooling") || m.includes("refrigeración")) {
    return CTA("Possible air-conditioning issue.", "Posible problema de aire acondicionado.");
  }
  return l("Tell us more symptoms for a better guess. For a quote, see the price list or WhatsApp. Or call +61 481 268 633.",
           "Cuéntanos más síntomas para afinar. Para el precio, mira la tabla o WhatsApp. O llama al +61 481 268 633.");
}
