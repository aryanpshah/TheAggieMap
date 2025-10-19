"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TopBar from "../components/layout/TopBar";
import SidebarDrawer from "../components/layout/SidebarDrawer";
import Hero from "../components/landing/Hero";
import QuickFilters from "../components/landing/QuickFilters";
import SuggestedGrid from "../components/landing/SuggestedGrid";
import { askPerplexity, getSuggested } from "../lib/api";
import type { SuggestedCard } from "../lib/types";

const FILTER_OPTIONS = [
  "Quiet Now",
  "Short Lines",
  "Open Late",
  "Group Study",
  "Outdoors",
];

export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [suggested, setSuggested] = useState<SuggestedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [assistantResponse, setAssistantResponse] = useState<string>("");
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantError, setAssistantError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getSuggested({ query, filters: activeFilters }).then((data) => {
      if (!isMounted) return;
      setSuggested(data);
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [query, activeFilters]);

  const toggleFilter = useCallback((filter: string) => {
    setActiveFilters((prev) => {
      if (prev.includes(filter)) {
        return prev.filter((item) => item !== filter);
      }
      return [...prev, filter];
    });
  }, []);

  const selectedFilters = useMemo(() => new Set(activeFilters), [activeFilters]);

  const handleHeroSubmit = useCallback(
    async (input: string) => {
      setAssistantLoading(true);
      setAssistantError(null);
      try {
        const result = await askPerplexity(input);
        setAssistantResponse(result.trim());
      } catch (error) {
        setAssistantResponse("");
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
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <TopBar onMenuClick={() => setDrawerOpen(true)} />
      <SidebarDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Box component="main" sx={{ pt: { xs: 8, md: 9 } }}>
        <Hero
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleHeroSubmit}
          response={assistantResponse}
          loadingResponse={assistantLoading}
          errorMessage={assistantError}
        />
        <Container maxWidth="lg" sx={{ mt: 6, mb: 10 }}>
          <Stack spacing={6}>
            <QuickFilters
              options={FILTER_OPTIONS}
              selected={selectedFilters}
              onToggle={toggleFilter}
            />
            <Divider />
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              Suggested Now
            </Typography>
            <SuggestedGrid
              items={suggested}
              loading={loading}
              filters={activeFilters}
            />
          </Stack>
        </Container>
        <Box
          component="footer"
          sx={{
            backgroundColor: "primary.main",
            color: "secondary.main",
            py: 2,
            mt: 8,
          }}
        >
          <Container maxWidth="lg">
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1, sm: 3 }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                The Aggie Map {"\u00A9"} 2025 {"\u2022"} Aggieland&apos;s One Stop Shop
              </Typography>
              <Stack direction="row" spacing={3}>
                <MuiLink
                  component={NextLink}
                  href="/privacy"
                  underline="hover"
                  color="inherit"
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  Privacy
                </MuiLink>
                <MuiLink
                  component={NextLink}
                  href="/about"
                  underline="hover"
                  color="inherit"
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  About
                </MuiLink>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
