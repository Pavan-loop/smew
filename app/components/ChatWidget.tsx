"use client";
import { useEffect, useRef, useState } from "react";

// ── INTENT ENGINE ──
const INTENTS = [
  // Small talk
  {
    id: "greet",
    triggers: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "howdy", "hiya", "sup"],
    reply: "Hello! Welcome to Shree Manjunatha Engineering Works. I'm here to help with all your steel fabrication needs. How can I assist you today?",
  },
  {
    id: "how_are_you",
    triggers: ["how are you", "how are you doing", "how's it going", "you okay", "you good"],
    reply: "I'm doing great, thank you for asking! Ready to help you with your fabrication needs. What can I assist you with today?",
  },
  {
    id: "thanks",
    triggers: ["thank you", "thanks", "thank you so much", "thanks a lot", "appreciate it", "thx", "ty"],
    reply: "You're very welcome! Feel free to ask anything else. We're always happy to help.",
  },
  {
    id: "bye",
    triggers: ["bye", "goodbye", "see you", "take care", "later", "farewell", "good night"],
    reply: "Goodbye! It was a pleasure. Feel free to reach out anytime — call us at 9986464819 or WhatsApp us. Have a wonderful day!",
  },
  {
    id: "who_are_you",
    triggers: ["who are you", "what are you", "your name", "introduce yourself", "tell me about yourself"],
    reply: "I'm the AI assistant for Shree Manjunatha Engineering Works — a trusted steel fabrication workshop in Mysore with 25+ years of experience. Ask me about our services, materials, pricing, or how to get a free quote!",
  },
  {
    id: "help",
    triggers: ["help", "what can you do", "what do you know", "guide me", "capabilities"],
    reply: "I can help with our services (gates, grills, shutters, railings and more), materials, pricing, timelines, location, working hours, and how to get a free quote. What would you like to know?",
  },

  // Services
  {
    id: "services",
    triggers: ["services", "what do you do", "what do you offer", "offerings", "what do you make", "what do you fabricate"],
    reply: "We specialize in: Main Gates, Safety Doors, Rolling Shutters, Window Grills, Staircase Railings, Collapsible Gates, Compound Walls, Garage Doors, MS Fabrication, Steel Structures, Repairs & Welding, and Custom Orders. Which would you like to know more about?",
  },
  {
    id: "gates",
    triggers: ["gate", "gates", "main gate", "compound gate", "entrance gate", "iron gate", "steel gate", "sliding gate"],
    reply: "We fabricate heavy-duty main gates in MS (Mild Steel) and SS (Stainless Steel) for homes and commercial spaces — compound gates, entrance gates, and sliding gates. Call 9986464819 for a free site visit and quote.",
  },
  {
    id: "safety_door",
    triggers: ["safety door", "security door", "grill door", "ms door", "iron door", "security grill", "safety doors"],
    reply: "Our safety doors include security grill doors, MS doors, and reinforced safety frames designed for maximum protection. Available in various designs for homes, offices, and apartments. Contact us for a custom quote.",
  },
  {
    id: "rolling_shutter",
    triggers: ["rolling shutter", "shutter", "shop shutter", "garage shutter", "industrial shutter", "shutters"],
    reply: "We install industrial and commercial rolling shutters for shops, warehouses, factories, and garages — both manual and motorised options. Call 9986464819 or WhatsApp us for a site measurement and quote.",
  },
  {
    id: "window_grill",
    triggers: ["window grill", "window grills", "grills", "grill", "window guard", "window bars"],
    reply: "We fabricate custom window grills in designer patterns, classic styles, and heavy-duty security options — made to your exact window measurements. Call us for pricing; we offer the best rates in Mysore.",
  },
  {
    id: "railing",
    triggers: ["railing", "railings", "staircase railing", "balcony railing", "handrail", "terrace railing", "stair railing"],
    reply: "We make elegant MS and SS railings for staircases, balconies, and terraces — modern minimalist or ornate traditional styles, fabricated to your exact specifications. Get in touch for a free quote.",
  },
  {
    id: "collapsible",
    triggers: ["collapsible gate", "collapsible", "folding gate", "foldable gate", "expandable gate"],
    reply: "Collapsible (folding) gates are perfect for garages, entrances, and narrow spaces — sturdy, space-saving, and available in single or double leaf designs. Contact us at 9986464819 for sizes and pricing.",
  },
  {
    id: "garage_door",
    triggers: ["garage door", "garage doors", "garage shutter", "car garage", "parking gate"],
    reply: "We build custom garage doors and shutters — both manual and automation-ready designs. Durable, smooth-operating, and built to last. Call us for a free site measurement and quote.",
  },
  {
    id: "custom",
    triggers: ["custom order", "custom", "custom design", "custom fabrication", "my own design", "special order", "any design"],
    reply: "Absolutely! Bring your own design, a photo reference, or just an idea — our craftsmen will fabricate exactly to your specifications. Custom orders are our specialty. Call or WhatsApp us to discuss.",
  },
  {
    id: "warranty",
    triggers: ["warranty", "guarantee", "warranty on", "damaged later", "if something breaks", "if it breaks", "if it gets damaged", "damage later", "free repair", "after installation", "after work is done", "after fabrication"],
    reply: "Damage is very rare because we use only high-quality steel and skilled craftsmen. But if anything does get damaged, we repair it free of charge — your satisfaction is our guarantee. Call 9986464819 if you ever face an issue.",
  },
  {
    id: "repair",
    triggers: ["repair", "repairs", "fix my gate", "broken gate", "broken grill", "refurbish", "rusted gate", "old gate repair"],
    reply: "Yes, we provide professional repair, welding, and refurbishment for existing gates, doors, grills, and shutters. Don't replace — repair! Call 9986464819 to describe the issue and get an estimate.",
  },
  {
    id: "compound_wall",
    triggers: ["compound wall", "compound fencing", "boundary wall", "boundary fence", "perimeter fence", "compound"],
    reply: "We fabricate MS fencing and grills for compound walls and boundary protection. Custom heights and designs available for homes, plots, and commercial premises. Call us for a site visit and quote.",
  },
  {
    id: "steel_structure",
    triggers: ["steel structure", "canopy", "shade", "pergola", "shed", "awning", "shelter"],
    reply: "We build small steel structures, canopies, shade frames, and pergolas for outdoor spaces. Strong, weather-resistant, and custom-sized to your space. Contact us for a free quote.",
  },

  // Materials
  {
    id: "materials",
    triggers: ["what material", "what steel do you use", "what materials", "type of steel", "grade of steel", "quality of steel", "mild steel", "stainless steel option"],
    reply: "We use only high-grade MS (Mild Steel) and SS (Stainless Steel). MS is great for gates, grills, and structures. SS is ideal for railings and moisture-prone areas. All materials are sourced from trusted suppliers for maximum durability.",
  },
  {
    id: "ss_vs_ms",
    triggers: ["ms vs ss", "difference between ms and ss", "stainless vs mild steel", "which steel is better", "which steel should i use", "ms or ss", "ss or ms"],
    reply: "MS (Mild Steel) is strong, cost-effective, and ideal for gates and grills — usually painted to prevent rust. SS (Stainless Steel) is rust-resistant and low-maintenance, better for railings and areas with moisture. We'll recommend the right one for your specific needs.",
  },

  // Pricing
  {
    id: "price",
    triggers: ["price", "pricing", "cost", "how much", "rate", "budget", "charges", "quote", "estimate", "quotation", "rates", "free quote"],
    reply: "Pricing depends on the type, size, design, and material chosen. We offer the most competitive rates in Mysore with no compromise on quality. Call 9986464819 or WhatsApp +91 9986464819 for a free quote and site measurement.",
  },

  // Timeline
  {
    id: "timeline",
    triggers: ["how long", "timeline", "delivery time", "when will it be ready", "time to complete", "how many days", "how many weeks", "turnaround"],
    reply: "Standard items like grills and small gates are typically ready in 5–10 working days. Larger custom projects may take 2–3 weeks. We always commit to a delivery date and honor it — on-time delivery is our promise.",
  },

  // Contact & location
  {
    id: "contact",
    triggers: ["contact", "reach you", "get in touch", "speak to someone", "phone number", "number", "call you", "call us"],
    reply: "Call us at 9986464819 or WhatsApp +91 9986464819. We're at 24/2, near Basaveshwara Temple, Kuppalur, Mysuru 570031. Workshop open Mon–Sat 9 AM–7 PM. Sundays we visit your site for measurements and quotations — call to book.",
  },
  {
    id: "location",
    triggers: ["location", "address", "where are you", "where is your workshop", "workshop location", "visit you", "find you", "directions"],
    reply: "We're located at 24/2, near Basaveshwara Temple, Kuppalur, Mysuru, Karnataka 570031. You can also search 'Shree Manjunatha Engineering Works' on Google Maps. Call 9986464819 if you need directions.",
  },
  {
    id: "hours",
    triggers: ["working hours", "hours", "timing", "timings", "open", "when are you open", "business hours", "open on sunday", "closed on"],
    reply: "Our workshop is open Monday to Saturday, 9:00 AM – 7:00 PM. On Sundays, we're available for site visits — measurements and quotations at your location. Call or WhatsApp +91 9986464819 to book a Sunday visit.",
  },
  {
    id: "whatsapp",
    triggers: ["whatsapp", "whatsapp number", "chat on whatsapp", "message us"],
    reply: "WhatsApp us at +91 9986464819 — just click the WhatsApp button on our website or message us directly. We respond quickly!",
  },

  // Trust & experience
  {
    id: "experience",
    triggers: ["experience", "how long have you been", "how old", "years of experience", "since when", "established", "trusted"],
    reply: "Shree Manjunatha Engineering Works has been serving Mysore for over 25 years. We've completed thousands of projects for homes, apartments, commercial spaces, and industries across Mysore and surrounding areas.",
  },
  {
    id: "why_choose",
    triggers: ["why choose you", "why you", "what makes you different", "what is special", "best fabrication", "reasons to choose"],
    reply: "25+ years of experience, premium quality steel, on-time delivery, affordable pricing, skilled craftsmen, and 1000+ satisfied customers in Mysore. We don't just build structures — we build trust. Call us for a free quote.",
  },
];

