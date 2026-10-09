import { OpenRouter } from "@openrouter/sdk";

export const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
  httpReferer: "https://aquacompute.app",
  appTitle: "AquaCompute",
});

export interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  contextLength: number;
  pricing: {
    prompt: string;
    completion: string;
  };
  provider: string;
}

async function fetchAllModels(): Promise<OpenRouterModel[]> {
  const response = await fetch("https://openrouter.ai/api/v1/models", {
    headers: process.env.OPENROUTER_API_KEY
      ? { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` }
      : {},
    next: { revalidate: 3600 },
  });

  if (!response.ok) throw new Error("Failed to fetch models");

  const data = await response.json();

  return (data.data || []).map((model: any) => ({
    id: model.id,
    name: model.name || model.id,
    description: model.description || "",
    contextLength: model.context_length || 0,
    pricing: {
      prompt: model.pricing?.prompt || "0",
      completion: model.pricing?.completion || "0",
    },
    provider: model.id.split("/")[0] || "unknown",
  }));
}

export async function searchModels(
  query: string,
  limit = 30,
): Promise<OpenRouterModel[]> {
  try {
    const allModels = await fetchAllModels();
    const q = query.toLowerCase().trim();

    if (!q) {
      return allModels.slice(0, limit);
    }

    const tokens = q.split(/\s+/).filter(Boolean);

    const scored = allModels
      .map((model) => {
        const id = model.id.toLowerCase();
        const name = model.name.toLowerCase();
        const description = model.description.toLowerCase();
        const searchable = `${id} ${name} ${description}`;

        const matchesAll = tokens.every((token) => searchable.includes(token));
        if (!matchesAll) return { model, score: 0 };

        let score = 15;
        if (id === q || name === q) score = 100;
        else if (name.startsWith(q)) score = 85;
        else if (id.includes(q)) score = 70;
        else if (name.includes(q)) score = 55;
        else if (tokens.every((token) => name.includes(token))) score = 40;

        return { model, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map((item) => item.model);
  } catch (error) {
    console.error("OpenRouter search failed:", error);
    return [];
  }
}
