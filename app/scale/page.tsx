"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import ModelSelector from "@/components/calculator/ModelSelector";
import CountrySelector from "@/components/CountrySelector";
import {
  calculateImpact,
  calculateEquivalents,
  ImpactResult,
  Equivalents,
} from "@/lib/math/modelEstimator";
import { OpenRouterModel } from "@/lib/openrouter";
import { COUNTRIES, CountryData } from "@/lib/countries";
import ScaleChart from "@/components/ScaleChart";

const DEFAULT_MODEL: OpenRouterModel = {
  id: "openai/gpt-4o",
  name: "OpenAI: GPT-4o",
  description: "OpenAI flagship multimodal model",
  contextLength: 128000,
  pricing: { prompt: "0", completion: "0" },
  provider: "openai",
};

const REQUEST_PRESETS = [
  { label: "100", value: 100 },
  { label: "1K", value: 1000 },
  { label: "10K", value: 10000 },
  { label: "100K", value: 100000 },
  { label: "1M", value: 1000000 },
  { label: "10M", value: 10000000 },
];

interface Projection {
  daily: ImpactResult;
  monthly: ImpactResult;
  yearly: ImpactResult;
  totalDailyTokens: number;
}

function formatNumber(n: number, decimals = 2): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1000000) return n.toExponential(2);
  if (Math.abs(n) >= 1000)
    return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  if (Math.abs(n) >= 1) return n.toFixed(decimals);
  if (Math.abs(n) >= 0.001) return n.toFixed(4);
  return n.toExponential(2);
}

