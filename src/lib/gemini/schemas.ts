import { SchemaType, type Schema } from "@google/generative-ai";

const localizedText: ObjectSchema = {
  type: SchemaType.OBJECT,
  properties: {
    en: { type: SchemaType.STRING },
    es: { type: SchemaType.STRING },
  },
  required: ["en", "es"],
};

type ObjectSchema = Schema & { type: SchemaType.OBJECT };

export const marketAnalysisSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    title: localizedText,
    competitors: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    sources: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    marketCards: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          label: localizedText,
          value: localizedText,
        },
        required: ["label", "value"],
      },
    },
    marketIntents: {
      type: SchemaType.ARRAY,
      items: localizedText,
    },
    bench: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          features: { type: SchemaType.NUMBER },
        },
        required: ["name", "features"],
      },
    },
    gapValues: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.NUMBER },
    },
    results: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          label: localizedText,
          value: { type: SchemaType.STRING },
        },
        required: ["label", "value"],
      },
    },
    confidenceItems: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          label: localizedText,
          value: localizedText,
        },
        required: ["label", "value"],
      },
    },
    overallConfidence: { type: SchemaType.STRING },
  },
  required: [
    "title",
    "competitors",
    "sources",
    "marketCards",
    "marketIntents",
    "bench",
    "gapValues",
    "results",
    "confidenceItems",
    "overallConfidence",
  ],
};

export const flowValidationSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    flowPanels: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          label: localizedText,
          value: { type: SchemaType.STRING },
        },
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
          confidence: { type: SchemaType.STRING },
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
        properties: {
          label: localizedText,
          value: localizedText,
        },
        required: ["label", "value"],
      },
    },
    recommendationTitle: localizedText,
    reasons: {
      type: SchemaType.ARRAY,
      items: localizedText,
    },
  },
  required: [
    "flowPanels",
    "flowCases",
    "flowMatrix",
    "confidenceMini",
    "recommendationTitle",
    "reasons",
  ],
};

export const deliveryArtifactsSchema: Schema = {
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
    jiraLines: {
      type: SchemaType.ARRAY,
      items: localizedText,
    },
  },
  required: ["pdf", "jiraLines"],
};
