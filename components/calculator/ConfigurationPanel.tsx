"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { OpenRouterModel } from "@/lib/openrouter";
import ModelSelector from "./ModelSelector";

interface ConfigurationPanelProps {
  onCalculate: (tokens: number, model: OpenRouterModel) => void;
  isCalculating: boolean;
  selectedModel: OpenRouterModel | null;
  onModelSelect: (model: OpenRouterModel) => void;
}

const QUICK_TOKENS = [
  { label: "1,000", value: 1000 },
  { label: "10,000", value: 10000 },
  { label: "50,000", value: 50000 },
  { label: "1,00,000", value: 100000 },
  { label: "10,00,000", value: 1000000 },
];

export default function ConfigurationPanel({
  onCalculate,
  isCalculating,
  selectedModel,
  onModelSelect,
}: ConfigurationPanelProps) {
  const [tokens, setTokens] = useState<number>(50000);

  const handleQuickSelect = (value: number) => setTokens(value);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/,/g, "");
    if (!isNaN(Number(val))) setTokens(Number(val));
  };

  return (
    <div className="border border-border p-8 rounded-lg bg-foreground/[0.03] flex flex-col gap-8 font-sans">
      <h3 className="text-xs tracking-[0.2em] text-muted uppercase font-sans">
        Workload Configuration
      </h3>

      <div className="flex flex-col gap-3">
        <label className="text-sm text-foreground font-sans">
          Total tokens
        </label>
        <input
          type="text"
          value={tokens.toLocaleString("en-IN")}
          onChange={handleTokenChange}
          className="bg-transparent border border-border p-4 rounded-md text-foreground text-lg focus:outline-none focus:border-accent transition-colors font-sans"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {QUICK_TOKENS.map((item) => (
            <button
              key={item.value}
              onClick={() => handleQuickSelect(item.value)}
              className={`px-4 py-2 text-xs rounded-md border transition-colors font-sans ${
                tokens === item.value
                  ? "border-accent text-accent bg-accent/10"
                  : "border-border text-muted hover:border-foreground/50 hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <ModelSelector selectedModel={selectedModel} onSelect={onModelSelect} />

      <motion.button
        whileHover={{ scale: isCalculating ? 1 : 1.02 }}
        whileTap={{ scale: isCalculating ? 1 : 0.98 }}
        onClick={() => selectedModel && onCalculate(tokens, selectedModel)}
        disabled={isCalculating || !selectedModel}
        className="mt-4 w-full bg-accent text-background font-medium py-4 rounded-full text-sm hover:bg-accent/90 transition-colors font-sans relative overflow-hidden disabled:opacity-50"
      >
        <motion.span
          animate={{ opacity: isCalculating ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          Calculate Impact
        </motion.span>
        {isCalculating && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center gap-2"
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full"
            />
            Calculating...
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}