export default function ScalePage() {
  const [model, setModel] = useState<OpenRouterModel | null>(DEFAULT_MODEL);
  const [country, setCountry] = useState<CountryData>(COUNTRIES[0]);
  const [requestsPerDay, setRequestsPerDay] = useState(1000);
  const [inputTokens, setInputTokens] = useState(500);
  const [outputTokens, setOutputTokens] = useState(500);
  const [projection, setProjection] = useState<Projection | null>(null);
  const [equivalents, setEquivalents] = useState<Equivalents | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    if (!model) return;
    setIsCalculating(true);
    setProjection(null);
    setEquivalents(null);

    setTimeout(() => {
      const tokensPerRequest = inputTokens + outputTokens;
      const totalDailyTokens = requestsPerDay * tokensPerRequest;

      const daily = calculateImpact(totalDailyTokens, model.id, model.name);
      const monthly = calculateImpact(
        totalDailyTokens * 30,
        model.id,
        model.name,
      );
      const yearly = calculateImpact(
        totalDailyTokens * 365,
        model.id,
        model.name,
      );

      setProjection({ daily, monthly, yearly, totalDailyTokens });
      setEquivalents(
        calculateEquivalents(
          monthly.waterLiters,
          monthly.energyKwh,
          monthly.carbonGrams,
          country.code,
        ),
      );
      setIsCalculating(false);
    }, 700);
  };

  const handleNumber = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (n: number) => void,
  ) => {
    const val = e.target.value.replace(/,/g, "");
    if (!isNaN(Number(val))) setter(Number(val));
  };

  const tokensPerRequest = inputTokens + outputTokens;
  const totalDailyTokens = requestsPerDay * tokensPerRequest;

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
              Scale Simulation / 03
            </span>
            <h1 className="text-5xl md:text-6xl mt-4 leading-[1.1] font-sans font-semibold text-foreground">
              What does your <br />
              <span className="text-accent">chatbot cost the planet?</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mt-6 font-sans">
              Enter real-world traffic assumptions. See daily, monthly, and
              yearly projections with equivalents that match your region.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="border border-border rounded-lg p-8 bg-foreground/[0.04] flex flex-col gap-8">
                <h3 className="text-xs tracking-[0.2em] text-muted uppercase font-sans">
                  Traffic Configuration
                </h3>

                <ModelSelector selectedModel={model} onSelect={setModel} />

                <CountrySelector selected={country} onSelect={setCountry} />

                <div className="flex flex-col gap-3">
                  <label className="text-sm text-foreground font-sans">
                    Requests / day
                  </label>
                  <input
                    type="text"
                    value={requestsPerDay.toLocaleString("en-IN")}
                    onChange={(e) => handleNumber(e, setRequestsPerDay)}
                    className="bg-transparent border border-border p-4 rounded-md text-foreground text-lg focus:outline-none focus:border-accent transition-colors font-sans"
                  />
                  <div className="flex flex-wrap gap-2 mt-1">
                    {REQUEST_PRESETS.map((item) => (
                      <button
                        key={item.value}
                        onClick={() => setRequestsPerDay(item.value)}
                        className={`px-3 py-1.5 text-xs rounded-md border transition-colors font-sans ${
                          requestsPerDay === item.value
                            ? "border-accent text-accent bg-accent/10"
                            : "border-border text-muted hover:border-foreground/50 hover:text-foreground"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <label className="text-sm text-foreground font-sans">
                      Input tokens
                    </label>
                    <input
                      type="text"
                      value={inputTokens.toLocaleString("en-IN")}
                      onChange={(e) => handleNumber(e, setInputTokens)}
                      className="bg-transparent border border-border p-4 rounded-md text-foreground text-lg focus:outline-none focus:border-accent transition-colors font-sans"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm text-foreground font-sans">
                      Output tokens
                    </label>
                    <input
                      type="text"
                      value={outputTokens.toLocaleString("en-IN")}
                      onChange={(e) => handleNumber(e, setOutputTokens)}
                      className="bg-transparent border border-border p-4 rounded-md text-foreground text-lg focus:outline-none focus:border-accent transition-colors font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <label className="text-sm text-foreground font-sans">
                      Tokens / request
                    </label>
                    <input
                      type="text"
                      value={tokensPerRequest.toLocaleString("en-IN")}
                      readOnly
                      className="bg-foreground/5 border border-border p-4 rounded-md text-muted text-lg font-sans cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm text-foreground font-sans">
                      Total tokens / day
                    </label>
                    <input
                      type="text"
                      value={totalDailyTokens.toLocaleString("en-IN")}
                      readOnly
                      className="bg-foreground/5 border border-border p-4 rounded-md text-accent text-lg font-mono cursor-not-allowed"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: isCalculating ? 1 : 1.02 }}
                  whileTap={{ scale: isCalculating ? 1 : 0.98 }}
                  onClick={handleCalculate}
                  disabled={isCalculating || !model}
                  className="w-full bg-accent text-background font-medium py-4 rounded-full text-sm hover:bg-accent/90 transition-colors font-sans relative overflow-hidden disabled:opacity-50"
                >
                  <motion.span
                    animate={{ opacity: isCalculating ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    Run Simulation
                  </motion.span>
                  {isCalculating && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center gap-2"
                    >
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full"
                      />
                      Simulating...
                    </motion.span>
                  )}
                </motion.button>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-6">
              <AnimatePresence mode="wait">
                {!projection && !isCalculating && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border border-border rounded-lg p-16 text-center bg-foreground/[0.02] h-full flex flex-col items-center justify-center gap-4"
                  >
                    <h3 className="text-3xl text-muted font-sans font-semibold">
                      Configure and simulate.
                    </h3>
                    <p className="text-faint text-sm font-sans max-w-md">
                      Adjust your traffic assumptions, then run the simulation
                      to see projected environmental impact across time.
                    </p>
                  </motion.div>
                )}

                {isCalculating && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border border-border rounded-lg p-16 bg-foreground/[0.02] h-full flex flex-col items-center justify-center gap-4"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full"
                    />
                    <p className="text-muted text-sm font-sans">
                      Running projections...
                    </p>
                  </motion.div>
                )}

                {projection && equivalents && !isCalculating && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1] as [
                        number,
                        number,
                        number,
                        number,
                      ],
                    }}
                    className="flex flex-col gap-6"
                  >
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Daily", data: projection.daily },
                        { label: "Monthly", data: projection.monthly },
                        { label: "Yearly", data: projection.yearly },
                      ].map((period, i) => (
                        <motion.div
                          key={period.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          className="border border-border rounded-lg p-6 bg-foreground/[0.04]"
                        >
                          <span className="text-[10px] tracking-[0.2em] uppercase text-muted font-sans">
                            {period.label}
                          </span>
                          <div className="flex flex-col gap-4 mt-4">
                            <div>
                              <div className="text-[10px] text-faint font-sans uppercase tracking-wider">
                                Water
                              </div>
                              <div className="font-mono text-accent text-lg mt-1">
                                {formatNumber(period.data.waterLiters)}
                              </div>
                              <div className="text-[10px] text-faint font-sans">
                                L
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-faint font-sans uppercase tracking-wider">
                                Energy
                              </div>
                              <div className="font-mono text-foreground text-lg mt-1">
                                {formatNumber(period.data.energyKwh)}
                              </div>
                              <div className="text-[10px] text-faint font-sans">
                                kWh
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-faint font-sans uppercase tracking-wider">
                                Carbon
                              </div>
                              <div className="font-mono text-foreground text-lg mt-1">
                                {formatNumber(period.data.carbonGrams)}
                              </div>
                              <div className="text-[10px] text-faint font-sans">
                                gCO₂
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="border border-border rounded-lg p-8 bg-foreground/[0.04]">
                      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                        <span className="text-xs tracking-[0.2em] uppercase text-muted font-sans">
                          Monthly equivalents
                        </span>
                        <span className="text-[10px] text-faint font-sans">
                          {country.flag} {country.name} · {model?.name} ·{" "}
                          {requestsPerDay.toLocaleString("en-IN")} req/day
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col gap-4">
                          <span className="text-[10px] tracking-[0.2em] uppercase text-accent font-sans">
                            Water
                          </span>
                          <div className="flex flex-col gap-3">
                            <div>
                              <div className="font-mono text-2xl text-foreground">
                                {formatNumber(equivalents.water.buckets, 0)}
                              </div>
                              <div className="text-[10px] text-faint font-sans mt-0.5">
                                {equivalents.water.bucketLabel}
                              </div>
                            </div>
                            <div>
                              <div className="font-mono text-lg text-muted">
                                {formatNumber(equivalents.water.bottles, 0)}
                              </div>
                              <div className="text-[10px] text-faint font-sans">
                                {equivalents.water.bottleLabel}
                              </div>
                            </div>
                            <div>
                              <div className="font-mono text-lg text-muted">
                                {formatNumber(equivalents.water.showers, 0)}
                              </div>
                              <div className="text-[10px] text-faint font-sans">
                                10-min showers
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          <span className="text-[10px] tracking-[0.2em] uppercase text-accent font-sans">
                            Energy
                          </span>
                          <div className="flex flex-col gap-3">
                            <div>
                              <div className="font-mono text-2xl text-foreground">
                                {formatNumber(equivalents.energy.acHours, 0)}
                              </div>
                              <div className="text-[10px] text-faint font-sans mt-0.5">
                                {equivalents.energy.acLabel}
                              </div>
                            </div>
                            <div>
                              <div className="font-mono text-lg text-muted">
                                {formatNumber(
                                  equivalents.energy.householdDays,
                                  0,
                                )}
                              </div>
                              <div className="text-[10px] text-faint font-sans">
                                {equivalents.energy.householdLabel}
                              </div>
                            </div>
                            <div>
                              <div className="font-mono text-lg text-muted">
                                {formatNumber(
                                  equivalents.energy.ledBulbHours,
                                  0,
                                )}
                              </div>
                              <div className="text-[10px] text-faint font-sans">
                                LED bulb hours
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          <span className="text-[10px] tracking-[0.2em] uppercase text-accent font-sans">
                            Carbon
                          </span>
                          <div className="flex flex-col gap-3">
                            <div>
                              <div className="font-mono text-2xl text-foreground">
                                {formatNumber(
                                  equivalents.carbon.domesticFlights,
                                  4,
                                )}
                              </div>
                              <div className="text-[10px] text-faint font-sans mt-0.5">
                                {equivalents.carbon.flightLabel}
                              </div>
                            </div>
                            <div>
                              <div className="font-mono text-lg text-muted">
                                {formatNumber(equivalents.carbon.treesYear, 2)}
                              </div>
                              <div className="text-[10px] text-faint font-sans">
                                tree-years
                              </div>
                            </div>
                            <div>
                              <div className="font-mono text-lg text-muted">
                                {formatNumber(equivalents.carbon.carKm, 0)}
                              </div>
                              <div className="text-[10px] text-faint font-sans">
                                km driven in a car
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-border rounded-lg p-4 bg-foreground/[0.02] flex items-center gap-3">
                      <span
                        className={`text-[10px] uppercase tracking-wider font-sans px-2 py-0.5 rounded shrink-0 ${
                          projection.monthly.confidence === "measured"
                            ? "bg-accent/20 text-accent"
                            : projection.monthly.confidence === "estimated"
                              ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                              : "bg-foreground/10 text-muted"
                        }`}
                      >
                        {projection.monthly.confidence}
                      </span>
                      <span className="text-xs text-faint font-sans">
                        {projection.monthly.source}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <ScaleChart
                model={model}
                inputTokens={inputTokens}
                outputTokens={outputTokens}
                currentRequestsPerDay={requestsPerDay}
              />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
