import { GoogleGenerativeAI } from "@google/generative-ai";
import { createServerFn } from "@tanstack/react-start";
import { deliveryArtifactsSchema } from "./schemas";
import type {
  DeliveryArtifactsResult,
  FlowValidationResult,
  MarketAnalysisResult,
} from "./types";

const SYSTEM_INSTRUCTION = `You are a technical writer who produces the final executive report and Jira publication messages for a product intelligence analysis. You will receive the complete market analysis and flow validation as JSON context.

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

export const generateDeliveryArtifacts = createServerFn({ method: "POST" })
  .validator(
    (input: {
      brief: string;
      marketAnalysis: MarketAnalysisResult;
      flowValidation: FlowValidationResult;
    }) => input,
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not configured. Set it in your .env file.",
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: deliveryArtifactsSchema,
        temperature: 0.7,
        maxOutputTokens: 8192,
        thinkingConfig: { thinkingLevel: "low" },
      } as never,
    });

    const prompt = `Original brief: "${data.brief}"

Market Analysis:
${JSON.stringify(data.marketAnalysis, null, 2)}

Flow Validation:
${JSON.stringify(data.flowValidation, null, 2)}

Based on the complete analysis above, generate the executive report sections (7 PDF sections: s1body, s2body, s3a, s3b, s3c, s4body, s5body) and the Jira publication progress messages (6 lines).`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();
    if (!text) {
      throw new Error(
        "Gemini returned an empty response. The model may be temporarily unavailable.",
      );
    }

    let parsed: DeliveryArtifactsResult;
    try {
      parsed = JSON.parse(text) as DeliveryArtifactsResult;
    } catch {
      throw new Error(
        "Failed to parse Gemini response as JSON. The model returned malformed data.",
      );
    }

    if (!parsed.pdf || !parsed.jiraLines) {
      throw new Error(
        "Gemini response is missing required fields. The model did not follow the expected schema.",
      );
    }

    return parsed;
  });
