"use client";

import Link from "next/link";
import Image from "next/image";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Menu } from "lucide-react";

type TopBarProps = {
  onMenuClick: () => void;
};

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { user } = useUser();
  const displayName =
    user?.firstName ??
    user?.username ??
    user?.fullName ??
    user?.primaryEmailAddress?.emailAddress ??
    "Aggie";

  return (
    <AppBar
      position="fixed"
      color="primary"
      elevation={0}
      sx={{
        borderBottom: "none",
        backdropFilter: "blur(12px)",
      }}
    >
      <Toolbar disableGutters sx={{ px: 0 }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: (theme) => theme.breakpoints.values.lg,
            mx: "auto",
            px: { xs: 0.5, md: 1.25 },
            display: "grid",
            gridTemplateColumns: "64px 1fr auto",
            alignItems: "center",
            minHeight: (theme) => theme.mixins.toolbar.minHeight,
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open navigation menu"
            onClick={onMenuClick}
            sx={{ justifySelf: "start" }}
          >
            <Menu size={22} />
          </IconButton>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              justifySelf: "center",
              ml: { xs: 3, md: 6 },
            }}
          >
            <Image
              src="/assets/logo.png"
              alt="The Aggie Map logo"
              width={48}
              height={48}
              style={{
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.92)",
                padding: 6,
                boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
              }}
            />
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, letterSpacing: 1.2 }}>
              The Aggie Map
            </Typography>
          </Stack>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, justifySelf: "end" }}>
            <SignedOut>
              <Stack direction="row" spacing={1.5}>
                <Button
                  component={Link}
                  href="/sign-in"
                  variant="outlined"
                  color="inherit"
                  sx={{ fontWeight: 600, borderRadius: "999px" }}
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  href="/sign-up"
                  variant="contained"
                  color="secondary"
                  sx={{ fontWeight: 700, borderRadius: "999px" }}
                >
                  Create Account
                </Button>
              </Stack>
            </SignedOut>
            <SignedIn>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Howdy, {displayName}
                </Typography>
                <UserButton afterSignOutUrl="/" />
              </Stack>
            </SignedIn>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
