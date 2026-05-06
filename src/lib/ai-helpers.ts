// AI helper utilities used by the Claude-backed API routes.
// Provides regex fallbacks for the search parser, simple keyword-driven
// chat replies, and a generic random-pick utility for recommendations.

import type { ProductCategory, ProductScale } from "@/types/database";

export interface SearchFilter {
  category: ProductCategory | null;
  scale: ProductScale | null;
  brand: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  limitedOnly: boolean;
  keywords: string[];
}

const KNOWN_BRANDS = [
  "Bburago",
  "Minichamps",
  "Herpa Wings",
  "Hobby Master",
  "Tekno",
  "Eligor",
  "Maisto",
  "AutoArt",
  "Italeri",
  "BMW",
  "Porsche",
  "Lamborghini",
  "Ferrari",
  "Bugatti",
  "Mercedes",
  "Mercedes-Benz",
  "Audi",
  "Volvo",
  "Scania",
  "Ducati",
  "Harley-Davidson",
  "Honda",
  "Yamaha",
  "Boeing",
  "Airbus",
];

const SCALES: ProductScale[] = ["1:64", "1:43", "1:24", "1:18", "1:12"];

const CATEGORY_KEYWORDS: Record<ProductCategory, string[]> = {
  cars: ["car", "cars", "auto", "supercar", "hypercar", "sedan", "coupe"],
  planes: ["plane", "planes", "aircraft", "jet", "airliner", "fighter"],
  trucks: ["truck", "trucks", "lorry", "tractor", "semi", "rig"],
  bikes: ["bike", "bikes", "motorcycle", "motorbike", "superbike", "cruiser"],
};

export function parseSearchQueryFallback(query: string): SearchFilter {
  const q = query.toLowerCase();

  // Category
  let category: ProductCategory | null = null;
  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS) as [
    ProductCategory,
    string[],
  ][]) {
    if (words.some((w) => q.includes(w))) {
      category = cat;
      break;
    }
  }

  // Scale
  let scale: ProductScale | null = null;
  for (const s of SCALES) {
    if (q.includes(s)) {
      scale = s;
      break;
    }
  }

  // Brand
  let brand: string | null = null;
  for (const b of KNOWN_BRANDS) {
    if (q.includes(b.toLowerCase())) {
      brand = b;
      break;
    }
  }

  // Price patterns
  let minPrice: number | null = null;
  let maxPrice: number | null = null;
  const underMatch = q.match(/under\s+(\d+(?:\.\d+)?)/);
  const belowMatch = q.match(/below\s+(\d+(?:\.\d+)?)/);
  const overMatch = q.match(/over\s+(\d+(?:\.\d+)?)/);
  const aboveMatch = q.match(/above\s+(\d+(?:\.\d+)?)/);
  const lessThanMatch = q.match(/less\s+than\s+(\d+(?:\.\d+)?)/);
  const moreThanMatch = q.match(/more\s+than\s+(\d+(?:\.\d+)?)/);
  const betweenMatch = q.match(
    /between\s+(\d+(?:\.\d+)?)\s+(?:and|to|-)\s+(\d+(?:\.\d+)?)/
  );

  if (betweenMatch) {
    minPrice = parseFloat(betweenMatch[1]);
    maxPrice = parseFloat(betweenMatch[2]);
  } else {
    if (underMatch) maxPrice = parseFloat(underMatch[1]);
    else if (belowMatch) maxPrice = parseFloat(belowMatch[1]);
    else if (lessThanMatch) maxPrice = parseFloat(lessThanMatch[1]);
    if (overMatch) minPrice = parseFloat(overMatch[1]);
    else if (aboveMatch) minPrice = parseFloat(aboveMatch[1]);
    else if (moreThanMatch) minPrice = parseFloat(moreThanMatch[1]);
  }

  // Limited
  const limitedOnly =
    q.includes("limited") || q.includes("rare") || q.includes("numbered");

  // Keywords (residual nouns we recognise)
  const keywordCandidates = [
    "vintage",
    "classic",
    "racing",
    "track",
    "carbon",
    "stealth",
    "fighter",
    "cruiser",
    "supersonic",
    "chrome",
  ];
  const keywords = keywordCandidates.filter((k) => q.includes(k));

  return { category, scale, brand, minPrice, maxPrice, limitedOnly, keywords };
}

export function pickRandom<T>(arr: T[], n: number): T[] {
  if (n >= arr.length) return [...arr];
  const pool = [...arr];
  const out: T[] = [];
  while (out.length < n && pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

export function keywordCannedReply(message: string): string {
  const m = message.toLowerCase();

  if (m.includes("shipping") || m.includes("delivery") || m.includes("ship")) {
    return "We ship across Oman within 2 to 3 business days, with complimentary delivery on orders over OMR 50.000. GCC orders typically arrive within 5 to 7 business days. Each piece travels in protective foam packaging to preserve its mint finish.";
  }

  if (m.includes("return") || m.includes("refund") || m.includes("exchange")) {
    return "You may return any model within 14 days of receipt, provided it remains in mint, unopened condition with the certificate intact. We will arrange collection and refund the full purchase price.";
  }

  if (m.includes("limited") || m.includes("rare") || m.includes("numbered")) {
    return "Our limited editions are individually numbered and accompanied by a certificate of authenticity. Current highlights include the Porsche 911 GT3 RS Weissach Pkg, the Bugatti Chiron Super Sport 300+, and the Concorde in retired Air France livery. Most exist in runs of fewer than 500 pieces.";
  }

  if (m.includes("scale")) {
    return "We curate five principal scales: 1:64 for desk-top vignettes, 1:43 for collectors' shelves, 1:24 and 1:18 for display centrepieces, and 1:12 for hero pieces. The larger the second number, the larger the model. Most enthusiasts begin at 1:18 — the sweet spot of detail and proportion.";
  }

  if (m.includes("price") || m.includes("cost") || m.includes("how much")) {
    return "Our collection ranges from approachable pieces near OMR 28.000 up to flagship hypercars and limited editions exceeding OMR 240.000. Prices reflect manufacturer, scale, and rarity. I'd be glad to suggest options within a specific budget — what range did you have in mind?";
  }

  if (m.includes("authentic") || m.includes("certificate") || m.includes("genuine")) {
    return "Every model in our catalogue is sourced directly from authorised manufacturers. Limited and sealed pieces ship with a certificate of authenticity, often individually numbered. We do not stock replicas or grey-market reproductions.";
  }

  if (m.includes("brand") || m.includes("manufacturer")) {
    return "We curate established names: AutoArt, Minichamps, Bburago, Maisto, Herpa Wings for aviation, Tekno and Eligor for trucks, plus select premium pieces from Italeri and Hobby Master. Is there a brand you collect, or shall I suggest a starting point?";
  }

  if (m.includes("hello") || m.includes("hi ") || m === "hi" || m.includes("hey")) {
    return "Welcome to Diecast Muscat. I can help you discover models by brand, scale, or theme — from 1:64 desk pieces to 1:12 centrepiece bikes. What kind of collection are you building?";
  }

  return "I'd be glad to help. Tell me a little more — are you drawn to a particular category (cars, planes, trucks, bikes), a scale, or a specific marque? I can also point you toward our limited editions or recent arrivals.";
}
