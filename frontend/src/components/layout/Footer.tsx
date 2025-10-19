"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#500000",
        color: "#FFFFFF",
        borderTop: "none",
        boxShadow: "none",
        py: 2,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 3 }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            The Aggie Map © 2025 • Aggieland&apos;s One Stop Shop
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link
              component={NextLink}
              href="/privacy"
              underline="hover"
              color="inherit"
              variant="body2"
              sx={{ fontWeight: 600 }}
              aria-label="Privacy policy"
            >
              Privacy
            </Link>
            <Link
              component={NextLink}
              href="/about"
              underline="hover"
              color="inherit"
              variant="body2"
              sx={{ fontWeight: 600 }}
              aria-label="About The Aggie Map"
            >
              About
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
