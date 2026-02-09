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
  deals: "/deals",
};

const SUGG = {
  POS: "POS Systems",
  SCALES: "Scales",
  CCTV: "CCTV Packages",
  PRINTERS: "Receipt Printers",
  ACCESSORIES: "Accessories",
  HOW: "How to order",
  ORDER: "Order on WhatsApp",
  FB: "Facebook Page",
  FB_ALT: "Facebook (Alt)",
  DEALS: "Deals",
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

let memory: { greeted?: boolean; lastIntent?: string } = {};

// Phrase pools
const tone = {
  greet: [
    "Hey 👋 Welcome to Tech Essentials.",
    "Hi there 👋 You’re chatting with Tech Essentials.",
    "Welcome! I can help you with POS, scales, CCTV packages, and how to order on WhatsApp.",
  ],
  order: [
    "To order: browse packages/prices, then tap “Order on WhatsApp” and send your list. We’ll confirm availability, delivery/installation, and payment.",
    "Ordering is simple: tell us the package/item you want, quantity, and your location. If it’s CCTV, mention number of cameras + installation required.",
  ],
  categories: [
    "We supply POS systems, price computing scales, CCTV packages, and business accessories (printers, scanners, cables, etc.).",
    "POS • Scales • CCTV • Printers • Accessories — tell me what you need and I’ll guide you to the right section.",
  ],
  pricing: [
    "Tell me what you need (e.g. POS + printer, scale with pole display, 4-camera CCTV) and I’ll guide you to the right section and ordering steps.",
    "Which package are you looking for — POS, scale, CCTV, or printer? I’ll help you place the order.",
  ],
  install: [
    "For installation, share your location and a quick note about the shop/home setup (indoor/outdoor cameras, number of rooms, etc.).",
    "If you want CCTV installed, tell me: number of cameras, indoor/outdoor, and your location — we’ll advise the best package.",
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
    respond: () => {
      memory.greeted = true;
      return reply(`${pick(tone.greet)}\nWhat do you need today?`, [
        SUGG.POS,
        SUGG.SCALES,
        SUGG.CCTV,
        SUGG.PRINTERS,
        SUGG.ORDER,
      ]);
    },
  },
  {
    name: "pos",
    weight: 3,
    matchers: [
      /\b(pos|point of sale|till|cashier|cash register|billing|shop system)\b/,
      /\b(supermarket|tuckshop|general dealer|butchery|restaurant|bar|liquor)\b/,
    ],
    respond: () =>
      reply(
        `${pick(tone.pricing)}\nBrowse POS options here: ${PATHS.pos}`,
        [SUGG.POS, SUGG.ORDER, SUGG.DEALS, SUGG.FB]
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
        `Scales are here: ${PATHS.scales}\nTell me if you need a pole display and your budget.`,
        [SUGG.SCALES, SUGG.ORDER, SUGG.DEALS, SUGG.FB]
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
        [SUGG.CCTV, SUGG.ORDER, SUGG.HOW, SUGG.FB]
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
        `Printers & accessories are here: ${PATHS.printers}\nTell me what POS you’re using and I’ll guide compatibility.`,
        [SUGG.PRINTERS, SUGG.ACCESSORIES, SUGG.ORDER, SUGG.FB]
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
        `Accessories are here: ${PATHS.accessories}\nTell me what you need and quantity.`,
        [SUGG.ACCESSORIES, SUGG.ORDER, SUGG.DEALS, SUGG.FB]
      ),
  },
  {
    name: "order",
    weight: 3,
    matchers: [/\b(order|buy|purchase|deliver|delivery|whatsapp|payment|pay|quote|price)\b/],
    respond: () =>
      reply(
        `${pick(tone.order)}\nWhatsApp: ${CONTACT.whatsappNumber}\nFacebook: ${CONTACT.facebookPrimary}`,
        [SUGG.ORDER, SUGG.HOW, SUGG.FB, SUGG.FB_ALT]
      ),
  },
  {
    name: "deals",
    weight: 2,
    matchers: [/\b(deal|deals|discount|sale|promo|special)\b/],
    respond: () =>
      reply(`Check deals here: ${PATHS.deals}`, [
        SUGG.DEALS,
        SUGG.ORDER,
        SUGG.FB,
      ]),
  },
  {
    name: "browse",
    weight: 2,
    matchers: [/\b(browse|categories|what do you sell|what do you have|stock)\b/],
    respond: () =>
      reply(`${pick(tone.categories)}`, [
        SUGG.POS,
        SUGG.SCALES,
        SUGG.CCTV,
        SUGG.PRINTERS,
        SUGG.ACCESSORIES,
      ]),
  },
];

const FALLBACK = () =>
  reply(
    pick([
      "Tell me what you need (POS / scale / CCTV) and any details (qty, budget, location) — I’ll guide you to the right package.",
      "If you’re not sure which package fits, tell me your business type (tuckshop, butchery, restaurant) and I’ll recommend what to ask for on WhatsApp.",
      `You can also order directly on WhatsApp: ${CONTACT.whatsappNumber}`,
    ]),
    [SUGG.POS, SUGG.SCALES, SUGG.CCTV, SUGG.ORDER, SUGG.FB]
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
      reply(`${pick(tone.greet)}\nWhat are you looking for?`, [
        SUGG.POS,
        SUGG.SCALES,
        SUGG.CCTV,
        SUGG.PRINTERS,
        SUGG.ORDER,
      ])
    );
  }

  const intent = detectIntent(text);
  if (intent) {
    memory.lastIntent = intent.name;
    return NextResponse.json(intent.respond(text));
  }

  return NextResponse.json(FALLBACK());
}
