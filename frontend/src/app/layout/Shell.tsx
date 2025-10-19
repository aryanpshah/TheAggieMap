"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Footer from "../../components/layout/Footer";
import SidebarDrawer from "../../components/layout/SidebarDrawer";
import TopBar from "../../components/layout/TopBar";

export interface ShellProps {
  activePath: string;
  children: React.ReactNode;
}

const HEADER_HEIGHT = 64;
const FOOTER_HEIGHT = 72;

export default function Shell({ activePath, children }: ShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const shellVars = useMemo(
    () => ({
      "--headerH": `${HEADER_HEIGHT}px`,
      "--footerH": `${FOOTER_HEIGHT}px`,
    }),
    [],
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
      style={shellVars as CSSProperties}
    >
      <TopBar onMenuClick={() => setDrawerOpen(true)} />
      <SidebarDrawer
        activePath={activePath}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          minHeight: "calc(100vh - var(--headerH) - var(--footerH))",
          display: "flex",
          flexDirection: "column",
          px: { xs: 2, md: 3 },
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: "56px", sm: "var(--headerH)" },
            flexShrink: 0,
          }}
        />
        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
            maxWidth: (theme) => theme.breakpoints.values.xl,
            mx: "auto",
            py: { xs: 3, md: 4 },
          }}
        >
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
