// Sample product data for development before Supabase is wired up.
// Replace by querying the `products` table once the database is provisioned.

import type { Product } from "@/types/database";

const NOW = new Date().toISOString();

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1a2b3c4d-0001",
    name: "Lamborghini Aventador SVJ",
    description:
      "The pinnacle of Italian engineering captured in 1:18 scale. Hand-finished metallic paint, working scissor doors, detailed V12 engine bay, and authentic Pirelli P Zero tyres.",
    category: "cars",
    scale: "1:18",
    brand: "Bburago",
    price: 78.5,
    stock: 4,
    sku: "BB-AVNT-SVJ-118",
    images: ["https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1200&q=80"],
    features: { doors_open: true, hood_opens: true, steerable: true, certificate: true },
    is_limited_edition: false,
    is_featured: true,
    condition: "mint",
    rating: 4.8,
    review_count: 24,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "1a2b3c4d-0002",
    name: "Porsche 911 GT3 RS — Weissach Pkg",
    description:
      "Limited edition rendering of the track-focused 992-generation 911 GT3 RS. Carbon-effect aero, opening engine cover, micrometric detailing.",
    category: "cars",
    scale: "1:18",
    brand: "Minichamps",
    price: 165.0,
    stock: 2,
    sku: "MC-911-GT3RS-118",
    images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80"],
    features: { doors_open: true, hood_opens: true, certificate: true, numbered: "0042/0500" },
    is_limited_edition: true,
    is_featured: true,
    condition: "sealed",
    rating: 5.0,
    review_count: 9,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "1a2b3c4d-0003",
    name: "Boeing 747-8 Lufthansa",
    description:
      "Commercial aviation icon in 1:200 scale. Authentic Lufthansa livery, retractable landing gear, removable engines.",
    category: "planes",
    scale: "1:18",
    brand: "Herpa Wings",
    price: 92.0,
    stock: 6,
    sku: "HW-747-LH-1200",
    images: ["https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80"],
    features: { gear_retracts: true, stand_included: true },
    is_limited_edition: false,
    is_featured: true,
    condition: "mint",
    rating: 4.6,
    review_count: 18,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "1a2b3c4d-0004",
    name: "F-22 Raptor Stealth Fighter",
    description:
      "USAF air superiority fighter in detailed 1:72 scale. Removable canopy, articulating thrust-vector nozzles, weapons bay opens.",
    category: "planes",
    scale: "1:24",
    brand: "Hobby Master",
    price: 58.0,
    stock: 8,
    sku: "HM-F22-172",
    images: ["https://images.unsplash.com/photo-1583373834259-46cc92173cb7?w=1200&q=80"],
    features: { canopy_opens: true, weapons_bay: true, decals_applied: true },
    is_limited_edition: false,
    is_featured: false,
    condition: "mint",
    rating: 4.7,
    review_count: 11,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "1a2b3c4d-0005",
    name: "Volvo FH16 Globetrotter Reefer",
    description:
      "European long-haul tractor with detailed cabin interior, articulating fifth wheel, working refrigerated trailer.",
    category: "trucks",
    scale: "1:43",
    brand: "Tekno",
    price: 124.0,
    stock: 3,
    sku: "TK-VOLVO-FH16-143",
    images: ["https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80"],
    features: { trailer_articulates: true, cabin_tilts: true },
    is_limited_edition: true,
    is_featured: true,
    condition: "sealed",
    rating: 4.9,
    review_count: 6,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "1a2b3c4d-0006",
    name: "Mercedes-Benz Actros 5",
    description:
      "Modern flagship truck with photorealistic livery, detailed Stage V engine, working air suspension.",
    category: "trucks",
    scale: "1:43",
    brand: "Eligor",
    price: 95.0,
    stock: 5,
    sku: "EL-ACTROS5-143",
    images: ["https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=1200&q=80"],
    features: { air_suspension: true, doors_open: true },
    is_limited_edition: false,
    is_featured: false,
    condition: "mint",
    rating: 4.5,
    review_count: 14,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "1a2b3c4d-0007",
    name: "Ducati Panigale V4 R",
    description:
      "Track-focused superbike rendering with carbon fiber details, working suspension, removable race fairings.",
    category: "bikes",
    scale: "1:12",
    brand: "Maisto",
    price: 42.0,
    stock: 12,
    sku: "MS-DUC-V4R-112",
    images: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=80"],
    features: { suspension_works: true, kick_stand: true, removable_fairings: true },
    is_limited_edition: false,
    is_featured: true,
    condition: "mint",
    rating: 4.4,
    review_count: 22,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "1a2b3c4d-0008",
    name: "Harley-Davidson Fat Boy",
    description:
      "Iconic American cruiser with chromed engine, detailed exhaust, leather-effect saddle.",
    category: "bikes",
    scale: "1:18",
    brand: "Maisto",
    price: 28.5,
    stock: 18,
    sku: "MS-HD-FATBOY-118",
    images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=80"],
    features: { chrome_finish: true, kick_stand: true },
    is_limited_edition: false,
    is_featured: false,
    condition: "mint",
    rating: 4.2,
    review_count: 31,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "1a2b3c4d-0009",
    name: "Bugatti Chiron Super Sport 300+",
    description:
      "World-record breaking hypercar in immaculate detail. Targa-style cabin, exposed quad-turbo W16, hand-painted finish.",
    category: "cars",
    scale: "1:43",
    brand: "AutoArt",
    price: 245.0,
    stock: 1,
    sku: "AA-CHIRON-300-143",
    images: ["https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=1200&q=80"],
    features: { numbered: "0007/0099", certificate: true, presentation_box: true },
    is_limited_edition: true,
    is_featured: true,
    condition: "sealed",
    rating: 5.0,
    review_count: 4,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "1a2b3c4d-0010",
    name: "Concorde — Air France",
    description:
      "Supersonic jet legend in retired Air France livery. Drooping nose function, removable engines, stand included.",
    category: "planes",
    scale: "1:18",
    brand: "Herpa Wings",
    price: 178.0,
    stock: 2,
    sku: "HW-CONC-AF-1200",
    images: ["https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=1200&q=80"],
    features: { droop_nose: true, stand_included: true, retired_livery: true },
    is_limited_edition: true,
    is_featured: true,
    condition: "sealed",
    rating: 4.9,
    review_count: 7,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "1a2b3c4d-0011",
    name: "Scania R730 V8 Topline",
    description:
      "European truck show champion in 1:24 scale. Premium Swedish detailing, chrome accessories, custom airbrush.",
    category: "trucks",
    scale: "1:24",
    brand: "Italeri",
    price: 68.0,
    stock: 7,
    sku: "IT-SCANIA-R730-124",
    images: ["https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=80"],
    features: { chrome_accessories: true, custom_airbrush: true },
    is_limited_edition: false,
    is_featured: false,
    condition: "mint",
    rating: 4.6,
    review_count: 9,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "1a2b3c4d-0012",
    name: "BMW M1000RR Superbike",
    description:
      "Bavarian engineering meets racing pedigree. M Carbon wheels, racing tyres, working rear suspension, M decals.",
    category: "bikes",
    scale: "1:12",
    brand: "Minichamps",
    price: 89.0,
    stock: 5,
    sku: "MC-BMW-M1000-112",
    images: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=80"],
    features: { carbon_wheels: true, suspension_works: true, decals_applied: true },
    is_limited_edition: true,
    is_featured: true,
    condition: "sealed",
    rating: 4.8,
    review_count: 5,
    created_at: NOW,
    updated_at: NOW,
  },
];

