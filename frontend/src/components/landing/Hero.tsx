"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { Mic, Search } from "lucide-react";
import type { SuggestedCard } from "../../lib/types";
import * as analytics from "../../lib/analytics";

type HeroProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: (query: string) => Promise<void>;
  results: SuggestedCard[] | null;
  loadingResults?: boolean;
  errorMessage?: string | null;
};

export default function Hero({
  query,
  onQueryChange,
  onSubmit,
  results,
  loadingResults = false,
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
          <Typography variant="h2" component="h1" sx={{ fontWeight: 700, letterSpacing: 1.2 }}>
            The Aggie Map
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 500, color: "text.secondary" }}>
            Aggieland&apos;s One Stop Shop
          </Typography>
        </Stack>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={10}
          sx={{
            width: "100%",
            p: { xs: 1.5, md: 2 },
            borderRadius: 4,
            backgroundColor: "background.paper",
            boxShadow: "0 20px 40px rgba(40,0,0,0.18)",
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
                  boxShadow: (theme) => `0 0 0 5px ${theme.palette.primary.main}33`,
                  transform: "scale(1.01)",
                },
              },
            }}
          />
        </Paper>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
          <Button
            component={Link}
            href="/explore#study-section"
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
          {(loadingResults || results || errorMessage) && (
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
              {loadingResults && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <CircularProgress size={20} color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    Gathering campus insights...
                  </Typography>
                </Stack>
              )}
              {!loadingResults && errorMessage && (
                <Typography variant="body2" color="error.main">
                  {errorMessage}
                </Typography>
              )}
              {!loadingResults && !errorMessage && results && (
                results.length > 0 ? (
                  <Grid container spacing={2}>
                    {results.map((item) => (
                      <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card
                          elevation={3}
                          sx={{
                            borderRadius: 3,
                            background: "linear-gradient(135deg, #ffffff 0%, #f6e3db 100%)",
                            border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                            transition: (theme) =>
                              theme.transitions.create(["transform", "box-shadow"], {
                                duration: theme.transitions.duration.shorter,
                              }),
                            "&:hover": {
                              transform: "translateY(-6px)",
                              boxShadow: "0 16px 30px rgba(80,0,0,0.22)",
                            },
                          }}
                        >
                          <CardContent>
                            <Stack spacing={1.4}>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {item.name}
                              </Typography>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Chip
                                  label={`${item.busyScore}% full`}
                                  size="small"
                                  color={
                                    item.busyScore < 40
                                      ? "success"
                                      : item.busyScore < 70
                                      ? "warning"
                                      : "error"
                                  }
                                  sx={{ fontWeight: 600 }}
                                />
                                {item.tags.map((tag) => (
                                  <Chip
                                    key={tag}
                                    label={tag}
                                    size="small"
                                    sx={{
                                      fontWeight: 600,
                                      backgroundColor: alpha("#500000", 0.12),
                                      border: "none",
                                    }}
                                  />
                                ))}
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No quick matches yet. Try another campus spot.
                  </Typography>
                )
              )}
            </Paper>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
