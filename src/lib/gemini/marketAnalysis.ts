import { GoogleGenerativeAI } from "@google/generative-ai";
import { createServerFn } from "@tanstack/react-start";
import { marketAnalysisSchema } from "./schemas";
import type { MarketAnalysisResult } from "./types";

const SYSTEM_INSTRUCTION = `You are a senior B2B/SaaS market analyst. Given a product brief, generate a realistic competitive market analysis.

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

export const generateMarketAnalysis = createServerFn({ method: "POST" })
  .validator((brief: string) => brief)
  .handler(async ({ data: brief }) => {
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
        responseSchema: marketAnalysisSchema,
        temperature: 0.7,
        maxOutputTokens: 8192,
        thinkingConfig: { thinkingLevel: "low" },
      } as never,
    });

    const prompt = `Analyze the following product brief and generate a competitive market analysis:\n\n"${brief}"`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();
    if (!text) {
      throw new Error(
        "Gemini returned an empty response. The model may be temporarily unavailable.",
      );
    }

    let parsed: MarketAnalysisResult;
    try {
      parsed = JSON.parse(text) as MarketAnalysisResult;
    } catch {
      throw new Error(
        "Failed to parse Gemini response as JSON. The model returned malformed data.",
      );
    }

    if (!parsed.competitors || !parsed.marketCards || !parsed.bench) {
      throw new Error(
        "Gemini response is missing required fields. The model did not follow the expected schema.",
      );
    }

    return parsed;
  });
