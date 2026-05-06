"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    // Simulated submit — replace with real subscribe endpoint when wired
    setTimeout(() => {
      toast.success("Subscribed", {
        description: "You're on the list. Welcome to the inner circle.",
      });
      setEmail("");
      setSubmitting(false);
    }, 600);
  }

  return (
    <section className="relative bg-bg overflow-hidden">
      {/* Hairline above */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl hairline-gold opacity-70" />

      <div className="absolute inset-0 bg-gold-glow opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-noise pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-6 lg:px-12 py-28 lg:py-40 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-[10px] uppercase tracking-[0.45em] text-gold mb-6 inline-flex items-center gap-3"
        >
          <span className="inline-block h-px w-8 bg-gold/60" />
          The Concierge Letter
          <span className="inline-block h-px w-8 bg-gold/60" />
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-display text-5xl md:text-7xl leading-[0.98] tracking-tight mb-6"
        >
          First access. New arrivals.
          <br />
          <span className="text-gradient-gold italic">Limited drops.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base text-text-muted mb-12 max-w-md mx-auto"
        >
          A short, considered note from our atelier. Sent only when something arrives that we genuinely think you should see first.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 h-14 px-5 bg-surface border border-border-strong text-text placeholder:text-text-dim focus:outline-none focus:border-gold transition-colors duration-200 rounded-md"
            disabled={submitting}
          />
          <Button type="submit" size="xl" disabled={submitting}>
            {submitting ? "Subscribing…" : "Subscribe"}
          </Button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-[10px] uppercase tracking-[0.3em] text-text-dim mt-8"
        >
          One letter a fortnight. Unsubscribe whenever.
        </motion.p>
      </div>

      {/* Hairline below — transitions to footer */}
      <div className="hairline-gold opacity-50" />
    </section>
  );
}
