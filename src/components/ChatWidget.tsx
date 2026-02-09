// src/components/ChatWidget.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Msg = { sender: "user" | "bot"; text: string };
type Stage = "browse" | "inquire" | "lead" | "handoff";

const STORAGE_KEY = "ihub_chat_history_v1";
const LEAD_KEY = "ihub_chat_lead_v1";

const WHATSAPP_NUMBER = "+267 78 768 259";
const WHATSAPP_CHANNEL =
  "https://whatsapp.com/channel/0029Vb6s2BE3LdQZJGmxQf1W";

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
      "I’m not sure about that one — but I can help you with prices, availability, and how to order.",
      "Try asking: iPhone 13 price, Samsung A15, Redmi, laptops, or how to order shoes/clothing.",
      "If it’s not listed, tell me what you want and I’ll help you message iHub on WhatsApp.",
    ],
    []
  );
  const fallbackIdx = useRef(0);
  const rotatedFallback = () => FALLBACKS[fallbackIdx.current++ % FALLBACKS.length];

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
            "Hey 👋 Welcome to iHub.\nYou can browse prices here, then order on WhatsApp.\nWhat are you looking for — phones, laptops, gadgets, clothing, or shoes?",
        },
      ]);
      setSuggestions([
        "Phones",
        "Laptops",
        "Gadgets",
        "Clothing & Shoes",
        "How to order",
        "WhatsApp Channel",
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
      "Hi iHub 👋 I want to place an order:",
      "",
      `Name: ${leadData.name || "-"}`,
      `Phone: ${leadData.phone || "-"}`,
      `Item: ${leadData.item || "-"}`,
      `Budget (optional): ${leadData.budget || "-"}`,
      `Location: ${leadData.location || "-"}`,
      `Notes: ${leadData.note || "-"}`,
      "",
      "— Chat context —",
      ...transcript.slice(-10).map((m) => `${m.sender === "user" ? "Me" : "Assistant"}: ${m.text}`),
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
    if (s === "WhatsApp Channel") {
      window.open(WHATSAPP_CHANNEL, "_blank");
      return;
    }
    if (s === "Order on WhatsApp") {
      setLeadOpen(true);
      setStage("lead");
      pushBot("No stress — fill this quick form and I’ll open WhatsApp with your order message.");
      return;
    }
    if (s === "How to order") {
      pushBot(
        "How ordering works:\n1) Browse prices\n2) Tap “Order on WhatsApp”\n3) iHub confirms availability + delivery + payment.\n\nWant to order now?",
        ["Order on WhatsApp", "Phones", "Laptops", "Gadgets"]
      );
      return;
    }
    if (s === "Phones") {
      window.location.href = "/c/phones";
      return;
    }
    if (s === "Laptops") {
      window.location.href = "/c/laptops";
      return;
    }
    if (s === "Gadgets") {
      window.location.href = "/c/gadgets";
      return;
    }
    if (s === "Clothing & Shoes") {
      pushBot(
        "For clothing & shoes, just tell me what you want (size, color, budget). If you have a photo/link, even better.",
        ["Order on WhatsApp", "WhatsApp Channel"]
      );
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
    pushBot("Opening WhatsApp now ✅", [
      "Phones",
      "Laptops",
      "Gadgets",
      "WhatsApp Channel",
    ]);
    setLeadOpen(false);
    setStage("handoff");
  };

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed z-50 bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white focus:outline-none animate-bounce-soft shadow-lg"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(96,165,250,0.95), rgba(37,99,235,0.95) 55%, rgba(168,85,247,0.9) 100%)",
            boxShadow: "0 0 18px rgba(96,165,250,0.25)",
          }}
          aria-label="Open chat"
        >
          💬
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-2 py-0.5">
              {unread}
            </span>
          )}
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          className="fixed z-50 bottom-6 right-6 flex flex-col rounded-2xl shadow-2xl border overflow-hidden animate-panel-in"
          style={{
            width: "min(92vw,22rem)",
            height: leadOpen ? "33rem" : "28rem",
            background: "rgba(11,15,25,0.96)",
            borderColor: "rgba(255,255,255,0.10)",
            animation: "slideIn 0.5s cubic-bezier(0.45,0,0.25,1)",
          }}
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between bg-[--surface] text-[--foreground] backdrop-blur-sm border-b border-[--border]">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 flex items-center justify-center rounded-full bg-white/10 text-[--foreground] text-xs font-semibold">
                iH
              </div>
              <div>
                <div className="font-semibold text-sm">iHub Assistant</div>
                <div className="text-[11px] opacity-80">
                  {stage === "lead" ? "Order details" : "Online • Ask prices / order"}
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white text-lg"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm bg-[--background]">
            {messages.map((m, i) => {
              const isUser = m.sender === "user";
              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[82%] whitespace-pre-line animate-bubble ${
                      isUser
                        ? "bg-white/10 text-[--foreground] border border-white/10"
                        : "bg-[--surface] text-[--foreground] border border-white/10"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}

            {typing && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl bg-[--surface] border border-white/10 text-[--foreground]">
                  <span className="typing-dot" />
                  <span className="typing-dot" style={{ animationDelay: "120ms" }} />
                  <span className="typing-dot" style={{ animationDelay: "240ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Order Form */}
          {leadOpen && (
            <div className="p-3 border-t border-white/10 bg-[--surface] space-y-2 text-sm text-[--foreground]">
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
                placeholder="What do you want? (e.g. iPhone 13 128GB)"
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
                placeholder="Notes (color/size/model) or paste a link"
                className="input"
              />

              <div className="flex gap-2 pt-1">
                <button onClick={submitLead} className="btn btn-primary">
                  Send to WhatsApp
                </button>
                <button
                  onClick={() => setLeadOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {!leadOpen && suggestions.length > 0 && (
            <div className="px-3 py-2 border-t border-white/10 bg-[--surface] flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => onSuggestion(s)}
                  className="text-xs px-3 py-1 rounded-full border border-white/15 text-[--foreground] hover:bg-white/10 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          {!leadOpen && (
            <div className="flex p-3 border-t border-white/10 bg-[--surface] gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask: iPhone 13 price / Samsung A15 / laptop…"
                className="flex-1 input"
              />
              <button className="btn btn-primary" onClick={() => sendMessage()}>
                Send
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes bounce-soft {
          0%,
          100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-6px);
          }
          50% {
            transform: translateY(0);
          }
          75% {
            transform: translateY(-3px);
          }
        }
        .animate-bounce-soft {
          animation: bounce-soft 4s cubic-bezier(0.45, 0, 0.25, 1) infinite;
        }

        @keyframes slideIn {
          from {
            transform: translateY(22px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes bubbleIn {
          0% {
            transform: scale(0.96);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bubble {
          animation: bubbleIn 0.22s ease-out;
        }

        @keyframes typing {
          0%,
          80%,
          100% {
            transform: scale(0);
            opacity: 0.3;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .typing-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          margin-right: 4px;
          background: linear-gradient(
            90deg,
            rgba(96, 165, 250, 0.95),
            rgba(168, 85, 247, 0.95),
            rgba(52, 211, 153, 0.95)
          );
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
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
