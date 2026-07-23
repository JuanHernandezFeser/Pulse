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
      properties: { en: { type: "STRING" }, es: { type: "STRING" } },
      required: ["en", "es"],
    },
  },
  required: ["competitors", "summary"],
};

const prompt = `Analyze this brief and return JSON: "Plataforma de gestión de turnos para clínicas odontológicas en Argentina, con recordatorios por WhatsApp"
Return 3 real competitors and a bilingual summary.`;

const configs = [
  { name: "gemini-flash-latest (no thinking)", model: "gemini-flash-latest", tc: { thinkingBudget: 0 } },
  { name: "gemini-flash-latest (low thinking)", model: "gemini-flash-latest", tc: { thinkingLevel: "low" } },
  { name: "gemini-flash-latest (default)",      model: "gemini-flash-latest", tc: null },
  { name: "gemini-3.5-flash (low thinking)",    model: "gemini-3.5-flash",    tc: { thinkingLevel: "low" } },
  { name: "gemini-3.6-flash (low thinking)",    model: "gemini-3.6-flash",    tc: { thinkingLevel: "low" } },
];

async function bench(c) {
  try {
    const config = {
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature: 0.7,
      maxOutputTokens: 1024,
    };
    if (c.tc) config.thinkingConfig = c.tc;
    const model = genAI.getGenerativeModel({ model: c.model, generationConfig: config });
    const t0 = performance.now();
    const res = await model.generateContent(prompt);
    const elapsed = ((performance.now() - t0) / 1000).toFixed(2);
    JSON.parse(res.response.text());
    console.log(`  ${c.name.padEnd(45)} ${elapsed}s`);
    return { name: c.name, time: parseFloat(elapsed), ok: true };
  } catch (err) {
    console.log(`  ${c.name.padEnd(45)} FAILED: ${err.message?.slice(0, 100)}`);
    return { name: c.name, time: Infinity, ok: false };
  }
}

console.log("=== Thinking Config Comparison ===\n");
const results = [];
for (const c of configs) {
  results.push(await bench(c));
}
console.log("\n=== Sorted by speed ===");
results.filter(r => r.ok).sort((a, b) => a.time - b.time).forEach(r => console.log(`  ${r.time}s  ${r.name}`));
