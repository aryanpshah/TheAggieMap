"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";
import type { EventClickArg, DatesSetArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/react";
import type { CampusEvent } from "../../data/eventsSeed";



export type CalendarViewType = "dayGridMonth" | "timeGridWeek" | "listWeek";

export interface EventCalendarProps {
  events: CampusEvent[];
  view: CalendarViewType;
  keyword?: string;
  category?: string;
  onEventClick: (event: CampusEvent) => void;
  onRangeChange?: (label: string) => void;
}

function matchesKeyword(event: CampusEvent, keyword?: string): boolean {
  if (!keyword) return true;
  const value = keyword.trim().toLowerCase();
  if (!value) return true;
  return (
    event.title.toLowerCase().includes(value) ||
    event.details.toLowerCase().includes(value) ||
    event.location.toLowerCase().includes(value)
  );
}

export default function EventCalendar({
  events,
  view,
  keyword,
  category,
  onEventClick,
  onRangeChange,
}: EventCalendarProps) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [rangeLabel, setRangeLabel] = useState("");

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory = !category || category === "All" || event.category === category;
      return matchesCategory && matchesKeyword(event, keyword);
    });
  }, [events, keyword, category]);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;
    if (calendarApi.view.type !== view) {
      calendarApi.changeView(view);
      // ensure range label updates when view is programmatically changed
      setRangeLabel(calendarApi.view.title);
      onRangeChange?.(calendarApi.view.title);
    }
  }, [view, onRangeChange]);

  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.prev();
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.next();
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.today();
  };

  const handleEventClick = (arg: EventClickArg) => {
    const event = arg.event;
    const payload: CampusEvent = {
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr ?? event.startStr,
      details: (event.extendedProps.details as string) ?? "",
      location: (event.extendedProps.location as string) ?? "",
      category: (event.extendedProps.category as CampusEvent["category"]) ?? "Academic",
    };
    onEventClick(payload);
  };

  const handleRangeChange = (arg: DatesSetArg) => {
    const title = arg.view.title;
    setRangeLabel(title);
    onRangeChange?.(title);
  };

  const calendarEvents = useMemo(
    () =>
      filteredEvents.map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        extendedProps: {
          details: event.details,
          location: event.location,
          category: event.category,
        },
      })),
    [filteredEvents],
  );

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        height: "min(75vh, calc(100vh - 220px))",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          position: "sticky",
          top: 0,
          zIndex: 1,
          bgcolor: "background.paper",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {rangeLabel}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<TodayIcon />}
              onClick={handleToday}
              sx={{ fontWeight: 600, borderRadius: 3 }}
            >
              Today
            </Button>
            <IconButton
              color="primary"
              onClick={handlePrev}
              aria-label="Previous period"
              sx={{
                border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              color="primary"
              onClick={handleNext}
              aria-label="Next period"
              sx={{
                border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          p: 0,
          "& .fc": {
            fontFamily: (theme) => theme.typography.fontFamily,
            "--fc-border-color": (theme) => theme.palette.divider,
            "--fc-page-bg-color": (theme) => theme.palette.background.paper,
          },
          "& .fc-daygrid-day.fc-day-today": {
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
          },
          "& .fc-theme-standard .fc-scrollgrid": {
            borderColor: (theme) => theme.palette.divider,
          },
          "& .fc-event": {
            borderRadius: 3,
            border: "none",
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.15),
            color: "inherit",
          },
          "& .fc-list-event:hover td": {
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
          },
        }}
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin ]}
          initialView={view}
          events={calendarEvents}
          headerToolbar={false}
          height="100%"
          eventClick={handleEventClick}
          datesSet={handleRangeChange}
          dayMaxEventRows={4}
          slotEventOverlap={false}
          expandRows
          nowIndicator
          eventTextColor="#1E1E1E"
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          noEventsContent={() => (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 1,
                color: "text.secondary",
                px: 3,
                textAlign: "center",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                No events match your filters.
              </Typography>
              <Typography variant="body2">
                Try adjusting your view or keyword to discover more happening around campus.
              </Typography>
            </Box>
          )}
        />
      </CardContent>
    </Card>
  );
}


