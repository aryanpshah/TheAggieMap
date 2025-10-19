"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import SidebarDrawer from "../../components/layout/SidebarDrawer";
import TopBar from "../../components/layout/TopBar";

export interface ShellProps {
  activePath: string;
  children: React.ReactNode;
}

export default function Shell({ activePath, children }: ShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <TopBar onMenuClick={() => setDrawerOpen(true)} />
      <SidebarDrawer activePath={activePath} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          px: { xs: 2, md: 3 },
          pt: { xs: 3, md: 4 },
          pb: { xs: 4, md: 6 },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar sx={{ minHeight: (theme) => theme.mixins.toolbar.minHeight }} />
        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
            maxWidth: (theme) => theme.breakpoints.values.xl,
            mx: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
