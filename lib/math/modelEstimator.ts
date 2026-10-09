import { CountryData, getCountryByCode } from "@/lib/countries";

export interface ModelProfile {
  id: string;
  name: string;
  energyPer1kTokensWh: number;
  waterPer1kTokensMl: number;
  carbonPer1kTokensG: number;
  description: string;
  confidence: "measured" | "estimated" | "extrapolated";
}

export interface EnvironmentalProfile {
  energyPer1kTokensWh: number;
  waterPer1kTokensMl: number;
  carbonPer1kTokensG: number;
  confidence: "measured" | "estimated" | "extrapolated";
  source: string;
}

export interface ImpactResult {
  energyKwh: number;
  waterLiters: number;
  carbonGrams: number;
  waterBottles: number;
  modelName: string;
  modelId: string;
  confidence: "measured" | "estimated" | "extrapolated";
  source: string;
}

export interface Equivalents {
  water: {
    buckets: number;
    bottles: number;
    showers: number;
    bucketLabel: string;
    bottleLabel: string;
  };
  energy: {
    acHours: number;
    householdDays: number;
    ledBulbHours: number;
    acLabel: string;
    householdLabel: string;
  };
  carbon: {
    domesticFlights: number;
    treesYear: number;
    carKm: number;
    flightLabel: string;
  };
}

export const MODEL_PROFILES: ModelProfile[] = [
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    energyPer1kTokensWh: 1.065,
    waterPer1kTokensMl: 3.63,
    carbonPer1kTokensG: 0.376,
    description: "OpenAI flagship. High capability, higher resource use.",
    confidence: "measured",
  },
  {
    id: "google/gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    energyPer1kTokensWh: 0.24,
    waterPer1kTokensMl: 0.26,
    carbonPer1kTokensG: 0.08,
    description: "Google's most efficient. Measured by Google directly.",
    confidence: "measured",
  },
  {
    id: "anthropic/claude-3-opus",
    name: "Claude 3 Opus",
    energyPer1kTokensWh: 10.0,
    waterPer1kTokensMl: 34.0,
    carbonPer1kTokensG: 3.5,
    description: "Anthropic frontier model. Highest resource intensity.",
    confidence: "estimated",
  },
  {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku",
    energyPer1kTokensWh: 0.55,
    waterPer1kTokensMl: 1.9,
    carbonPer1kTokensG: 0.19,
    description: "Anthropic lightweight. Optimized for speed and efficiency.",
    confidence: "estimated",
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B",
    energyPer1kTokensWh: 0.5,
    waterPer1kTokensMl: 1.7,
    carbonPer1kTokensG: 0.18,
    description: "Meta open-source. Balanced performance and efficiency.",
    confidence: "estimated",
  },
];

const MEASURED_PROFILES: Record<string, EnvironmentalProfile> = {
  "openai/gpt-4o": {
    energyPer1kTokensWh: 1.065,
    waterPer1kTokensMl: 3.63,
    carbonPer1kTokensG: 0.376,
    confidence: "measured",
    source:
      "Vanderbilt token-level study (2026), OpenAI 2025 sustainability disclosures",
  },
  "google/gemini-2.5-pro": {
    energyPer1kTokensWh: 0.24,
    waterPer1kTokensMl: 0.26,
    carbonPer1kTokensG: 0.08,
    confidence: "measured",
    source: "Google 2025 environmental report (measured per median prompt)",
  },
  "anthropic/claude-3-opus": {
    energyPer1kTokensWh: 10.0,
    waterPer1kTokensMl: 34.0,
    carbonPer1kTokensG: 3.5,
    confidence: "estimated",
    source:
      "Independent benchmark extrapolation (4.05 Wh per ~400-token exchange)",
  },
  "anthropic/claude-3-haiku": {
    energyPer1kTokensWh: 0.55,
    waterPer1kTokensMl: 1.9,
    carbonPer1kTokensG: 0.19,
    confidence: "estimated",
    source: "Independent benchmark extrapolation (0.22 Wh per query)",
  },
  "meta-llama/llama-3.3-70b-instruct": {
    energyPer1kTokensWh: 0.5,
    waterPer1kTokensMl: 1.7,
    carbonPer1kTokensG: 0.18,
    confidence: "estimated",
    source: "ArXiv per-token estimates for 70B-class open models",
  },
};

const PROVIDER_BASELINES: Record<
  string,
  { energy: number; water: number; carbon: number }
> = {
  openai: { energy: 0.8, water: 2.8, carbon: 0.3 },
  anthropic: { energy: 0.7, water: 2.4, carbon: 0.25 },
  google: { energy: 0.3, water: 0.4, carbon: 0.1 },
  "meta-llama": { energy: 0.5, water: 1.7, carbon: 0.18 },
  mistralai: { energy: 0.6, water: 2.0, carbon: 0.2 },
  deepseek: { energy: 0.45, water: 1.5, carbon: 0.16 },
  qwen: { energy: 0.5, water: 1.6, carbon: 0.17 },
  "x-ai": { energy: 0.55, water: 1.8, carbon: 0.19 },
  cohere: { energy: 0.65, water: 2.1, carbon: 0.22 },
};

