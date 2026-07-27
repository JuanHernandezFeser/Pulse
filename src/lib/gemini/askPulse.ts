import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { createServerFn } from "@tanstack/react-start";
import type { ScenarioData } from "@/lib/scenarios";

export type ChatMessage = { role: "user" | "model"; text: string };

export type AskPulseResult = {
  answer: string;
  relatedGap?: string;
};

const SYSTEM_INSTRUCTION = `You are PULSE, an enterprise product intelligence assistant. You answer questions about a competitive market analysis that has already been generated.

You MUST base your answers exclusively on the scenario data provided in the user prompt. Do NOT invent, assume, or hallucinate any data that is not present in the scenario. If the data does not contain information to answer a question, say so clearly.

Rules:
- Respond in the language indicated by the "locale" field in the prompt ("en" or "es"). Match the locale exactly.
- Tone: executive, direct, concise. No filler words.
- Maximum ~4 sentences per response.
- When the question relates to a specific flowCase or flowMatrix item, mention it by name explicitly and note whether it was validated or rejected. Offer the user to review that item in the analysis (do NOT invent buttons or UI actions — only mention it in text).
- If the question is about competitors, reference the specific competitor names and benchmark data from the scenario.
- If the question is about gaps, reference the gapValues and their categories.
- If the question is about confidence or evidence, reference the confidenceItems, results, and overallConfidence from the scenario.
- Always return valid JSON matching the required schema. No markdown, no explanation outside the JSON.`;

function buildScenarioContext(scenario: ScenarioData): string {
  return JSON.stringify(
    {
      title: scenario.title,
      text: scenario.text,
      competitors: scenario.competitors,
      sources: scenario.sources,
      marketCards: scenario.marketCards,
      marketIntents: scenario.marketIntents,
      bench: scenario.bench,
      gapValues: scenario.gapValues,
      results: scenario.results,
      confidenceItems: scenario.confidenceItems,
      flowCases: scenario.flowCases,
      flowMatrix: scenario.flowMatrix,
      overallConfidence: scenario.overallConfidence,
      recommendationTitle: scenario.recommendationTitle,
      reasons: scenario.reasons,
    },
    null,
    2,
  );
}

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    answer: { type: SchemaType.STRING, description: "The answer to the user's question" },
    relatedGap: {
      type: SchemaType.STRING,
      description:
        "Optional. The title of the flowCase or flowMatrix item most related to the question, if applicable.",
    },
  },
  required: ["answer"],
};

export const askPulse = createServerFn({ method: "POST" })
  .validator(
    (input: {
      question: string;
      history: ChatMessage[];
      scenario: ScenarioData;
      locale: "en" | "es";
    }) => input,
  )
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
        responseSchema,
        temperature: 0.7,
        maxOutputTokens: 1024,
        thinkingConfig: { thinkingLevel: "low" },
      } as never,
    });

    const scenarioContext = buildScenarioContext(data.scenario);

    const conversationHistory = data.history
      .map((m) => `${m.role === "user" ? "User" : "PULSE"}: ${m.text}`)
      .join("\n");

    const prompt = `Locale: ${data.locale}

Scenario Data:
${scenarioContext}

${conversationHistory ? `Conversation history:\n${conversationHistory}\n` : ""}
User: ${data.question}`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();
    if (!text) {
      throw new Error(
        "Gemini returned an empty response. The model may be temporarily unavailable.",
      );
    }

    let parsed: AskPulseResult;
    try {
      parsed = JSON.parse(text) as AskPulseResult;
    } catch {
      throw new Error(
        "Failed to parse Gemini response as JSON. The model returned malformed data.",
      );
    }

    if (!parsed.answer) {
      throw new Error(
        "Gemini response is missing the answer field. The model did not follow the expected schema.",
      );
    }

    return parsed;
  });