// Any query containing these words goes straight to AI — intent engine can't reason about them
const AI_OVERRIDE_KEYWORDS = [
  // Pricing
  "price", "cost", "how much", "rate", "per sq", "per square", "per foot",
  "per feet", "per running", "starting price", "budget", "quotation",
  "charges", "fee", "expensive", "cheap", "affordable", "rupee", "inr", "₹",
  // Comparison & analysis
  "difference", "differ", "compare", "comparison", "versus", " vs ",
  "maintenance", "maintain", "durability", "durable", "last longer",
  "lifespan", "life span", "rust", "corrosion", "weather",
  "pros and cons", "advantages", "disadvantages", "benefit",
  "in terms of", "which is better", "which one is", "which should i",
  "explain", "tell me more", "elaborate",
  // Warranty & damage
  "warranty", "guarantee", "damaged", "damage", "breaks down", "falls apart",
  "after how many years", "how long will it last", "quality assurance",
];

function matchIntent(text: string) {
  const lower = text.toLowerCase().replace(/[^a-z0-9\s'₹]/g, " ");

  // Complex or analytical questions always go to AI
  if (AI_OVERRIDE_KEYWORDS.some((w) => lower.includes(w))) return null;

  const words = new Set(lower.split(/\s+/));
  let best: (typeof INTENTS)[0] | null = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    for (const trigger of intent.triggers) {
      const t = trigger.trim().toLowerCase();
      const tWords = t.split(/\s+/);
      const matched = tWords.length === 1 ? words.has(t) : lower.includes(t);
      if (matched) {
        const score = tWords.length * 6 + t.length;
        // Single-word triggers need score ≥ 8 to avoid short ambiguous matches
        if (score > bestScore && (tWords.length > 1 || score >= 8)) {
          bestScore = score;
          best = intent;
        }
      }
    }
  }
  return best;
}

const SYSTEM_PROMPT = `You are the AI assistant for Shree Manjunatha Engineering Works, a steel fabrication workshop in Mysore, Karnataka, India with 25+ years of experience. You are knowledgeable, friendly, and professional. Reply in 2-4 sentences max. Use simple English. Never use markdown. Plain conversational text only.

PRICING QUESTIONS — this is critical:
When asked about price, cost, or rates, always:
1. Explain the key factors that affect pricing for that specific product (material grade, design complexity, size, finish type).
2. Give a helpful ballpark (e.g. "SS gates generally cost more than MS due to material — the final price depends on size, design and finish.").
3. End with: "For an exact quote, call us at 9986464819 or WhatsApp +91 9986464819 — we'll give you a free estimate after a quick site measurement."
Never say you don't know prices. Always give useful context before directing them to call.

MATERIAL GUIDANCE — answer comparison questions like an expert:
MS (Mild Steel): Strong, cost-effective. Needs painting or powder-coating every few years to prevent rust. If maintained well, lasts decades. Best for: gates, grills, shutters, structures, compound walls. More affordable.
SS (Stainless Steel): Naturally rust and corrosion resistant. Needs only occasional wiping — no painting needed. Retains shine for years. Best for: railings, balconies, terraces, coastal or high-moisture areas. Premium cost.
For comparison questions (maintenance, durability, which is better): give a clear, specific side-by-side answer for the product they asked about. Do not just say "contact us" — answer the question first, then offer a quote CTA at the end.

KNOWLEDGE BASE:
Company: Shree Manjunatha Engineering Works (SMEW). 25+ years in Mysore. Tagline: "Built Once. Built Right." 1000+ satisfied customers.
Services: Main Gates (MS & SS), Safety Doors, Rolling Shutters, Window Grills, Staircase Railings, Collapsible Gates, Compound Walls, Garage Doors, MS Fabrication, Steel Structures (canopies, pergolas), Repairs & Welding, Custom Orders.
Contact: Phone 9986464819, WhatsApp +91 9986464819.
Location: 24/2, near Basaveshwara Temple, Kuppalur, Mysuru, Karnataka 570031.
Working hours: Monday to Saturday, 9:00 AM to 7:00 PM (workshop open). Sundays: available for site visits — measurements and quotations at the customer's location. Call or WhatsApp to book a Sunday appointment.
Pricing: Competitive rates, best value in Mysore. Free site measurement and quotes available.
Warranty: Damage is very rare because we use high-quality steel and skilled craftsmen. If anything gets damaged after installation, we repair it free of charge. Customer satisfaction is our guarantee.`;

type Message = { role: "bot" | "user"; content: string };

const GOLD = "#b8860b";
const DARK = "#0f0f0f";
const BORDER = "#e4e0da";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chipsHidden, setChipsHidden] = useState(false);
  const [notifVisible, setNotifVisible] = useState(true);
  const msgsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages([
      {
        role: "bot",
        content:
          "Hello! I'm your assistant for Shree Manjunatha Engineering Works.\n\nAsk me about our services, materials, pricing, or how to get a free quote. How can I help you today?",
      },
    ]);
  }, []);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, loading]);

  function toggle() {
    setOpen((o) => !o);
    setNotifVisible(false);
    setTimeout(() => inputRef.current?.focus(), 300);
  }

  async function send(preset?: string) {
    const text = (preset ?? input).trim();
    if (!text || loading) return;
    setInput("");
    if (!chipsHidden) setChipsHidden(true);

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const intent = matchIntent(text);
    if (intent) {
      setMessages((prev) => [...prev, { role: "bot", content: intent.reply }]);
      setLoading(false);
      return;
    }

    try {
      const history = [...messages, userMsg];
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...history.slice(-8).map((m) => ({
              role: m.role === "bot" ? "assistant" : "user",
              content: m.content,
            })),
          ],
        }),
      });
      const data = await res.json() as { reply?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "API error");
      setMessages((prev) => [...prev, { role: "bot", content: data.reply! }]);
    } catch (err) {
      console.error("[ChatWidget] API error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "I couldn't process that right now. Please call us at 9986464819 or WhatsApp +91 9986464819 — we're happy to help!",
        },
      ]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Bubble button */}
      <button
        onClick={toggle}
        aria-label="Open chat assistant"
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          width: 62,
          height: 62,
          borderRadius: "50%",
          background: GOLD,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 24px rgba(184,134,11,0.4)",
          zIndex: 9999,
          transition: "transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 10px 32px rgba(184,134,11,0.5)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(184,134,11,0.4)";
        }}
      >
        {notifVisible && (
          <div
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: GOLD,
              border: "2px solid #fff",
              fontSize: 8,
              fontWeight: 700,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            1
          </div>
        )}
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="white" opacity="0.9" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      <div
        style={{
          position: "fixed",
          bottom: 104,
          right: 28,
          width: 368,
          height: 560,
          background: "#fff",
          borderRadius: 16,
          boxShadow: `0 24px 64px rgba(0,0,0,0.18), 0 0 0 1px ${BORDER}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 9998,
          transform: open ? "scale(1) translateY(0)" : "scale(0.85) translateY(20px)",
          transformOrigin: "bottom right",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
          transition: "transform 0.3s cubic-bezier(.34,1.4,.64,1), opacity 0.25s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: DARK,
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <img src="/smew-logo.png" alt="SMEW" width={36} height={36} style={{ objectFit: "contain" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.2px",
              }}
            >
              SMEW Assistant
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                marginTop: 2,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#4ade80",
                  display: "inline-block",
                  animation: "smew-blink 2s infinite",
                }}
              />
              Online · Ready to help
            </div>
          </div>
          <button
            onClick={toggle}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.8)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div
          ref={msgsRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            background: "#f8f7f4",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-end",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                animation: "smew-slide-up 0.25s ease forwards",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 9,
                  fontWeight: 700,
                  fontFamily: "Syne, sans-serif",
                  background: msg.role === "bot" ? DARK : "#e8d89a",
                  color: msg.role === "bot" ? "#fff" : DARK,
                  border: `2px solid ${BORDER}`,
                }}
              >
                {msg.role === "bot" ? "AI" : "You"}
              </div>
              <div
                style={{
                  maxWidth: "78%",
                  padding: "10px 14px",
                  borderRadius: 14,
                  fontSize: 13,
                  lineHeight: 1.65,
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  background: msg.role === "bot" ? "#fff" : DARK,
                  color: msg.role === "bot" ? "#1a1a1a" : "#fff",
                  border: msg.role === "bot" ? `1px solid ${BORDER}` : "none",
                  borderBottomLeftRadius: msg.role === "bot" ? 4 : 14,
                  borderBottomRightRadius: msg.role === "user" ? 4 : 14,
                  boxShadow: msg.role === "bot" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: DARK,
                  border: `2px solid ${BORDER}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "Syne, sans-serif",
                  flexShrink: 0,
                }}
              >
                AI
              </div>
              <div
                style={{
                  background: "#fff",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 14,
                  borderBottomLeftRadius: 4,
                  padding: "12px 16px",
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                {[0, 1, 2].map((j) => (
                  <div
                    key={j}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#aaa",
                      animation: `smew-bounce 1.2s infinite ${j * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick chips */}
        {!chipsHidden && (
          <div
            style={{
              padding: "10px 16px 12px",
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              background: "#f8f7f4",
              borderTop: `1px solid ${BORDER}`,
            }}
          >
            {[
              "Our Services",
              "Get a Quote",
              "Materials Used",
              "How long does it take?",
              "Contact & Hours",
              "Custom Orders",
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => send(chip)}
                style={{
                  background: "#fff",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 20,
                  padding: "5px 12px",
                  fontSize: 11.5,
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 500,
                  color: DARK,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.18s",
                }}
                onMouseEnter={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background = DARK;
                  b.style.color = "#fff";
                  b.style.borderColor = DARK;
                }}
                onMouseLeave={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background = "#fff";
                  b.style.color = DARK;
                  b.style.borderColor = BORDER;
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input bar */}
        <div
          style={{
            padding: "12px 14px",
            borderTop: `1px solid ${BORDER}`,
            background: "#fff",
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) send();
            }}
            placeholder="Ask about gates, grills, pricing…"
            disabled={loading}
            style={{
              flex: 1,
              background: "#f8f7f4",
              border: `1.5px solid ${BORDER}`,
              borderRadius: 22,
              padding: "9px 15px",
              fontSize: 13,
              color: DARK,
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
              fontFamily: "DM Sans, sans-serif",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = GOLD;
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(184,134,11,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = BORDER;
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "none",
              background: input.trim() && !loading ? DARK : BORDER,
              color: "#fff",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              if (input.trim() && !loading)
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            padding: "6px 0 10px",
            fontSize: 10,
            fontFamily: "Syne, sans-serif",
            color: "#aaa",
            background: "#fff",
          }}
        >
          Shree Manjunatha Engineering Works · Mysore
        </div>
      </div>

      <style>{`
        @keyframes smew-blink { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes smew-bounce {
          0%,60%,100% { transform:translateY(0); }
          30% { transform:translateY(-5px); }
        }
        @keyframes smew-slide-up {
          from { opacity:0; transform:translateY(8px); }
          to { opacity:1; transform:translateY(0); }
        }
        @media (max-width: 420px) {
          /* panel and bubble are positioned fixed; width adjusts below */
        }
      `}</style>
    </>
  );
}
