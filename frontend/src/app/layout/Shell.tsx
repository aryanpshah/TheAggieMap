"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Sidebar from "./Sidebar";

export interface ShellProps {
  activePath: string;
  children: React.ReactNode;
}

export default function Shell({ activePath, children }: ShellProps) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar activePath={activePath} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Box
          component="header"
          sx={{
            px: { xs: 3, md: 4 },
            py: 3,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            bgcolor: "background.paper",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" sx={{ textTransform: "uppercase", color: "text.secondary" }}>
                Navigation
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                The Aggie Map
              </Typography>
            </Stack>
          </Stack>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            px: { xs: 3, md: 4 },
            py: { xs: 3, md: 4 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
