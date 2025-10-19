import type { SuggestedCard } from "./types";

export const BASE_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL ?? "http://142.93.69.165:8000";

export type OccupancyRecord = {
  location: string;
  percent_full: number;
};

type AskResponse = {
  response: string;
};

const MOCK_SUGGESTIONS: SuggestedCard[] = [
  {
    id: "evans-2f",
    name: "Evans Library 2F",
    distanceMeters: 420,
    busyScore: 22,
    status: "Quiet",
    tags: ["Solo", "Outlets", "Sunlight"],
    imageUrl: "/og-image.png",
  },
  {
    id: "zach-atrium",
    name: "ZACH Atrium",
    distanceMeters: 760,
    busyScore: 58,
    status: "Moderate",
    tags: ["Group", "Open seating"],
    imageUrl: "/og-image.png",
  },
  {
    id: "sbisa",
    name: "Sbisa Dining",
    distanceMeters: 300,
    busyScore: 34,
    status: "Quiet",
    tags: ["Food", "Short line"],
    imageUrl: "/og-image.png",
  },
];

const FILTER_RULES: Record<string, (card: SuggestedCard) => boolean> = {
  "Quiet Now": (card) => card.status === "Quiet",
  "Short Lines": (card) =>
    card.tags.some((tag) => /short/i.test(tag)) || card.busyScore < 35,
  "Open Late": (card) =>
    ["evans-2f", "zach-atrium"].includes(card.id) || card.tags.includes("Sunlight"),
  "Group Study": (card) =>
    card.tags.some((tag) => /group/i.test(tag)) || card.id === "zach-atrium",
  Outdoors: (card) =>
    card.tags.some((tag) => /outdoor|sunlight/i.test(tag)) ||
    card.id === "zach-atrium",
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getSuggested({
  query = "",
  filters = [],
}: {
  query?: string;
  filters?: string[];
} = {}): Promise<SuggestedCard[]> {
  await delay(300);

  // TODO: Replace this mock implementation with a real FastAPI call.
  let results = [...MOCK_SUGGESTIONS];

  if (query) {
    const normalized = query.toLowerCase();
    results = results.filter(
      (item) =>
        item.name.toLowerCase().includes(normalized) ||
        item.tags.some((tag) => tag.toLowerCase().includes(normalized)),
    );
  }

  if (filters.length > 0) {
    results = results.filter((item) =>
      filters.every((filter) => {
        const predicate = FILTER_RULES[filter];
        return predicate ? predicate(item) : true;
      }),
    );
  }

  return results;
}

export async function fetchOccupancy(): Promise<OccupancyRecord[]> {
  try {
    const response = await fetch(`${BASE_API_URL}/retrieve`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch occupancy data (${response.status})`);
    }

    const data = (await response.json()) as OccupancyRecord[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch occupancy data", error);
    throw error;
  }
}

export async function askPerplexity(query: string): Promise<string> {
  try {
    const response = await fetch(`${BASE_API_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: query }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get response from Perplexity (${response.status})`);
    }

    const data = (await response.json()) as AskResponse;
    return data.response;
  } catch (error) {
    console.error("Failed to get response from Perplexity", error);
    throw error;
  }
}
