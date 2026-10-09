"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import ModelSelector from "@/components/calculator/ModelSelector";
import {
  calculateWhatIfImpact,
  InfraAssumptions,
  PRESETS,
  REFERENCE_ASSUMPTIONS,
} from "@/lib/math/whatif";
import { ImpactResult } from "@/lib/math/modelEstimator";
import { OpenRouterModel } from "@/lib/openrouter";

const DEFAULT_MODEL: OpenRouterModel = {
  id: "openai/gpt-4o",
  name: "OpenAI: GPT-4o",
  description: "OpenAI flagship multimodal model",
  contextLength: 128000,
  pricing: { prompt: "0", completion: "0" },
  provider: "openai",
};

const TOKEN_PRESETS = [
  { label: "10K", value: 10000 },
  { label: "50K", value: 50000 },
  { label: "1L", value: 100000 },
  { label: "10L", value: 1000000 },
  { label: "1Cr", value: 10000000 },
];

function formatValue(n: number, decimals = 4): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1000000) return n.toExponential(2);
  if (Math.abs(n) >= 1000)
    return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  if (Math.abs(n) >= 1) return n.toFixed(2);
  if (Math.abs(n) >= 0.001) return n.toFixed(decimals);
  return n.toExponential(2);
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  minLabel: string;
  maxLabel: string;
  onChange: (value: number) => void;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  minLabel,
  maxLabel,
  onChange,
}: SliderProps) {
  return (
    <div className="flex flex-col gap-3 font-sans">
      <div className="flex items-center justify-between">
        <label className="text-sm text-foreground">{label}</label>
        <span className="font-mono text-sm text-accent">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-foreground/10 rounded-full appearance-none cursor-pointer accent-accent"
      />
      <div className="flex justify-between text-[10px] text-faint tracking-wider uppercase">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

interface CompareCellProps {
  label: string;
  baseline: number;
  adjusted: number;
  unit: string;
  isWater?: boolean;
}

function CompareCell({
  label,
  baseline,
  adjusted,
  unit,
  isWater,
}: CompareCellProps) {
  const ratio = baseline > 0 ? adjusted / baseline : 1;
  const deltaPercent = (ratio - 1) * 100;
  const isReduction = ratio < 1;

  return (
    <div className="flex flex-col gap-4 p-6 border border-border rounded-lg bg-foreground/[0.03]">
      <span className="text-[10px] tracking-[0.2em] uppercase text-muted font-sans">
        {label}
      </span>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[10px] text-faint font-sans uppercase tracking-wider">
            Baseline
          </span>
          <span className="font-mono text-sm text-muted">
            {formatValue(baseline)} {unit}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[10px] text-accent font-sans uppercase tracking-wider">
            Adjusted
          </span>
          <span
            className={`font-mono text-lg ${
              isWater ? "text-accent" : "text-foreground"
            }`}
          >
            {formatValue(adjusted)} {unit}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
            isReduction
              ? "bg-accent/20 text-accent"
              : "bg-rose-500/20 text-rose-400"
          }`}
        >
          {isReduction ? "−" : "+"}
          {Math.abs(deltaPercent).toFixed(0)}%
        </span>
        <span className="text-[10px] text-faint font-sans">
          {isReduction ? "reduction" : "increase"} vs. baseline
        </span>
      </div>
    </div>
  );
}

export default function WhatIfPage() {
  const [model, setModel] = useState<OpenRouterModel | null>(DEFAULT_MODEL);
  const [tokens, setTokens] = useState(50000);
  const [assumptions, setAssumptions] = useState<InfraAssumptions>(
    REFERENCE_ASSUMPTIONS,
  );
  const [activePreset, setActivePreset] = useState<string>("standard");

  const baseline: ImpactResult | null = model
    ? calculateWhatIfImpact(tokens, model.id, model.name, REFERENCE_ASSUMPTIONS)
    : null;

  const adjusted: ImpactResult | null = model
    ? calculateWhatIfImpact(tokens, model.id, model.name, assumptions)
    : null;

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/,/g, "");
    if (!isNaN(Number(val))) setTokens(Number(val));
  };

  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setAssumptions(preset.assumptions);
    setActivePreset(presetId);
  };

  const updateAssumption = (key: keyof InfraAssumptions, value: number) => {
    setAssumptions({ ...assumptions, [key]: value });
    setActivePreset("custom");
  };

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
              What-If Simulator / 04
            </span>
            <h1 className="text-5xl md:text-6xl mt-4 leading-[1.1] font-sans font-semibold text-foreground">
              Same tokens. <br />
              <span className="text-accent">Different infrastructure.</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mt-6 font-sans">
              The published per-token coefficients assume average
              infrastructure. Change the cooling, water efficiency, or grid mix
              and see how much the footprint moves.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="border border-border rounded-lg p-8 bg-foreground/[0.04] flex flex-col gap-8">
                <h3 className="text-xs tracking-[0.2em] text-muted uppercase font-sans">
                  Workload
                </h3>

                <ModelSelector selectedModel={model} onSelect={setModel} />

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
                  <div className="flex flex-wrap gap-2 mt-1">
                    {TOKEN_PRESETS.map((item) => (
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
              </div>

              <div className="border border-border rounded-lg p-8 bg-foreground/[0.04] flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs tracking-[0.2em] text-muted uppercase font-sans">
                    Infrastructure
                  </h3>
                  <span className="text-[10px] tracking-wider uppercase text-faint font-sans">
                    {activePreset === "custom"
                      ? "Custom"
                      : PRESETS.find((p) => p.id === activePreset)?.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset.id)}
                      className={`px-3 py-2.5 text-xs rounded-md border transition-colors font-sans text-left ${
                        activePreset === preset.id
                          ? "border-accent text-accent bg-accent/10"
                          : "border-border text-muted hover:border-foreground/50 hover:text-foreground"
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>

                {activePreset !== "custom" && (
                  <p className="text-xs text-faint font-sans leading-relaxed -mt-2">
                    {PRESETS.find((p) => p.id === activePreset)?.description}
                  </p>
                )}

                <div className="flex flex-col gap-8 pt-2">
                  <Slider
                    label="PUE — Power Usage Effectiveness"
                    value={assumptions.pue}
                    min={1.05}
                    max={2.0}
                    step={0.05}
                    unit=""
                    minLabel="Hyperscale 1.05"
                    maxLabel="Legacy 2.0"
                    onChange={(v) => updateAssumption("pue", v)}
                  />
                  <Slider
                    label="WUE — Water Usage Effectiveness"
                    value={assumptions.wue}
                    min={0.1}
                    max={5.0}
                    step={0.1}
                    unit="L/kWh"
                    minLabel="Air 0.1"
                    maxLabel="Evaporative 5.0"
                    onChange={(v) => updateAssumption("wue", v)}
                  />
                  <Slider
                    label="Grid Carbon Intensity"
                    value={assumptions.carbonIntensity}
                    min={20}
                    max={800}
                    step={10}
                    unit="gCO₂/kWh"
                    minLabel="Hydro 20"
                    maxLabel="Coal 800"
                    onChange={(v) => updateAssumption("carbonIntensity", v)}
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-6">
              {baseline && adjusted && model && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="border border-border rounded-lg p-8 bg-foreground/[0.04] flex flex-col gap-8"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <span className="text-[10px] tracking-[0.2em] uppercase text-muted font-sans">
                        Comparison
                      </span>
                      <div className="text-foreground font-sans text-sm mt-1">
                        {tokens.toLocaleString("en-IN")} tokens on {model.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] tracking-wider uppercase text-faint font-sans">
                        Baseline:
                      </span>
                      <span className="text-[10px] text-muted font-mono">
                        PUE {REFERENCE_ASSUMPTIONS.pue} · WUE{" "}
                        {REFERENCE_ASSUMPTIONS.wue} ·{" "}
                        {REFERENCE_ASSUMPTIONS.carbonIntensity} gCO₂/kWh
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CompareCell
                      label="Energy"
                      baseline={baseline.energyKwh}
                      adjusted={adjusted.energyKwh}
                      unit="kWh"
                    />
                    <CompareCell
                      label="Water"
                      baseline={baseline.waterLiters}
                      adjusted={adjusted.waterLiters}
                      unit="L"
                      isWater
                    />
                    <CompareCell
                      label="Carbon"
                      baseline={baseline.carbonGrams}
                      adjusted={adjusted.carbonGrams}
                      unit="gCO₂"
                    />
                  </div>

                  <div className="border-t border-border pt-6">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-muted font-sans">
                      The takeaway
                    </span>
                    <p className="text-foreground font-sans text-lg mt-3 leading-relaxed max-w-2xl">
                      {assumptions.wue < REFERENCE_ASSUMPTIONS.wue
                        ? `Switching to this infrastructure cuts water by `
                        : assumptions.wue > REFERENCE_ASSUMPTIONS.wue
                          ? `This infrastructure increases water by `
                          : `Water stays roughly the same, but `}
                      <span className="text-accent font-mono">
                        {Math.abs(
                          (adjusted.waterLiters / (baseline.waterLiters || 1) -
                            1) *
                            100,
                        ).toFixed(0)}
                        %
                      </span>
                      . Same model, same tokens — just a different data center.
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="border border-border rounded-lg p-6 bg-foreground/[0.02] flex flex-col gap-3">
                <span className="text-[10px] tracking-[0.2em] uppercase text-muted font-sans">
                  Why these three
                </span>
                <div className="flex flex-col gap-3 text-xs text-muted font-sans leading-relaxed">
                  <p>
                    <span className="text-foreground">PUE</span> — how much
                    overhead the data center adds on top of the raw GPU energy.
                    Cooling, distribution, lighting. Modern AI facilities run
                    1.05–1.15. Older colo runs 1.5–2.0.
                  </p>
                  <p>
                    <span className="text-foreground">WUE</span> — liters of
                    water evaporated per kWh of IT energy. Air-cooled in cool
                    climates drops to 0.1–0.3. Evaporative cooling in hot
                    regions hits 3–5.
                  </p>
                  <p>
                    <span className="text-foreground">Grid intensity</span> —
                    grams of CO₂ per kWh consumed. Hydro and nuclear run under
                    50. Coal-heavy grids run 700–800. Same electricity, wildly
                    different carbon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
