"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { OpenRouterModel } from "@/lib/openrouter";
import { getEnvironmentalProfile } from "@/lib/math/modelEstimator";

interface ModelSelectorProps {
  selectedModel: OpenRouterModel | null;
  onSelect: (model: OpenRouterModel) => void;
}

export default function ModelSelector({
  selectedModel,
  onSelect,
}: ModelSelectorProps) {
  const [query, setQuery] = useState("");
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/models/search?q=${encodeURIComponent(query)}&limit=25`,
        );
        const data = await res.json();
        setModels(data.models || []);
      } catch {
        setModels([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSelect = (model: OpenRouterModel) => {
    onSelect(model);
    setIsOpen(false);
    setQuery("");
  };

  const profile = selectedModel
    ? getEnvironmentalProfile(selectedModel.id)
    : null;

  return (
    <div className="flex flex-col gap-3 relative font-sans">
      <label className="text-sm text-foreground font-sans">Model profile</label>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-transparent border border-border p-4 rounded-md text-foreground text-lg cursor-pointer focus:outline-none focus:border-accent transition-colors font-sans flex items-center justify-between"
      >
        <span className="truncate">
          {selectedModel ? selectedModel.name : "Search 400+ models..."}
        </span>
        <span className="text-muted text-sm">{isOpen ? "▲" : "▼"}</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-md z-50 max-h-80 overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="p-3 border-b border-border">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search models (e.g. claude, deepseek, gpt-5)"
                autoFocus
                className="w-full bg-transparent text-foreground text-sm focus:outline-none font-sans placeholder:text-faint"
              />
            </div>

            <div className="overflow-y-auto flex-1">
              {isLoading ? (
                <div className="p-4 text-center text-muted text-sm font-sans">
                  Searching...
                </div>
              ) : models.length === 0 ? (
                <div className="p-4 text-center text-muted text-sm font-sans">
                  {query ? "No models found." : "Type to search models."}
                </div>
              ) : (
                models.map((model) => {
                  const modelProfile = getEnvironmentalProfile(model.id);
                  return (
                    <button
                      key={model.id}
                      onClick={() => handleSelect(model)}
                      className="w-full text-left px-4 py-3 hover:bg-accent/10 transition-colors border-b border-border last:border-0"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-foreground text-sm font-sans truncate">
                          {model.name}
                        </span>
                        <span
                          className={`text-[10px] uppercase tracking-wider font-sans shrink-0 ${
                            modelProfile.confidence === "measured"
                              ? "text-accent"
                              : modelProfile.confidence === "estimated"
                                ? "text-amber-500"
                                : "text-faint"
                          }`}
                        >
                          {modelProfile.confidence}
                        </span>
                      </div>
                      <span className="text-faint text-xs font-sans block truncate">
                        {model.id} · {model.contextLength.toLocaleString()}{" "}
                        context
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {profile && selectedModel && (
        <div className="flex flex-col gap-1 mt-1">
          <p className="text-xs text-muted font-sans">
            {profile.energyPer1kTokensWh} Wh · {profile.waterPer1kTokensMl} mL ·{" "}
            {profile.carbonPer1kTokensG} g CO₂ per 1K tokens
          </p>
          <p className="text-[10px] text-faint font-sans">
            Source: {profile.source}
          </p>
        </div>
      )}
    </div>
  );
}
