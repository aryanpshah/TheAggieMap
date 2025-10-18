import { createTheme } from "@mui/material/styles";

const aggieTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#500000",
      dark: "#380000",
      light: "#7A2C2C",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F5EFE6",
      dark: "#E0D5C1",
      light: "#FBF6EE",
      contrastText: "#500000",
    },
    text: {
      primary: "#1E1E1E",
      secondary: "#5F5F5F",
    },
    background: {
      default: "#FAF9F7",
      paper: "#FFFFFF",
    },
    divider: "#E2D6CB",
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
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
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
          boxShadow: "0px 18px 46px rgba(80, 0, 0, 0.08)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "#500000",
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          borderColor: "#CBB6A4",
          "&.Mui-selected": {
            backgroundColor: "#500000",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#380000",
            },
          },
        },
      },
    },
  },
});

export default aggieTheme;
