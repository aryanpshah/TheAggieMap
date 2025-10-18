import { createTheme } from "@mui/material/styles";

const aggieTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#500000",
    },
    secondary: {
      main: "#F5EFE6",
    },
    text: {
      primary: "#1E1E1E",
      secondary: "#5F5F5F",
    },
    background: {
      default: "#FAF9F7",
      paper: "#FFFFFF",
    },
    success: {
      main: "#2E7D32",
    },
    warning: {
      main: "#ED6C02",
    },
    error: {
      main: "#C62828",
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default aggieTheme;
