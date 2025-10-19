"use client";

import dynamic from "next/dynamic";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Shell from "../layout/Shell";
import { useOccupancy } from "../../hooks/useOccupancy";
import { useGeocodedPoints } from "../../hooks/useGeocodedPoints";

const Leaflet2D = dynamic(() => import("../../components/map/Leaflet2D"), {
  ssr: false,
});

export default function MapPage() {
  const {
    data: occupancy,
    loading: occupancyLoading,
    error: occupancyError,
  } = useOccupancy(30_000);
  const { points, loading: geocodeLoading } = useGeocodedPoints(occupancy);

  const loading = occupancyLoading || geocodeLoading;
  const unresolved = points.filter((point) => !point.coord).map((point) => point.name);

  return (
    <Shell activePath="/map">
      <Stack spacing={3} sx={{ mt: { xs: 2, md: 3 } }}>
        <Stack spacing={0.5}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
            Map
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Live hotspots by capacity
          </Typography>
        </Stack>

        {occupancyError && (
          <Alert severity="warning" sx={{ borderRadius: 3 }}>
            {occupancyError}
          </Alert>
        )}

        {unresolved.length > 0 && (
          <Alert severity="info" sx={{ borderRadius: 3 }}>
            Awaiting coordinates for: {unresolved.join(", ")}
          </Alert>
        )}

        <Card
          elevation={1}
          sx={{
            borderRadius: 3,
            height: { xs: "60vh", md: "72vh" },
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 0, height: "100%" }}>
            {loading ? (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <CircularProgress size={24} />
                <Typography variant="body2" color="text.secondary">
                  Loading hotspots…
                </Typography>
              </Box>
            ) : points.length > 0 ? (
              <Leaflet2D points={points} />
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No live occupancy data available right now.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Shell>
  );
}
