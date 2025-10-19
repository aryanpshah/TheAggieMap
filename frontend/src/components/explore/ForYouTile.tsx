"use client";

import { MouseEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import type { ForYouItem } from "../../data/forYouSeed";

type ForYouTileProps = {
  item: ForYouItem;
  distanceLabel?: string | null;
  reserveDistanceSpace?: boolean;
  onTileClick?: (itemId: string) => void;
  disableNavigation?: boolean;
  tabIndex?: number;
  ariaHidden?: boolean;
};

function isExternalLink(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export default function ForYouTile({
  item,
  distanceLabel,
  reserveDistanceSpace = false,
  onTileClick,
  disableNavigation = false,
  tabIndex,
  ariaHidden,
}: ForYouTileProps) {
  const router = useRouter();
  const cardRole = disableNavigation ? "presentation" : "listitem";

  const handleNavigate = useCallback(() => {
    if (disableNavigation) {
      return;
    }

    onTileClick?.(item.id);

    if (!item.href) {
      return;
    }

    if (isExternalLink(item.href)) {
      window.open(item.href, "_blank", "noopener");
      return;
    }

    router.push(item.href);
  }, [item.href, item.id, onTileClick, router]);

  const handleButtonClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if (!disableNavigation) {
        handleNavigate();
      }
    },
    [disableNavigation, handleNavigate],
  );

  return (
    <Card
      role={cardRole}
      elevation={3}
      sx={{
        borderRadius: 3,
        backgroundColor: "background.paper",
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
        boxShadow: "0 8px 24px rgba(80,0,0,0.08)",
        transition: (theme) =>
          theme.transitions.create(["transform", "box-shadow"], {
            duration: theme.transitions.duration.shorter,
          }),
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 16px 32px rgba(80,0,0,0.12)",
        },
        "&:focus-within": {
          outline: (theme) => `2px solid ${alpha(theme.palette.primary.main, 0.4)}`,
          outlineOffset: 4,
        },
      }}
      aria-hidden={ariaHidden}
    >
      <CardActionArea
        onClick={handleNavigate}
        sx={{
          borderRadius: 3,
          height: "100%",
          pointerEvents: disableNavigation ? "none" : undefined,
        }}
        tabIndex={tabIndex}
        aria-hidden={ariaHidden}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            minHeight: 180,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="h6"
              component="h3"
              noWrap
              sx={{ fontWeight: 700, flexGrow: 1, color: "text.primary" }}
            >
              {item.name}
            </Typography>
            {distanceLabel ? (
              <Chip
                label={distanceLabel}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            ) : reserveDistanceSpace ? (
              <Chip
                label="0.0 mi"
                size="small"
                variant="outlined"
                sx={{ visibility: "hidden" }}
              />
            ) : null}
          </Stack>

          {item.tags && item.tags.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {item.tags.slice(0, 3).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderRadius: "999px",
                    fontWeight: 600,
                  }}
                />
              ))}
            </Stack>
          )}

          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={handleButtonClick}
            disabled={disableNavigation}
            sx={{ alignSelf: "flex-start", mt: "auto" }}
          >
            See details
          </Button>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
