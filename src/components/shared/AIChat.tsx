"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to Diecast Muscat. I'm your concierge — ask about scales, brands, limited editions, or shipping across Oman.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("diecast:open-chat", handler);
    return () => window.removeEventListener("diecast:open-chat", handler);
  }, []);

  async function send(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || busy) return;
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) throw new Error("Chat failed");
      const data = (await res.json()) as { reply: string };
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Floating button — desktop only; mobile reaches it via search sheet / BottomNav */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "hidden lg:inline-flex fixed bottom-6 right-6 z-40 h-14 px-5 items-center gap-2 rounded-full",
          "bg-gold text-black shadow-glow hover:shadow-[0_0_36px_rgba(212,175,55,0.4)]",
          "transition-all duration-200",
          open && "opacity-0 pointer-events-none scale-90"
        )}
        aria-label="Open chat"
      >
        <Sparkles className="h-5 w-5" />
        <span className="text-sm font-medium">Concierge</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed inset-x-3 bottom-3 sm:bottom-6 sm:right-6 sm:left-auto z-50 sm:w-[400px] h-[calc(100dvh-2rem)] sm:h-[560px] max-h-[80vh] rounded-lg overflow-hidden flex flex-col bg-surface border border-border-strong shadow-card"
            style={{
              bottom: "calc(env(safe-area-inset-bottom) + 4.5rem)",
            }}
          >
            <header className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-b from-surface-elevated to-surface">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-gold" />
                </div>
                <div>
                  <p className="font-display text-base leading-none">Concierge</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted mt-1">AI · Diecast Muscat</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="h-8 w-8 inline-flex items-center justify-center rounded-md text-text-muted hover:text-text hover:bg-bg transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed",
                    m.role === "user"
                      ? "self-end bg-gold/15 text-text border border-gold/30"
                      : "self-start bg-surface-elevated text-text border border-border"
                  )}
                >
                  {m.content}
                </div>
              ))}
              {busy && (
                <div className="self-start text-xs text-text-muted px-4 py-2 italic">thinking…</div>
              )}
            </div>

            <form onSubmit={send} className="p-4 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a model, scale, brand…"
                disabled={busy}
                className="flex-1 h-11 px-4 rounded-md bg-bg border border-border-strong text-sm placeholder:text-text-dim focus:outline-none focus:border-gold transition-colors"
              />
              <Button type="submit" disabled={!input.trim() || busy} size="icon" className="h-11 w-11">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
