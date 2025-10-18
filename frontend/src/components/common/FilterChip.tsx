"use client";

import Chip, { ChipProps } from "@mui/material/Chip";

type FilterChipProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  size?: ChipProps["size"];
  readOnly?: boolean;
};

export default function FilterChip({
  label,
  selected = false,
  onClick,
  size = "medium",
  readOnly = false,
}: FilterChipProps) {
  return (
    <Chip
      label={label}
      clickable={!readOnly}
      onClick={readOnly ? undefined : onClick}
      size={size}
      sx={{
        borderRadius: "999px",
        fontWeight: 600,
        textTransform: "none",
        backgroundColor: (theme) =>
          selected ? theme.palette.secondary.main : theme.palette.background.paper,
        color: (theme) =>
          selected ? theme.palette.primary.main : theme.palette.text.primary,
        border: (theme) =>
          `1px solid ${
            selected ? theme.palette.secondary.dark : theme.palette.divider
          }`,
        transition: (theme) =>
          theme.transitions.create(["background-color", "transform"], {
            duration: theme.transitions.duration.shorter,
          }),
        "&:hover": {
          transform: selected ? "scale(1.03)" : "scale(1.02)",
        },
        "&:focus-visible": {
          outline: (theme) => `3px solid ${theme.palette.secondary.light}`,
          outlineOffset: 2,
        },
      }}
    />
  );
}
