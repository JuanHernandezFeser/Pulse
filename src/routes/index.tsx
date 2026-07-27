import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { translations, type Lang } from "@/lib/pulse-i18n";
import { scenariosRaw, localizeScenario, type ScenarioData } from "@/lib/scenarios";
import { generateMarketAnalysis } from "@/lib/gemini/marketAnalysis";
import { generateFlowValidation } from "@/lib/gemini/flowValidation";
import { generateDeliveryArtifacts } from "@/lib/gemini/deliveryArtifacts";
import type {
  MarketAnalysisResult,
  FlowValidationResult,
  DeliveryArtifactsResult,
} from "@/lib/gemini/types";
import { TopBar } from "@/components/pulse/TopBar";
import { Timeline } from "@/components/pulse/Timeline";
import { Hero } from "@/components/pulse/Hero";
import { Phase1Connect, type JiraState } from "@/components/pulse/Phase1Connect";
import { Phase2Brief } from "@/components/pulse/Phase2Brief";
import { Phase3Clarify } from "@/components/pulse/Phase3Clarify";
import { CognitiveTransition } from "@/components/pulse/CognitiveTransition";
import { CognitiveEngine } from "@/components/pulse/CognitiveEngine";
import { FlowDelivery } from "@/components/pulse/FlowDelivery";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PULSE Experience — Enterprise Product Intelligence" },
      {
        name: "description",
        content:
          "PULSE turns market intelligence into engineering decisions. Continuously discover product opportunities, validate them with real market evidence, and generate engineering-ready recommendations.",
      },
      { property: "og:title", content: "PULSE Experience — Enterprise Product Intelligence" },
      {
        property: "og:description",
        content:
          "AI-driven cognitive intelligence for enterprise product teams. Discover, validate and execute.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PulseExperience,
});

type Stage = "hero" | "p1" | "p2" | "p3" | "transition" | "engine" | "flow";

