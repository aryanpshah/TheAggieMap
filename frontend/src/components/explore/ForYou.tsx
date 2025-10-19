"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { alpha, useTheme } from "@mui/material/styles";
import ForYouTile from "./ForYouTile";
import { FOR_YOU_POOL, type ForYouItem } from "../../data/forYouSeed";
import { useReferenceLocation } from "../../hooks/useReferenceLocation";
import {
  formatMiles1dp,
  haversineMeters,
  metersToMiles,
  type LatLng,
} from "../../utils/distance";
import {
  getSessionSeed,
  pickTop,
  reseed,
  weightedShuffle,
} from "../../utils/randomize";

const SEED_STORAGE_KEY = "forYouSeed";

type ForYouProps = {
  title?: string;
  maxItems?: number;
  onTileClick?: (itemId: string) => void;
};

type PersonalizationContext = {
  isEvening: boolean;
  reference?: LatLng;
  favoriteCategory?: ForYouItem["category"] | null;
};

function applyPersonalization(
  items: ForYouItem[],
  context: PersonalizationContext,
): ForYouItem[] {
  return items.map((item) => {
    const baseWeight = item.weight ?? 1;
    let adjustedWeight = baseWeight;

    if (
      context.isEvening &&
      (item.category === "Dining" || item.category === "Study")
    ) {
      adjustedWeight += baseWeight * 0.15;
    }

    if (context.favoriteCategory && item.category === context.favoriteCategory) {
      adjustedWeight += baseWeight * 0.2;
    }

    if (context.reference && item.coord) {
      const meters = haversineMeters(context.reference, item.coord);
      const miles = metersToMiles(meters);
      if (miles < 0.3) {
        adjustedWeight += baseWeight * 0.25;
      }
    }

    return {
      ...item,
      weight: adjustedWeight,
    };
  });
}

function isValidCategory(value: string): value is ForYouItem["category"] {
  return ["Study", "Dining", "Rec", "Library", "Event", "Other"].includes(value);
}

export default function ForYou({
  title = "For You",
  maxItems = 8,
  onTileClick,
}: ForYouProps) {
  const theme = useTheme();
  const { status, reference } = useReferenceLocation();
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [favoriteCategory, setFavoriteCategory] = useState<
    ForYouItem["category"] | null
  >(null);
  const [seed, setSeed] = useState<number>(() => getSessionSeed(SEED_STORAGE_KEY));
  const [items, setItems] = useState<ForYouItem[]>([]);
  const railRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem("favCategory");
      if (stored && isValidCategory(stored)) {
        setFavoriteCategory(stored);
      }
    } catch (error) {
      console.warn("Unable to load favorite category", error);
    }
  }, []);

  const isEvening = useMemo(() => {
    const hour = new Date().getHours();
    return hour >= 17 || hour < 5;
  }, []);

  useEffect(() => {
    const personalizedPool = applyPersonalization(FOR_YOU_POOL, {
      isEvening,
      reference,
      favoriteCategory,
    });
    const shuffled = weightedShuffle(personalizedPool, seed);
    setItems(pickTop(shuffled, maxItems));
  }, [favoriteCategory, isEvening, maxItems, reference, seed]);

  const distanceLookup = useMemo(() => {
    if (!reference) {
      return {};
    }
    return items.reduce<Record<string, string>>((acc, item) => {
      if (!item.coord) {
        return acc;
      }
      const meters = haversineMeters(reference, item.coord);
      const miles = metersToMiles(meters);
      acc[item.id] = formatMiles1dp(miles);
      return acc;
    }, {});
  }, [items, reference]);

  const handleRefresh = useCallback(() => {
    const nextSeed = reseed(SEED_STORAGE_KEY);
    setSeed(nextSeed);
  }, []);

  const handleRailKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!railRef.current) {
        return;
      }

      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
        return;
      }

      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const { clientWidth } = railRef.current;
      const step = Math.max(clientWidth * 0.7, 200);
      railRef.current.scrollBy({
        left: direction * step,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    },
    [prefersReducedMotion],
  );

  const reserveDistanceSpace = status === "pending";

  return (
    <Box
      component="section"
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 3,
        p: { xs: 2, md: 3 },
        boxShadow: "0 12px 30px rgba(80,0,0,0.08)",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
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
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            {title}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Refresh">
            <IconButton
              aria-label="Refresh recommendations"
              onClick={handleRefresh}
              size="small"
              sx={{
                border: (themeInner) =>
                  `1px solid ${alpha(themeInner.palette.primary.main, 0.16)}`,
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              }}
            >
              <RotateCcw size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit preferences (coming soon)">
            <span>
              <Button
                size="small"
                color="primary"
                variant="text"
                startIcon={<SlidersHorizontal size={16} />}
                disabled
              >
                Edit prefs
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      <Box sx={{ position: "relative" }}>
        <Box
          ref={railRef}
          role="list"
          aria-label={`${title} carousel`}
          tabIndex={0}
          onKeyDown={handleRailKeyDown}
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
            outline: "none",
            scrollBehavior: prefersReducedMotion ? "auto" : "smooth",
            "&:focus-visible": {
              boxShadow: (themeInner) =>
                `0 0 0 3px ${alpha(themeInner.palette.primary.main, 0.3)}`,
              borderRadius: 3,
            },
          }}
        >
          {items.map((item) => (
            <Box
              key={item.id}
              sx={{
                minWidth: {
                  xs: "80%",
                  sm: "45%",
                  md: "33%",
                  lg: "25%",
                },
                scrollSnapAlign: "start",
              }}
            >
              <ForYouTile
                item={item}
                distanceLabel={distanceLookup[item.id]}
                reserveDistanceSpace={reserveDistanceSpace}
                onTileClick={onTileClick}
              />
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            pointerEvents: "none",
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "space-between",
          }}
          aria-hidden
        >
          <Box
            sx={{
              width: 40,
              background: (themeInner) =>
                `linear-gradient(90deg, ${themeInner.palette.background.default} 0%, ${alpha(
                  themeInner.palette.background.default,
                  0,
                )} 100%)`,
            }}
          />
          <Box
            sx={{
              width: 40,
              background: (themeInner) =>
                `linear-gradient(270deg, ${themeInner.palette.background.default} 0%, ${alpha(
                  themeInner.palette.background.default,
                  0,
                )} 100%)`,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
