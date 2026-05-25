import { NextRequest, NextResponse } from "next/server";

const OPENAI_KEY = process.env.OPENAI_API_KEY;

const DIAGNOSIS_PROMPT = `You are an expert mechanic from Gold Coast, Queensland, Australia. Labor rate: $120 AUD/hour.

Analyze the customer's problem and provide:
1. Possible cause (1-2 sentences)
2. Related services (eg: oil change, brake pads, battery)
3. Estimated cost in AUD (include parts + labor at $120/h)
4. If urgent appointment needed

Respond in the same language as the customer (English or Spanish). Clear, professional, and friendly.

Ejemplo en español: "⚠️ Posible: Pastillas de freno desgastadas. Coste estimado: $150-300 AUD (incluye mano de obra a $120/h). ¿Quieres agendar?"`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ reply: "Please describe your issue" });
    }

    if (!OPENAI_KEY) {
      const fallbackReply = diagnoseFallback(message);
      return NextResponse.json({ reply: fallbackReply });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: DIAGNOSIS_PROMPT },
          { role: "user", content: message },
        ],
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || diagnoseFallback(message);

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ reply: "⚠️ Error. Call +61 7 1234 5678 / Llama al +61 7 1234 5678" });
  }
}

function diagnoseFallback(message: string): string {
  const m = message.toLowerCase();
  const es = /[áéíóúñ¿¡]/i.test(m) || m.includes("freno") || m.includes("aceite") || m.includes("ruido");
  const l = (en: string, es: string) => es ? es : en;

  if (m.includes("brake") || m.includes("freno") || m.includes("noise") || m.includes("ruido") || m.includes("stopping") || m.includes("frenar")) {
    return l("🔧 Possible: Worn brake pads. Cost: $150-300 AUD (incl. $120/h labor). Book a time?",
             "🔧 Posible: Pastillas de freno desgastadas. Coste: $150-300 AUD (incl. mano de obra $120/h). ¿Agendamos?");
  }
  if (m.includes("start") || m.includes("battery") || m.includes("batería") || m.includes("won't start") || m.includes("no arranca")) {
    return l("🔧 Possible: Flat/defective battery. Cost: $150-250 AUD (incl. $120/h labor). Book a time?",
             "🔧 Posible: Batería descargada/defectuosa. Coste: $150-250 AUD (incl. mano de obra $120/h). ¿Agendamos?");
  }
  if (m.includes("oil") || m.includes("aceite") || m.includes("leak") || m.includes("pérdida") || m.includes("burning") || m.includes("quema")) {
    return l("🔧 Possible: Oil leak or low oil. Inspection: $80-150 AUD. Book a time?",
             "🔧 Posible: Pérdida de aceite o nivel bajo. Inspección: $80-150 AUD. ¿Agendamos?");
  }
  if (m.includes("engine") || m.includes("motor") || m.includes("hot") || m.includes("caliente") || m.includes("overheat") || m.includes("sobrecalienta")) {
    return l("🔧 Possible: Overheating. URGENT: call +61 7 1234 5678 now",
             "🔧 Posible: Sobrecalentamiento. URGENTE: llama ahora al +61 7 1234 5678");
  }
  if (m.includes("tire") || m.includes("neumático") || m.includes("puncture") || m.includes("pinchazo") || m.includes("flat") || m.includes("desinflado")) {
    return l("🔧 Possible: Puncture or low pressure. Cost: $30-80 AUD. Book a time?",
             "🔧 Posible: Pinchazo o presión baja. Coste: $30-80 AUD. ¿Agendamos?");
  }
  if (m.includes("steering") || m.includes("dirección") || m.includes("wheel") || m.includes("rueda") || m.includes("pull") || m.includes("tira")) {
    return l("🔧 Possible: Wheel alignment or power steering. Cost: $80-150 AUD. Book a time?",
             "🔧 Posible: Alineación o dirección. Coste: $80-150 AUD. ¿Agendamos?");
  }
  if (m.includes("clutch") || m.includes("embrague") || m.includes("gear") || m.includes("marcha") || m.includes("shift") || m.includes("cambio")) {
    return l("🔧 Possible: Clutch issue. Inspection: $100-200 AUD. Book a time?",
             "🔧 Posible: Problema de embrague. Inspección: $100-200 AUD. ¿Agendamos?");
  }
  if (m.includes("ac") || m.includes("aire") || m.includes("air") || m.includes("heat") || m.includes("calefacción") || m.includes("cooling") || m.includes("refrigeración")) {
    return l("🔧 Possible: AC system issue. Cost: $100-300 AUD. Book a time?",
             "🔧 Posible: Problema de aire acondicionado. Coste: $100-300 AUD. ¿Agendamos?");
  }
  
  return l("🔧 Describe more symptoms for an estimate. Or call +61 7 1234 5678",
           "🔧 Describe más síntomas para un presupuesto. O llama al +61 7 1234 5678");
}