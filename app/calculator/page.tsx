"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import ConfigurationPanel from "@/components/calculator/ConfigurationPanel";
import ResultsPanel from "@/components/calculator/ResultsPanel";
import { calculateImpact, ImpactResult } from "@/lib/math/modelEstimator";
import { OpenRouterModel } from "@/lib/openrouter";

const DEFAULT_MODEL: OpenRouterModel = {
  id: "openai/gpt-4o",
  name: "OpenAI: GPT-4o",
  description: "OpenAI flagship multimodal model",
  contextLength: 128000,
  pricing: { prompt: "0.0000025", completion: "0.00001" },
  provider: "openai",
};

export default function CalculatorPage() {
  const [result, setResult] = useState<ImpactResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedModel, setSelectedModel] = useState<OpenRouterModel | null>(
    DEFAULT_MODEL,
  );

  const handleCalculate = (tokens: number, model: OpenRouterModel) => {
    setIsCalculating(true);
    setResult(null);

    setTimeout(() => {
      const impact = calculateImpact(tokens, model.id, model.name);
      setResult(impact);
      setIsCalculating(false);
    }, 800);
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
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
            className="mb-16"
          >
            <span className="text-xs tracking-[0.2em] text-muted uppercase font-sans">
              Environmental Impact / 01
            </span>
            <h1 className="text-5xl md:text-6xl mt-4 leading-[1.1] font-sans font-semibold text-foreground">
              Understand your <br />
              <span className="text-accent">AI footprint.</span>
            </h1>
            <p className="text-muted text-lg max-w-xl mt-6 font-sans">
              Search 400+ real models and estimate the energy, water, and carbon
              impact of any AI workload.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ConfigurationPanel
              onCalculate={handleCalculate}
              isCalculating={isCalculating}
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
            />
            <ResultsPanel result={result} isCalculating={isCalculating} />
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
