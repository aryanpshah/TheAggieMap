import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#500000",
      dark: "#380000",
      light: "#7a2c2c",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#B9995E",
      dark: "#8F7640",
      light: "#DCC9A0",
      contrastText: "#500000",
    },
    background: {
      default: "#F8F4E3",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2B2B2B",
      secondary: "#4F4F4F",
    },
    success: {
      main: "#42A042",
    },
    warning: {
      main: "#F1C40F",
    },
    error: {
      main: "#C0392B",
    },
  },
  typography: {
    fontFamily:
      'var(--font-inter, "Inter"), "Inter", "Segoe UI", -apple-system, sans-serif',
    h1: {
      fontFamily:
        'var(--font-montserrat, "Montserrat"), "Montserrat", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily:
        'var(--font-montserrat, "Montserrat"), "Montserrat", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily:
        'var(--font-montserrat, "Montserrat"), "Montserrat", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily:
        'var(--font-montserrat, "Montserrat"), "Montserrat", sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily:
        'var(--font-montserrat, "Montserrat"), "Montserrat", sans-serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily:
        'var(--font-montserrat, "Montserrat"), "Montserrat", sans-serif',
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
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
          borderRadius: 12,
          boxShadow:
            "0 18px 45px rgba(80, 0, 0, 0.12), 0 8px 18px rgba(80, 0, 0, 0.08)",
        },
      },
    },
  },
});

export default theme;
