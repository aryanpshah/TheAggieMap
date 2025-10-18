import Box from "@mui/material/Box";

type GaugeMiniProps = {
  value: number;
};

export default function GaugeMini({ value }: GaugeMiniProps) {
  const clamped = Math.min(Math.max(value, 0), 100);

  return (
    <Box
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      sx={{
        width: 96,
        height: 10,
        borderRadius: 999,
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? `${theme.palette.grey[300]}`
            : `${theme.palette.grey[700]}`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: `${clamped}%`,
          height: "100%",
          borderRadius: 999,
          transition: (theme) =>
            theme.transitions.create("width", {
              duration: theme.transitions.duration.shorter,
            }),
          backgroundColor: (theme) => {
            if (clamped < 40) {
              return theme.palette.success.main;
            }
            if (clamped < 70) {
              return theme.palette.warning.main;
            }
            return theme.palette.error.main;
          },
        }}
      />
    </Box>
  );
}
