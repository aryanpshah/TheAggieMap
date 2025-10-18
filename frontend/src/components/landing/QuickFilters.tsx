"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as analytics from "../../lib/analytics";
import FilterChip from "../common/FilterChip";

type QuickFiltersProps = {
  options: string[];
  selected: Set<string>;
  onToggle: (filter: string) => void;
};

export default function QuickFilters({
  options,
  selected,
  onToggle,
}: QuickFiltersProps) {
  return (
    <Stack spacing={2} component="section">
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Quick Filters
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        flexWrap="wrap"
        role="group"
        aria-label="Filter suggested spots"
      >
        {options.map((option) => {
          const isSelected = selected.has(option);
          return (
            <FilterChip
              key={option}
              label={option}
              selected={isSelected}
              onClick={() => {
                analytics.filter_toggled(option, !isSelected);
                onToggle(option);
              }}
            />
          );
        })}
      </Stack>
    </Stack>
  );
}
