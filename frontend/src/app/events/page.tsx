"use client";

import { useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import type { SelectChangeEvent } from "@mui/material/Select";
import Shell from "../layout/Shell";
import EventCalendar, { type CalendarViewType } from "../../components/events/EventCalendar";
import EventDrawer from "../../components/events/EventDrawer";
import { EVENTS_SEED, type CampusEvent } from "../../data/eventsSeed";
import { createCalendarEvent } from "../../lib/api";

type ViewOption = "month" | "week" | "list";

const VIEW_TO_CALENDAR: Record<ViewOption, CalendarViewType> = {
  month: "dayGridMonth",
  week: "timeGridWeek",
  list: "listWeek",
};

const toGCalUTC = (date: Date): string => {
  const pad = (value: number) => value.toString().padStart(2, "0");
  return (
    date.getUTCFullYear().toString().padStart(4, "0") +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
};

export default function EventsPage() {
  const [view, setView] = useState<ViewOption>("month");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const categories = useMemo(() => ["All", ...new Set(EVENTS_SEED.map((event) => event.category))], []);

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, next: ViewOption | null) => {
    if (next) {
      setView(next);
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategory(event.target.value);
  };

  const handleEventClick = (event: CampusEvent) => {
    setSelectedEvent(event);
    setDrawerOpen(true);
  };

  const handleAddToGoogle = async (event: CampusEvent) => {
    const start = toGCalUTC(new Date(event.start));
    const end = toGCalUTC(new Date(event.end));
    try {
      const link = await createCalendarEvent({
        text: event.title,
        start,
        end,
        details: event.details,
        location: event.location,
      });
      window.open(link, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to open calendar", error);
      setSnackbar({
        open: true,
        message: "Could not open Google Calendar. Please try again.",
        severity: "error",
      });
    }
  };

  /*const handleSaveToBackend = async (event: CampusEvent) => {
    setSaving(true);
    try {
      const payload = {
        text: event.title,
        start: toCompactOffset(event.start),
        end: toCompactOffset(event.end),
        details: event.details,
        location: event.location,
      };

      const response = await fetch("/api/calendar/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setSnackbar({
        open: true,
        message: "Event saved to your calendar.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: (error as Error).message ?? "Unable to save event.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };*/

  const handleCopyLink = () => {
    setSnackbar({
      open: true,
      message: "Event link copied.",
      severity: "info",
    });
  };

  const handleShare = () => {
    setSnackbar({
      open: true,
      message: "Share sheet opened.",
      severity: "info",
    });
  };

  return (
    <Shell activePath="/events">
      <Box
        sx={{
          width: "100%",
          maxWidth: (theme) => theme.breakpoints.values.xl,
          mx: "auto",
          px: { xs: 2, md: 3 },
          py: 2,
        }}
      >
        <Stack spacing={4}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 3 }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
          >
            <Stack spacing={1}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
                Events
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {"What's happening around campus."}
              </Typography>
            </Stack>
            <Stack
              direction={{ xs: "column", lg: "row" }}
              spacing={{ xs: 1.5, lg: 2 }}
              alignItems={{ xs: "flex-start", lg: "center" }}
            >
              <ToggleButtonGroup
                color="primary"
                value={view}
                exclusive
                onChange={handleViewChange}
                size="small"
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 999,
                  p: 0.5,
                  columnGap: 1,
                  display: "inline-flex",
                  boxShadow: "inset 0 0 0 1px rgba(80,0,0,0.12)",
                  "& .MuiToggleButtonGroup-grouped": {
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 600,
                    minWidth: 80,
                    px: 2.5,
                    py: 0.5,
                    border: "1px solid",
                    borderColor: (theme) => `${theme.palette.primary.main}33`,
                    margin: 0,
                  },
                  "& .MuiToggleButtonGroup-grouped:not(:first-of-type)": {
                    marginLeft: 0,
                  },
                }}
              >
                <ToggleButton value="month">Month</ToggleButton>
                <ToggleButton value="week">Week</ToggleButton>
                <ToggleButton value="list">List</ToggleButton>
              </ToggleButtonGroup>
              <TextField
                size="small"
                placeholder="Search events..."
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                inputProps={{ "aria-label": "Search events" }}
              />
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="events-category-label">Category</InputLabel>
                <Select
                  labelId="events-category-label"
                  value={category}
                  label="Category"
                  onChange={handleCategoryChange}
                >
                  {categories.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>

          <EventCalendar
            events={EVENTS_SEED}
            view={VIEW_TO_CALENDAR[view]}
            keyword={keyword}
            category={category}
            onEventClick={handleEventClick}
          />
        </Stack>
      </Box>

      <EventDrawer
        open={drawerOpen}
        event={selectedEvent}
        onClose={() => setDrawerOpen(false)}
        onAddToGoogle={handleAddToGoogle}
        onCopyLink={handleCopyLink}
        onShare={handleShare}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Shell>
  );
}






