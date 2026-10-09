"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const PRINCIPLES = [
  {
    title: "Transparency over precision",
    body: "Every number is tagged with its confidence level. We would rather show you an honest range than a fake exact figure.",
  },
  {
    title: "Directional, not regulatory",
    body: "This is an educational tool. It helps you reason about scale and tradeoffs — not audit a procurement contract.",
  },
  {
    title: "Model-aware, not model-agnostic",
    body: "A 70B model and a frontier reasoning model have very different footprints. We treat them differently because they are.",
  },
  {
    title: "Open by default",
    body: "The formulas are published. The sources are cited. The limitations are documented. If we can't show our work, we shouldn't ship it.",
  },
];

export default function AboutPage() {
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
            className="mb-24 max-w-4xl"
          >
            <span className="text-xs tracking-[0.2em] text-muted uppercase font-sans">
              About AquaCompute
            </span>
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl mt-6 leading-[1.05] text-foreground">
              The water <br />
              behind the <br />
              <span className="italic text-accent">word.</span>
            </h1>
            <p className="text-muted text-xl mt-10 max-w-2xl font-sans leading-relaxed">
              Every prompt you send to an AI model runs through a data center
              somewhere. That data center consumes electricity. That electricity
              consumes water. AquaCompute makes that chain visible.
            </p>
          </motion.div>

          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-32 max-w-3xl"
          >
            <span className="text-xs tracking-[0.2em] text-muted uppercase font-sans">
              The story
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-8 text-foreground">
              Why this exists.
            </h2>
            <div className="flex flex-col gap-6 text-muted font-sans leading-relaxed text-lg">
              <p>
                Everyone says AI uses an enormous amount of water. Almost nobody
                shows you the math.
              </p>
              <p>
                The numbers you see quoted online — "one ChatGPT conversation
                uses 500 milliliters," "one prompt uses a full water bottle" —
                are often recycled from old estimates, missing sources, or
                flatly misapplied. Some are dramatically exaggerated. Some are
                dramatically understated. And almost none of them let you check
                the assumptions.
              </p>
              <p>
                AquaCompute was built to change that. It is an attempt to make
                the environmental impact of AI inference auditable by anyone —
                developers, researchers, journalists, or just someone who wants
                to know what a "footprint" actually means.
              </p>
              <p>
                Every figure on this site is traceable to a source, tiered by
                confidence, and paired with the limitations we already know
                about. Where we can't be precise, we say so. Where the data
                doesn't exist, we extrapolate and label it as extrapolated.
              </p>
            </div>
          </motion.section>

          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-32"
          >
            <span className="text-xs tracking-[0.2em] text-muted uppercase font-sans">
              Principles
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-12 text-foreground">
              How we think about it.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PRINCIPLES.map((principle, i) => (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.08,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="border border-border rounded-lg p-8 bg-foreground/[0.06] hover:border-accent/50 transition-colors"
                >
                  <span className="text-xs font-mono text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-2xl mt-4 mb-3 text-foreground">
                    {principle.title}
                  </h3>
                  <p className="text-muted text-sm font-sans leading-relaxed">
                    {principle.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-32"
          >
            <span className="text-xs tracking-[0.2em] text-muted uppercase font-sans">
              What this is not
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-8 text-foreground">
              Setting expectations.
            </h2>

            <div className="flex flex-col gap-6 max-w-3xl">
              {[
                {
                  title: "Not a sustainability certification",
                  body: "AquaCompute doesn't issue compliance reports or verify vendor claims. It's a reasoning tool for thinking about scale.",
                },
                {
                  title: "Not a replacement for provider disclosures",
                  body: "When OpenAI, Google, or Anthropic publish their own per-token numbers, use those. Our data is derived from public sources and academic studies, not first-party measurements.",
                },
                {
                  title: "Not a prediction market",
                  body: "We don't forecast what AI's impact will be in 2030. The environmental landscape shifts too quickly for that. We estimate the present, as accurately as public data allows.",
                },
                {
                  title: "Not the final word",
                  body: "If you find an error, a better source, or a missed factor, the methodology page links to every assumption. Corrections are welcome and encouraged.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.6 }}
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
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16"
          >
            <span className="text-xs tracking-[0.2em] text-muted uppercase font-sans">
              Built by
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-8 text-foreground">
              One person, one weekend at a time.
            </h2>
            <p className="text-muted font-sans text-lg leading-relaxed max-w-2xl mb-10">
              AquaCompute is an independent project, built in public. Every
              commit, every design decision, every formula is documented as it's
              shipped.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
              <a
                href="https://github.com/adityay04"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border rounded-lg p-6 bg-foreground/[0.06] hover:border-accent/50 hover:bg-accent/5 transition-colors group"
              >
                <span className="text-[10px] tracking-[0.2em] uppercase text-muted font-sans">
                  GitHub
                </span>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-foreground font-sans text-sm group-hover:text-accent transition-colors">
                    @adityay04
                  </span>
                  <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    ↗
                  </span>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/aditya-yadav2005"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border rounded-lg p-6 bg-foreground/[0.06] hover:border-accent/50 hover:bg-accent/5 transition-colors group"
              >
                <span className="text-[10px] tracking-[0.2em] uppercase text-muted font-sans">
                  LinkedIn
                </span>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-foreground font-sans text-sm group-hover:text-accent transition-colors">
                    aditya-yadav2005
                  </span>
                  <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    ↗
                  </span>
                </div>
              </a>

              <a
                href="https://x.com/AdityaYada76111"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border rounded-lg p-6 bg-foreground/[0.06] hover:border-accent/50 hover:bg-accent/5 transition-colors group"
              >
                <span className="text-[10px] tracking-[0.2em] uppercase text-muted font-sans">
                  X
                </span>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-foreground font-sans text-sm group-hover:text-accent transition-colors">
                    @AdityaYada76111
                  </span>
                  <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    ↗
                  </span>
                </div>
              </a>
            </div>
          </motion.section>

          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="border-t border-border pt-16 mt-16"
          >
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="font-serif text-4xl md:text-5xl leading-tight text-foreground">
                  Ready to see your <br />
                  <span className="italic text-accent">footprint?</span>
                </h2>
                <p className="text-muted font-sans text-lg mt-4">
                  Pick a model. Enter some tokens. See what the same task costs
                  across different options.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/calculator"
                  className="bg-accent text-background font-medium px-8 py-4 rounded-full text-sm hover:bg-accent/90 transition-colors font-sans whitespace-nowrap"
                >
                  Try the Calculator →
                </Link>
                <Link
                  href="/compare"
                  className="border border-border hover:border-accent hover:text-accent transition-colors px-8 py-4 rounded-full text-sm font-medium font-sans whitespace-nowrap"
                >
                  Compare Models
                </Link>
              </div>
            </div>
          </motion.section>
        </div>

        <Footer />
      </div>
    </main>
  );
}
