import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { translations, type Lang } from "@/lib/pulse-i18n";
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
    setStage("hero");
  };

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
            onValidate={() => setStage("flow")}
            onBack={() => setStage("p3")}
          />
        ) : stage === "flow" ? (
          <FlowDelivery
            t={t}
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
          <div className="text-[12px] font-medium text-foreground/80">
            {t.footer1}
          </div>
          <div className="text-[11px] text-muted-foreground/70">
            {t.footer2}
          </div>
        </div>
      </footer>

      {stage === "transition" && (
        <CognitiveTransition t={t} onDone={() => setStage("engine")} />
      )}
    </div>
  );
}
