import { useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { LocationProvider, useLocationContext } from "../context/LocationContext";
import useGoogleMapsClient from "../hooks/useGoogleMapsClient";
import { getSouthsideCommonsAnchor, SOUTHSIDE_COMMONS_FALLBACK } from "../utils/places";
import { formatMiles } from "../utils/distance";

type ExplorePoi = {
  id: string;
  name: string;
  description: string;
  location: google.maps.LatLngLiteral;
  tags: string[];
};

const POIS: ExplorePoi[] = [
  {
    id: "evans-2f",
    name: "Evans Library 2F",
    description: "Silent stacks and individual carrels for heads-down work.",
    location: { lat: 30.616415, lng: -96.338295 },
    tags: ["Quiet", "Outlets", "Open late"],
  },
  {
    id: "zach-atrium",
    name: "ZACH Atrium",
    description: "Bright, open seating with collaborative tables.",
    location: { lat: 30.619123, lng: -96.340807 },
    tags: ["Group study", "Sunlight"],
  },
  {
    id: "sbisa",
    name: "Sbisa Dining",
    description: "Dining hall on the northside with quick bites and coffee.",
    location: { lat: 30.61862, lng: -96.34391 },
    tags: ["Dining", "Grab & go"],
  },
];

function ExploreView() {
  const { status, userCoords } = useLocationContext();
  const { ready, error, google } = useGoogleMapsClient();
  const [anchor, setAnchor] = useState<google.maps.LatLngLiteral | null>(null);
  const [loadingAnchor, setLoadingAnchor] = useState(true);
  const [anchorError, setAnchorError] = useState<string | null>(null);
  const [showFallbackAlert, setShowFallbackAlert] = useState(true);
  const [distanceMap, setDistanceMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!ready || !google) {
      return;
    }

    let cancelled = false;
    setLoadingAnchor(true);
    setAnchorError(null);

    getSouthsideCommonsAnchor(google)
      .then((result) => {
        if (cancelled) return;
        setAnchor(result ?? SOUTHSIDE_COMMONS_FALLBACK);
        setLoadingAnchor(false);
      })
      .catch(() => {
        if (cancelled) return;
        setAnchor(SOUTHSIDE_COMMONS_FALLBACK);
        setLoadingAnchor(false);
        setAnchorError("Unable to load campus anchor. Using default coordinates.");
      });

    return () => {
      cancelled = true;
    };
  }, [ready, google]);

  useEffect(() => {
    if (!ready || !google || !anchor) {
      return;
    }

    const compute = () => {
      const origin = userCoords
        ? new google.maps.LatLng(userCoords.latitude, userCoords.longitude)
        : new google.maps.LatLng(anchor.lat, anchor.lng);

      const updated: Record<string, string> = {};
      POIS.forEach((poi) => {
        const destination = new google.maps.LatLng(poi.location.lat, poi.location.lng);
        const meters = google.maps.geometry?.spherical?.computeDistanceBetween(origin, destination);
        if (typeof meters === "number") {
          updated[poi.id] = formatMiles(meters);
        } else {
          updated[poi.id] = "—";
        }
      });

      setDistanceMap(updated);
    };

    compute();
  }, [ready, google, anchor, userCoords]);

  const alertVisible = useMemo(() => status !== "granted" && showFallbackAlert, [status, showFallbackAlert]);

  return (
    <Box sx={{ p: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Explore campus highlights
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Distances update automatically once your precise location is available.
        </Typography>
        <Collapse in={alertVisible} unmountOnExit>
          <Alert
            severity="info"
            variant="outlined"
            action={
              <IconButton
                aria-label="Dismiss"
                size="small"
                onClick={() => setShowFallbackAlert(false)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ borderRadius: 3 }}
          >
            Using Southside Commons for distance until location is enabled.
          </Alert>
        </Collapse>
        {error && (
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            {error} Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment to enable distance
            calculations.
          </Alert>
        )}
        {anchorError && (
          <Alert severity="warning" sx={{ borderRadius: 3 }}>
            {anchorError}
          </Alert>
        )}
      </Stack>

      <Box sx={{ mt: 4 }}>
        {((!ready && !error) || loadingAnchor) && (
          <Stack spacing={2}>
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />
          </Stack>
        )}

        {ready && !loadingAnchor && !error && (
          <Grid container spacing={3} sx={{ mt: 0 }}>
            {POIS.map((poi) => (
              <Grid item xs={12} md={4} key={poi.id}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {poi.name}
                      </Typography>
                      {distanceMap[poi.id] ? (
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {distanceMap[poi.id]}
                        </Typography>
                      ) : (
                        <CircularProgress size={16} thickness={5} />
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {poi.description}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {poi.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}

export default function ExplorePage() {
  return (
    <LocationProvider>
      <ExploreView />
    </LocationProvider>
  );
}
