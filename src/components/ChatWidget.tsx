import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTED = [
  "What are Moha's priorities?",
  "How do I donate?",
  "Tell me about the bursary program",
  "Where is Moha's office?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Karibu! 👋 I'm Moha's AI assistant. Ask me about the manifesto, donations, foundations, or how to get involved. Kuna More na Moha!",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userMsg: Msg = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "Failed to reach AI" }));
        setMessages((m) => [
          ...m,
          { role: "assistant", content: err.error || "Something went wrong. Please try again." },
        ]);
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";
      let done = false;

      // Add empty assistant placeholder
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") {
            done = true;
            break;
          }
          try {
            const json = JSON.parse(payload);
            const delta: string | undefined = json.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Network error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.5 }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat with Moha AI"
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-glow flex items-center justify-center transition-all hover:scale-110",
          "bg-gradient-gold text-gold-foreground"
        )}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="msg"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm h-[560px] max-h-[80vh] bg-card border border-border rounded-2xl shadow-elegant flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-primary text-primary-foreground p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gold flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-gold-foreground" />
              </div>
              <div>
                <div className="font-display font-bold">Moha AI</div>
                <div className="text-xs text-primary-foreground/80 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  Online — ask anything
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    )}
                  >
                    {m.content || (loading && i === messages.length - 1 ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null)}
                  </div>
                </div>
              ))}

              {messages.length <= 1 && !loading && (
                <div className="pt-2 space-y-2">
                  <p className="text-xs text-muted-foreground font-semibold">
                    Try asking:
                  </p>
                  {SUGGESTED.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="block w-full text-left text-sm px-3 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="p-3 border-t border-border bg-card flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Moha AI…"
                disabled={loading}
                maxLength={500}
                className="flex-1 h-11 px-4 rounded-lg bg-muted text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                type="submit"
                size="icon"
                variant="hero"
                className="h-11 w-11 shrink-0"
                disabled={loading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