function PulseExperience() {
  const [lang, setLang] = useState<Lang>("en");
  const [stage, setStage] = useState<Stage>("hero");

  // Preserved user state across back navigation
  const [jiraState, setJiraState] = useState<JiraState>("idle");
  const [brief, setBrief] = useState("");
  const [answers, setAnswers] = useState<(string | null)[]>([null, null, null]);
  const [scenarioIndex, setScenarioIndex] = useState<number>(0);
  const scenario: ScenarioData = useMemo(
    () => localizeScenario(scenariosRaw[scenarioIndex], lang),
    [scenarioIndex, lang],
  );

  // Gemini analysis state
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Gemini FLOW validation state
  const [flowValidation, setFlowValidation] = useState<FlowValidationResult | null>(null);
  const [flowValidationError, setFlowValidationError] = useState<string | null>(null);

  // Gemini delivery artifacts state
  const [deliveryArtifacts, setDeliveryArtifacts] =
    useState<DeliveryArtifactsResult | null>(null);
  const [deliveryArtifactsError, setDeliveryArtifactsError] = useState<string | null>(null);

  const t = translations[lang];

  const stageMeta: Record<Stage, { active: number; completed: number }> = {
    hero: { active: 0, completed: -1 },
    p1: { active: 0, completed: -1 },
    p2: { active: 1, completed: 0 },
    p3: { active: 2, completed: 1 },
    transition: { active: 3, completed: 2 },
    engine: { active: 3, completed: 2 },
    flow: { active: 3, completed: 2 },
  };
  const { active, completed } = stageMeta[stage];

  const restart = () => {
    setJiraState("idle");
    setBrief("");
    setAnswers([null, null, null]);
    setScenarioIndex(0);
    setMarketAnalysis(null);
    setAnalysisError(null);
    setFlowValidation(null);
    setFlowValidationError(null);
    setDeliveryArtifacts(null);
    setDeliveryArtifactsError(null);
    setStage("hero");
  };

  // Call Gemini when entering the transition stage
  useEffect(() => {
    if (stage === "transition" && brief.trim() && !marketAnalysis && !analysisError) {
      setMarketAnalysis(null);
      setAnalysisError(null);
      generateMarketAnalysis({ data: brief.trim() })
        .then(setMarketAnalysis)
        .catch((err: unknown) => {
          const msg =
            err instanceof Error ? err.message : "Market analysis failed. Using fallback data.";
          setAnalysisError(msg);
        });
    }
  }, [stage, brief, marketAnalysis, analysisError]);

  // Call Gemini FLOW validation when entering the flow stage
  useEffect(() => {
    if (
      stage === "flow" &&
      brief.trim() &&
      marketAnalysis &&
      !flowValidation &&
      !flowValidationError
    ) {
      setFlowValidation(null);
      setFlowValidationError(null);
      generateFlowValidation({ data: { brief: brief.trim(), marketAnalysis } })
        .then(setFlowValidation)
        .catch((err: unknown) => {
          const msg =
            err instanceof Error ? err.message : "FLOW validation failed. Using fallback data.";
          setFlowValidationError(msg);
        });
    }
  }, [stage, brief, marketAnalysis, flowValidation, flowValidationError]);

  // Call Gemini delivery artifacts when flow validation is ready
  useEffect(() => {
    if (
      stage === "flow" &&
      brief.trim() &&
      marketAnalysis &&
      flowValidation &&
      !deliveryArtifacts &&
      !deliveryArtifactsError
    ) {
      setDeliveryArtifacts(null);
      setDeliveryArtifactsError(null);
      generateDeliveryArtifacts({
        data: { brief: brief.trim(), marketAnalysis, flowValidation },
      })
        .then(setDeliveryArtifacts)
        .catch((err: unknown) => {
          const msg =
            err instanceof Error
              ? err.message
              : "Delivery artifacts generation failed. Using fallback data.";
          setDeliveryArtifactsError(msg);
        });
    }
  }, [
    stage,
    brief,
    marketAnalysis,
    flowValidation,
    deliveryArtifacts,
    deliveryArtifactsError,
  ]);

  // Merge Gemini analysis into a ScenarioData for CognitiveEngine
  const engineScenario: ScenarioData = useMemo(() => {
    if (!marketAnalysis) return scenario;
    return {
      ...scenario,
      title: marketAnalysis.title[lang],
      competitors: marketAnalysis.competitors,
      sources: marketAnalysis.sources,
      marketCards: marketAnalysis.marketCards.map((c) => ({
        label: c.label[lang],
        value: c.value[lang],
      })),
      marketIntents: marketAnalysis.marketIntents.map((m) => m[lang]),
      bench: marketAnalysis.bench,
      gapValues: marketAnalysis.gapValues,
      results: marketAnalysis.results.map((r) => ({
        label: r.label[lang],
        value: r.value,
      })),
      confidenceItems: marketAnalysis.confidenceItems.map((c) => ({
        label: c.label[lang],
        value: c.value[lang],
      })),
      overallConfidence: marketAnalysis.overallConfidence,
    };
  }, [marketAnalysis, scenario, lang]);

  // Merge FLOW validation data into ScenarioData for FlowDelivery
  const flowScenario: ScenarioData = useMemo(() => {
    if (!flowValidation) return engineScenario;
    return {
      ...engineScenario,
      flowPanels: flowValidation.flowPanels.map((p) => ({
        label: p.label[lang],
        value: p.value,
      })),
      flowCases: flowValidation.flowCases.map((c) => ({
        title: c.title[lang],
        evidence: c.evidence[lang],
        ...(c.reason ? { reason: c.reason[lang] } : {}),
      })),
      flowMatrix: flowValidation.flowMatrix.map((m) => ({
        opportunity: m.opportunity[lang],
        value: m.value[lang],
        confidence: m.confidence,
        complexity: m.complexity[lang],
        ...(m.reason ? { reason: m.reason[lang] } : {}),
      })),
      confidenceMini: flowValidation.confidenceMini.map((c) => ({
        label: c.label[lang],
        value: c.value[lang],
      })),
      recommendationTitle: flowValidation.recommendationTitle[lang],
      reasons: flowValidation.reasons.map((r) => r[lang]),
    };
  }, [flowValidation, engineScenario, lang]);

  // Merge delivery artifacts into ScenarioData for DeliveryHub
  const deliveryScenario: ScenarioData = useMemo(() => {
    if (!deliveryArtifacts) return flowScenario;
    return {
      ...flowScenario,
      pdf: {
        s1body: deliveryArtifacts.pdf.s1body[lang],
        s2body: deliveryArtifacts.pdf.s2body[lang],
        s3a: deliveryArtifacts.pdf.s3a[lang],
        s3b: deliveryArtifacts.pdf.s3b[lang],
        s3c: deliveryArtifacts.pdf.s3c[lang],
        s4body: deliveryArtifacts.pdf.s4body[lang],
        s5body: deliveryArtifacts.pdf.s5body[lang],
      },
      jiraLines: deliveryArtifacts.jiraLines.map((j) => j[lang]),
    };
  }, [deliveryArtifacts, flowScenario, lang]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stage]);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar lang={lang} onLangChange={setLang} />

      <main className="flex-1">
        {stage === "hero" ? (
          <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
            <Hero t={t} onStart={() => setStage("p1")} />
          </div>
        ) : stage === "engine" ? (
          <CognitiveEngine
            t={t}
            lang={lang}
            scenario={engineScenario}
            analysisLoading={!marketAnalysis && !analysisError}
            analysisError={analysisError}
            onValidate={() => setStage("flow")}
            onBack={() => setStage("p3")}
          />
        ) : stage === "flow" ? (
          <FlowDelivery
            t={t}
            scenario={deliveryScenario}
            flowValidationLoading={!flowValidation && !flowValidationError}
            flowValidationError={flowValidationError}
            deliveryArtifactsLoading={!deliveryArtifacts && !deliveryArtifactsError}
            deliveryArtifactsError={deliveryArtifactsError}
            marketAnalysis={marketAnalysis}
            flowValidation={flowValidation}
            deliveryArtifacts={deliveryArtifacts}
            onRestart={restart}
            onBackToEngine={() => setStage("engine")}
          />
        ) : (
          <div className="mx-auto max-w-[1240px] px-6 lg:px-10 pt-14 pb-24">
            <div className="grid lg:grid-cols-[220px_1fr] gap-14">
              <aside>
                <Timeline t={t} activeIndex={active} completedThrough={completed} />
              </aside>
              <div key={stage} className="min-w-0 animate-soft-in">
                {stage === "p1" && (
                  <Phase1Connect
                    t={t}
                    state={jiraState}
                    onStateChange={setJiraState}
                    onContinue={() => setStage("p2")}
                    onBack={() => setStage("hero")}
                  />
                )}
                {stage === "p2" && (
                  <Phase2Brief
                    t={t}
                    value={brief}
                    onValueChange={setBrief}
                    onContinue={(b) => {
                      setBrief(b);
                      setStage("p3");
                    }}
                    onScenarioSelect={setScenarioIndex}
                    onBack={() => setStage("p1")}
                  />
                )}
                {stage === "p3" && (
                  <Phase3Clarify
                    t={t}
                    brief={brief}
                    answers={answers}
                    onAnswersChange={setAnswers}
                    onContinue={() => setStage("transition")}
                    onBack={() => setStage("p2")}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-10 flex flex-col items-center gap-1 text-center">
          <div className="text-[12px] font-medium text-foreground/80">{t.footer1}</div>
          <div className="text-[11px] text-muted-foreground/70">{t.footer2}</div>
        </div>
      </footer>

      {stage === "transition" && <CognitiveTransition t={t} onDone={() => setStage("engine")} />}
    </div>
  );
}
