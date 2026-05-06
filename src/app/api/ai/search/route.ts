import { NextResponse } from "next/server";
import { claude, CLAUDE_MODEL, SEARCH_SYSTEM_PROMPT } from "@/lib/claude";
import { parseSearchQueryFallback, type SearchFilter } from "@/lib/ai-helpers";
import { SAMPLE_PRODUCTS } from "@/lib/sample-products";
import type { Product } from "@/types/database";

export const dynamic = "force-dynamic";

interface SearchRequestBody {
  query: string;
}

function applyFilter(filter: SearchFilter, products: Product[]): Product[] {
  return products.filter((p) => {
    if (filter.category && p.category !== filter.category) return false;
    if (filter.scale && p.scale !== filter.scale) return false;
    if (filter.brand) {
      const target = filter.brand.toLowerCase();
      const brand = (p.brand ?? "").toLowerCase();
      const name = p.name.toLowerCase();
      if (!brand.includes(target) && !name.includes(target)) return false;
    }
    if (filter.minPrice !== null && p.price < filter.minPrice) return false;
    if (filter.maxPrice !== null && p.price > filter.maxPrice) return false;
    if (filter.limitedOnly && !p.is_limited_edition) return false;
    if (filter.keywords.length > 0) {
      const haystack = `${p.name} ${p.description ?? ""}`.toLowerCase();
      const allMatch = filter.keywords.every((k) =>
        haystack.includes(k.toLowerCase())
      );
      if (!allMatch) return false;
    }
    return true;
  });
}

function normaliseFilter(raw: Partial<SearchFilter> | null | undefined): SearchFilter {
  return {
    category: raw?.category ?? null,
    scale: raw?.scale ?? null,
    brand: raw?.brand ?? null,
    minPrice:
      typeof raw?.minPrice === "number" && !Number.isNaN(raw.minPrice)
        ? raw.minPrice
        : null,
    maxPrice:
      typeof raw?.maxPrice === "number" && !Number.isNaN(raw.maxPrice)
        ? raw.maxPrice
        : null,
    limitedOnly: Boolean(raw?.limitedOnly),
    keywords: Array.isArray(raw?.keywords)
      ? raw.keywords.filter((k): k is string => typeof k === "string")
      : [],
  };
}

function extractJSON(text: string): unknown {
  // Strip code fences if present and grab the first JSON-ish block.
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fence ? fence[1] : text).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON object found");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

export async function POST(request: Request) {
  let body: SearchRequestBody;
  try {
    body = (await request.json()) as SearchRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const query = typeof body?.query === "string" ? body.query.trim() : "";
  if (!query) {
    return NextResponse.json(
      { error: "query is required" },
      { status: 400 }
    );
  }

  let filter: SearchFilter;

  if (!claude) {
    filter = parseSearchQueryFallback(query);
  } else {
    try {
      const response = await claude.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 300,
        system: SEARCH_SYSTEM_PROMPT,
        messages: [{ role: "user", content: query }],
      });
      const textBlock = response.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        filter = parseSearchQueryFallback(query);
      } else {
        try {
          const parsed = extractJSON(textBlock.text) as Partial<SearchFilter>;
          filter = normaliseFilter(parsed);
        } catch {
          filter = parseSearchQueryFallback(query);
        }
      }
    } catch {
      filter = parseSearchQueryFallback(query);
    }
  }

  const products = applyFilter(filter, SAMPLE_PRODUCTS);

  return NextResponse.json({ filter, products });
}
