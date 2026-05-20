"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Search, ShoppingBag, X, ArrowRight, ArrowUpRight } from "lucide-react";
import { formatCurrencyOMR } from "@/lib/utils";

/* ---------- palette ---------- */
const BG = "#F2EEE5";
const BG_DEEP = "#EBE6D9";
const CARD = "#FCFBF7";
const INK = "#1B1A16";
const MUTED = "#6E6A5E";
const FAINT = "#A09A89";
const BRASS = "#9C7C49";
const LINE = "rgba(27,26,22,0.10)";
const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- catalogue ---------- */
type Car = {
  id: string;
  lot: string;
  name: string;
  marque: "Ferrari" | "Lamborghini" | "Maserati";
  scale: string;
  price: number;
  edition: string;
  img: string;
  ratio: number; // width / height of the cutout, for object sizing
  desc: string;
  limited: boolean;
};

const CARS: Car[] = [
  {
    id: "c1",
    lot: "001",
    name: "Ferrari LaFerrari",
    marque: "Ferrari",
    scale: "1:18",
    price: 165,
    edition: "041 / 500",
    img: "/cars/car-01.webp",
    ratio: 1300 / 518,
    desc: "The hybrid flagship of Maranello, captured in 1:18. Hand-laid Rosso Corsa over a die-cast shell, opening butterfly doors, a fully detailed HY-KERS V12 bay.",
    limited: true,
  },
  {
    id: "c2",
    lot: "002",
    name: "Ferrari SF90 Stradale",
    marque: "Ferrari",
    scale: "1:18",
    price: 142,
    edition: "Open series",
    img: "/cars/car-02.webp",
    ratio: 1300 / 900,
    desc: "Ferrari's first plug-in hybrid series car, modelled with photo-etched aero, working steering and a sculpted carbon cabin.",
    limited: false,
  },
  {
    id: "c3",
    lot: "003",
    name: "Ferrari 488 GTB",
    marque: "Ferrari",
    scale: "1:24",
    price: 64,
    edition: "Open series",
    img: "/cars/car-03.webp",
    ratio: 625 / 387,
    desc: "The twin-turbo V8 berlinetta in a crisp 1:24 rendering — opening engine cover, detailed quad-exhaust and authentic alloys.",
    limited: false,
  },
  {
    id: "c4",
    lot: "004",
    name: "Ferrari F8 Tributo",
    marque: "Ferrari",
    scale: "1:18",
    price: 124,
    edition: "Open series",
    img: "/cars/car-04.webp",
    ratio: 1300 / 795,
    desc: "A tribute to the V8 bloodline. S-Duct nose, louvred rear screen and hand-finished metallic paintwork.",
    limited: false,
  },
  {
    id: "c5",
    lot: "005",
    name: "Lamborghini Huracán EVO",
    marque: "Lamborghini",
    scale: "1:18",
    price: 118,
    edition: "Open series",
    img: "/cars/car-05.webp",
    ratio: 1092 / 377,
    desc: "Sant'Agata's naturally aspirated V10, in 1:18. Y-signature lights, working scissor doors, fully trimmed interior.",
    limited: false,
  },
  {
    id: "c6",
    lot: "006",
    name: "Lamborghini Huracán STO",
    marque: "Lamborghini",
    scale: "1:18",
    price: 156,
    edition: "088 / 500",
    img: "/cars/car-06.webp",
    ratio: 1300 / 518,
    desc: "The track-bred Super Trofeo Omologata — cofango bonnet, roof scoop and a towering rear wing, all rendered to scale.",
    limited: true,
  },
  {
    id: "c7",
    lot: "007",
    name: "Lamborghini Gallardo",
    marque: "Lamborghini",
    scale: "1:24",
    price: 58,
    edition: "Open series",
    img: "/cars/car-07.webp",
    ratio: 568 / 402,
    desc: "The car that defined a generation of Lamborghini, in a tidy 1:24 — sharp lines, detailed V10 cover.",
    limited: false,
  },
  {
    id: "c8",
    lot: "008",
    name: "Lamborghini Sián FKP 37",
    marque: "Lamborghini",
    scale: "1:18",
    price: 245,
    edition: "007 / 500",
    img: "/cars/car-08.webp",
    ratio: 1300 / 587,
    desc: "The first hybrid Lamborghini and rarest in the cabinet — supercapacitor V12, hexagonal lighting, presentation case included.",
    limited: true,
  },
  {
    id: "c9",
    lot: "009",
    name: "Lamborghini Aventador SVJ",
    marque: "Lamborghini",
    scale: "1:18",
    price: 188,
    edition: "Open series",
    img: "/cars/car-09.webp",
    ratio: 1300 / 592,
    desc: "Superveloce Jota — ALA active aero, a 6.5-litre V12, and the most aggressive Aventador silhouette, faithfully scaled.",
    limited: false,
  },
  {
    id: "c10",
    lot: "010",
    name: "Lamborghini Aventador S",
    marque: "Lamborghini",
    scale: "1:18",
    price: 132,
    edition: "Open series",
    img: "/cars/car-10.webp",
    ratio: 1300 / 500,
    desc: "Four-wheel steering and a naturally aspirated V12, modelled with opening doors and a detailed driver's cell.",
    limited: false,
  },
  {
    id: "c11",
    lot: "011",
    name: "Lamborghini Aventador Roadster",
    marque: "Lamborghini",
    scale: "1:12",
    price: 360,
    edition: "012 / 250",
    img: "/cars/car-11.webp",
    ratio: 1197 / 1048,
    desc: "The cabinet's centrepiece — a 1:12 masterwork. Removable roof panels, full engine bay, opening doors and a numbered chassis plate.",
    limited: true,
  },
  {
    id: "c12",
    lot: "012",
    name: "Maserati MC20",
    marque: "Maserati",
    scale: "1:18",
    price: 138,
    edition: "Open series",
    img: "/cars/car-12.webp",
    ratio: 1300 / 999,
    desc: "Modena's mid-engined return — the Nettuno V6, butterfly doors and a clean, modern silhouette in hand-finished 1:18.",
    limited: false,
  },
];

