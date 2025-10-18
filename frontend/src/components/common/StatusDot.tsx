import Box from "@mui/material/Box";
import type { SuggestedStatus } from "../../lib/types";

type StatusDotProps = {
  status: SuggestedStatus;
};

export default function StatusDot({ status }: StatusDotProps) {
  return (
    <Box
      component="span"
      role="status"
      aria-label={status}
      sx={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        display: "inline-flex",
        backgroundColor: (theme) => {
          switch (status) {
            case "Quiet":
              return theme.palette.success.main;
            case "Moderate":
              return theme.palette.warning.main;
            case "Busy":
            default:
              return theme.palette.error.main;
          }
        },
        boxShadow: (theme) =>
          `0 0 0 2px ${theme.palette.background.paper}`,
      }}
    />
  );
}
