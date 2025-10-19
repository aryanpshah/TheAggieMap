"use client";

import { useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import ForYou from "../../components/explore/ForYou";
import Shell from "../layout/Shell";
import { DetailLinkButton } from "../../components/DetailLinkButton";
import {
  DINING_HALLS,
  LIBRARIES,
  REC,
  STUDY_SPOTS,
  SOUTHSIDE_COMMONS_COORD,
  type ExploreItem,
} from "../../data/exploreSeed";
import { useReferenceLocation } from "../../hooks/useReferenceLocation";
import {
  formatMiles1dp,
  haversineMeters,
  metersToMiles,
  type LatLng,
} from "../../utils/distance";

type SectionConfig = {
  key: string;
  title: string;
  ariaLabel: string;
  items: ExploreItem[];
};

const CONTROL_HEIGHT = 50;

function getDistanceLabel(reference: LatLng | undefined, coord: LatLng | undefined): string | null {
  if (!reference || !coord) {
    return null;
  }
  const meters = haversineMeters(reference, coord);
  const miles = metersToMiles(meters);
  return formatMiles1dp(miles);
}

function matchesQuery(item: ExploreItem, query: string): boolean {
  if (!query) return true;
  const normalized = query.toLowerCase();
  if (item.name.toLowerCase().includes(normalized)) {
    return true;
  }
  return item.tags.some((tag) => tag.toLowerCase().includes(normalized));
}

function ExploreContent() {
  const { status, reference, error } = useReferenceLocation();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedQuery(searchValue.trim().toLowerCase());
    }, 200);

    return () => {
      window.clearTimeout(handle);
    };
  }, [searchValue]);

  const sections = useMemo<SectionConfig[]>(() => {
    const filterItems = (items: ExploreItem[]) =>
      items.filter((item) => matchesQuery(item, debouncedQuery));

    return [
      {
        key: "study",
        title: "Study Spots",
        ariaLabel: "Study Spots carousel",
        items: filterItems(STUDY_SPOTS),
      },
      {
        key: "dining",
        title: "Dining Halls",
        ariaLabel: "Dining Halls carousel",
        items: filterItems(DINING_HALLS),
      },
      {
        key: "libraries",
        title: "Libraries",
        ariaLabel: "Libraries carousel",
        items: filterItems(LIBRARIES),
      },
      {
        key: "rec",
        title: "Rec",
        ariaLabel: "Rec carousel",
        items: filterItems(REC),
      },
    ];
  }, [debouncedQuery]);

  const effectiveReference = status === "fallback" ? SOUTHSIDE_COMMONS_COORD : reference;
  const locationReady = status !== "pending";
  const locationLabel =
    status === "pending"
      ? "Locating..."
      : status === "granted"
      ? "Using your location"
      : "Using Southside Commons";

  return (
    <Shell activePath="/explore">
      <Box
        sx={{
          maxWidth: (theme) => theme.breakpoints.values.xl,
          mx: "auto",
          width: "100%",
          px: { xs: 2, md: 3 },
          py: 2,
        }}
      >
        <Stack spacing={4}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            spacing={{ xs: 2, md: 3 }}
          >
            <Stack spacing={1}>
              <Typography variant="h4" component="h1" color="text.primary" sx={{ fontWeight: 700 }}>
                Explore
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Find what’s near you on campus.
              </Typography>
            </Stack>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              alignItems="center"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              <Button
                variant="outlined"
                color="primary"
                startIcon={locationReady ? <MyLocationIcon fontSize="small" /> : undefined}
                disabled={!locationReady}
                sx={{
                  height: CONTROL_HEIGHT,
                  borderRadius: 999,
                  px: 2,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  borderWidth: 2,
                  ":hover": {
                    backgroundColor: "rgba(80,0,0,0.06)",
                  },
                  ":disabled": {
                    borderColor: "rgba(80,0,0,0.28)",
                    color: "text.disabled",
                  },
                }}
              >
                {locationLabel}
              </Button>
              <TextField
                size="medium"
                placeholder="Search places..."
                variant="outlined"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                sx={{
                  minWidth: { xs: "100%", sm: 260 },
                  "& .MuiOutlinedInput-root": {
                    height: CONTROL_HEIGHT,
                    borderRadius: 999,
                    pl: 2,
                  },
                }}
                inputProps={{ "aria-label": "Search places" }}
              />
            </Stack>
          </Stack>

          {error && status === "fallback" && (
            <Alert severity="warning" sx={{ borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          <ForYou />

          {sections.map((section, index) => {
            const sectionId = section.key === "study" ? "study-section" : `${section.key}-section`;

            return (
              <Box key={section.key} id={sectionId}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  sx={{ mb: 2 }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 4,
                        height: 24,
                        borderRadius: 9999,
                        bgcolor: "primary.main",
                      }}
                    />
                    <Typography
                      variant="h6"
                      component="h2"
                      color="text.primary"
                      sx={{ fontWeight: 600 }}
                    >
                      {section.title}
                    </Typography>
                  </Stack>
                </Stack>

                <Box sx={{ position: "relative" }}>
                  <Box
                    role="list"
                    aria-label={section.ariaLabel}
                    sx={{
                      display: "grid",
                      gridAutoFlow: "column",
                      gridAutoColumns: {
                        xs: "80%",
                        sm: "45%",
                        md: "33%",
                        lg: "25%",
                      },
                      columnGap: 2,
                      overflowX: "auto",
                      scrollSnapType: "x mandatory",
                      WebkitOverflowScrolling: "touch",
                      pb: 1,
                      pr: 0.5,
                    }}
                  >
                    {section.items.map((item) => {
                      const distanceLabel = getDistanceLabel(effectiveReference, item.coord);
                      const ariaDistance = distanceLabel ?? "distance unavailable";
                      return (
                        <Card
                          key={item.id}
                          role="listitem"
                          sx={{
                            minWidth: {
                              xs: "80%",
                              sm: "45%",
                              md: "33%",
                              lg: "25%",
                            },
                            scrollSnapAlign: "start",
                            borderRadius: "16px",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                            border: `1px solid ${alpha("#500000", 0.06)}`,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                          aria-label={`${item.name}, ${ariaDistance}`}
                        >
                          <CardContent sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography
                                variant="h6"
                                component="p"
                                noWrap
                                sx={{ fontWeight: 700, flexGrow: 1 }}
                              >
                                {item.name}
                              </Typography>
                              {distanceLabel && (
                                <Chip
                                  aria-label="Distance from your location"
                                  label={distanceLabel}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                  sx={{ fontWeight: 600 }}
                                />
                              )}
                            </Stack>

                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              {item.tags.map((tag) => (
                                <Chip key={tag} label={tag} size="small" variant="outlined" />
                              ))}
                            </Stack>

                          <DetailLinkButton
                            id={item.id}
                            label="Details"
                            size="small"
                            ariaLabel={`Open details for ${item.name}`}
                          />
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Box>

                  <Box
                    sx={{
                      pointerEvents: "none",
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      right: 0,
                      width: 40,
                      background: (theme) =>
                        `linear-gradient(270deg, ${theme.palette.background.default} 0%, ${alpha(
                          theme.palette.background.default,
                          0,
                        )} 100%)`,
                    }}
                  />
                </Box>

                {index < sections.length - 1 && (
                  <Divider sx={{ my: 3, borderColor: (theme) => alpha(theme.palette.primary.main, 0.08) }} />
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Shell>
  );
}

export default function ExplorePage() {
  return <ExploreContent />;
}
