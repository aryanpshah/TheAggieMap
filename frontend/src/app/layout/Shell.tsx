"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import SidebarDrawer from "../../components/layout/SidebarDrawer";
import TopBar from "../../components/layout/TopBar";
import Sidebar from "./Sidebar";

export interface ShellProps {
  activePath: string;
  children: React.ReactNode;
}

export default function Shell({ activePath, children }: ShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <TopBar onMenuClick={() => setDrawerOpen(true)} />
      <SidebarDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column" }}>
          <Toolbar sx={{ mb: 2 }} />
          <Sidebar activePath={activePath} />
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: "100vh",
            px: { xs: 2, md: 3 },
            py: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Toolbar sx={{ mb: { xs: 2, md: 3 } }} />
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
    </Box>
  );
}
