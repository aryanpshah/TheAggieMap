"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Shell from "../layout/Shell";
import { SAMPLE_CAPACITY } from "../../data/sampleCapacity";
import { fetchOccupancy, type OccupancyRecord } from "../../lib/api";
import { useGeocoder, SOUTHSIDE_COMMONS } from "../../hooks/useGeocoder";
import { useLocationContext } from "../../context/LocationContext";
import { CAPACITY_THRESHOLDS, parseCapacity } from "../../utils/capacity";
import {
  formatMiles1dp,
  haversineDistanceMeters,
  metersToMiles,
  type LatLng,
} from "../../utils/coords";
import { buildDirectionsUrl } from "../../utils/directions";

const Leaflet2D = dynamic(() => import("../../components/map/Leaflet2D"), {
  ssr: false,
});

const LEGEND = [
  { label: `<= ${CAPACITY_THRESHOLDS.green}%`, color: "#2E7D32" },
  { label: `<= ${CAPACITY_THRESHOLDS.yellow}%`, color: "#ED6C02" },
  { label: `> ${CAPACITY_THRESHOLDS.yellow}%`, color: "#C62828" },
];

interface MapPoint {
  name: string;
  capacity: number;
  coord: LatLng;
  distanceText?: string;
  directionsUrl: string;
}

interface SourceItem {
  name: string;
  percent: number;
}

function resolveApiKey(): string | undefined {
  if (typeof process !== "undefined") {
    return (
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
      process.env.VITE_GOOGLE_MAPS_API_KEY
    );
  }
  return undefined;
}

function buildPoints(
  data: SourceItem[],
  coords: Map<string, LatLng>,
  reference: LatLng | undefined,
): MapPoint[] {
  const points: MapPoint[] = [];

  data.forEach((item) => {
    const coord = coords.get(item.name);
    if (!coord) return;

    const capacity = item.percent;
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
  const [occupancy, setOccupancy] = useState<OccupancyRecord[]>([]);
  const [loadingOccupancy, setLoadingOccupancy] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const googleMapsKey = resolveApiKey();
  const { userCoords } = useLocationContext();

  useEffect(() => {
    let cancelled = false;

    const loadOccupancy = async () => {
      setLoadingOccupancy(true);
      setFetchError(null);
      try {
        const data = await fetchOccupancy();
        if (!cancelled) {
          setOccupancy(data);
        }
      } catch (error) {
        if (!cancelled) {
          setFetchError((error as Error).message ?? "Unable to load occupancy data.");
        }
      } finally {
        if (!cancelled) {
          setLoadingOccupancy(false);
        }
      }
    };

    loadOccupancy();

    return () => {
      cancelled = true;
    };
  }, []);

  const fallbackItems = useMemo<SourceItem[]>(
    () =>
      SAMPLE_CAPACITY.map((item) => ({
        name: item.name,
        percent: parseCapacity(item.capacityValue),
      })),
    [],
  );

  const sourceItems = useMemo<SourceItem[]>(() => {
    if (occupancy.length > 0) {
      return occupancy.map((record) => ({
        name: record.location,
        percent: record.percent_full,
      }));
    }
    if (!loadingOccupancy && fetchError) {
      return fallbackItems;
    }
    return [];
  }, [occupancy, loadingOccupancy, fetchError, fallbackItems]);

  const names = useMemo(
    () => sourceItems.map((item) => item.name),
    [sourceItems],
  );

  const { coordsByName, unresolved, isLoading: geocodeLoading, error: geocodeError } =
    useGeocoder(names, googleMapsKey);

  const southside = coordsByName.get(SOUTHSIDE_COMMONS);

  const reference: LatLng | undefined = useMemo(() => {
    if (userCoords) {
      return { lat: userCoords.latitude, lng: userCoords.longitude };
    }
    return southside;
  }, [userCoords, southside]);

  const points = useMemo(
    () => buildPoints(sourceItems, coordsByName, reference),
    [sourceItems, coordsByName, reference],
  );

  const center: LatLng | undefined = useMemo(() => {
    if (points.length) {
      return points[0].coord;
    }
    return reference;
  }, [points, reference]);

  const unresolvedNames = useMemo(
    () =>
      unresolved
        .map((name) => name.trim())
        .filter((name) => name && name !== SOUTHSIDE_COMMONS),
    [unresolved],
  );

  const apiKeyError = !googleMapsKey
    ? "Missing Google Maps API key. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY or VITE_GOOGLE_MAPS_API_KEY."
    : null;

  const showLoading =
    loadingOccupancy || geocodeLoading || (!reference && points.length === 0);

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

        <Stack direction={{ xs: "column", md: "row" }} alignItems={{ xs: "flex-start", md: "center" }} justifyContent="flex-end" spacing={2}>
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

        {fetchError && !loadingOccupancy && (
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            {fetchError}
          </Alert>
        )}

        {apiKeyError && (
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            {apiKeyError}
          </Alert>
        )}

        {geocodeError && !apiKeyError && (
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            {geocodeError}
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
            {showLoading && (
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

            {!showLoading && center && reference && points.length > 0 && (
              <Leaflet2D points={points} center={center} />
            )}

            {!showLoading && (!reference || points.length === 0) && (
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
  return <MapContent />;
}
