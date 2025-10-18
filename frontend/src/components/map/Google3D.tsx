"use client";

import { useEffect, useMemo, useRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import type { LatLng } from "../../utils/coords";
import { capacityToColor, radiusFor } from "../../utils/capacity";
import useGoogleMapsLoader from "../../hooks/useGoogleMapsLoader";

const COLOR_HEX: Record<ReturnType<typeof capacityToColor>, string> = {
  green: "#2E7D32",
  yellow: "#ED6C02",
  red: "#C62828",
};

export interface GooglePoint {
  name: string;
  capacity: number;
  coord: LatLng;
  distanceText?: string;
  directionsUrl: string;
}

export interface Google3DProps {
  points: GooglePoint[];
  center: LatLng;
}

export default function Google3D({ points, center }: Google3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const { google, isReady, error } = useGoogleMapsLoader();

  const mapCenter = useMemo(() => {
    if (points.length) {
      return points[0].coord;
    }
    return center;
  }, [points, center]);

  useEffect(() => {
    if (!isReady || !google || !containerRef.current) {
      return;
    }

    mapRef.current = new google.maps.Map(containerRef.current, {
      center: mapCenter,
      tilt: 67.5,
      zoom: 17,
      gestureHandling: "greedy",
      disableDefaultUI: true,
      clickableIcons: false,
      mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
    });

    // Custom minimalist zoom controls
    const controlContainer = document.createElement("div");
    controlContainer.style.display = "flex";
    controlContainer.style.flexDirection = "column";
    controlContainer.style.position = "absolute";
    controlContainer.style.right = "16px";
    controlContainer.style.bottom = "24px";
    controlContainer.style.borderRadius = "12px";
    controlContainer.style.overflow = "hidden";
    controlContainer.style.boxShadow = "0 8px 24px rgba(0,0,0,0.16)";

    const createControlButton = (label: string, onClick: () => void) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.style.background = "#FFFFFF";
      button.style.color = "#500000";
      button.style.border = "none";
      button.style.padding = "10px 14px";
      button.style.fontSize = "18px";
      button.style.cursor = "pointer";
      button.style.fontWeight = "600";
      button.addEventListener("click", onClick);
      return button;
    };

    controlContainer.appendChild(
      createControlButton("+", () => {
        const map = mapRef.current;
        if (!map) return;
        map.setZoom(Math.min((map.getZoom() ?? 17) + 1, 21));
      }),
    );
    controlContainer.appendChild(
      createControlButton("-", () => {
        const map = mapRef.current;
        if (!map) return;
        map.setZoom(Math.max((map.getZoom() ?? 17) - 1, 3));
      }),
    );

    mapRef.current.getDiv().appendChild(controlContainer);
    infoWindowRef.current = new google.maps.InfoWindow();

    return () => {
      controlContainer.remove();
      markersRef.current.forEach((marker) => (marker.map = null));
      markersRef.current = [];
      infoWindowRef.current?.close();
      infoWindowRef.current = null;
      mapRef.current = null;
    };
  }, [google, isReady, mapCenter, center]);

  useEffect(() => {
    if (!isReady || !google || !mapRef.current) return;

    markersRef.current.forEach((marker) => (marker.map = null));
    markersRef.current = [];

    points.forEach((point) => {
      const color = COLOR_HEX[capacityToColor(point.capacity)];
      const radius = radiusFor(point.capacity);

      const content = document.createElement("div");
      const size = Math.max(16, radius * 14);
      content.style.width = `${size}px`;
      content.style.height = `${size}px`;
      content.style.background = color;
      content.style.borderRadius = "50%";
      content.style.border = "3px solid #FFFFFF";
      content.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: point.coord,
        content,
      });

      marker.addListener("click", () => {
        if (!infoWindowRef.current) return;

        const container = document.createElement("div");
        container.style.minWidth = "220px";

        const nameEl = document.createElement("div");
        nameEl.textContent = point.name;
        nameEl.style.fontWeight = "700";
        nameEl.style.marginBottom = "4px";
        nameEl.style.color = "#500000";
        container.appendChild(nameEl);

        const capacityEl = document.createElement("div");
        capacityEl.textContent = `Capacity: ${point.capacity}`;
        capacityEl.style.fontSize = "13px";
        capacityEl.style.color = "#5F5F5F";
        container.appendChild(capacityEl);

        if (point.distanceText) {
          const distanceEl = document.createElement("div");
          distanceEl.textContent = `Distance: ${point.distanceText}`;
          distanceEl.style.fontSize = "13px";
          distanceEl.style.color = "#5F5F5F";
          distanceEl.style.marginBottom = "8px";
          container.appendChild(distanceEl);
        }

        const buttonEl = document.createElement("button");
        buttonEl.type = "button";
        buttonEl.textContent = "Get Directions";
        buttonEl.style.background = "#500000";
        buttonEl.style.color = "#FFFFFF";
        buttonEl.style.border = "none";
        buttonEl.style.padding = "8px 14px";
        buttonEl.style.borderRadius = "999px";
        buttonEl.style.cursor = "pointer";
        buttonEl.style.fontWeight = "600";
        buttonEl.addEventListener("click", () => {
          window.open(point.directionsUrl, "_blank", "noopener");
        });
        container.appendChild(buttonEl);

        infoWindowRef.current.setContent(container);
        infoWindowRef.current.open(mapRef.current, marker);
      });

      markersRef.current.push(marker);
    });
  }, [google, isReady, points]);

  useEffect(() => {
    if (!isReady || !google || !mapRef.current) return;
    mapRef.current.setCenter(center);
  }, [google, isReady, center]);

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!isReady) {
    return (
      <Stack
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{
          height: "100%",
          borderRadius: 4,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading Google Maps 3D view...
        </Typography>
      </Stack>
    );
  }

  return <Box ref={containerRef} sx={{ height: "100%", width: "100%", borderRadius: 4, overflow: "hidden" }} />;
}
