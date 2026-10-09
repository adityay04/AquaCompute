"use client";

import { motion, AnimatePresence } from "motion/react";
import { ImpactResult } from "@/lib/math/modelEstimator";

interface ResultsPanelProps {
  result: ImpactResult | null;
  isCalculating: boolean;
}

export default function ResultsPanel({
  result,
  isCalculating,
}: ResultsPanelProps) {
  return (
    <div className="flex flex-col gap-6 h-full font-sans">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-3xl text-foreground font-sans font-semibold">
          Estimated Impact
        </h2>
        <span className="text-[10px] tracking-[0.2em] text-accent uppercase font-sans border border-accent/40 px-3 py-1 rounded-full">
          Provisional Model
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isCalculating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full"
              />
              <p className="text-muted text-sm font-sans">
                Crunching the numbers...
              </p>
            </motion.div>
          ) : !result ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center flex flex-col gap-4 max-w-sm"
            >
              <h3 className="text-4xl text-muted leading-tight font-sans font-semibold">
                Your results will appear here.
              </h3>
              <p className="text-faint text-sm font-sans">
                Configure your workload and calculate its estimated
                environmental impact.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full grid grid-cols-1 gap-6"
            >
              <div className="border border-border p-6 rounded-lg bg-foreground/[0.03]">
                <div className="flex items-center justify-between mb-2 gap-3">
                  <span className="text-xs tracking-widest text-muted uppercase font-sans">
                    Water Usage
                  </span>
                  <span className="text-xs text-accent font-sans truncate max-w-[200px]">
                    {result.modelName}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl text-accent font-sans font-semibold">
                    {result.waterLiters}
                  </span>
                  <span className="text-muted font-sans">Liters</span>
                </div>
                <p className="text-sm text-muted mt-2 font-sans">
                  Equivalent to {result.waterBottles} standard 500ml water
                  bottles.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="border border-border p-6 rounded-lg bg-foreground/[0.03]">
                  <span className="text-xs tracking-widest text-muted uppercase font-sans">
                    Energy
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl text-foreground font-sans font-semibold">
                      {result.energyKwh}
                    </span>
                    <span className="text-muted font-sans text-sm">kWh</span>
                  </div>
                </div>
                <div className="border border-border p-6 rounded-lg bg-foreground/[0.03]">
                  <span className="text-xs tracking-widest text-muted uppercase font-sans">
                    Carbon
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl text-foreground font-sans font-semibold">
                      {result.carbonGrams}
                    </span>
                    <span className="text-muted font-sans text-sm">gCO₂</span>
                  </div>
                </div>
              </div>

              <div className="border border-border p-4 rounded-lg bg-foreground/[0.02]">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] uppercase tracking-wider font-sans px-2 py-0.5 rounded shrink-0 ${
                      result.confidence === "measured"
                        ? "bg-accent/20 text-accent"
                        : result.confidence === "estimated"
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                          : "bg-foreground/10 text-muted"
                    }`}
                  >
                    {result.confidence}
                  </span>
                  <span className="text-xs text-faint font-sans">
                    {result.source}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
