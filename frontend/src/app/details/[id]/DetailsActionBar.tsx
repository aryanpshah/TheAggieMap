"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { buildGoogleDirectionsUrl } from "../../../lib/directions";
import { getUserPosition } from "../../../components/client/getUserPosition";
import type { LocationDetail } from "../../../types/locations";

type DetailsActionBarProps = {
  loc: LocationDetail;
};

export default function DetailsActionBar({ loc }: DetailsActionBarProps) {
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const hasDestination =
    Boolean(loc.placeId) || (typeof loc.lat === "number" && typeof loc.lng === "number");

  const handleGoNow = async () => {
    if (!hasDestination) return;
    setLoading(true);
    try {
      const origin = await getUserPosition(2000);
      const url = buildGoogleDirectionsUrl({
        dest: { placeId: loc.placeId, lat: loc.lat, lng: loc.lng },
        origin: origin ?? undefined,
      });
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAddress = async () => {
    if (!loc.address || typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }
    await navigator.clipboard.writeText(loc.address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Stack spacing={1.5} sx={{ position: { xs: "static", md: "relative" } }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<DirectionsWalkIcon />}
        onClick={handleGoNow}
        disabled={!hasDestination || loading}
        aria-label="Open walking directions in Google Maps"
        sx={{ py: 1.25 }}
      >
        {loading ? "Getting your location…" : "Go Now"}
      </Button>
      <Typography variant="caption" color="text.secondary">
        {hasDestination
          ? "Opens Google Maps in a new tab with walking directions."
          : "Directions unavailable (no destination set)."}
      </Typography>

      <Tooltip
        title={
          loc.address ? (copied ? "Address copied!" : "Copy address") : "Address unavailable"
        }
      >
        <span>
          <Button
            variant="text"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyAddress}
            disabled={!loc.address}
            aria-label="Copy address to clipboard"
          >
            Copy address
          </Button>
        </span>
      </Tooltip>
    </Stack>
  );
}
