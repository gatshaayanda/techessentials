// src/components/ChatWidget.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Msg = { sender: "user" | "bot"; text: string };
type Stage = "browse" | "inquire" | "lead" | "handoff";

const STORAGE_KEY = "techessentials_chat_history_v1";
const LEAD_KEY = "techessentials_chat_lead_v1";

const WHATSAPP_NUMBER = "+26772545765";
const FACEBOOK_PAGE_PRIMARY = "https://www.facebook.com/techessentialz/";
const FACEBOOK_PAGE_SECONDARY = "https://www.facebook.com/techessentialsbw/";

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("browse");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [unread, setUnread] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [leadOpen, setLeadOpen] = useState(false);
  const [lead, setLead] = useState({
    name: "",
    phone: "",
    item: "",
    budget: "",
    location: "",
    note: "",
  });

  const FALLBACKS = useMemo(
    () => [
      "I’m not sure about that one — but I can help with POS, scales, CCTV pricing, availability, and installation info.",
      "Try: POS package price, 4 camera CCTV, 8 camera CCTV, ColourVu, price computing scale, receipt printer, barcode scanner.",
      "If it’s not listed, tell me what you need and I’ll help you request a quote on WhatsApp.",
    ],
    []
  );
  const fallbackIdx = useRef(0);
  const rotatedFallback = () =>
    FALLBACKS[fallbackIdx.current++ % FALLBACKS.length];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
      const leadSaved = localStorage.getItem(LEAD_KEY);
      if (leadSaved) setLead((prev) => ({ ...prev, ...(JSON.parse(leadSaved) || {}) }));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    if (!open && messages.length) setUnread((u) => u + 1);
  }, [messages, open]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          sender: "bot",
          text:
            "Hi 👋 Welcome to Tech Essentials.\nWe supply POS systems, price computing scales, CCTV packages, and accessories.\nWhat do you need help with?",
        },
      ]);
      setSuggestions([
        "POS Systems",
        "Scales",
        "CCTV Packages",
        "Request a Quote",
        "Facebook (techessentialz)",
        "Facebook (techessentialsbw)",
      ]);
      setUnread(0);
      setStage("inquire");
    }
    if (open) setUnread(0);
  }, [open, messages.length]);

  const pushBot = (text: string, sugg?: string[]) => {
    setMessages((p) => [...p, { sender: "bot", text }]);
    setSuggestions(Array.isArray(sugg) ? sugg : []);
  };

  const toWhatsAppOrder = (leadData: typeof lead, transcript: Msg[]) => {
    const lines = [
      "Hi Tech Essentials 👋 I want to request a quote / place an order:",
      "",
      `Name: ${leadData.name || "-"}`,
      `Phone: ${leadData.phone || "-"}`,
      `Item(s): ${leadData.item || "-"}`,
      `Budget (optional): ${leadData.budget || "-"}`,
      `Location: ${leadData.location || "-"}`,
      `Notes: ${leadData.note || "-"}`,
      "",
      "— Chat context —",
      ...transcript
        .slice(-10)
        .map((m) => `${m.sender === "user" ? "Me" : "Assistant"}: ${m.text}`),
    ];
    return waLink(lines.join("\n"));
  };

  async function sendMessage(override?: string) {
    const text = (override ?? input).trim();
    if (!text) return;

    setMessages((p) => [...p, { sender: "user", text }]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/fake-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      const reply = (data?.reply || "").trim() || rotatedFallback();
      pushBot(reply, data?.suggestions || []);
      setTyping(false);
    } catch {
      setTyping(false);
      pushBot(rotatedFallback());
    }
  }

  const onSuggestion = (s: string) => {
    if (s === "Facebook (techessentialz)") {
      window.open(FACEBOOK_PAGE_PRIMARY, "_blank", "noopener,noreferrer");
      return;
    }
    if (s === "Facebook (techessentialsbw)") {
      window.open(FACEBOOK_PAGE_SECONDARY, "_blank", "noopener,noreferrer");
      return;
    }
    if (s === "Request a Quote" || s === "Order on WhatsApp") {
      setLeadOpen(true);
      setStage("lead");
      pushBot("Quick details please — I’ll open WhatsApp with your quote message.");
      return;
    }

    if (s === "POS Systems") {
      window.location.href = "/c/pos";
      return;
    }
    if (s === "Scales") {
      window.location.href = "/c/scales";
      return;
    }
    if (s === "CCTV Packages") {
      window.location.href = "/c/cctv";
      return;
    }

    sendMessage(s);
  };

  const submitLead = () => {
    const clean = {
      name: lead.name.trim(),
      phone: lead.phone.trim(),
      item: lead.item.trim(),
      budget: lead.budget.trim(),
      location: lead.location.trim(),
      note: lead.note.trim(),
    };
    try {
      localStorage.setItem(LEAD_KEY, JSON.stringify(clean));
    } catch {}

    window.location.href = toWhatsAppOrder(clean, messages);
    pushBot("Opening WhatsApp ✅", ["POS Systems", "Scales", "CCTV Packages"]);
    setLeadOpen(false);
    setStage("handoff");
  };

  return (
    <>
      {/* Launcher (clean, not neon) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed z-50 bottom-6 right-6 h-14 w-14 rounded-full grid place-items-center border"
          style={{
            background: "var(--brand-primary)",
            borderColor: "rgba(255,255,255,0.22)",
            boxShadow: "0 14px 34px rgba(15,23,42,0.18)",
            color: "#fff",
          }}
          aria-label="Open chat"
          title="Chat / Request quote"
        >
          <span style={{ fontSize: 22, lineHeight: 1 }}>💬</span>
          {unread > 0 && (
            <span
              className="absolute -top-1 -right-1 text-xs rounded-full px-2 py-0.5"
              style={{ background: "#ef4444", color: "#fff" }}
            >
              {unread}
            </span>
          )}
        </button>
      )}

      {/* Panel (light, readable, “service desk”) */}
      {open && (
        <div
          className="fixed z-50 bottom-6 right-6 flex flex-col overflow-hidden border"
          style={{
            width: "min(94vw, 23rem)",
            height: leadOpen ? "34rem" : "29rem",
            background: "var(--surface)",
            borderColor: "var(--border)",
            borderRadius: "18px",
            boxShadow: "0 22px 60px rgba(15,23,42,0.20)",
          }}
          role="dialog"
          aria-label="Tech Essentials chat"
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between border-b"
            style={{
              borderColor: "var(--border)",
              background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
              color: "#fff",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-full grid place-items-center"
                style={{ background: "rgba(255,255,255,0.22)", fontWeight: 800 }}
                aria-hidden="true"
              >
                TE
              </div>
              <div>
                <div className="text-sm font-extrabold">Tech Essentials</div>
                <div className="text-[11px]" style={{ opacity: 0.92 }}>
                  {stage === "lead" ? "Quote details" : "Online • Prices • Installations"}
                </div>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="h-9 w-9 rounded-lg grid place-items-center"
              style={{ background: "rgba(255,255,255,0.18)" }}
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-3 space-y-2 text-sm"
            style={{ background: "var(--background)", color: "var(--foreground)" }}
          >
            {messages.map((m, i) => {
              const isUser = m.sender === "user";
              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className="px-3 py-2 max-w-[86%] whitespace-pre-line"
                    style={{
                      borderRadius: 16,
                      border: `1px solid var(--border)`,
                      background: isUser ? "rgba(11,94,215,0.08)" : "var(--surface)",
                      color: "var(--foreground)",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}

            {typing && (
              <div className="flex justify-start">
                <div
                  className="px-3 py-2"
                  style={{
                    borderRadius: 16,
                    border: `1px solid var(--border)`,
                    background: "var(--surface)",
                  }}
                >
                  <span className="te-dot" />
                  <span className="te-dot" style={{ animationDelay: "120ms" }} />
                  <span className="te-dot" style={{ animationDelay: "240ms" }} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Lead Form */}
          {leadOpen && (
            <div className="p-3 border-t space-y-2 text-sm" style={{ borderColor: "var(--border)" }}>
              <input
                value={lead.name}
                onChange={(e) => setLead((s) => ({ ...s, name: e.target.value }))}
                placeholder="Your name"
                className="input"
              />
              <input
                value={lead.phone}
                onChange={(e) => setLead((s) => ({ ...s, phone: e.target.value }))}
                placeholder="Your phone (optional)"
                className="input"
              />
              <input
                value={lead.item}
                onChange={(e) => setLead((s) => ({ ...s, item: e.target.value }))}
                placeholder="What do you need? (e.g. 8ch CCTV + install)"
                className="input"
              />
              <div className="flex gap-2">
                <input
                  value={lead.budget}
                  onChange={(e) => setLead((s) => ({ ...s, budget: e.target.value }))}
                  placeholder="Budget (optional)"
                  className="input"
                />
                <input
                  value={lead.location}
                  onChange={(e) => setLead((s) => ({ ...s, location: e.target.value }))}
                  placeholder="Location"
                  className="input"
                />
              </div>
              <textarea
                rows={2}
                value={lead.note}
                onChange={(e) => setLead((s) => ({ ...s, note: e.target.value }))}
                placeholder="Notes (qty / models / install needed)"
                className="input"
              />

              <div className="flex gap-2 pt-1">
                <button onClick={submitLead} className="btn btn-primary">
                  Send to WhatsApp
                </button>
                <button
                  onClick={() => setLeadOpen(false)}
                  className="btn btn-outline"
                  type="button"
                >
                  Cancel
                </button>
              </div>

              <div className="text-[11px] text-[--muted] pt-1">
                WhatsApp opens with your quote message to +267 72 545 765.
              </div>
            </div>
          )}

          {/* Suggestions */}
          {!leadOpen && suggestions.length > 0 && (
            <div className="px-3 py-2 border-t flex flex-wrap gap-2" style={{ borderColor: "var(--border)" }}>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => onSuggestion(s)}
                  type="button"
                  className="text-xs px-3 py-1.5 rounded-full"
                  style={{
                    border: `1px solid var(--border)`,
                    background: "var(--surface)",
                    color: "var(--foreground)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          {!leadOpen && (
            <div className="flex p-3 border-t gap-2" style={{ borderColor: "var(--border)" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask: POS package / CCTV / scale…"
                className="flex-1 input"
              />
              <button className="btn btn-primary" onClick={() => sendMessage()} type="button">
                Send
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes teTyping {
          0%,
          80%,
          100% {
            transform: scale(0);
            opacity: 0.35;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .te-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          margin-right: 4px;
          border-radius: 50%;
          background: var(--brand-primary);
          animation: teTyping 1.2s infinite ease-in-out;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}
