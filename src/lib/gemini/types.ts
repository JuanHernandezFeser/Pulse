export type LocalizedText = { en: string; es: string };

export type MarketAnalysisResult = {
  title: LocalizedText;
  competitors: string[];
  sources: string[];
  marketCards: { label: LocalizedText; value: LocalizedText }[];
  marketIntents: LocalizedText[];
  bench: { name: string; features: number }[];
  gapValues: number[];
  results: { label: LocalizedText; value: string }[];
  confidenceItems: { label: LocalizedText; value: LocalizedText }[];
  overallConfidence: string;
};

export type FlowValidationResult = {
  flowPanels: { label: LocalizedText; value: string }[];
  flowCases: {
    title: LocalizedText;
    evidence: LocalizedText;
    reason?: LocalizedText;
  }[];
  flowMatrix: {
    opportunity: LocalizedText;
    value: LocalizedText;
    confidence: string;
    complexity: LocalizedText;
    reason?: LocalizedText;
  }[];
  confidenceMini: { label: LocalizedText; value: LocalizedText }[];
  recommendationTitle: LocalizedText;
  reasons: LocalizedText[];
};

export type DeliveryArtifactsResult = {
  pdf: {
    s1body: LocalizedText;
    s2body: LocalizedText;
    s3a: LocalizedText;
    s3b: LocalizedText;
    s3c: LocalizedText;
    s4body: LocalizedText;
    s5body: LocalizedText;
  };
  jiraLines: LocalizedText[];
};
