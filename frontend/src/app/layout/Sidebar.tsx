"use client";

import Link from "next/link";
import { useMemo } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Map", href: "/map" },
  { label: "Explore", href: "/explore" },
  { label: "Events", href: "/events" },
];

export interface SidebarProps {
  activePath: string;
}

export default function Sidebar({ activePath }: SidebarProps) {
  const normalizedActive = useMemo(() => activePath.toLowerCase(), [activePath]);

  return (
    <Box
      component="nav"
      sx={{
        width: { xs: 0, md: 280 },
        flexShrink: 0,
        bgcolor: "background.paper",
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexDirection: "column",
        minHeight: { md: "calc(100vh - 64px)" },
        position: "sticky",
        top: { md: "64px" },
        px: 1,
      }}
    >
      <Stack spacing={0.5} sx={{ px: 2.5, py: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
          The Aggie Map
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aggieland&apos;s One Stop Shop
        </Typography>
      </Stack>
      <List sx={{ flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            normalizedActive === item.href.toLowerCase() ||
            normalizedActive.replace(/\/$/, "") === item.href.toLowerCase();
          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={isActive}
              sx={{
                borderRadius: 2,
                mx: 1,
                mb: 0.5,
                "&.Mui-selected": {
                  bgcolor: "#5000000F",
                  color: "primary.main",
                },
                "&:hover": {
                  bgcolor: "#50000014",
                },
              }}
            >
              <ListItemText
                primaryTypographyProps={{
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {item.label}
              </ListItemText>
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
