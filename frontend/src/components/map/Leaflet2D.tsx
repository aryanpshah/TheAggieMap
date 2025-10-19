"use client";

import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import { LatLngBounds } from "leaflet";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { LatLng } from "../../utils/coords";
import { capacityToColor, radiusFor } from "../../utils/capacity";

const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const TAMU_CENTER: LatLng = { lat: 30.6153, lng: -96.341 };
const DEFAULT_ZOOM = 15.5;

const COLOR_HEX: Record<ReturnType<typeof capacityToColor>, string> = {
  green: "#2E7D32",
  yellow: "#ED6C02",
  red: "#C62828",
};

export interface LeafletPoint {
  name: string;
  capacity: number;
  coord: LatLng;
  distanceText?: string;
  directionsUrl: string;
}

export interface Leaflet2DProps {
  points: LeafletPoint[];
  center: LatLng;
  zoom?: number;
}

function FitBoundsEffect({ points }: { points: LeafletPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (!points || points.length === 0) {
      map.setView(TAMU_CENTER, DEFAULT_ZOOM, { animate: true });
      return;
    }

    if (points.length === 1) {
      map.setView(points[0].coord, 17, { animate: true });
      return;
    }

    const bounds = new LatLngBounds(points.map((p) => [p.coord.lat, p.coord.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, points]);

  return null;
}

export default function Leaflet2D({ points, center, zoom = DEFAULT_ZOOM }: Leaflet2DProps) {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom
        zoomControl={false}
        zoomAnimation
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url={TILE_URL} attribution={ATTRIBUTION} />
        <FitBoundsEffect points={points} />
        {points.map((point) => {
          const colorKey = capacityToColor(point.capacity);
          const color = COLOR_HEX[colorKey];
          const radius = radiusFor(point.capacity);
          return (
            <CircleMarker
              key={point.name}
              center={[point.coord.lat, point.coord.lng]}
              radius={radius}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.7,
                weight: 2,
              }}
            >
              <Popup>
                <Box sx={{ minWidth: 220 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main" }}>
                    {point.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Capacity: {point.capacity.toFixed(1)}%
                  </Typography>
                  {point.distanceText && (
                    <Typography variant="body2" color="text.secondary">
                      Distance: {point.distanceText}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => window.open(point.directionsUrl, "_blank", "noopener")}
                    disabled={!point.directionsUrl}
                  >
                    Get Directions
                  </Button>
                </Box>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </Box>
  );
}
