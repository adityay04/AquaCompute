"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { OpenRouterModel } from "@/lib/openrouter";
import {
  calculateImpact,
  ImpactResult,
  getEnvironmentalProfile,
} from "@/lib/math/modelEstimator";

const DEFAULT_MODEL_A: OpenRouterModel = {
  id: "anthropic/claude-3-opus",
  name: "Claude 3 Opus",
  description: "Anthropic frontier model",
  contextLength: 200000,
  pricing: { prompt: "0", completion: "0" },
  provider: "anthropic",
};

const DEFAULT_MODEL_B: OpenRouterModel = {
  id: "google/gemini-2.5-pro",
  name: "Gemini 2.5 Pro",
  description: "Google's most efficient model",
  contextLength: 1000000,
  pricing: { prompt: "0", completion: "0" },
  provider: "google",
};

const QUICK_TOKENS = [
  { label: "1,000", value: 1000 },
  { label: "50,000", value: 50000 },
  { label: "1,00,000", value: 100000 },
  { label: "10,00,000", value: 1000000 },
];

interface MiniModelPickerProps {
  label: string;
  selected: OpenRouterModel | null;
  onSelect: (model: OpenRouterModel) => void;
  accentColor: "a" | "b";
}

function MiniModelPicker({
  label,
  selected,
  onSelect,
  accentColor,
}: MiniModelPickerProps) {
  const [query, setQuery] = useState("");
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/models/search?q=${encodeURIComponent(query)}&limit=20`,
        );
        const data = await res.json();
        setModels(data.models || []);
      } catch {
        setModels([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="flex flex-col gap-3 relative font-sans">
      <span
        className={`text-[10px] tracking-[0.2em] uppercase font-sans ${accentColor === "a" ? "text-rose-400" : "text-accent"}`}
      >
        {label}
      </span>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border border-border p-4 rounded-md cursor-pointer hover:border-foreground/50 transition-colors flex items-center justify-between bg-foreground/3"
      >
        <span className="text-foreground text-base truncate">
          {selected ? selected.name : "Select model..."}
        </span>
        <span className="text-muted text-sm">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-md z-50 max-h-72 overflow-hidden flex flex-col shadow-2xl"
        >
          <div className="p-3 border-b border-border">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search models..."
              autoFocus
              className="w-full bg-transparent text-foreground text-base focus:outline-none font-sans placeholder:text-faint"
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="p-4 text-center text-muted text-sm font-sans">
                Searching...
              </div>
            ) : models.length === 0 ? (
              <div className="p-4 text-center text-muted text-sm font-sans">
                {query ? "No models found." : "Type to search..."}
              </div>
            ) : (
              models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onSelect(model);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-accent/10 transition-colors border-b border-border last:border-0"
                >
                  <div className="text-foreground text-sm font-sans truncate">
                    {model.name}
                  </div>
                  <div className="text-faint text-xs font-sans truncate mt-0.5">
                    {model.id}
                  </div>
                </button>
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface ResultBarProps {
  label: string;
  valueA: number;
  valueB: number;
  unit: string;
  maxValue: number;
  modelAName: string;
  modelBName: string;
}

function ResultBar({
  label,
  valueA,
  valueB,
  unit,
  maxValue,
  modelAName,
  modelBName,
}: ResultBarProps) {
  const widthA = maxValue > 0 ? (valueA / maxValue) * 100 : 0;
  const widthB = maxValue > 0 ? (valueB / maxValue) * 100 : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-[0.2em] uppercase text-muted font-sans">
          {label}
        </span>
        <span className="text-[10px] text-faint font-sans">
          {valueA > valueB
            ? `${(valueA / (valueB || 1)).toFixed(1)}× difference`
            : valueB > valueA
              ? `${(valueB / (valueA || 1)).toFixed(1)}× difference`
              : "Equal"}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <div className="w-32 text-right">
            <div className="font-mono text-sm text-rose-400">
              {valueA.toLocaleString()}
            </div>
            <div className="text-[10px] text-faint font-sans">{unit}</div>
          </div>
          <div className="flex-1 h-8 bg-foreground/5 rounded-sm overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${widthA}%` }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-gradient-to-r from-rose-500/80 to-rose-400 flex items-center px-3"
            >
              {widthA > 15 && (
                <span className="text-[10px] text-white/90 font-sans truncate">
                  {modelAName}
                </span>
              )}
            </motion.div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-32 text-right">
            <div className="font-mono text-sm text-accent">
              {valueB.toLocaleString()}
            </div>
            <div className="text-[10px] text-faint font-sans">{unit}</div>
          </div>
          <div className="flex-1 h-8 bg-foreground/5 rounded-sm overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${widthB}%` }}
              transition={{
                duration: 1.2,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="h-full bg-gradient-to-r from-emerald-500/80 to-accent flex items-center px-3"
            >
              {widthB > 15 && (
                <span className="text-[10px] text-black/70 font-sans truncate">
                  {modelBName}
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  const [tokens, setTokens] = useState(50000);
  const [modelA, setModelA] = useState<OpenRouterModel | null>(DEFAULT_MODEL_A);
  const [modelB, setModelB] = useState<OpenRouterModel | null>(DEFAULT_MODEL_B);
  const [resultA, setResultA] = useState<ImpactResult | null>(null);
  const [resultB, setResultB] = useState<ImpactResult | null>(null);

  const handleCompare = () => {
    if (!modelA || !modelB) return;
    setResultA(null);
    setResultB(null);
    setTimeout(() => {
      setResultA(calculateImpact(tokens, modelA.id, modelA.name));
      setResultB(calculateImpact(tokens, modelB.id, modelB.name));
    }, 200);
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/,/g, "");
    if (!isNaN(Number(val))) setTokens(Number(val));
  };

  const maxWater =
    resultA && resultB ? Math.max(resultA.waterLiters, resultB.waterLiters) : 0;
  const maxEnergy =
    resultA && resultB ? Math.max(resultA.energyKwh, resultB.energyKwh) : 0;
  const maxCarbon =
    resultA && resultB ? Math.max(resultA.carbonGrams, resultB.carbonGrams) : 0;

  const profileA = modelA ? getEnvironmentalProfile(modelA.id) : null;
  const profileB = modelB ? getEnvironmentalProfile(modelB.id) : null;

  return (
    <main className="min-h-screen flex flex-col font-sans relative">
      <PageBackground />

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />

        <div className="flex-1 max-w-7xl mx-auto w-full px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <span className="text-xs tracking-[0.2em] text-muted uppercase font-sans">
              Comparative Analysis / 02
            </span>
            <h1 className="text-5xl md:text-6xl mt-4 leading-[1.1] font-sans font-semibold text-foreground">
              Same tokens, <br />
              <span className="text-accent">Different cost.</span>
            </h1>
            <p className="text-muted text-lg max-w-xl mt-6 font-sans">
              Pick any two models. Enter a token count. See how the
              environmental footprint of the same task differs between them.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <MiniModelPicker
                label="Model A"
                selected={modelA}
                onSelect={setModelA}
                accentColor="a"
              />
              <MiniModelPicker
                label="Model B"
                selected={modelB}
                onSelect={setModelB}
                accentColor="b"
              />
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted font-sans">
                Total tokens
              </span>
              <input
                type="text"
                value={tokens.toLocaleString("en-IN")}
                onChange={handleTokenChange}
                className="bg-transparent border border-border p-4 rounded-md text-foreground text-lg focus:outline-none focus:border-accent transition-colors font-sans"
              />
              <div className="flex flex-wrap gap-2">
                {QUICK_TOKENS.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setTokens(item.value)}
                    className={`px-3 py-1.5 text-xs rounded-md border transition-colors font-sans ${
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

            <div className="lg:col-span-2 flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCompare}
                disabled={!modelA || !modelB}
                className="w-full bg-accent text-background font-medium py-4 rounded-full text-sm hover:bg-accent/90 transition-colors font-sans disabled:opacity-50"
              >
                Compare
              </motion.button>
            </div>
          </div>

          {profileA && modelA && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              <div className="border border-rose-400/20 rounded-lg p-5 bg-foreground/[0.04]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-rose-400 font-sans">
                    {modelA.name}
                  </span>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-sans px-2 py-0.5 rounded ${
                      profileA.confidence === "measured"
                        ? "bg-accent/20 text-accent"
                        : profileA.confidence === "estimated"
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                          : "bg-foreground/10 text-muted"
                    }`}
                  >
                    {profileA.confidence}
                  </span>
                </div>
                <p className="text-xs text-muted font-sans leading-relaxed">
                  {profileA.source}
                </p>
              </div>
              {profileB && modelB && (
                <div className="border border-accent/20 rounded-lg p-5 bg-foreground/[0.04]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-accent font-sans">
                      {modelB.name}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-sans px-2 py-0.5 rounded ${
                        profileB.confidence === "measured"
                          ? "bg-accent/20 text-accent"
                          : profileB.confidence === "estimated"
                            ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                            : "bg-foreground/10 text-muted"
                      }`}
                    >
                      {profileB.confidence}
                    </span>
                  </div>
                  <p className="text-xs text-muted font-sans leading-relaxed">
                    {profileB.source}
                  </p>
                </div>
              )}
            </div>
          )}

          {resultA && resultB ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="border border-border rounded-lg p-8 md:p-12 bg-foreground/[0.04] flex flex-col gap-12"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-border">
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-muted font-sans">
                    Headline
                  </span>
                  <div className="mt-2 flex items-baseline gap-3 flex-wrap">
                    <span className="text-4xl md:text-5xl font-sans font-semibold text-foreground">
                      {Math.max(
                        resultA.waterLiters / (resultB.waterLiters || 1),
                        resultB.waterLiters / (resultA.waterLiters || 1),
                      ).toFixed(1)}
                      <span className="text-accent">×</span>
                    </span>
                    <span className="text-muted text-lg font-sans max-w-xs">
                      water difference between{" "}
                      <span className="text-rose-400">
                        {resultA.waterLiters > resultB.waterLiters
                          ? modelA?.name
                          : modelB?.name}
                      </span>{" "}
                      and{" "}
                      <span className="text-accent">
                        {resultA.waterLiters > resultB.waterLiters
                          ? modelB?.name
                          : modelA?.name}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[20px] tracking-[0.2em] uppercase text-muted font-sans">
                    Tokens compared
                  </span>
                  <div className="font-mono text-2xl text-foreground mt-2">
                    {tokens.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              <ResultBar
                label="Water"
                valueA={resultA.waterLiters}
                valueB={resultB.waterLiters}
                unit="Liters"
                maxValue={maxWater}
                modelAName={modelA?.name || "A"}
                modelBName={modelB?.name || "B"}
              />

              <ResultBar
                label="Energy"
                valueA={resultA.energyKwh}
                valueB={resultB.energyKwh}
                unit="kWh"
                maxValue={maxEnergy}
                modelAName={modelA?.name || "A"}
                modelBName={modelB?.name || "B"}
              />

              <ResultBar
                label="Carbon"
                valueA={resultA.carbonGrams}
                valueB={resultB.carbonGrams}
                unit="gCO₂"
                maxValue={maxCarbon}
                modelAName={modelA?.name || "A"}
                modelBName={modelB?.name || "B"}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border">
                <div>
                  <span className="text-[20px] tracking-[0.2em] uppercase text-muted font-sans">
                    Water in bottles
                  </span>
                  <div className="font-sans text-lg text-foreground mt-2">
                    <span className="text-rose-400 font-mono">
                      {resultA.waterBottles}
                    </span>{" "}
                    vs{" "}
                    <span className="text-accent font-mono">
                      {resultB.waterBottles}
                    </span>
                  </div>
                  <p className="text-[20px] text-faint mt-1 font-sans">
                    500 mL bottles
                  </p>
                </div>
                <div>
                  <span className="text-[20px] tracking-[0.2em] uppercase text-muted font-sans">
                    Ratio
                  </span>
                  <div className="font-sans text-lg text-foreground mt-2 font-mono">
                    {resultA.waterLiters >= resultB.waterLiters
                      ? "A is heavier"
                      : "B is heavier"}
                  </div>
                  <p className="text-[20px] text-faint mt-1 font-sans">
                    By environmental cost
                  </p>
                </div>
                <div>
                  <span className="text-[20px] tracking-[0.2em] uppercase text-muted font-sans">
                    Recommended
                  </span>
                  <div className="font-sans text-lg text-accent mt-2">
                    {resultA.waterLiters < resultB.waterLiters
                      ? modelA?.name
                      : modelB?.name}
                  </div>
                  <p className="text-[20px] text-faint mt-1 font-sans">
                    Lower footprint for this workload
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="border border-border rounded-lg p-16 text-center bg-foreground/[0.04]">
              <h3 className="text-3xl text-muted font-sans font-semibold">
                Select two models to compare.
              </h3>
              <p className="text-faint text-sm mt-3 font-sans">
                The comparison visualizes water, energy, and carbon side by
                side.
              </p>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </main>
  );
}
