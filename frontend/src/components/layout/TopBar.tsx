"use client";

import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
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
        borderBottom: (theme) => `1px solid ${theme.palette.primary.dark}`,
        backdropFilter: "blur(12px)",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: "1200px",
          width: "100%",
          mx: "auto",
          px: { xs: 2, md: 4 },
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Open navigation menu"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <Menu size={22} />
        </IconButton>
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 700, letterSpacing: 1.2 }}
          >
            The Aggie Map
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
              <Avatar
                src={user?.imageUrl ?? undefined}
                alt={displayName}
                sx={{ width: 32, height: 32 }}
              />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Howdy, {displayName}
              </Typography>
              <UserButton afterSignOutUrl="/" />
            </Stack>
          </SignedIn>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
