# AquaCompute

> Every token has a footprint.

AquaCompute is an open-source tool that estimates the environmental impact of AI inference. Enter a token count, pick a model, and see the estimated water, energy, and carbon cost — with transparent assumptions, cited sources, and confidence tiers for every number.

**[Live Demo →](https://aquacompute.vercel.app)** _(deploy link — update once live)_

---

## Why this exists

Everyone says AI consumes an enormous amount of water. Almost nobody shows you the math.

The numbers you see quoted online — "one ChatGPT conversation uses 500 milliliters," "one prompt uses a full water bottle" — are often recycled from old estimates, missing sources, or flatly misapplied. Some are dramatically exaggerated. Some are dramatically understated. And almost none of them let you check the assumptions.

AquaCompute was built to change that. Every figure is traceable to a source, tiered by confidence, and paired with the limitations we already know about.

---

## Features

### 🧮 Calculator

Enter a token count, pick from 400+ real models (via [OpenRouter](https://openrouter.ai)), and see estimated water (liters), energy (kWh), and carbon (gCO₂).

### ⚖️ Compare

Side-by-side model comparison with animated bars. The same 50,000 tokens on Claude 3 Opus vs. Gemini 2.5 Pro shows a **130× difference in water consumption**.

### 📈 Scale Simulator

Input your app's traffic assumptions (requests/day, avg input/output tokens). Get daily, monthly, and yearly projections. Relatable equivalents localized to 10 countries — Indian households get buckets and 1.5-ton AC hours, US users get NY→LA flights, etc.

### 📉 Scaling Curve

Log-log chart showing how environmental impact scales linearly with request volume. There are no diminishing returns. Every additional user costs the same water, forever.

### 🎛️ What-If Simulator

Drag three sliders — PUE (cooling efficiency), WUE (water per kWh), and grid carbon intensity — and watch the numbers move. Same model, same tokens, different data center: **up to 22× swing in water impact**.

### 📖 Methodology

Full transparency page exposing the formula, per-model data table, confidence tiers, and an honest "What We Don't Measure" section.

---

## Confidence Tiers

Every model is tagged with how much we actually know about its environmental footprint:

| Tier             | Badge | Meaning                                               |
| ---------------- | ----- | ----------------------------------------------------- |
| **Measured**     | 🟢    | Peer-reviewed studies or provider disclosures         |
| **Estimated**    | 🟡    | Extrapolated from third-party benchmarks              |
| **Extrapolated** | ⚪    | Inferred from provider baselines and model size class |

No fake precision. Where we don't know, we say we don't know.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Motion (Framer Motion)
- **Charts:** Recharts
- **Theming:** next-themes
- **Model catalog:** OpenRouter API
- **Fonts:** Inter + Playfair Display (via next/font)

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/adityay04/aquacompute.git
cd aquacompute
```