export function getProductsByCategory(category: Product["category"]) {
  return SAMPLE_PRODUCTS.filter((p) => p.category === category);
}

export function getFeaturedProducts(limit = 8) {
  return SAMPLE_PRODUCTS.filter((p) => p.is_featured).slice(0, limit);
}

export function getLimitedProducts(limit = 4) {
  return SAMPLE_PRODUCTS.filter((p) => p.is_limited_edition).slice(0, limit);
}

export function getProductById(id: string) {
  return SAMPLE_PRODUCTS.find((p) => p.id === id) ?? null;
}

export function searchProducts(query: string) {
  const q = query.toLowerCase();
  return SAMPLE_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category.includes(q)
  );
}

export const CATEGORIES_META = [
  { slug: "cars", label: "Cars", icon: "🚗", count: SAMPLE_PRODUCTS.filter((p) => p.category === "cars").length },
  { slug: "planes", label: "Planes", icon: "✈️", count: SAMPLE_PRODUCTS.filter((p) => p.category === "planes").length },
  { slug: "trucks", label: "Trucks", icon: "🚚", count: SAMPLE_PRODUCTS.filter((p) => p.category === "trucks").length },
  { slug: "bikes", label: "Bikes", icon: "🏍️", count: SAMPLE_PRODUCTS.filter((p) => p.category === "bikes").length },
] as const;

export const ALL_BRANDS = Array.from(new Set(SAMPLE_PRODUCTS.map((p) => p.brand).filter(Boolean))) as string[];
export const ALL_SCALES = ["1:64", "1:43", "1:24", "1:18", "1:12"] as const;
