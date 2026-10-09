"use client";

import { motion } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { MODEL_PROFILES } from "@/lib/math/modelEstimator";

const SECTIONS = [
  { id: "formula", label: "01 — The Formula" },
  { id: "profiles", label: "02 — Model Profiles" },
  { id: "confidence", label: "03 — Confidence Levels" },
  { id: "limitations", label: "04 — What We Don't Measure" },
  { id: "references", label: "05 — References" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen flex flex-col font-sans relative">
      <PageBackground />

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />

        <div className="max-w-7xl mx-auto w-full px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-24 max-w-3xl"
          >
            <span className="text-xs tracking-[0.2em] text-muted uppercase font-sans">
              Methodology / Transparency
            </span>
            <h1 className="font-serif text-6xl md:text-7xl mt-6 leading-[1.05] text-foreground">
              How is this <br />
              <span className="italic text-accent">calculated?</span>
            </h1>
            <p className="text-muted text-lg mt-8 max-w-xl font-sans leading-relaxed">
              Every number AquaCompute produces is traceable. This page exposes
              the formulas, the source data, the assumptions, and the boundaries
              of what we can honestly estimate.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <aside className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-8 flex flex-col gap-3">
                {SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-sm text-muted hover:text-accent transition-colors font-sans"
                  >
                    {section.label}
                  </a>
                ))}
              </div>
            </aside>

            <div className="lg:col-span-9 flex flex-col gap-32">
              <motion.section
                id="formula"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="font-serif text-4xl md:text-5xl mb-8 text-foreground">
                  <span className="text-accent">01</span> — The Formula
                </h2>
                <p className="text-muted text-lg font-sans leading-relaxed mb-10 max-w-2xl">
                  AquaCompute does not use a single magic constant. Each model
                  has its own measured or estimated profile, expressed per 1,000
                  tokens. The calculation is deliberately simple so anyone can
                  verify it.
                </p>

                <div className="rounded-lg bg-[#0B0B0B] border border-[#1F1F1F] p-8 font-mono text-sm overflow-x-auto">
                  <div className="text-[#6B6B6B] mb-4">Core calculation</div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="text-[#6EE7B7]">energy_kWh</span>
                      <span className="text-[#B8B8B8]">
                        {" "}
                        = (tokens / 1000) × (Wh_per_1k / 1000)
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6EE7B7]">water_L</span>
                      <span className="text-[#B8B8B8]">
                        {" "}
                        = (tokens / 1000) × (mL_per_1k / 1000)
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6EE7B7]">carbon_gCO2</span>
                      <span className="text-[#B8B8B8]">
                        {" "}
                        = (tokens / 1000) × g_per_1k
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6EE7B7]">water_bottles</span>
                      <span className="text-[#B8B8B8]"> = water_L / 0.5</span>
                    </div>
                  </div>
                </div>

                <p className="text-faint text-sm font-sans mt-6 max-w-2xl leading-relaxed">
                  The per-1K values already incorporate data center overhead
                  (PUE, cooling, distribution losses) when they come from
                  published measurements. For extrapolated models, we apply
                  provider-specific baselines scaled by model size class.
                </p>
              </motion.section>

              <motion.section
                id="profiles"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="font-serif text-4xl md:text-5xl mb-8 text-foreground">
                  <span className="text-accent">02</span> — Model Profiles
                </h2>
                <p className="text-muted text-lg font-sans leading-relaxed mb-10 max-w-2xl">
                  Published environmental data exists for a small set of models.
                  For everything else, we extrapolate — and we tell you when we
                  do.
                </p>

                <div className="border border-border rounded-lg overflow-hidden bg-foreground/[0.04]">
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border text-xs tracking-widest uppercase text-muted font-sans">
                    <div className="col-span-4">Model</div>
                    <div className="col-span-2 text-right">Wh / 1K</div>
                    <div className="col-span-2 text-right">mL / 1K</div>
                    <div className="col-span-2 text-right">g CO₂ / 1K</div>
                    <div className="col-span-2 text-right">Confidence</div>
                  </div>
                  {MODEL_PROFILES.map((profile, i) => (
                    <motion.div
                      key={profile.id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-border last:border-0 hover:bg-accent/5 transition-colors items-center"
                    >
                      <div className="col-span-4">
                        <div className="text-foreground font-sans text-sm">
                          {profile.name}
                        </div>
                        <div className="text-faint text-xs mt-1">
                          {profile.description}
                        </div>
                      </div>
                      <div className="col-span-2 text-right font-mono text-sm text-foreground">
                        {profile.energyPer1kTokensWh}
                      </div>
                      <div className="col-span-2 text-right font-mono text-sm text-foreground">
                        {profile.waterPer1kTokensMl}
                      </div>
                      <div className="col-span-2 text-right font-mono text-sm text-foreground">
                        {profile.carbonPer1kTokensG}
                      </div>
                      <div className="col-span-2 text-right">
                        <span
                          className={`text-[10px] uppercase tracking-wider font-sans px-2 py-1 rounded ${
                            profile.confidence === "measured"
                              ? "bg-accent/20 text-accent"
                              : profile.confidence === "estimated"
                                ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                : "bg-foreground/10 text-muted"
                          }`}
                        >
                          {profile.confidence}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              <motion.section
                id="confidence"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="font-serif text-4xl md:text-5xl mb-8 text-foreground">
                  <span className="text-accent">03</span> — Confidence Levels
                </h2>
                <p className="text-muted text-lg font-sans leading-relaxed mb-10 max-w-2xl">
                  We refuse to present fake precision. Every result is tagged
                  with how much we actually know about that model's
                  environmental footprint.
                </p>

                <div className="flex flex-col gap-4">
                  <div className="border border-border rounded-lg p-6 bg-foreground/[0.04] flex gap-6 items-start">
                    <span className="text-[10px] uppercase tracking-wider font-sans px-3 py-1 rounded bg-accent/20 text-accent whitespace-nowrap mt-1">
                      Measured
                    </span>
                    <div>
                      <h3 className="font-serif text-xl mb-2 text-foreground">
                        Ground truth from published research
                      </h3>
                      <p className="text-muted text-sm font-sans leading-relaxed">
                        The model's per-token impact comes from peer-reviewed
                        studies, provider sustainability reports, or direct
                        measurement. This is the highest tier of confidence.
                        Currently applies to GPT-4o and Gemini.
                      </p>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-6 bg-foreground/[0.04] flex gap-6 items-start">
                    <span className="text-[10px] uppercase tracking-wider font-sans px-3 py-1 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 whitespace-nowrap mt-1">
                      Estimated
                    </span>
                    <div>
                      <h3 className="font-serif text-xl mb-2 text-foreground">
                        Extrapolated from benchmarks
                      </h3>
                      <p className="text-muted text-sm font-sans leading-relaxed">
                        The model was benchmarked by third parties but the
                        provider hasn't published per-token sustainability data.
                        We scale from measured benchmarks with documented
                        assumptions. Applies to Claude 3 Opus, Claude 3 Haiku,
                        and Llama 3.3 70B.
                      </p>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-6 bg-foreground/[0.04] flex gap-6 items-start">
                    <span className="text-[10px] uppercase tracking-wider font-sans px-3 py-1 rounded bg-foreground/10 text-muted whitespace-nowrap mt-1">
                      Extrapolated
                    </span>
                    <div>
                      <h3 className="font-serif text-xl mb-2 text-foreground">
                        Inferred from provider and size class
                      </h3>
                      <p className="text-muted text-sm font-sans leading-relaxed">
                        For the 400+ models without any specific data, we apply
                        provider-level baselines scaled by model size class.
                        Treat these numbers as directional, not absolute. Every
                        extrapolated result on the calculator carries this
                        warning.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>

              <motion.section
                id="limitations"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="font-serif text-4xl md:text-5xl mb-8 text-foreground">
                  <span className="text-accent">04</span> — What We Don't
                  Measure
                </h2>
                <p className="text-muted text-lg font-sans leading-relaxed mb-10 max-w-2xl">
                  Honesty about scope is more valuable than false completeness.
                  Here's what AquaCompute does not capture today.
                </p>

                <div className="flex flex-col gap-6 max-w-3xl">
                  {[
                    {
                      title: "Training cost",
                      body: "We estimate inference impact only. The energy and water consumed to train a model is amortized across billions of requests and is a fundamentally different calculation.",
                    },
                    {
                      title: "Geographic variance",
                      body: "Water intensity varies massively by data center location. A request routed to Arizona uses very different water than the same request in Ireland. We use provider averages.",
                    },
                    {
                      title: "Time-of-day carbon intensity",
                      body: "Grid carbon intensity fluctuates hourly. A request at 2pm on solar is cleaner than the same request at 2am on coal. Our carbon numbers use annual grid averages.",
                    },
                    {
                      title: "Hardware generation",
                      body: "H100 vs H200 vs B200 have very different performance-per-watt ratios. We use the provider's reported fleet mix rather than a specific GPU assumption.",
                    },
                    {
                      title: "Reasoning tokens",
                      body: "Models with extended reasoning (o1, o3, R1, Claude extended thinking) generate internal tokens invisible to the user. These add real environmental cost not captured by your visible token count.",
                    },
                    {
                      title: "Caching and batching",
                      body: "Prompt caching, KV caching, and continuous batching dramatically reduce per-request impact at scale. Our calculator models a single cold request.",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.6 }}
                      className="border-l-2 border-accent/40 pl-6 py-2"
                    >
                      <h3 className="font-serif text-xl mb-2 text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-muted text-sm font-sans leading-relaxed">
                        {item.body}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              <motion.section
                id="references"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="font-serif text-4xl md:text-5xl mb-8 text-foreground">
                  <span className="text-accent">05</span> — References
                </h2>
                <p className="text-muted text-lg font-sans leading-relaxed mb-10 max-w-2xl">
                  Primary sources behind the measured and estimated numbers.
                </p>

                <div className="flex flex-col gap-4 max-w-3xl">
                  {[
                    {
                      title:
                        "Vanderbilt University — Token-Level Environmental Impact Study",
                      detail:
                        "Direct measurement of GPT-4o energy and water consumption per 1,000 tokens.",
                    },
                    {
                      title: "Google 2025 Environmental Report",
                      detail:
                        "Gemini per-prompt energy and water measurements, including PUE-adjusted figures.",
                    },
                    {
                      title: "OpenAI 2025 Sustainability Disclosures",
                      detail:
                        "Aggregate energy and water usage data informing GPT-4o estimates.",
                    },
                    {
                      title: "ArXiv — Per-Token Estimates for Open Models",
                      detail:
                        "70B-class open-source model benchmarks used for Llama 3.3 estimations.",
                    },
                    {
                      title: "OpenRouter Model Catalog API",
                      detail:
                        "Live model metadata for the 400+ models available in the calculator search.",
                    },
                  ].map((ref, i) => (
                    <motion.div
                      key={ref.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.6 }}
                      className="border border-border rounded-lg p-6 bg-foreground/[0.04] hover:border-accent/50 transition-colors"
                    >
                      <h3 className="font-sans font-medium text-foreground mb-2">
                        {ref.title}
                      </h3>
                      <p className="text-muted text-sm font-sans leading-relaxed">
                        {ref.detail}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-16 pt-8 border-t border-border">
                  <p className="text-faint text-sm font-sans leading-relaxed max-w-2xl">
                    AquaCompute is an educational tool. The numbers are best
                    treated as informed estimates, not regulatory-grade
                    measurements. If you're making procurement or policy
                    decisions, we recommend commissioning direct measurement
                    from your infrastructure provider.
                  </p>
                </div>
              </motion.section>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
