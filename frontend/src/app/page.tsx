"use client";

import { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Shell from "./layout/Shell";
import Hero from "../components/landing/Hero";
import { askPerplexity } from "../lib/api";
import type { SuggestedCard } from "../lib/types";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [assistantResponse, setAssistantResponse] = useState<SuggestedCard[] | null>(null);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantError, setAssistantError] = useState<string | null>(null);

  const handleHeroSubmit = useCallback(
    async (input: string) => {
      setAssistantLoading(true);
      setAssistantError(null);
      setAssistantResponse(null);
      try {
        const result = await askPerplexity(input);
        const parsed = JSON.parse(result.trim()) as Array<{
          name: string;
          percent_full: number;
          available_seats: number;
        }>;
        if (!Array.isArray(parsed)) {
          throw new Error("Unexpected search response");
        }
        const transformed: SuggestedCard[] = parsed.map((item, index) => ({
          id: `${item.name}-${index}`,
          name: item.name,
          distanceMeters: 0,
          busyScore: item.percent_full,
          status: item.percent_full < 40 ? "Quiet" : item.percent_full < 70 ? "Moderate" : "Busy",
          tags: [`${item.available_seats} seats free`],
          imageUrl: "/og-image.png",
        }));
        setAssistantResponse(transformed);
      } catch (error) {
        console.error(error);
        setAssistantResponse(null);
        setAssistantError(
          (error as Error).message ?? "Unable to retrieve campus insights right now.",
        );
      } finally {
        setAssistantLoading(false);
      }
    },
    [],
  );

  return (
    <Shell activePath="/">
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Hero
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleHeroSubmit}
          results={assistantResponse}
          loadingResults={assistantLoading}
          errorMessage={assistantError}
        />
      </Box>
    </Shell>
  );
}
