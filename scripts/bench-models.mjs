import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(import.meta.dirname, "..", ".env");
const apiKey = readFileSync(envPath, "utf8").match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
const genAI = new GoogleGenerativeAI(apiKey);

const schema = {
  type: "OBJECT",
  properties: {
    competitors: { type: "ARRAY", items: { type: "STRING" } },
    summary: {
      type: "OBJECT",
      properties: {
        en: { type: "STRING" },
        es: { type: "STRING" },
      },
      required: ["en", "es"],
    },
  },
  required: ["competitors", "summary"],
};

const prompt = `Analyze this brief and return JSON: "Plataforma de gestión de turnos para clínicas odontológicas en Argentina, con recordatorios por WhatsApp"
Return 3 real competitors and a bilingual summary.`;

const models = [
  { name: "gemini-2.5-flash", thinkingBudget: 0 },
  { name: "gemini-2.5-flash-lite", thinkingBudget: 0 },
  { name: "gemini-3.5-flash", thinkingLevel: "low" },
  { name: "gemini-flash-latest", thinkingLevel: "low" },
];

async function bench(m) {
  try {
    const config = {
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature: 0.7,
      maxOutputTokens: 1024,
    };
    if (m.thinkingBudget !== undefined) {
      config.thinkingConfig = { thinkingBudget: m.thinkingBudget };
    } else if (m.thinkingLevel) {
      config.thinkingConfig = { thinkingLevel: m.thinkingLevel };
    }
    const model = genAI.getGenerativeModel({ model: m.name, generationConfig: config });
    const t0 = performance.now();
    const res = await model.generateContent(prompt);
    const elapsed = ((performance.now() - t0) / 1000).toFixed(2);
    const text = res.response.text();
    const parsed = JSON.parse(text);
    console.log(`  ${m.name.padEnd(30)} ${elapsed}s  competitors=${parsed.competitors?.length}`);
    return { name: m.name, time: parseFloat(elapsed), ok: true };
  } catch (err) {
    console.log(`  ${m.name.padEnd(30)} FAILED: ${err.message?.slice(0, 80)}`);
    return { name: m.name, time: Infinity, ok: false };
  }
}

console.log("=== Model Speed Comparison ===\n");
const results = [];
for (const m of models) {
  results.push(await bench(m));
}
console.log("\n=== Winner ===");
const winner = results.filter(r => r.ok).sort((a, b) => a.time - b.time)[0];
if (winner) console.log(`  ${winner.name} at ${winner.time}s`);
