"use client";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SuggestedCard, { SuggestedCardSkeleton } from "./SuggestedCard";
import type { SuggestedCard as SuggestedCardType } from "../../lib/types";

type SuggestedGridProps = {
  items: SuggestedCardType[];
  loading: boolean;
  filters: string[];
};

export default function SuggestedGrid({
  items,
  loading,
  filters,
}: SuggestedGridProps) {
  const showEmpty = !loading && items.length === 0;

  if (showEmpty) {
    return (
      <Stack spacing={2} alignItems="center" textAlign="center">
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          No spots match those filters yet.
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Try removing{" "}
          {filters.length > 0
            ? "a filter or adjust your search."
            : "your search query to see more options."}
        </Typography>
      </Stack>
    );
  }

  return (
    <Grid container spacing={3}>
      {loading
        ? Array.from({ length: 3 }).map((_, index) => (
            <Grid item xs={12} md={4} key={index}>
              <SuggestedCardSkeleton />
            </Grid>
          ))
        : items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <SuggestedCard card={item} />
            </Grid>
          ))}
    </Grid>
  );
}
