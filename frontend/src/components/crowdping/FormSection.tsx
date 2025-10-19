"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { alpha } from "@mui/material/styles";

export interface FormSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  divider?: boolean;
}

export default function FormSection({ title, subtitle, children, divider = true }: FormSectionProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {children}

      {divider && (
        <Divider
          sx={{
            borderColor: (theme) => alpha(theme.palette.primary.main, 0.08),
            mt: 1,
          }}
        />
      )}
    </Box>
  );
}
