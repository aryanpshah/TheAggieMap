"use client";

import { useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Shell from "../layout/Shell";
import CrowdPingForm, { type CrowdPingFormValues } from "../../components/crowdping/CrowdPingForm";
import { useReferenceLocation } from "../../hooks/useReferenceLocation";
import { toCTIsoString } from "../../utils/datetime";
import type { LatLng } from "../../utils/distance";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error";
};

export default function CrowdPingPage() {
  const { status, reference, error: locationError } = useReferenceLocation();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);
  const [observedAt, setObservedAt] = useState(() => toCTIsoString(new Date()));
  const [formKey, setFormKey] = useState(0);

  const locationChip = useMemo(() => {
    if (status === "pending") {
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">
            Locating you...
          </Typography>
        </Stack>
      );
    }
    return (
      <Chip
        label={
          status === "granted" ? "Using your location" : "Using Southside Commons"
        }
        variant="outlined"
        color={status === "granted" ? "primary" : "default"}
        sx={{ fontWeight: 600 }}
      />
    );
  }, [status]);

  const resolveCoord = (): LatLng | null => {
    if (status === "granted" && reference) {
      return reference;
    }
    return null;
  };

  const handleSubmit = async (values: CrowdPingFormValues) => {
    setSubmitting(true);
    setSubmitError(null);

    const coord = resolveCoord();
    const payload: Record<string, unknown> = {
      place: values.place,
      levels: {
        crowded: values.crowded,
        loud: values.loud,
      },
      vibe: values.vibe,
      notes: values.notes,
      observedAt: toCTIsoString(new Date()),
      coord,
      source: "user",
    };

    if (!coord) {
      payload.reference = "Southside Commons";
    }

    try {
      const response = await fetch("/api/crowdping/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setFormKey((prev) => prev + 1);
      setObservedAt(toCTIsoString(new Date()));
      setSnackbar({ open: true, message: "Thanks! Your crowd ping was submitted.", severity: "success" });
    } catch (error) {
      setSubmitError((error as Error).message ?? "Could not submit right now.");
      setSnackbar({ open: true, message: "Could not submit right now.", severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Shell activePath="/crowdping">
      <Box
        sx={{
          width: "100%",
          maxWidth: (theme) => theme.breakpoints.values.lg,
          mx: "auto",
          px: { xs: 2, md: 3 },
          py: 2,
        }}
      >
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 3 }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
                Crowd Ping
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Share a quick snapshot of your spot on campus.
              </Typography>
            </Box>
            {locationChip}
          </Stack>

          {locationError && (
            <Alert severity="warning" sx={{ borderRadius: 3 }}>
              {locationError}
            </Alert>
          )}

          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardHeader
              title={
                <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                  Tell us about the scene
                </Typography>
              }
              subheader={
                <Typography variant="body2" color="text.secondary">
                  Observed at {observedAt}
                </Typography>
              }
            />
            <CardContent sx={{ pt: 0 }}>
              <CrowdPingForm
                key={formKey}
                onSubmit={handleSubmit}
                submitting={submitting}
                error={submitError}
              />
            </CardContent>
          </Card>
        </Stack>
      </Box>

      <Snackbar
        open={Boolean(snackbar?.open)}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        message={snackbar?.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Shell>
  );
}
