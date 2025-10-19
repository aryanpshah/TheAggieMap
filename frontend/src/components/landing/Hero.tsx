"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { Search, Mic } from "lucide-react";
import * as analytics from "../../lib/analytics";

type HeroProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: (query: string) => Promise<void>;
  response?: string;
  loadingResponse?: boolean;
  errorMessage?: string | null;
};

export default function Hero({
  query,
  onQueryChange,
  onSubmit,
  response,
  loadingResponse = false,
  errorMessage = null,
}: HeroProps) {
  const [value, setValue] = useState(query);

  useEffect(() => {
    setValue(query);
  }, [query]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = value.trim();
    analytics.search_submitted(nextQuery);
    onQueryChange(nextQuery);
    if (nextQuery) {
      await onSubmit(nextQuery);
    }
  };

  return (
    <Box
      className="maroonGradient"
      sx={{
        color: "text.primary",
        py: { xs: 10, md: 14 },
        px: 2,
      }}
    >
      <Stack
        spacing={4}
        alignItems="center"
        textAlign="center"
        sx={{ maxWidth: 780, mx: "auto" }}
      >
        <Stack spacing={2}>
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontWeight: 700, letterSpacing: 1.2 }}
          >
            The Aggie Map
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: 500, color: "text.secondary" }}
          >
            Aggieland&apos;s One Stop Shop
          </Typography>
        </Stack>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={8}
          sx={{
            width: "100%",
            p: { xs: 1.5, md: 2 },
            borderRadius: 3,
            backgroundColor: "background.paper",
          }}
        >
          <TextField
            fullWidth
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Search campus: study, dining, MSC, ZACH, REC..."
            aria-label="Search campus"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    edge="end"
                    aria-label="Activate voice search"
                    disableRipple
                  >
                    <Mic size={20} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "999px",
                transition: (theme) =>
                  theme.transitions.create(["box-shadow", "transform"], {
                    duration: theme.transitions.duration.shorter,
                  }),
                "&.Mui-focused": {
                  boxShadow: (theme) =>
                    `0 0 0 4px ${theme.palette.secondary.main}40`,
                  transform: "scale(1.01)",
                },
              },
            }}
          />
        </Paper>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            component={Link}
            href="/map?type=study"
            variant="contained"
            color="primary"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 700,
              borderRadius: "999px",
              transition: (theme) =>
                theme.transitions.create("transform", {
                  duration: theme.transitions.duration.shorter,
                }),
              "&:hover": {
                transform: "scale(1.03)",
              },
            }}
          >
            Find Study Spots
          </Button>
          <Button
            component={Link}
            href="/map?type=dining"
            variant="outlined"
            color="secondary"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 700,
              borderRadius: "999px",
              transition: (theme) =>
                theme.transitions.create("transform", {
                  duration: theme.transitions.duration.shorter,
                }),
              "&:hover": {
                transform: "scale(1.03)",
              },
            }}
          >
            See Dining Halls
          </Button>
        </Stack>
        <Stack spacing={1.5} sx={{ width: "100%" }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Built for Aggies. Powered by your campus.
          </Typography>
          {(loadingResponse || response || errorMessage) && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: (theme) => `1px solid ${theme.palette.primary.main}22`,
                bgcolor: "background.paper",
                textAlign: "left",
                minWidth: { xs: "100%", sm: 520 },
              }}
            >
              {loadingResponse && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <CircularProgress size={20} color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    Gathering campus insights...
                  </Typography>
                </Stack>
              )}
              {!loadingResponse && errorMessage && (
                <Typography variant="body2" color="error.main">
                  {errorMessage}
                </Typography>
              )}
              {!loadingResponse && !errorMessage && response && (
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                    color: "text.primary",
                  }}
                >
                  {response}
                </Typography>
              )}
            </Paper>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
