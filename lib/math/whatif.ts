import { getEnvironmentalProfile, ImpactResult } from "./modelEstimator";

export interface InfraAssumptions {
  pue: number;
  wue: number;
  carbonIntensity: number;
}

export const REFERENCE_ASSUMPTIONS: InfraAssumptions = {
  pue: 1.2,
  wue: 1.8,
  carbonIntensity: 400,
};

export interface InfraPreset {
  id: string;
  name: string;
  description: string;
  assumptions: InfraAssumptions;
}

export const PRESETS: InfraPreset[] = [
  {
    id: "hyperscale",
    name: "Hyperscale",
    description: "Modern liquid-cooled AI data center in a cool climate.",
    assumptions: { pue: 1.1, wue: 0.3, carbonIntensity: 150 },
  },
  {
    id: "standard",
    name: "Standard Cloud",
    description: "Industry-average cloud region. The reference baseline.",
    assumptions: { pue: 1.2, wue: 1.8, carbonIntensity: 400 },
  },
  {
    id: "legacy",
    name: "Legacy Evaporative",
    description: "Older evaporative-cooled facility. Heavy water overhead.",
    assumptions: { pue: 1.5, wue: 3.5, carbonIntensity: 550 },
  },
  {
    id: "arid",
    name: "Arid Region",
    description: "High water stress zone using evaporative cooling.",
    assumptions: { pue: 1.4, wue: 4.5, carbonIntensity: 500 },
  },
  {
    id: "nordic",
    name: "Nordic Renewable",
    description: "Hydro-powered, air-cooled facility. Best-in-class.",
    assumptions: { pue: 1.15, wue: 0.2, carbonIntensity: 30 },
  },
];

export function calculateWhatIfImpact(
  tokens: number,
  modelId: string,
  modelName: string,
  assumptions: InfraAssumptions
): ImpactResult {
  const profile = getEnvironmentalProfile(modelId);

  const baseEnergyKwh = (tokens / 1000) * (profile.energyPer1kTokensWh / 1000);
  const baseWaterLiters = (tokens / 1000) * (profile.waterPer1kTokensMl / 1000);
  const baseCarbonGrams = (tokens / 1000) * profile.carbonPer1kTokensG;

  const pueFactor = assumptions.pue / REFERENCE_ASSUMPTIONS.pue;
  const wueFactor = assumptions.wue / REFERENCE_ASSUMPTIONS.wue;
  const carbonFactor = assumptions.carbonIntensity / REFERENCE_ASSUMPTIONS.carbonIntensity;

  const energyKwh = baseEnergyKwh * pueFactor;
  const waterLiters = baseWaterLiters * pueFactor * wueFactor;
  const carbonGrams = baseCarbonGrams * pueFactor * carbonFactor;

  return {
    energyKwh: parseFloat(energyKwh.toFixed(6)),
    waterLiters: parseFloat(waterLiters.toFixed(4)),
    carbonGrams: parseFloat(carbonGrams.toFixed(4)),
    waterBottles: parseFloat((waterLiters / 0.5).toFixed(2)),
    modelName,
    modelId,
    confidence: "extrapolated",
    source: `Custom assumptions — PUE ${assumptions.pue}, WUE ${assumptions.wue} L/kWh, grid ${assumptions.carbonIntensity} gCO₂/kWh`,
  };
}