"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Shell from "../layout/Shell";
import CrowdPingForm, { type CrowdPingFormValues } from "../../components/crowdping/CrowdPingForm";
import { useReferenceLocation } from "../../hooks/useReferenceLocation";
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
  const [formKey, setFormKey] = useState(0);

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
                Share a quick pulse on the crowd around you.
              </Typography>
            </Box>
          </Stack>

          {locationError && (
            <Alert severity="warning" sx={{ borderRadius: 3 }}>
              {locationError}
            </Alert>
          )}

          <Card
            elevation={4}
            sx={{
              borderRadius: 0,
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent>
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





