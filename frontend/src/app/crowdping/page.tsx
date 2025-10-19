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
import CrowdPingForm from "../../components/crowdping/CrowdPingForm";
import { useReferenceLocation } from "../../hooks/useReferenceLocation";
import type { LatLng } from "../../utils/distance";

type SnackbarState = {
  open: boolean;
  message: string;
};

export default function CrowdPingPage() {
  const { status, reference, error: locationError } = useReferenceLocation();
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);
  const [formKey, setFormKey] = useState(0);

  const resolveCoord = (): LatLng | null => {
    if (status === "granted" && reference) {
      return reference;
    }
    return null;
  };

  const handleSubmit: () => Promise<void> = async () => {
    resolveCoord(); // trigger permission prompt if available, though not used currently
    setFormKey((prev) => prev + 1);
    setSnackbar({ open: true, message: "Ping recorded" });
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
              <CrowdPingForm key={formKey} onSubmit={handleSubmit} />
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





