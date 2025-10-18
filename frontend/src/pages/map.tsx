"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import Shell from "../app/layout/Shell";
import { SAMPLE_CAPACITY, type BackendItem } from "../data/sampleCapacity";
import { useGeocoder, SOUTHSIDE_COMMONS } from "../hooks/useGeocoder";
import { LocationProvider, useLocationContext } from "../context/LocationContext";
import { CAPACITY_THRESHOLDS, parseCapacity } from "../utils/capacity";
import {
  formatMiles1dp,
  haversineDistanceMeters,
  metersToMiles,
  type LatLng,
} from "../utils/coords";
import { buildDirectionsUrl } from "../utils/directions";

const Leaflet2D = dynamic(() => import("../components/map/Leaflet2D"), {
  ssr: false,
});
const Google3D = dynamic(() => import("../components/map/Google3D"), {
  ssr: false,
});

type ViewMode = "2d" | "3d";

const LEGEND = [
  { label: `≤ ${CAPACITY_THRESHOLDS.green}`, color: "#2E7D32" },
  { label: `≤ ${CAPACITY_THRESHOLDS.yellow}`, color: "#ED6C02" },
  { label: "> 75", color: "#C62828" },
];

function resolveApiKey(): string | undefined {
  if (typeof process !== "undefined") {
    return (
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
      process.env.VITE_GOOGLE_MAPS_API_KEY
    );
  }
  return undefined;
}

interface MapPoint {
  name: string;
  capacity: number;
  coord: LatLng;
  distanceText?: string;
  directionsUrl: string;
}

function buildPoints(
  data: BackendItem[],
  coords: Map<string, LatLng>,
  reference: LatLng | undefined,
): MapPoint[] {
  const points: MapPoint[] = [];

  data.forEach((item) => {
    const coord = coords.get(item.name);
    if (!coord) {
      return;
    }

    const capacity = parseCapacity(item.capacityValue);
    let distanceText: string | undefined;
    let directionsUrl = "";

    if (reference) {
      const meters = haversineDistanceMeters(reference, coord);
      const miles = metersToMiles(meters);
      distanceText = formatMiles1dp(miles);
      directionsUrl = buildDirectionsUrl(reference, coord);
    }

    points.push({
      name: item.name,
      capacity,
      coord,
      distanceText,
      directionsUrl,
    });
  });

  return points;
}

function MapContent() {
  const [viewMode, setViewMode] = useState<ViewMode>("2d");
  const googleMapsKey = resolveApiKey();
  const { userCoords } = useLocationContext();

  const backendData = SAMPLE_CAPACITY;
  const names = useMemo(() => backendData.map((item) => item.name), [backendData]);

  const { coordsByName, unresolved, isLoading, error } = useGeocoder(
    names,
    googleMapsKey,
  );

  const southside = coordsByName.get(SOUTHSIDE_COMMONS);

  const reference: LatLng | undefined = useMemo(() => {
    if (userCoords) {
      return { lat: userCoords.latitude, lng: userCoords.longitude };
    }
    return southside;
  }, [userCoords, southside]);

  const points = useMemo(
    () => buildPoints(backendData, coordsByName, reference),
    [backendData, coordsByName, reference],
  );

  const center: LatLng | undefined = useMemo(() => {
    if (points.length) {
      return points[0].coord;
    }
    return reference;
  }, [points, reference]);

  const unresolvedNames = useMemo(
    () =>
      unresolved.filter(
        (name) => name.toLowerCase() !== SOUTHSIDE_COMMONS.toLowerCase(),
      ),
    [unresolved],
  );

  const apiKeyError = !googleMapsKey
    ? "Missing Google Maps API key. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY or VITE_GOOGLE_MAPS_API_KEY."
    : null;

  const showLoadingState = isLoading && !reference;

  return (
    <Shell activePath="/map">
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
            Map
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Live campus hotspots
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_event, value: ViewMode | null) => {
              if (value) setViewMode(value);
            }}
            size="small"
            color="primary"
            sx={{
              "& .MuiToggleButton-root": {
                fontWeight: 600,
                px: 2.5,
              },
            }}
          >
            <ToggleButton value="2d">2D</ToggleButton>
            <ToggleButton value="3d">3D</ToggleButton>
          </ToggleButtonGroup>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Legend
            </Typography>
            <Stack direction="row" spacing={1}>
              {LEGEND.map((item) => (
                <Chip
                  key={item.label}
                  label={item.label}
                  size="small"
                  sx={{
                    backgroundColor: `${item.color}14`,
                    border: `1px solid ${item.color}`,
                    color: "text.primary",
                    fontWeight: 600,
                    borderRadius: "999px",
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Stack>

        {apiKeyError && (
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            {apiKeyError}
          </Alert>
        )}

        {error && !apiKeyError && (
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {unresolvedNames.length > 0 && (
          <Alert severity="warning" sx={{ borderRadius: 3 }}>
            Some locations could not be resolved: {unresolvedNames.join(", ")}
          </Alert>
        )}

        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            bgcolor: "background.paper",
          }}
        >
          <CardContent
            sx={{
              p: 0,
              height: "min(72vh, calc(100vh - 220px))",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {showLoadingState && (
              <Stack
                spacing={2}
                alignItems="center"
                justifyContent="center"
                sx={{ flexGrow: 1 }}
              >
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                  Resolving map coordinates...
                </Typography>
              </Stack>
            )}

            {!showLoadingState &&
              center &&
              reference &&
              points.length > 0 &&
              viewMode === "2d" && <Leaflet2D points={points} center={center} />}

            {!showLoadingState &&
              center &&
              reference &&
              points.length > 0 &&
              viewMode === "3d" && <Google3D points={points} center={center} />}

            {!showLoadingState && (!reference || points.length === 0) && (
              <Stack
                spacing={2}
                alignItems="center"
                justifyContent="center"
                sx={{ flexGrow: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Unable to display the map until location data is available.
                </Typography>
              </Stack>
            )}
          </CardContent>
          <Divider />
          <Box sx={{ px: 3, py: 2, bgcolor: "background.default" }}>
            <Typography variant="caption" color="text.secondary">
              Tap a marker to view occupancy details and walking directions.
            </Typography>
          </Box>
        </Card>
      </Stack>
    </Shell>
  );
}

export default function MapPage() {
  return (
    <LocationProvider>
      <MapContent />
    </LocationProvider>
  );
}
