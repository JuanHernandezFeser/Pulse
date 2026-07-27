import { useRef, useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { PulseMark } from "./PulseMark";
import { askPulse, type ChatMessage, type AskPulseResult } from "@/lib/gemini/askPulse";
import type { ScenarioData } from "@/lib/scenarios";
import type { Lang } from "@/lib/pulse-i18n";

interface AskPulseChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scenario: ScenarioData;
  locale: Lang;
}

interface DisplayMessage {
  role: "user" | "model";
  text: string;
  relatedGap?: string;
}

export function AskPulseChat({ open, onOpenChange, scenario, locale }: AskPulseChatProps) {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: DisplayMessage = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const history: ChatMessage[] = [...messages, userMsg].map((m) => ({
      role: m.role,
      text: m.text,
    }));

    try {
      const result: AskPulseResult = await askPulse({
        data: {
          question: trimmed,
          history,
          scenario,
          locale,
        },
      });

      const modelMsg: DisplayMessage = {
        role: "model",
        text: result.answer,
        relatedGap: result.relatedGap,
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      console.error("askPulse error:", err);
      const errorMsg: DisplayMessage = {
        role: "model",
        text:
          locale === "es"
            ? "No pude procesar tu pregunta. Intentá de nuevo."
            : "I couldn't process your question. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[420px] p-0 flex flex-col bg-surface-elevated border-border"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <PulseMark size={20} />
            <SheetTitle className="text-[15px] font-semibold tracking-tight text-foreground">
              {locale === "es" ? "Preguntar a PULSE" : "Ask PULSE"}
            </SheetTitle>
          </div>
          <SheetDescription className="text-[12px] text-muted-foreground/70">
            {locale === "es"
              ? "Consultá sobre el análisis de mercado generado."
              : "Ask about the generated market analysis."}
          </SheetDescription>
        </SheetHeader>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {messages.length === 0 && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-12">
              <PulseMark size={32} />
              <p className="text-[13px] text-muted-foreground/60 max-w-[260px] leading-relaxed">
                {locale === "es"
                  ? "Preguntá sobre competidores, gaps, oportunidades o cualquier dato del análisis."
                  : "Ask about competitors, gaps, opportunities, or any data from the analysis."}
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={[
                "flex flex-col gap-1.5 max-w-[85%] animate-soft-in",
                msg.role === "user" ? "self-end items-end" : "self-start items-start",
              ].join(" ")}
            >
              <div
                className={[
                  "rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed",
                  msg.role === "user"
                    ? "bg-foreground text-background rounded-br-md"
                    : "bg-surface border border-border text-foreground rounded-bl-md",
                ].join(" ")}
              >
                {msg.text}
              </div>
              {msg.role === "model" && msg.relatedGap && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[10.5px] font-medium text-muted-foreground/70">
                  <span className="h-1 w-1 rounded-full bg-foreground/50" />
                  {msg.relatedGap}
                </span>
              )}
            </div>
          ))}

          {loading && (
            <div className="self-start flex flex-col gap-1.5 max-w-[85%]">
              <div className="rounded-2xl rounded-bl-md bg-surface border border-border px-4 py-3 flex items-center gap-2">
                <PulseMark size={14} />
                <span className="text-[13px] text-muted-foreground/60">
                  {locale === "es" ? "Pensando..." : "Thinking..."}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                locale === "es"
                  ? "Escribí tu pregunta..."
                  : "Type your question..."
              }
              disabled={loading}
              className="bg-surface border-border text-[13px] placeholder:text-muted-foreground/50 focus-visible:ring-foreground/20"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="inline-flex items-center justify-center h-9 w-9 shrink-0 rounded-full bg-foreground text-background transition-all duration-200 hover:opacity-90 active:scale-[0.95] disabled:opacity-30 disabled:pointer-events-none"
              aria-label={locale === "es" ? "Enviar" : "Send"}
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
