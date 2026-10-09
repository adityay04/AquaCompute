export interface ModelProfile {
  id: string;
  name: string;
  energyPer1kTokensWh: number;
  waterPer1kTokensMl: number;
  carbonPer1kTokensG: number;
  description: string;
}

export const MODEL_PROFILES: ModelProfile[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    energyPer1kTokensWh: 1.065,
    waterPer1kTokensMl: 3.63,
    carbonPer1kTokensG: 0.376,
    description: "OpenAI flagship. High capability, higher resource use.",
  },
  {
    id: "llama-3-70b",
    name: "Llama 3.3 70B",
    energyPer1kTokensWh: 0.5,
    waterPer1kTokensMl: 1.7,
    carbonPer1kTokensG: 0.18,
    description: "Meta open-source. Balanced performance and efficiency.",
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    energyPer1kTokensWh: 10.0,
    waterPer1kTokensMl: 34.0,
    carbonPer1kTokensG: 3.5,
    description: "Anthropic frontier model. Highest resource intensity.",
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    energyPer1kTokensWh: 0.55,
    waterPer1kTokensMl: 1.9,
    carbonPer1kTokensG: 0.19,
    description: "Anthropic lightweight. Optimized for speed and efficiency.",
  },
  {
    id: "gemini",
    name: "Gemini (Google)",
    energyPer1kTokensWh: 0.24,
    waterPer1kTokensMl: 0.26,
    carbonPer1kTokensG: 0.08,
    description: "Google's most efficient. Measured by Google directly.",
  },
];

export interface ImpactResult {
  energyKwh: number;
  waterLiters: number;
  carbonGrams: number;
  waterBottles: number;
  modelName: string;
}

export function calculateImpact(tokens: number, modelId: string): ImpactResult {
  const model =
    MODEL_PROFILES.find((m) => m.id === modelId) || MODEL_PROFILES[0];

  const energyKwh = (tokens / 1000) * (model.energyPer1kTokensWh / 1000);
  const waterLiters = (tokens / 1000) * (model.waterPer1kTokensMl / 1000);
  const carbonGrams = (tokens / 1000) * model.carbonPer1kTokensG;

  return {
    energyKwh: parseFloat(energyKwh.toFixed(6)),
    waterLiters: parseFloat(waterLiters.toFixed(4)),
    carbonGrams: parseFloat(carbonGrams.toFixed(4)),
    waterBottles: parseFloat((waterLiters / 0.5).toFixed(2)),
    modelName: model.name,
  };
}
