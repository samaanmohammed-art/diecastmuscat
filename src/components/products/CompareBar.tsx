"use client";

import { useRouter } from "next/navigation";
import { GitCompareArrows, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCompareStore } from "@/stores/compare";
import { useMounted } from "@/hooks/useMounted";
import { Button } from "@/components/ui/button";

export function CompareBar() {
  const ids = useCompareStore((s) => s.ids);
  const clear = useCompareStore((s) => s.clear);
  const toggle = useCompareStore((s) => s.toggle);
  const mounted = useMounted();
  const router = useRouter();

  const visible = mounted && ids.length >= 2;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="compare-bar"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed bottom-20 sm:bottom-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
        >
          <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-gold/30 bg-surface-elevated/95 backdrop-blur-md px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <GitCompareArrows className="h-4 w-4 text-gold shrink-0" />

            <p className="text-sm text-text-muted whitespace-nowrap">
              <span className="text-gold font-medium">{ids.length}</span>{" "}
              {ids.length === 1 ? "piece" : "pieces"} selected
            </p>

            <div className="flex items-center gap-1">
              {ids.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggle(id)}
                  aria-label="Remove from comparison"
                  className="h-6 w-6 rounded-full border border-border-strong/60 bg-surface flex items-center justify-center text-text-dim hover:text-gold hover:border-gold/40 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-border-strong" />

            <Button
              size="sm"
              className="bg-gold text-bg hover:bg-gold-bright text-xs uppercase tracking-[0.18em] h-8"
              onClick={() => router.push(`/compare?ids=${ids.join(",")}`)}
            >
              Compare
            </Button>

            <button
              type="button"
              onClick={clear}
              aria-label="Clear comparison"
              className="h-7 w-7 rounded-full flex items-center justify-center text-text-dim hover:text-gold transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
