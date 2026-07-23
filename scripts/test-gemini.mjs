/**
 * Standalone diagnostic script — runs all 3 Gemini steps sequentially,
 * logs timing, raw JSON, and cross-step coherence.
 *
 * Usage: bun run scripts/test-gemini.mjs
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import { resolve } from "path";

// ---------------------------------------------------------------------------
// Load API key from .env
// ---------------------------------------------------------------------------
const envPath = resolve(import.meta.dirname, "..", ".env");
const envContent = readFileSync(envPath, "utf8");
const apiKeyMatch = envContent.match(/^GEMINI_API_KEY=(.+)$/m);
if (!apiKeyMatch) {
  console.error("ERROR: GEMINI_API_KEY not found in .env");
  process.exit(1);
}
const API_KEY = apiKeyMatch[1].trim();
console.log(`API key loaded (length=${API_KEY.length}, prefix=${API_KEY.slice(0, 6)}...)`);

const genAI = new GoogleGenerativeAI(API_KEY);

// ---------------------------------------------------------------------------
// Schemas — copied from src/lib/gemini/schemas.ts
// ---------------------------------------------------------------------------
const SchemaType = {
  OBJECT: "OBJECT",
  STRING: "STRING",
  NUMBER: "NUMBER",
  BOOLEAN: "BOOLEAN",
  ARRAY: "ARRAY",
};

const localizedText = {
  type: SchemaType.OBJECT,
  properties: {
    en: { type: SchemaType.STRING },
    es: { type: SchemaType.STRING },
  },
  required: ["en", "es"],
};

const marketAnalysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    title: localizedText,
    competitors: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    sources: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    marketCards: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: { label: localizedText, value: localizedText },
        required: ["label", "value"],
      },
    },
    marketIntents: { type: SchemaType.ARRAY, items: localizedText },
    bench: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: { name: { type: SchemaType.STRING }, features: { type: SchemaType.NUMBER } },
        required: ["name", "features"],
      },
    },
    gapValues: { type: SchemaType.ARRAY, items: { type: SchemaType.NUMBER } },
    results: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: { label: localizedText, value: localizedText },
        required: ["label", "value"],
      },
    },
    confidenceItems: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: { label: localizedText, value: localizedText },
        required: ["label", "value"],
      },
    },
    overallConfidence: { type: SchemaType.STRING },
    recommendationTitle: localizedText,
    reasons: { type: SchemaType.ARRAY, items: localizedText },
    flowPanels: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: { label: localizedText, value: localizedText },
        required: ["label", "value"],
      },
    },
    confidenceMini: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: { label: localizedText, value: localizedText },
        required: ["label", "value"],
      },
    },
  },
  required: [
    "title", "competitors", "sources", "marketCards", "marketIntents",
    "bench", "gapValues", "results", "confidenceItems", "overallConfidence",
    "recommendationTitle", "reasons", "flowPanels", "confidenceMini",
  ],
};

const flowValidationSchema = {
  type: SchemaType.OBJECT,
  properties: {
    flowPanels: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: { label: localizedText, value: localizedText },
        required: ["label", "value"],
      },
    },
    flowCases: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: localizedText,
          evidence: localizedText,
          reason: localizedText,
        },
        required: ["title", "evidence"],
      },
    },
    flowMatrix: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          opportunity: localizedText,
          value: localizedText,
          confidence: localizedText,
          complexity: localizedText,
          reason: localizedText,
        },
        required: ["opportunity", "value", "confidence", "complexity"],
      },
    },
    confidenceMini: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: { label: localizedText, value: localizedText },
        required: ["label", "value"],
      },
    },
    recommendationTitle: localizedText,
    reasons: { type: SchemaType.ARRAY, items: localizedText },
  },
  required: [
    "flowPanels", "flowCases", "flowMatrix",
    "confidenceMini", "recommendationTitle", "reasons",
  ],
};

const deliveryArtifactsSchema = {
  type: SchemaType.OBJECT,
  properties: {
    pdf: {
      type: SchemaType.OBJECT,
      properties: {
        s1body: localizedText,
        s2body: localizedText,
        s3a: localizedText,
        s3b: localizedText,
        s3c: localizedText,
        s4body: localizedText,
        s5body: localizedText,
      },
      required: ["s1body", "s2body", "s3a", "s3b", "s3c", "s4body", "s5body"],
    },
    jiraLines: { type: SchemaType.ARRAY, items: localizedText },
  },
  required: ["pdf", "jiraLines"],
};

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function elapsed(startMs) {
  return ((performance.now() - startMs) / 1000).toFixed(2);
}

// ---------------------------------------------------------------------------
// Step 1: Market Analysis
// ---------------------------------------------------------------------------
const MARKET_SYSTEM = `You are a senior B2B/SaaS market analyst. Given a product brief, generate a realistic competitive market analysis.

Rules:
- Identify 3 to 5 REAL competitors that exist in the market category described by the brief. Do NOT invent fictional company names. Use well-known companies relevant to the domain.
- For "bench", compare 3 to 5 real competitors. The "features" number must be a realistic count of publicly known product capabilities (e.g. 120–300 range).
- "gapValues" must be an array of exactly 4 numbers representing the Gap Discovery section. CRITICAL: gapValues[0] ("Detected Feature Gaps") MUST be the exact arithmetic sum of gapValues[1] + gapValues[2] + gapValues[3]. The three sub-categories are: gapValues[1] = "Critical Opportunities" (high-impact gaps, largest portion), gapValues[2] = "Incremental Improvements" (medium portion), gapValues[3] = "Strategic Innovations" (smallest portion). Example: [148, 62, 51, 35] because 62 + 51 + 35 = 148. Order from highest to lowest.
- "results" must contain exactly 5 metrics as label/value pairs where value is a numeric string (e.g. "186", "412"). Labels should be things like "Sources Consulted", "Market Signals", "Validated Mentions", "Relevant Documents", "Engineering References".
- "marketCards" must contain exactly 4 cards: Business Domain, Product Category, Target Market, Primary Users.
- "marketIntents" must contain exactly 3 strategic intents.
- "confidenceItems" must contain exactly 4 quality metrics.
- "overallConfidence" must be a string like "93%" representing the overall confidence score based on data quality and coverage.
- ALL text fields must be provided in both "en" and "es" with the same meaning. The Spanish translation must be natural and accurate.
- "title" is a short English/Spanish name for the analysis category.
- "competitors" is an array of competitor names (strings, not objects).
- "sources" is an array of source names where this data would come from (strings).

Return ONLY valid JSON matching the required schema. No markdown, no explanation.`;

// ---------------------------------------------------------------------------
// Step 2: FLOW Validation
// ---------------------------------------------------------------------------
const FLOW_SYSTEM = `You are a senior product analyst who validates business opportunities based on an already-generated market analysis. You will receive the market analysis as JSON context in the user prompt.

Rules:
- Generate "flowPanels": exactly 5 summary metrics as label/value pairs. CRITICAL: The numeric values for "Validated Opportunities" and "Rejected Opportunities" MUST be counted from the flowMatrix items you generate in the same response. "Validated Opportunities" = the count of flowMatrix items where the item has NO "reason" field (these are the validated ones). "Rejected Opportunities" = the count of flowMatrix items where the item HAS a "reason" field. "Validation In Progress" = 0 (there is no real in-progress data). The "Market Signals" and "Evidence Sources" values MUST match the marketAnalysis.results numbers provided in context. Do NOT invent arbitrary counts.
- Generate "flowCases": at least 1 validated opportunity and 1 rejected opportunity. Each has title, evidence (based on the market context received), and optionally reason (required for rejected cases). Evidence must reference real data points from the market analysis (competitor names, source counts, signal counts).
- Generate "flowMatrix": exactly 3 prioritized opportunities. Each has opportunity name, business value (Very High/High/Medium/Low), confidence (string like "96%"), complexity (High/Medium/Low), and optionally reason (for low-confidence items). Higher value + higher confidence + lower complexity = higher priority. The top 2 are validated (NO reason field), the last is rejected (MUST have a reason field).
- Generate "confidenceMini": exactly 4 quality metrics (e.g., Evidence Quality, Market Coverage, Benchmark Reliability, Strategic Priority).
- Generate "recommendationTitle": a specific executive recommendation that references the actual opportunities and data from the market analysis. NOT generic.
- Generate "reasons": exactly 5 reasons that directly reference the data generated in this response and the market analysis. NOT generic boilerplate.
- ALL text fields must be provided in both "en" and "es" with the same meaning. Spanish must be natural.
- "confidence" values must be percentage strings like "94%", "22%".
- Return ONLY valid JSON matching the required schema.`;

// ---------------------------------------------------------------------------
// Step 3: Delivery Artifacts
// ---------------------------------------------------------------------------
const DELIVERY_SYSTEM = `You are a technical writer who produces the final executive report and Jira publication messages for a product intelligence analysis. You will receive the complete market analysis and flow validation as JSON context.

Rules:
- Generate "pdf" with 7 sections, each 2-4 sentences:
  - s1body: Executive Summary — the top recommendation and why
  - s2body: Market Findings — key competitor insights and market signals from the analysis
  - s3a: First validated opportunity name, confidence percentage, and 1-sentence justification (e.g. "AI Candidate Ranking — Confidence 94% — Highest ROI with lowest complexity")
  - s3b: Second validated opportunity name, confidence percentage, and 1-sentence justification
  - s3c: Either a third validated opportunity (if 3+ passed validation) OR a rejected opportunity with its low confidence and reason (e.g. "Offline Recruiting Mode — Rejected (18%) — Complexity too high for current sprint capacity")
  - s4body: Business Impact — overall confidence score, benchmark reliability, data quality assessment
  - s5body: Engineering Roadmap — phased delivery approach, sprint planning readiness, recommended next actions
  All sections must reference specific data from the provided analysis (competitor names, numbers, opportunity names, confidence scores).
- Generate "jiraLines": exactly 6 localization objects for Jira publish progress messages. The format must be short status lines like "Publishing...", "Epic Created", "N Stories Created", "N Tasks Created", "Evidence Attached", "Ready for Sprint Planning". The numbers in "Stories Created" and "Tasks Created" must be derived from the flow validation data (e.g., count of validated opportunities × 8-12 for stories, × 3-5 for tasks), NOT random.
- ALL text fields must be provided in both "en" and "es" with the same meaning. Spanish must be natural.
- Return ONLY valid JSON matching the required schema.`;

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
const BRIEF = "Plataforma de gestión de turnos para clínicas odontológicas en Argentina, con recordatorios por WhatsApp";

async function generateWithRetry(model, prompt, label, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const t0 = performance.now();
      const res = await model.generateContent(prompt);
      const elapsed = ((performance.now() - t0) / 1000).toFixed(2);
      const text = res.response.text();
      const parsed = JSON.parse(text);
      console.log(`Time: ${elapsed}s (attempt ${attempt})`);
      return { data: parsed, time: parseFloat(elapsed) };
    } catch (err) {
      const isRetryable = err.message?.includes("503") || err.message?.includes("429") || err.message?.includes("retry");
      console.log(`Attempt ${attempt} failed: ${err.message?.slice(0, 120)}`);
      if (isRetryable && attempt < retries) {
        const delay = attempt * 3000;
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
}

async function main() {
  console.log("\n========================================");
  console.log("PULSE Gemini Integration Diagnostic");
  console.log("========================================\n");
  console.log(`Brief: "${BRIEF}"\n`);

  // --- Step 1 ---
  console.log("--- STEP 1: Market Analysis ---");
  const model1 = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction: MARKET_SYSTEM,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: marketAnalysisSchema,
      temperature: 0.7,
              maxOutputTokens: 8192,
        thinkingConfig: { thinkingLevel: "low" },
    },
  });
  const prompt1 = `Analyze the following product brief and generate a competitive market analysis:\n\n"${BRIEF}"`;
  let marketResult;
  const stepTimes = [];
  try {
    const r1 = await generateWithRetry(model1, prompt1, "Market Analysis");
    marketResult = r1.data;
    stepTimes.push({ step: "Market Analysis", time: r1.time });
    console.log(`Competitors: ${JSON.stringify(marketResult.competitors)}`);
    console.log(`Sources: ${JSON.stringify(marketResult.sources)}`);
    console.log(`Overall Confidence: ${marketResult.overallConfidence}`);
    console.log(`Market Cards: ${marketResult.marketCards?.length}`);
    console.log(`Bench entries: ${marketResult.bench?.length}`);
    console.log(`Results: ${JSON.stringify(marketResult.results)}`);
    console.log(`Full JSON:\n${JSON.stringify(marketResult, null, 2)}\n`);
  } catch (err) {
    console.error(`FAILED:`, err.message);
    process.exit(1);
  }

  // --- Step 2 ---
  console.log("--- STEP 2: FLOW Validation ---");
  const model2 = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction: FLOW_SYSTEM,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: flowValidationSchema,
      temperature: 0.7,
              maxOutputTokens: 8192,
        thinkingConfig: { thinkingLevel: "low" },
    },
  });
  const prompt2 = `Original brief: "${BRIEF}"

Market Analysis (already generated):
${JSON.stringify(marketResult, null, 2)}

Based on the market analysis above, generate the FLOW validation: validate opportunities, build the evidence matrix, and provide an executive recommendation.`;
  let flowResult;
  try {
    const r2 = await generateWithRetry(model2, prompt2, "FLOW Validation");
    flowResult = r2.data;
    stepTimes.push({ step: "FLOW Validation", time: r2.time });
    console.log(`Flow Panels: ${flowResult.flowPanels?.length}`);
    console.log(`Flow Cases: ${flowResult.flowCases?.length}`);
    console.log(`Flow Matrix: ${flowResult.flowMatrix?.length}`);
    console.log(`Recommendation: ${JSON.stringify(flowResult.recommendationTitle)}`);
    console.log(`Full JSON:\n${JSON.stringify(flowResult, null, 2)}\n`);
  } catch (err) {
    console.error(`FAILED:`, err.message);
    process.exit(1);
  }

  // --- Step 3 ---
  console.log("--- STEP 3: Delivery Artifacts ---");
  const model3 = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction: DELIVERY_SYSTEM,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: deliveryArtifactsSchema,
      temperature: 0.7,
              maxOutputTokens: 8192,
        thinkingConfig: { thinkingLevel: "low" },
    },
  });
  const prompt3 = `Original brief: "${BRIEF}"

Market Analysis:
${JSON.stringify(marketResult, null, 2)}

Flow Validation:
${JSON.stringify(flowResult, null, 2)}

Based on the complete analysis above, generate the executive report sections (7 PDF sections: s1body, s2body, s3a, s3b, s3c, s4body, s5body) and the Jira publication progress messages (6 lines).`;
  let deliveryResult;
  try {
    const r3 = await generateWithRetry(model3, prompt3, "Delivery Artifacts");
    deliveryResult = r3.data;
    stepTimes.push({ step: "Delivery Artifacts", time: r3.time });
    console.log(`PDF sections: ${Object.keys(deliveryResult.pdf || {}).join(", ")}`);
    console.log(`Jira lines: ${deliveryResult.jiraLines?.length}`);
    console.log(`Full JSON:\n${JSON.stringify(deliveryResult, null, 2)}\n`);
  } catch (err) {
    console.error(`FAILED:`, err.message);
    process.exit(1);
  }

  // --- Cross-step coherence check ---
  console.log("========================================");
  console.log("CROSS-STEP COHERENCE CHECK");
  console.log("========================================\n");

  const mktCompetitors = (marketResult.competitors || []).map((c) => c.toLowerCase());
  const mktOpps = (marketResult.reasons || []).map((r) => (r.en || "").toLowerCase());

  // Check FLOW references Market Analysis
  const flowText = JSON.stringify(flowResult).toLowerCase();
  let flowIssues = [];
  for (const c of mktCompetitors) {
    if (flowText.includes(c)) {
      console.log(`[OK] FLOW references competitor "${c}" from Market Analysis`);
    }
  }
  const flowOpps = (flowResult.flowCases || []).map((fc) => (fc.title?.en || "").toLowerCase());
  for (const opp of flowOpps) {
    if (opp && flowText.includes(opp.slice(0, 15))) {
      console.log(`[OK] FLOW has case: "${opp}"`);
    }
  }

  // Check Delivery references both
  const deliveryText = JSON.stringify(deliveryResult).toLowerCase();
  let deliveryIssues = [];
  for (const c of mktCompetitors) {
    if (deliveryText.includes(c)) {
      console.log(`[OK] Delivery references competitor "${c}" from Market Analysis`);
    }
  }
  for (const opp of flowOpps) {
    if (opp && deliveryText.includes(opp.slice(0, 15))) {
      console.log(`[OK] Delivery references FLOW case "${opp}"`);
    }
  }

  // Validate s3a/s3b/s3c are non-empty
  for (const key of ["s3a", "s3b", "s3c"]) {
    const val = deliveryResult.pdf?.[key]?.en || "";
    if (val.length < 10) {
      console.log(`[WARN] pdf.${key} is very short: "${val}"`);
    } else {
      console.log(`[OK] pdf.${key}: "${val.slice(0, 80)}..."`);
    }
  }

  // --- FIX 1: Validate flowPanels counts match flowMatrix ---
  console.log("\n--- FIX 1: flowPanels count validation ---");
  const matrixValidated = (flowResult.flowMatrix || []).filter((m) => !m.reason).length;
  const matrixRejected = (flowResult.flowMatrix || []).filter((m) => m.reason).length;
  const panelValidated = (flowResult.flowPanels || []).find((p) => (p.label?.en || "").toLowerCase().includes("validated"));
  const panelRejected = (flowResult.flowPanels || []).find((p) => (p.label?.en || "").toLowerCase().includes("rejected"));
  const panelInProgress = (flowResult.flowPanels || []).find((p) => (p.label?.en || "").toLowerCase().includes("progress"));
  console.log(`flowMatrix: ${matrixValidated} validated (no reason), ${matrixRejected} rejected (has reason)`);
  console.log(`flowPanels validated: ${panelValidated?.value?.en} (should be ${matrixValidated})`);
  console.log(`flowPanels rejected: ${panelRejected?.value?.en} (should be ${matrixRejected})`);
  console.log(`flowPanels in-progress: ${panelInProgress?.value?.en} (should be 0)`);
  if (parseInt(panelValidated?.value?.en || "-1") === matrixValidated &&
      parseInt(panelRejected?.value?.en || "-1") === matrixRejected &&
      parseInt(panelInProgress?.value?.en || "-1") === 0) {
    console.log("[OK] FIX 1: flowPanels counts match flowMatrix exactly");
  } else {
    console.log("[FAIL] FIX 1: flowPanels counts DO NOT match flowMatrix");
  }

  // --- FIX 2: Validate gapValues[0] = sum of others ---
  console.log("\n--- FIX 2: gapValues sum validation ---");
  const gv = marketResult.gapValues || [];
  if (gv.length === 4) {
    const sum = gv[1] + gv[2] + gv[3];
    console.log(`gapValues: [${gv.join(", ")}]`);
    console.log(`gapValues[0]=${gv[0]}, sum(others)=${sum}`);
    if (gv[0] === sum) {
      console.log("[OK] FIX 2: gapValues[0] = gapValues[1] + gapValues[2] + gapValues[3]");
    } else {
      console.log(`[FAIL] FIX 2: gapValues[0] (${gv[0]}) ≠ sum (${sum}), delta=${gv[0] - sum}`);
    }
  } else {
    console.log(`[WARN] gapValues has ${gv.length} items, expected 4`);
  }

  // Validate jiraLines count
  if (deliveryResult.jiraLines?.length !== 6) {
    console.log(`[WARN] jiraLines has ${deliveryResult.jiraLines?.length} items, expected 6`);
  } else {
    console.log(`[OK] jiraLines: ${deliveryResult.jiraLines.length} items`);
  }

  console.log("========================================");
  console.log("SUMMARY");
  console.log("========================================");
  const totalTime = stepTimes.reduce((s, x) => s + x.time, 0).toFixed(2);
  stepTimes.forEach(s => console.log(`  ${s.step}: ${s.time}s`));
  console.log(`  Total: ${totalTime}s`);
  console.log(`  Baseline:  44s (14.3+14.4+15.1)`);
  console.log(`  Reduction: ${((1 - totalTime / 44) * 100).toFixed(0)}%`);
  console.log("========================================\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