const HERO = CARS[10]; // Aventador Roadster
const CURATOR = CARS[11]; // Maserati MC20
const FERRARIS = CARS.filter((c) => c.marque === "Ferrari");
const LAMBOS = CARS.filter((c) => c.marque === "Lamborghini");
const LIMITED = CARS.filter((c) => c.limited);

/* ---------- brass nameplate ---------- */
function Nameplate({ title, sub }: { title: string; sub: string }) {
  return (
    <div
      className="inline-flex flex-col items-center rounded-[3px] px-6 py-2"
      style={{
        background: "linear-gradient(180deg,#D2C19A 0%,#A98E5F 52%,#8A7142 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.18), 0 3px 8px rgba(27,26,22,0.22)",
      }}
    >
      <span
        className="text-[10px] font-semibold uppercase tracking-[0.24em]"
        style={{ color: "#3A2E14", textShadow: "0 1px 0 rgba(255,255,255,0.35)" }}
      >
        {title}
      </span>
      <span
        className="mt-0.5 text-[8px] uppercase tracking-[0.3em]"
        style={{ color: "#5A4B2C" }}
      >
        {sub}
      </span>
    </div>
  );
}

/* ---------- soft contact shadow under a cutout ---------- */
function CarShadow({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[50%] ${className}`}
      style={{
        background:
          "radial-gradient(ellipse, rgba(27,26,22,0.30) 0%, rgba(27,26,22,0.12) 45%, transparent 72%)",
        filter: "blur(7px)",
      }}
    />
  );
}

/* ---------- product card ---------- */
function CarCard({ car, onOpen }: { car: Car; onOpen: (c: Car) => void }) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(car)}
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="group relative flex w-[260px] flex-shrink-0 snap-start flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9C7C49] sm:w-[300px]"
      aria-label={`${car.name} — ${formatCurrencyOMR(car.price)}`}
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ background: CARD, border: `1px solid ${LINE}` }}
      >
        {/* glass top edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)",
          }}
        />
        {car.limited && (
          <span
            className="absolute left-3.5 top-3.5 z-10 rounded-full px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.18em]"
            style={{ background: INK, color: BG }}
          >
            Numbered
          </span>
        )}
        <div className="relative flex aspect-[7/5] items-center justify-center px-7 pb-9 pt-7">
          <CarShadow className="bottom-[18%] h-[12%] w-[72%] transition-all duration-300 group-hover:w-[60%] group-hover:opacity-80" />
          <motion.div
            variants={{ rest: { y: 0 }, hover: { y: -10 } }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative h-full w-full"
          >
            <Image
              src={car.img}
              alt={car.name}
              fill
              className="object-contain"
              sizes="300px"
            />
          </motion.div>
        </div>
      </div>
      <div className="px-1.5 pt-3.5">
        <p
          className="text-[9px] font-medium uppercase tracking-[0.2em]"
          style={{ color: BRASS }}
        >
          Lot {car.lot} · {car.scale}
        </p>
        <h4 className="mt-1.5 text-[15px] font-medium" style={{ color: INK }}>
          {car.name}
        </h4>
        <div className="mt-1.5 flex items-center justify-between">
          <span
            className="text-sm font-medium tabular-nums"
            style={{ color: MUTED }}
          >
            {formatCurrencyOMR(car.price)}
          </span>
          <span
            className="flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ color: BRASS }}
          >
            Examine
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

/* ---------- a cabinet shelf ---------- */
function Shelf({
  marque,
  sub,
  cars,
  onOpen,
}: {
  marque: string;
  sub: string;
  cars: Car[];
  onOpen: (c: Car) => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.65, ease: EASE }}
      className="mx-auto max-w-6xl"
    >
      <div className="mb-5 flex items-end justify-between px-5 sm:px-8">
        <div>
          <h3
            className="font-display text-[1.7rem] leading-none tracking-tight sm:text-4xl"
            style={{ color: INK }}
          >
            {marque}
          </h3>
          <p className="mt-2 text-xs" style={{ color: MUTED }}>
            {sub}
          </p>
        </div>
        <span
          className="whitespace-nowrap text-[10px] uppercase tracking-[0.22em]"
          style={{ color: FAINT }}
        >
          {cars.length} in the cabinet
        </span>
      </div>
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-4 top-0 z-10 h-px sm:inset-x-8"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 50%,transparent)",
          }}
        />
        <div
          className="shelf-scroll flex gap-5 overflow-x-auto px-5 pb-8 pt-8 sm:px-8"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 80%)",
          }}
        >
          {cars.map((c) => (
            <CarCard key={c.id} car={c} onOpen={onOpen} />
          ))}
        </div>
        <div
          aria-hidden
          className="absolute inset-x-4 bottom-0 h-px sm:inset-x-8"
          style={{ background: LINE }}
        />
      </div>
    </motion.section>
  );
}

/* ---------- quick-look ---------- */
function QuickLook({
  car,
  onClose,
  onAdd,
}: {
  car: Car;
  onClose: () => void;
  onAdd: () => void;
}) {
  const specs = [
    { l: "Marque", v: car.marque },
    { l: "Scale", v: car.scale },
    { l: "Edition", v: car.edition },
    { l: "Lot", v: car.lot },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      style={{ background: "rgba(20,18,14,0.5)", backdropFilter: "blur(7px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={car.name}
    >
      <motion.div
        initial={{ y: 64, opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 64, opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl sm:max-w-3xl sm:rounded-3xl"
        style={{ background: BG, border: `1px solid ${LINE}` }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[rgba(27,26,22,0.06)]"
          style={{ background: CARD, border: `1px solid ${LINE}`, color: INK }}
        >
          <X className="h-4 w-4" />
        </button>
        <div className="grid sm:grid-cols-2">
          {/* the case */}
          <div
            className="relative flex aspect-square items-center justify-center p-8"
            style={{
              background: `radial-gradient(70% 55% at 50% 42%, #FFFFFF 0%, ${BG_DEEP} 100%)`,
            }}
          >
            <CarShadow className="bottom-[20%] h-[12%] w-[68%]" />
            <div className="relative h-full w-full">
              <Image
                src={car.img}
                alt={car.name}
                fill
                className="object-contain"
                sizes="(max-width:640px) 100vw, 384px"
              />
            </div>
          </div>
          {/* details */}
          <div className="p-7 sm:p-9">
            <p
              className="text-[10px] font-medium uppercase tracking-[0.26em]"
              style={{ color: BRASS }}
            >
              {car.limited ? "Numbered Edition" : "The Collection"}
            </p>
            <h3
              className="mt-2 font-display text-3xl leading-tight tracking-tight"
              style={{ color: INK }}
            >
              {car.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTED }}>
              {car.desc}
            </p>
            <div
              className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl"
              style={{ background: LINE }}
            >
              {specs.map((s) => (
                <div key={s.l} className="px-4 py-3" style={{ background: BG }}>
                  <p
                    className="text-[8px] uppercase tracking-[0.22em]"
                    style={{ color: FAINT }}
                  >
                    {s.l}
                  </p>
                  <p
                    className="mt-1 text-sm font-medium"
                    style={{ color: INK }}
                  >
                    {s.v}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-7 flex items-end justify-between">
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.26em]"
                  style={{ color: FAINT }}
                >
                  Price
                </p>
                <p
                  className="font-display text-2xl tabular-nums"
                  style={{ color: INK }}
                >
                  {formatCurrencyOMR(car.price)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onAdd}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full py-4 text-xs font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-90"
              style={{ background: INK, color: BG }}
            >
              Add to Collection
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- page ---------- */
export default function CabinetPage() {
  const [selected, setSelected] = useState<Car | null>(null);
  const [cart, setCart] = useState(0);

  const open = useCallback((c: Car) => setSelected(c), []);
  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  /* hero parallax */
  const caseRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const carX = useTransform(sx, [-0.5, 0.5], [-16, 16]);
  const carY = useTransform(sy, [-0.5, 0.5], [-11, 11]);

  const onCaseMove = (e: React.MouseEvent) => {
    const r = caseRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onCaseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <main className="relative w-full" style={{ background: BG, color: INK }}>
      <style>{`header,footer,nav[aria-label="Primary"]{display:none!important}`}</style>

      {/* ---------- header ---------- */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 sm:px-8"
        style={{
          background: "rgba(242,238,229,0.85)",
          backdropFilter: "blur(14px)",
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <div className="flex flex-col leading-none">
          <span
            className="text-[12px] font-semibold uppercase tracking-[0.26em]"
            style={{ color: INK }}
          >
            Diecast Muscat
          </span>
          <span
            className="mt-1 text-[8px] uppercase tracking-[0.38em]"
            style={{ color: BRASS }}
          >
            House of Crafts
          </span>
        </div>
        <nav className="hidden items-center gap-8 sm:flex">
          {["Ferrari", "Lamborghini", "Limited", "About"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-[#9C7C49]"
              style={{ color: MUTED }}
            >
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[rgba(27,26,22,0.05)]"
            style={{ color: INK }}
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Collection — ${cart} pieces`}
            className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[rgba(27,26,22,0.05)]"
            style={{ color: INK }}
          >
            <ShoppingBag className="h-4 w-4" />
            {cart > 0 && (
              <span
                className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold tabular-nums"
                style={{ background: BRASS, color: "#FFFFFF" }}
              >
                {cart}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ---------- hero ---------- */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 pb-14 pt-12 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:pb-24 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p
            className="mb-5 text-[10px] font-medium uppercase tracking-[0.4em]"
            style={{ color: BRASS }}
          >
            The Cabinet — Volume I
          </p>
          <h1
            className="font-display text-[2.9rem] leading-[0.98] tracking-tight sm:text-[4.6rem]"
            style={{ color: INK }}
          >
            Supercars,
            <br />
            kept under glass.
          </h1>
          <p
            className="mt-6 max-w-md text-sm leading-relaxed sm:text-base"
            style={{ color: MUTED }}
          >
            A curated cabinet of die-cast scale models — Ferrari, Lamborghini
            and Maserati, each piece numbered, hand-finished, and shelved like
            the collectible it is.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#ferrari"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-xs font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-90"
              style={{ background: INK, color: BG }}
            >
              Open the cabinet
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#limited"
              className="inline-flex items-center rounded-full px-6 py-3.5 text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:border-[#9C7C49]"
              style={{ border: `1px solid ${LINE}`, color: INK }}
            >
              Limited editions
            </a>
          </div>
          <div
            className="mt-9 flex items-center gap-5 text-[10px] uppercase tracking-[0.22em]"
            style={{ color: FAINT }}
          >
            <span>{CARS.length} pieces</span>
            <span>·</span>
            <span>3 marques</span>
            <span>·</span>
            <span>Est. Muscat</span>
          </div>
        </motion.div>

        {/* the lit case */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
        >
          <div
            ref={caseRef}
            onMouseMove={onCaseMove}
            onMouseLeave={onCaseLeave}
            className="relative overflow-hidden rounded-3xl"
            style={{
              background: `linear-gradient(168deg, ${CARD} 0%, #EDE8DB 58%, #E3DDCD 100%)`,
              border: `1px solid ${LINE}`,
              boxShadow: "0 50px 90px -46px rgba(27,26,22,0.45)",
            }}
          >
            {/* glass edges */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(56% 44% at 50% 34%, rgba(255,251,240,0.9), transparent 76%)",
              }}
            />
            <button
              type="button"
              onClick={() => open(HERO)}
              className="relative block w-full px-8 pb-6 pt-10 focus:outline-none sm:px-12 sm:pt-12"
              aria-label={`View ${HERO.name}`}
            >
              <div className="relative flex h-[230px] items-center justify-center sm:h-[330px]">
                <CarShadow className="bottom-[6%] h-[13%] w-[66%]" />
                <motion.div
                  style={{ x: carX, y: carY }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={HERO.img}
                    alt={HERO.name}
                    fill
                    priority
                    className="object-contain"
                    sizes="(max-width:1024px) 90vw, 600px"
                  />
                </motion.div>
              </div>
            </button>
            <div className="relative flex justify-center pb-9">
              <Nameplate
                title={HERO.name}
                sub={`${HERO.scale} · Lot ${HERO.lot}`}
              />
            </div>
          </div>
          <p
            className="mt-4 text-center text-[10px] uppercase tracking-[0.26em]"
            style={{ color: FAINT }}
          >
            In the case — the cabinet&rsquo;s centrepiece
          </p>
        </motion.div>
      </section>

      {/* ---------- shelves ---------- */}
      <div className="space-y-16 pb-6 lg:space-y-24">
        <div id="ferrari">
          <Shelf
            marque="Ferrari"
            sub="Maranello — road, race and hybrid flagship."
            cars={FERRARIS}
            onOpen={open}
          />
        </div>
        <div id="lamborghini">
          <Shelf
            marque="Lamborghini"
            sub="Sant'Agata Bolognese — the V10 and V12 bloodline."
            cars={LAMBOS}
            onOpen={open}
          />
        </div>
      </div>

      {/* ---------- curator's selection ---------- */}
      <motion.section
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-90px" }}
        transition={{ duration: 0.65, ease: EASE }}
        className="mx-auto my-20 max-w-6xl px-5 sm:px-8 lg:my-28"
      >
        <div
          className="grid items-center gap-8 overflow-hidden rounded-3xl lg:grid-cols-2 lg:gap-0"
          style={{ background: CARD, border: `1px solid ${LINE}` }}
        >
          <button
            type="button"
            onClick={() => open(CURATOR)}
            className="relative flex h-[280px] items-center justify-center p-8 focus:outline-none sm:h-[380px]"
            style={{
              background: `radial-gradient(65% 52% at 50% 42%, #FFFFFF 0%, ${BG_DEEP} 100%)`,
            }}
            aria-label={`View ${CURATOR.name}`}
          >
            <CarShadow className="bottom-[20%] h-[12%] w-[64%]" />
            <div className="relative h-full w-full">
              <Image
                src={CURATOR.img}
                alt={CURATOR.name}
                fill
                className="object-contain"
                sizes="(max-width:1024px) 90vw, 480px"
              />
            </div>
          </button>
          <div className="p-7 pt-0 sm:p-12 lg:pt-12">
            <p
              className="text-[10px] font-medium uppercase tracking-[0.36em]"
              style={{ color: BRASS }}
            >
              Curator&rsquo;s Selection
            </p>
            <h2
              className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-[2.7rem]"
              style={{ color: INK }}
            >
              {CURATOR.name}
            </h2>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: MUTED }}>
              {CURATOR.desc}
            </p>
            <p
              className="mt-5 border-l-2 pl-4 text-sm italic leading-relaxed"
              style={{ borderColor: BRASS, color: INK }}
            >
              &ldquo;Modena rarely makes the noise Maranello does — which is
              exactly why this one earns the open shelf.&rdquo;
            </p>
            <div className="mt-7 flex items-center gap-6">
              <span
                className="font-display text-2xl tabular-nums"
                style={{ color: INK }}
              >
                {formatCurrencyOMR(CURATOR.price)}
              </span>
              <button
                type="button"
                onClick={() => open(CURATOR)}
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-[#9C7C49]"
                style={{ color: INK }}
              >
                Examine the piece
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ---------- limited editions ---------- */}
      <section
        id="limited"
        className="border-y px-5 py-20 sm:px-8 lg:py-28"
        style={{ borderColor: LINE, background: BG_DEEP }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-9">
            <p
              className="mb-2 text-[10px] font-medium uppercase tracking-[0.36em]"
              style={{ color: BRASS }}
            >
              The Locked Shelf
            </p>
            <h2
              className="font-display text-3xl tracking-tight sm:text-[2.7rem]"
              style={{ color: INK }}
            >
              Numbered &amp; limited
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {LIMITED.map((c, i) => (
              <motion.button
                key={c.id}
                type="button"
                onClick={() => open(c)}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08, ease: EASE }}
                className="group flex flex-col text-left focus:outline-none"
                aria-label={`View ${c.name}`}
              >
                <div
                  className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl px-5"
                  style={{ background: CARD, border: `1px solid ${LINE}` }}
                >
                  <span
                    className="absolute left-3 top-3 z-10 rounded-full px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.16em]"
                    style={{ background: INK, color: BG }}
                  >
                    {c.edition}
                  </span>
                  <CarShadow className="bottom-[16%] h-[11%] w-[70%] transition-all duration-300 group-hover:w-[58%]" />
                  <motion.div
                    variants={{ rest: { y: 0 }, hover: { y: -8 } }}
                    initial="rest"
                    whileHover="hover"
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="relative h-[78%] w-full"
                  >
                    <Image
                      src={c.img}
                      alt={c.name}
                      fill
                      className="object-contain"
                      sizes="(max-width:1024px) 50vw, 25vw"
                    />
                  </motion.div>
                </div>
                <p
                  className="mt-3 text-[9px] font-medium uppercase tracking-[0.2em]"
                  style={{ color: BRASS }}
                >
                  Lot {c.lot} · {c.scale}
                </p>
                <h4
                  className="mt-1 text-sm font-medium"
                  style={{ color: INK }}
                >
                  {c.name}
                </h4>
                <span
                  className="mt-1 text-sm font-medium tabular-nums"
                  style={{ color: MUTED }}
                >
                  {formatCurrencyOMR(c.price)}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- assurance band ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              h: "Authenticated",
              b: "Every model checked against the maker's reference before it reaches the cabinet.",
            },
            {
              h: "Numbered",
              b: "Limited pieces arrive with their edition plate and certificate of authenticity.",
            },
            {
              h: "Shipped from Muscat",
              b: "Cushioned, insured delivery across Oman and the wider GCC.",
            },
          ].map((c) => (
            <div key={c.h}>
              <p
                className="text-[10px] font-medium uppercase tracking-[0.28em]"
                style={{ color: BRASS }}
              >
                {c.h}
              </p>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: MUTED }}
              >
                {c.b}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- footer ---------- */}
      <footer
        id="about"
        className="border-t"
        style={{ borderColor: LINE }}
      >
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="grid gap-8 sm:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <p
                className="text-[13px] font-semibold uppercase tracking-[0.26em]"
                style={{ color: INK }}
              >
                Diecast Muscat
              </p>
              <p
                className="mt-1 text-[9px] uppercase tracking-[0.38em]"
                style={{ color: BRASS }}
              >
                House of Crafts
              </p>
              <p
                className="mt-4 max-w-xs text-sm leading-relaxed"
                style={{ color: MUTED }}
              >
                A curated cabinet of die-cast scale models, kept and shipped
                from Muscat.
              </p>
            </div>
            {[
              {
                h: "Cabinet",
                links: ["Ferrari", "Lamborghini", "Maserati", "Limited"],
              },
              { h: "House", links: ["About", "Contact", "Returns", "F.A.Q."] },
            ].map((col) => (
              <div key={col.h}>
                <p
                  className="mb-3 text-[10px] uppercase tracking-[0.28em]"
                  style={{ color: FAINT }}
                >
                  {col.h}
                </p>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <span
                        className="text-sm transition-colors hover:text-[#9C7C49]"
                        style={{ color: MUTED }}
                      >
                        {l}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            className="mt-12 flex flex-col gap-2 border-t pt-6 text-[10px] uppercase tracking-[0.22em] sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: LINE, color: FAINT }}
          >
            <span>© MMXXVI Diecast Muscat — Muscat, Oman</span>
            <span>The collector&rsquo;s cabinet</span>
          </div>
        </div>
      </footer>

      {/* ---------- quick-look ---------- */}
      <AnimatePresence>
        {selected && (
          <QuickLook
            car={selected}
            onClose={close}
            onAdd={() => {
              setCart((c) => c + 1);
              close();
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
