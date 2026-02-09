// src/app/api/fake-bot/route.ts
import { NextResponse } from "next/server";

type BotResponse = { reply: string; suggestions?: string[] };

const CONTACT = {
  whatsappNumber: "+267 78 768 259",
  whatsappChannel:
    "https://whatsapp.com/channel/0029Vb6s2BE3LdQZJGmxQf1W",
};

const PATHS = {
  phones: "/c/phones",
  laptops: "/c/laptops",
  gadgets: "/c/gadgets",
  clothing: "/c/clothing",
  shoes: "/c/shoes",
  deals: "/deals",
};

const SUGG = {
  PHONES: "Phones",
  LAPTOPS: "Laptops",
  GADGETS: "Gadgets",
  CLOTHING_SHOES: "Clothing & Shoes",
  HOW: "How to order",
  ORDER: "Order on WhatsApp",
  CHANNEL: "WhatsApp Channel",
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
    "Hey 👋 Welcome to iHub.",
    "Hi there 👋 You’re chatting with iHub.",
    "Welcome! iHub can help you with prices and orders.",
  ],
  order: [
    "To order: browse prices, then tap “Order on WhatsApp” and send your list. iHub will confirm availability + delivery + payment.",
    "Ordering is easy: choose items, then message iHub on WhatsApp with the model + storage + color (and your location).",
  ],
  categories: [
    `We stock phones (iPhone, Samsung, Redmi/Xiaomi), laptops, and gadgets.\nWe also order clothing and shoes on request.`,
    "Phones, laptops, and gadgets are available — and we can also order clothing/shoes if you send details or a photo.",
  ],
  pricing: [
    "Tell me the exact model (e.g. iPhone 13 128GB / Samsung A15) and I’ll guide you to the right section and ordering steps.",
    "Which model are you looking for? (brand + model + storage) — I’ll help you place the order.",
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
    matchers: [/\b(hello|hi|hey|sup|morning|afternoon|evening)\b/, /\b(start|help|menu)\b/],
    respond: () => {
      memory.greeted = true;
      return reply(
        `${pick(tone.greet)}\nWhat are you looking for today?`,
        [SUGG.PHONES, SUGG.LAPTOPS, SUGG.GADGETS, SUGG.CLOTHING_SHOES, SUGG.ORDER]
      );
    },
  },
  {
    name: "phones",
    weight: 3,
    matchers: [/\b(phone|iphone|samsung|redmi|xiaomi|infinix|tecno|huawei)\b/],
    respond: () =>
      reply(
        `${pick(tone.pricing)}\nYou can also browse here: ${PATHS.phones}`,
        [SUGG.PHONES, SUGG.ORDER, SUGG.DEALS, SUGG.CHANNEL]
      ),
  },
  {
    name: "laptops",
    weight: 3,
    matchers: [/\b(laptop|macbook|hp|dell|lenovo|asus|acer)\b/],
    respond: () =>
      reply(
        `Nice — laptops are here: ${PATHS.laptops}\nTell me the brand + size + budget and I’ll help you order.`,
        [SUGG.LAPTOPS, SUGG.ORDER, SUGG.DEALS, SUGG.CHANNEL]
      ),
  },
  {
    name: "gadgets",
    weight: 2,
    matchers: [/\b(gadget|airpods|earbuds|headphones|watch|smartwatch|speaker|charger|power bank|cable)\b/],
    respond: () =>
      reply(
        `Gadgets are here: ${PATHS.gadgets}\nTell me what you need and I’ll guide the order message.`,
        [SUGG.GADGETS, SUGG.ORDER, SUGG.CHANNEL]
      ),
  },
  {
    name: "clothing_shoes",
    weight: 2,
    matchers: [/\b(clothing|clothes|shirt|hoodie|pants|jeans|dress|shoe|shoes|sneaker|nike|adidas|puma|converse)\b/],
    respond: () =>
      reply(
        `For clothing/shoes, send: size, color, brand (if any), and budget. If you have a photo/link, even better.\nWant to order now?`,
        [SUGG.ORDER, SUGG.CLOTHING_SHOES, SUGG.CHANNEL]
      ),
  },
  {
    name: "order",
    weight: 3,
    matchers: [/\b(order|buy|purchase|deliver|delivery|whatsapp|payment|pay)\b/],
    respond: () =>
      reply(
        `${pick(tone.order)}\nWhatsApp: ${CONTACT.whatsappNumber}\nChannel: ${CONTACT.whatsappChannel}`,
        [SUGG.ORDER, SUGG.HOW, SUGG.CHANNEL]
      ),
  },
  {
    name: "deals",
    weight: 2,
    matchers: [/\b(deal|deals|discount|sale|promo|special)\b/],
    respond: () =>
      reply(`Check deals here: ${PATHS.deals}`, [SUGG.DEALS, SUGG.ORDER, SUGG.CHANNEL]),
  },
  {
    name: "browse",
    weight: 2,
    matchers: [/\b(browse|categories|what do you sell|what do you have|stock)\b/],
    respond: () =>
      reply(`${pick(tone.categories)}`, [SUGG.PHONES, SUGG.LAPTOPS, SUGG.GADGETS, SUGG.CLOTHING_SHOES]),
  },
];

const FALLBACK = () =>
  reply(
    pick([
      "Tell me the exact item/model you want (brand + model + storage/size) and I’ll help you order.",
      "If it’s not listed, you can still order — describe it and I’ll help you message iHub.",
      `You can also order directly on WhatsApp: ${CONTACT.whatsappNumber}`,
    ]),
    [SUGG.PHONES, SUGG.LAPTOPS, SUGG.GADGETS, SUGG.ORDER, SUGG.CHANNEL]
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
        SUGG.PHONES,
        SUGG.LAPTOPS,
        SUGG.GADGETS,
        SUGG.CLOTHING_SHOES,
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
