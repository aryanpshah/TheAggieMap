"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Search } from "lucide-react";
import LocationTile, { LocationTileSkeleton } from "./LocationTile";
import type { SuggestedCard as SuggestedCardType } from "../../lib/types";
import * as analytics from "../../lib/analytics";

type NormalizedStatus = "Quiet" | "Moderate" | "Busy" | "Loud";

type HeroProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: (query: string) => Promise<void>;
  results: SuggestedCardType[] | null;
  loadingResults?: boolean;
  errorMessage?: string | null;
};

export default function Hero({
  query,
  onQueryChange,
  onSubmit,
  results,
  loadingResults = false,
  errorMessage = null,
}: HeroProps) {
  const [value, setValue] = useState(query);
  const router = useRouter();

  useEffect(() => {
    setValue(query);
  }, [query]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = value.trim();
    analytics.search_submitted(nextQuery);
    onQueryChange(nextQuery);
    if (nextQuery) {
      await onSubmit(nextQuery);
    }
  };

  const handleNavigate = (id: string) => {
    analytics.card_clicked(id);
    router.push(`/map?focus=${encodeURIComponent(id)}`);
  };

  return (
    <Box
      className="maroonGradient"
      sx={{
        color: "text.primary",
        py: { xs: 10, md: 14 },
        px: 2,
      }}
    >
      <Stack
        spacing={4}
        alignItems="center"
        textAlign="center"
        sx={{ maxWidth: 780, mx: "auto" }}
      >
        <Stack spacing={2}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 700, letterSpacing: 1.2 }}>
            The Aggie Map
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 500, color: "text.secondary" }}>
            Aggieland&apos;s One Stop Shop
          </Typography>
        </Stack>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={10}
          sx={{
            width: "100%",
            p: { xs: 1.5, md: 2 },
            borderRadius: 4,
            backgroundColor: "background.paper",
            boxShadow: "0 20px 40px rgba(40,0,0,0.18)",
          }}
        >
          <TextField
            fullWidth
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="What are you looking for?"
            aria-label="Search campus"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "999px",
                transition: (theme) =>
                  theme.transitions.create(["box-shadow", "transform"], {
                    duration: theme.transitions.duration.shorter,
                  }),
                "&.Mui-focused": {
                  boxShadow: (theme) => `0 0 0 5px ${theme.palette.primary.main}33`,
                  transform: "scale(1.01)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          />
        </Paper>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 3 }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            data-testid="landing-cta-primary"
            aria-label="Explore study spots near me"
            sx={{
              px: 3.5,
              height: 52,
              borderRadius: 999,
              fontWeight: 700,
              letterSpacing: 0.2,
              boxShadow: "0 8px 24px rgba(80,0,0,0.20)",
              ":hover": {
                boxShadow: "0 10px 28px rgba(80,0,0,0.25)",
              },
              ":focus-visible": {
                outline: "3px solid rgba(80,0,0,0.25)",
                outlineOffset: "2px",
              },
            }}
            onClick={() => router.push("/explore#study")}
          >
            Find Study Spots
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            data-testid="landing-cta-secondary"
            aria-label="See dining halls on the map"
            sx={{
              px: 3.5,
              height: 52,
              borderRadius: 999,
              fontWeight: 700,
              letterSpacing: 0.2,
              borderWidth: 2,
              ":hover": {
                backgroundColor: "rgba(80,0,0,0.06)",
              },
              ":focus-visible": {
                outline: "3px solid rgba(80,0,0,0.20)",
                outlineOffset: "2px",
              },
            }}
            onClick={() => router.push("/explore#dining")}
          >
            See Dining Halls
          </Button>
        </Stack>
        <Stack spacing={1.5} sx={{ width: "100%" }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Built for Aggies. Powered by your campus.
          </Typography>
          {(loadingResults || results || errorMessage) && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 4,
                border: (theme) => `1px solid ${theme.palette.primary.main}1f`,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(247,225,215,0.94) 100%)",
                boxShadow: "0 24px 48px rgba(80,0,0,0.14)",
                minWidth: { xs: "100%", sm: 520 },
              }}
            >
              {loadingResults ? (
                <Grid container spacing={3}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={`hero-skeleton-${index}`}>
                      <LocationTileSkeleton />
                    </Grid>
                  ))}
                </Grid>
              ) : errorMessage ? (
                <Stack spacing={1.5} alignItems="flex-start">
                  <Typography variant="body2" color="error.main">
                    {errorMessage}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Try again in a moment or adjust your search.
                  </Typography>
                </Stack>
              ) : results && results.length > 0 ? (
                <Grid container spacing={3}>
                  {results.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <LocationTile
                        code={item.name}
                        distanceText={formatHeroDistance(item.distanceMeters)}
                        noiseLabel={normalizeStatus(item.status)}
                        noisePct={item.busyScore}
                        seatsFree={extractSeats(item.tags)}
                        onClick={() => handleNavigate(item.id)}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No quick matches yet. Try another campus spot.
                </Typography>
              )}
            </Paper>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

function formatHeroDistance(distanceMeters: number | undefined): string {
  if (!Number.isFinite(distanceMeters) || distanceMeters === undefined || distanceMeters <= 0) {
    return "—";
  }
  if (distanceMeters < 200) {
    return `${Math.max(0, Math.round(distanceMeters))} m`;
  }
  const miles = distanceMeters / 1609.34;
  if (miles < 0.05) {
    return "<0.1 mi";
  }
  return `${miles.toFixed(1)} mi`;
}

function normalizeStatus(status: string | undefined): NormalizedStatus {
  const normalized = (status ?? "").toLowerCase();
  if (normalized.includes("loud")) return "Loud";
  if (normalized.includes("busy")) return "Busy";
  if (normalized.includes("moderate")) return "Moderate";
  return "Quiet";
}

function extractSeats(tags: string[] | undefined): number {
  if (!Array.isArray(tags)) return 0;
  for (const tag of tags) {
    const match = tag.match(/(\d[\d,]*)/);
    if (match) {
      return Number.parseInt(match[1].replace(/,/g, ""), 10);
    }
  }
  return 0;
}
