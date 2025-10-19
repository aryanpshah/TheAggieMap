"use client";

import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FmdGoodOutlined } from "@mui/icons-material";

declare module "@mui/material/styles" {
  interface TypeBackground {
    cream?: string;
  }
}

export interface LocationTileProps {
  code: string;
  distanceText?: string;
  noisePct?: number;
  noiseLabel?: "Quiet" | "Moderate" | "Busy" | "Loud";
  seatsFree: number;
  onClick?: () => void;
}

const DOT_COLORS: Record<NonNullable<LocationTileProps["noiseLabel"]>, string> = {
  Quiet: "#2E7D32",
  Moderate: "#ED6C02",
  Busy: "#C62828",
  Loud: "#8E0000",
};

function clamp(value: number | undefined): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export default function LocationTile({
  code,
  distanceText = "\u2014",
  noisePct = 0,
  noiseLabel = "Quiet",
  seatsFree,
  onClick,
}: LocationTileProps) {
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [displaySeats, setDisplaySeats] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplaySeats(seatsFree);
      return;
    }

    const target = Math.max(0, Math.round(seatsFree));
    const startTime = performance.now();
    const duration = 400;

    let frameId: number;

    const animate = (currentTime: number) => {
      const elapsed = Math.min(1, (currentTime - startTime) / duration);
      const eased = 1 - (1 - elapsed) * (1 - elapsed);
      setDisplaySeats(Math.round(target * eased));
      if (elapsed < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [prefersReducedMotion, seatsFree]);

  const dotColor = DOT_COLORS[noiseLabel] ?? DOT_COLORS.Quiet;
  const progress = clamp(noisePct);

  const ariaLabel = useMemo(
    () =>
      `${code}, distance ${distanceText || "unavailable"}, status ${noiseLabel}, ${displaySeats.toLocaleString()} seats free`,
    [code, distanceText, noiseLabel, displaySeats],
  );

  const handleClick = () => {
    onClick?.();
  };

  return (
    <Card
      role="article"
      aria-label={ariaLabel}
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        backgroundColor: "#FFFFFF",
        transition: (theme) =>
          theme.transitions.create(["transform", "box-shadow"], {
            duration: 180,
            easing: theme.transitions.easing.easeInOut,
          }),
        "&:hover": prefersReducedMotion
          ? undefined
          : {
              transform: "translateY(-2px)",
              boxShadow: "0 14px 36px rgba(0,0,0,0.10)",
            },
        "&:focus-within": {
          boxShadow: "0 0 0 3px rgba(80,0,0,0.15)",
        },
      }}
    >
      <Box
        sx={{
          backgroundColor: "#F7F4EE",
          px: 2,
          pt: 2,
          pb: 0,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: "#500000", fontSize: 14, lineHeight: 1.3 }}
        >
          The Aggie Map
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "#B8A886",
            fontSize: 13.5,
            lineHeight: 1.3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Aggieland&apos;s One Stop Shop
        </Typography>
      </Box>
      <Box
        aria-hidden
        sx={{
          backgroundColor: "#500000",
          height: 80,
        }}
      />
      <Box
        sx={{
          flexGrow: 1,
          display: "grid",
          gridAutoRows: "min-content",
          rowGap: 2.5,
          px: 2.5,
          pb: 3,
          pt: 2.5,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: 21,
            lineHeight: 1.2,
            color: "#1E1E1E",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {code}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <FmdGoodOutlined sx={{ fontSize: 20, color: "#757575" }} aria-hidden />
          <Typography
            variant="body2"
            sx={{ color: "#757575", fontSize: 14, lineHeight: 1.3, minWidth: 48 }}
          >
            {distanceText || "\u2014"}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            component="span"
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: dotColor,
              flexShrink: 0,
            }}
            aria-label={`Noise level is ${noiseLabel}`}
          />
          <Typography variant="body2" sx={{ color: "#3E3E3E", fontSize: 14, fontWeight: 500 }}>
            {noiseLabel}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            aria-label="Ambient noise"
            sx={{
              flexGrow: 1,
              height: 6,
              borderRadius: 9999,
              backgroundColor: "#EBEBEB",
              "& .MuiLinearProgress-bar": {
                borderRadius: 9999,
                backgroundColor: alpha("#500000", 0.35),
              },
            }}
          />
        </Stack>
        <Chip
          label={`${displaySeats.toLocaleString()} seats free`}
          sx={{
            width: "fit-content",
            borderRadius: 50,
            px: 1.5,
            py: 0.5,
            fontSize: 14,
            fontWeight: 500,
            border: "1px solid rgba(80,0,0,0.2)",
            color: "#1E1E1E",
            backgroundColor: "#FFFFFF",
          }}
        />
        <Button
          variant="contained"
          onClick={handleClick}
          aria-label={`Open directions to ${code}`}
          sx={{
            mt: 1,
            borderRadius: "9999px",
            height: 46,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "0.2px",
            backgroundColor: "#500000",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#3B0000",
              boxShadow: prefersReducedMotion ? undefined : "0 8px 16px rgba(80,0,0,0.25)",
            },
            "&:focus-visible": {
              boxShadow: "0 0 0 3px rgba(80,0,0,0.18)",
            },
            "&:active": {
              transform: prefersReducedMotion ? undefined : "scale(0.98)",
              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.18)",
            },
          }}
        >
          Go Now
        </Button>
      </Box>
    </Card>
  );
}

export function LocationTileSkeleton() {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <Box sx={{ backgroundColor: "#F7F4EE", px: 2, pt: 2, pb: 0 }}>
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="text" width="60%" height={16} />
      </Box>
      <Skeleton variant="rectangular" height={80} />
      <Box sx={{ flexGrow: 1, px: 2.5, pt: 2.5, pb: 3 }}>
        <Stack spacing={2}>
          <Skeleton variant="text" width="70%" height={28} />
          <Skeleton variant="text" width="50%" height={20} />
          <Skeleton variant="rectangular" height={14} />
          <Skeleton variant="rounded" width="60%" height={28} />
          <Skeleton variant="rounded" height={46} />
        </Stack>
      </Box>
    </Card>
  );
}
