"use client";

import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { SignedIn, useUser } from "@clerk/nextjs";
import { X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Map", href: "/map" },
  { label: "Explore", href: "/explore" },
  { label: "Crowd Ping", href: "/crowdping" },
  { label: "Events", href: "/events" },
  { label: "Dining Halls", href: "/map?type=dining" },
  { label: "Study Spots", href: "/map?type=study" },
  { label: "Favorites", href: "/favorites" },
  { label: "Preferences", href: "/preferences" },
  { label: "Privacy", href: "/privacy" },
  { label: "About", href: "/about" },
];

type SidebarDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function SidebarDrawer({ open, onClose }: SidebarDrawerProps) {
  const { user } = useUser();

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 320,
          backgroundColor: "background.default",
          borderRight: (theme) => `1px solid ${theme.palette.primary.main}`,
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 3,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              The Aggie Map
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              Aggieland&apos;s One Stop Shop
            </Typography>
          </Box>
          <IconButton
            aria-label="Close navigation menu"
            onClick={onClose}
            size="small"
          >
            <X size={20} />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List>
            {NAV_LINKS.map((item) => (
              <ListItemButton
                key={item.label}
                component={Link}
                href={item.href}
                onClick={onClose}
                sx={{
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "secondary.light",
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Divider />
        <SignedIn>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              px: 3,
              py: 3,
              backgroundColor: "primary.light",
            }}
          >
            <Avatar
              src={user?.imageUrl ?? undefined}
              alt={user?.fullName ?? "Account avatar"}
            />
            <Box>
              <Typography sx={{ fontWeight: 600 }}>
                {user?.fullName ?? user?.primaryEmailAddress?.emailAddress}
              </Typography>
              <Typography variant="body2" sx={{ color: "primary.dark" }}>
                Signed in
              </Typography>
            </Box>
          </Box>
        </SignedIn>
      </Box>
    </Drawer>
  );
}
