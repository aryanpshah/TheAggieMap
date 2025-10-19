"use client";

import { useEffect, useMemo, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import type { CampusEvent } from "../../data/eventsSeed";
import { formatRangeCT } from "../../utils/datetime";

export interface EventDrawerProps {
  open: boolean;
  event: CampusEvent | null;
  onClose: () => void;
  onAddToGoogle: (event: CampusEvent) => void;
  onSaveToBackend: (event: CampusEvent) => void;
  onCopyLink?: (event: CampusEvent) => void;
  onShare?: (event: CampusEvent) => void;
  saving?: boolean;
}

export default function EventDrawer({
  open,
  event,
  onClose,
  onAddToGoogle,
  onSaveToBackend,
  onCopyLink,
  onShare,
  saving = false,
}: EventDrawerProps) {
  const primaryButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open && primaryButtonRef.current) {
      primaryButtonRef.current.focus();
    }
  }, [open, event]);

  const timeRangeLabel = useMemo(() => {
    if (!event) return "";
    return formatRangeCT(event.start, event.end);
  }, [event]);

  const handleCopyLink = () => {
    if (!event) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href + `?event=${event.id}`).catch(() => {
        // swallow errors silently; optional callback can be used by parent if needed
      });
    }
    onCopyLink?.(event);
  };

  const handleShare = () => {
    if (!event) return;
    if (navigator.share) {
      navigator
        .share({
          title: event.title,
          text: event.details,
          url: window.location.href + `?event=${event.id}`,
        })
        .catch(() => {
          // ignore share cancellation/errors
        });
    }
    onShare?.(event);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 420 },
          maxWidth: "100%",
          borderTopLeftRadius: { xs: 24, sm: 0 },
          borderBottomLeftRadius: { xs: 0, sm: 0 },
          p: 0,
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Event Details
        </Typography>
        <IconButton aria-label="Close event details" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: "auto", px: 3, py: 3 }}>
        {event ? (
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main" }}>
                {event.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {timeRangeLabel}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <PlaceOutlinedIcon fontSize="small" color="primary" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {event.location}
                </Typography>
              </Stack>
            </Stack>

            <Divider />

            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-line",
                lineHeight: 1.6,
              }}
            >
              {event.details}
            </Typography>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Select an event to see more details.
          </Typography>
        )}
      </Box>

      <Divider />

      <Box sx={{ px: 3, py: 3 }}>
        <Stack spacing={1.5}>
          <Button
            ref={primaryButtonRef}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={!event}
            onClick={() => {
              if (event) {
                onAddToGoogle(event);
              }
            }}
            sx={{ fontWeight: 700, borderRadius: 3 }}
          >
            Add to Google Calendar
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            fullWidth
            disabled={!event || saving}
            onClick={() => {
              if (event) {
                onSaveToBackend(event);
              }
            }}
            sx={{ fontWeight: 700, borderRadius: 3 }}
          >
            {saving ? "Saving..." : "Save to My Calendar"}
          </Button>
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Button
              variant="text"
              color="primary"
              size="small"
              startIcon={<ContentCopyIcon fontSize="small" />}
              onClick={handleCopyLink}
              disabled={!event}
              sx={{ fontWeight: 600 }}
            >
              Copy link
            </Button>
            <Button
              variant="text"
              color="primary"
              size="small"
              startIcon={<ShareOutlinedIcon fontSize="small" />}
              onClick={handleShare}
              disabled={!event}
              sx={{ fontWeight: 600 }}
            >
              Share
            </Button>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
            Times shown in CT (America/Chicago)
          </Typography>
        </Stack>
      </Box>
    </Drawer>
  );
}
