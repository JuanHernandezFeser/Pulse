import { GoogleGenerativeAI } from "@google/generative-ai";
import { createServerFn } from "@tanstack/react-start";
import { flowValidationSchema } from "./schemas";
import type { FlowValidationResult, MarketAnalysisResult } from "./types";

const SYSTEM_INSTRUCTION = `You are a senior product analyst who validates business opportunities based on an already-generated market analysis. You will receive the market analysis as JSON context in the user prompt.

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

export const generateFlowValidation = createServerFn({ method: "POST" })
  .validator((input: { brief: string; marketAnalysis: MarketAnalysisResult }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured. Set it in your .env file.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: flowValidationSchema,
        temperature: 0.7,
        maxOutputTokens: 8192,
        thinkingConfig: { thinkingLevel: "low" },
      } as never,
    });

    const prompt = `Original brief: "${data.brief}"

Market Analysis (already generated):
${JSON.stringify(data.marketAnalysis, null, 2)}

Based on the market analysis above, generate the FLOW validation: validate opportunities, build the evidence matrix, and provide an executive recommendation.`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();
    if (!text) {
      throw new Error(
        "Gemini returned an empty response. The model may be temporarily unavailable.",
      );
    }

    let parsed: FlowValidationResult;
    try {
      parsed = JSON.parse(text) as FlowValidationResult;
    } catch {
      throw new Error(
        "Failed to parse Gemini response as JSON. The model returned malformed data.",
      );
    }

    if (!parsed.flowPanels || !parsed.flowCases || !parsed.flowMatrix) {
      throw new Error(
        "Gemini response is missing required fields. The model did not follow the expected schema.",
      );
    }

    return parsed;
  });
