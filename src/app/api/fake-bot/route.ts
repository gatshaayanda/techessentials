// src/app/api/fake-bot/route.ts
import { NextResponse } from "next/server";

type BotResponse = { reply: string; suggestions?: string[] };

const CONTACT = {
  whatsappNumber: "+267 72 545 765",
  facebookPrimary: "https://www.facebook.com/techessentialz/",
  facebookSecondary: "https://www.facebook.com/techessentialsbw/",
};

const PATHS = {
  pos: "/c/pos",
  scales: "/c/scales",
  cctv: "/c/cctv",
  printers: "/c/printers",
  accessories: "/c/accessories",
};

const SUGG = {
  POS: "POS Systems",
  SCALES: "Scales",
  CCTV: "CCTV Packages",
  PRINTERS: "Receipt Printers",
  ACCESSORIES: "Accessories",
  QUOTE: "Request a Quote",
  FB: "Facebook (techessentialz)",
  FB_ALT: "Facebook (techessentialsbw)",
} as const;

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const reply = (text: string, suggestions?: string[]): BotResponse => ({
  reply: text.trim(),
  suggestions,
});

const normalize = (s: unknown): string =>
  (String(s ?? "") || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const includesAny = (s: string, pats: (string | RegExp)[]) =>
  pats.some((p) => (p instanceof RegExp ? p.test(s) : s.includes(p)));

const DEFAULT_SUGG = [
  SUGG.POS,
  SUGG.SCALES,
  SUGG.CCTV,
  SUGG.PRINTERS,
  SUGG.ACCESSORIES,
  SUGG.QUOTE,
] as const;

// Phrase pools
const tone = {
  greet: [
    "Hi 👋 Welcome to Tech Essentials.",
    "Hello 👋 Tech Essentials here.",
    "Welcome! I can help with POS, scales, CCTV packages, and accessories.",
  ],
  order: [
    "To request a quote: tell us what you need, quantity, and your location. We’ll confirm availability, delivery/installation, and payment on WhatsApp.",
    "Ordering is simple: pick your package/item, share quantity + location, and we’ll confirm delivery/installation and price on WhatsApp.",
  ],
  categories: [
    "We supply POS systems, price computing scales, CCTV packages, receipt printers, and accessories.",
    "POS • Scales • CCTV • Printers • Accessories — tell me what you need and I’ll guide you.",
  ],
  pricing: [
    "Tell me what you need (e.g. POS + printer, scale with pole display, 4-camera CCTV) and I’ll guide you to the right section.",
    "Which package are you looking for — POS, scale, CCTV, or printer? I’ll guide you to the right option.",
  ],
  install: [
    "For CCTV installation, tell me: number of cameras, indoor/outdoor, and your location.",
    "If you want installation, share your location and the setup (home/shop, rooms/areas, indoor/outdoor).",
  ],
};

// Intents
type Intent = {
  name: string;
  weight: number;
  matchers: (string | RegExp)[];
  respond: (text: string) => BotResponse;
};

const INTENTS: Intent[] = [
  {
    name: "greeting",
    weight: 3,
    matchers: [
      /\b(hello|hi|hey|sup|morning|afternoon|evening)\b/,
      /\b(start|help|menu)\b/,
    ],
    respond: () =>
      reply(`${pick(tone.greet)}\nWhat do you need today?`, [...DEFAULT_SUGG]),
  },

  {
    name: "pos",
    weight: 3,
    matchers: [
      /\b(pos|point of sale|till|cashier|cash register|billing|shop system)\b/,
      /\b(supermarket|tuckshop|general dealer|butchery|restaurant|bar)\b/,
    ],
    respond: () =>
      reply(
        `${pick(tone.pricing)}\nBrowse POS options here: ${PATHS.pos}`,
        [SUGG.POS, SUGG.QUOTE, SUGG.FB, SUGG.FB_ALT]
      ),
  },

  {
    name: "scales",
    weight: 3,
    matchers: [
      /\b(scale|scales|weighing|weight|price computing|label scale)\b/,
      /\b(butchery|meat|deli|vegetable|produce)\b/,
    ],
    respond: () =>
      reply(
        `Scales are here: ${PATHS.scales}\nTell me if you need a pole display + your budget.`,
        [SUGG.SCALES, SUGG.QUOTE, SUGG.FB, SUGG.FB_ALT]
      ),
  },

  {
    name: "cctv",
    weight: 3,
    matchers: [
      /\b(cctv|camera|cameras|dvr|nvr|hikvision|dahua|colorvu|colourvu|night vision|security)\b/,
      /\b(install|installation|mount|setup|configure)\b/,
    ],
    respond: () =>
      reply(
        `CCTV packages are here: ${PATHS.cctv}\n${pick(tone.install)}`,
        [SUGG.CCTV, SUGG.QUOTE, SUGG.FB, SUGG.FB_ALT]
      ),
  },

  {
    name: "printers",
    weight: 2,
    matchers: [
      /\b(printer|receipt printer|thermal|pos printer)\b/,
      /\b(barcode scanner|scanner|cash drawer|label printer)\b/,
    ],
    respond: () =>
      reply(
        `Printers are here: ${PATHS.printers}\nTell me what POS you’re using and I’ll guide compatibility.`,
        [SUGG.PRINTERS, SUGG.ACCESSORIES, SUGG.QUOTE, SUGG.FB]
      ),
  },

  {
    name: "accessories",
    weight: 2,
    matchers: [
      /\b(accessory|accessories|cable|hdmi|power|adapter|router|switch)\b/,
      /\b(scanner|cash drawer|keyboard|mouse|monitor)\b/,
    ],
    respond: () =>
      reply(
        `Accessories are here: ${PATHS.accessories}\nTell me what you need + quantity.`,
        [SUGG.ACCESSORIES, SUGG.QUOTE, SUGG.FB, SUGG.FB_ALT]
      ),
  },

  {
    name: "quote_order",
    weight: 3,
    matchers: [/\b(order|buy|purchase|deliver|delivery|whatsapp|payment|pay|quote|price)\b/],
    respond: () =>
      reply(
        `${pick(tone.order)}\nWhatsApp: ${CONTACT.whatsappNumber}\nFacebook: ${CONTACT.facebookPrimary}`,
        [SUGG.QUOTE, ...DEFAULT_SUGG.slice(0, 3), SUGG.FB, SUGG.FB_ALT]
      ),
  },

  {
    name: "browse",
    weight: 2,
    matchers: [/\b(browse|categories|what do you sell|what do you have|stock)\b/],
    respond: () => reply(pick(tone.categories), [...DEFAULT_SUGG, SUGG.FB]),
  },
];

const FALLBACK = () =>
  reply(
    pick([
      "Tell me what you need (POS / scale / CCTV) plus quantity, budget, and location — I’ll guide you.",
      "If you’re not sure which package fits, tell me your business type (tuckshop, butchery, restaurant) and I’ll advise what to request.",
      `You can request a quote directly on WhatsApp: ${CONTACT.whatsappNumber}`,
    ]),
    [...DEFAULT_SUGG, SUGG.FB, SUGG.FB_ALT]
  );

function detectIntent(text: string): Intent | null {
  const scores = INTENTS.map((intent) => {
    const hits = intent.matchers.reduce(
      (acc, m) => (includesAny(text, [m]) ? acc + 1 : acc),
      0
    );
    return { intent, score: hits * intent.weight };
  });
  scores.sort((a, b) => b.score - a.score);
  const top = scores[0];
  return top && top.score > 0 ? top.intent : null;
}

export async function POST(req: Request) {
  let text = "";
  try {
    const body = await req.json();
    text = normalize(body?.message);
  } catch {}

  if (!text) {
    return NextResponse.json(
      reply(`${pick(tone.greet)}\nWhat are you looking for?`, [...DEFAULT_SUGG, SUGG.FB])
    );
  }

  const intent = detectIntent(text);
  if (intent) return NextResponse.json(intent.respond(text));

  return NextResponse.json(FALLBACK());
}