function inferProvider(modelId: string): string {
  return modelId.split("/")[0]?.toLowerCase() || "unknown";
}

function inferModelSize(modelId: string): number {
  const lower = modelId.toLowerCase();

  if (
    lower.includes("opus") ||
    lower.includes("ultra") ||
    lower.includes("405b") ||
    lower.includes("671b")
  )
    return 1.8;
  if (
    lower.includes("sonnet") ||
    lower.includes("pro") ||
    lower.includes("70b") ||
    lower.includes("72b")
  )
    return 1.2;
  if (
    lower.includes("haiku") ||
    lower.includes("flash") ||
    lower.includes("mini") ||
    lower.includes("nano")
  )
    return 0.4;
  if (lower.includes("8b") || lower.includes("7b") || lower.includes("9b"))
    return 0.6;
  if (lower.includes("32b") || lower.includes("34b")) return 0.9;
  if (
    lower.includes("reasoning") ||
    lower.includes("r1") ||
    lower.includes("o1") ||
    lower.includes("o3")
  )
    return 2.0;
  if (lower.includes("coder")) return 1.3;
  if (lower.includes("vision") || lower.includes("multimodal")) return 1.1;

  return 1.0;
}

export function getEnvironmentalProfile(modelId: string): EnvironmentalProfile {
  const normalizedId = modelId.toLowerCase();

  if (MEASURED_PROFILES[normalizedId]) {
    return MEASURED_PROFILES[normalizedId];
  }

  const provider = inferProvider(modelId);
  const sizeMultiplier = inferModelSize(modelId);
  const baseline = PROVIDER_BASELINES[provider] || PROVIDER_BASELINES.openai;

  return {
    energyPer1kTokensWh: parseFloat(
      (baseline.energy * sizeMultiplier).toFixed(4),
    ),
    waterPer1kTokensMl: parseFloat(
      (baseline.water * sizeMultiplier).toFixed(4),
    ),
    carbonPer1kTokensG: parseFloat(
      (baseline.carbon * sizeMultiplier).toFixed(4),
    ),
    confidence: "extrapolated",
    source: `Extrapolated from ${provider} provider baselines and model size class (${sizeMultiplier}x multiplier)`,
  };
}

export function calculateImpact(
  tokens: number,
  modelId: string,
  modelName: string,
): ImpactResult {
  const profile = getEnvironmentalProfile(modelId);

  const energyKwh = (tokens / 1000) * (profile.energyPer1kTokensWh / 1000);
  const waterLiters = (tokens / 1000) * (profile.waterPer1kTokensMl / 1000);
  const carbonGrams = (tokens / 1000) * profile.carbonPer1kTokensG;

  return {
    energyKwh: parseFloat(energyKwh.toFixed(6)),
    waterLiters: parseFloat(waterLiters.toFixed(4)),
    carbonGrams: parseFloat(carbonGrams.toFixed(4)),
    waterBottles: parseFloat((waterLiters / 0.5).toFixed(2)),
    modelName,
    modelId,
    confidence: profile.confidence,
    source: profile.source,
  };
}

export function calculateEquivalents(
  waterLiters: number,
  energyKwh: number,
  carbonGrams: number,
  countryCode: string,
): Equivalents {
  const country = getCountryByCode(countryCode);

  if (!country) {
    return {
      water: {
        buckets: 0,
        bottles: 0,
        showers: 0,
        bucketLabel: "buckets",
        bottleLabel: "bottles",
      },
      energy: {
        acHours: 0,
        householdDays: 0,
        ledBulbHours: 0,
        acLabel: "AC hours",
        householdLabel: "household days",
      },
      carbon: {
        domesticFlights: 0,
        treesYear: 0,
        carKm: 0,
        flightLabel: "flights",
      },
    };
  }

  return {
    water: {
      buckets: waterLiters / country.water.bucketLiters,
      bottles: waterLiters / country.water.bottleLiters,
      showers: waterLiters / country.water.showerLiters,
      bucketLabel: `${country.water.bucketLiters}L buckets`,
      bottleLabel: `${country.water.bottleLiters}L bottles`,
    },
    energy: {
      acHours: energyKwh / country.energy.acUnitKw,
      householdDays: energyKwh / country.energy.householdDailyKwh,
      ledBulbHours: (energyKwh * 1000) / country.energy.bulbWatts,
      acLabel: `hours of ${country.energy.acLabel}`,
      householdLabel: country.energy.householdLabel,
    },
    carbon: {
      domesticFlights: carbonGrams / (country.carbon.domesticFlightKg * 1000),
      treesYear: carbonGrams / 21000,
      carKm: carbonGrams / country.carbon.carGramsPerKm,
      flightLabel: country.carbon.domesticFlightLabel,
    },
  };
}
