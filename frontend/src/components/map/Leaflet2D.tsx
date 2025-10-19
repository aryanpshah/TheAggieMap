"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { LatLngBounds } from "leaflet";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { GeocodedPoint } from "../../hooks/useGeocodedPoints";
import type { LatLng } from "../../utils/coords";
import { capacityToColor, radiusFor, COLORS } from "../../utils/capacity";

const TAMU_CENTER: LatLng = { lat: 30.6153, lng: -96.341 };

function FitOnData({ points }: { points: GeocodedPoint[] }) {
  const map = useMap();

  useEffect(() => {
    const withCoords = points.filter((p) => p.coord);
    if (withCoords.length === 0) {
      map.setView(TAMU_CENTER, 15.5);
      return;
    }
    if (withCoords.length === 1) {
      map.setView(withCoords[0].coord as LatLng, 17);
      return;
    }
    const bounds = new LatLngBounds(
      withCoords.map((p) => [p.coord!.lat, p.coord!.lng]),
    );
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [points, map]);

  return null;
}

export function Leaflet2D({ points }: { points: GeocodedPoint[] }) {
  const missing = useMemo(
    () => points.filter((p) => !p.coord).map((p) => p.name),
    [points],
  );

  useEffect(() => {
    if (missing.length > 0) {
      console.warn("Geocoding failed for:", missing);
    }
  }, [missing]);

  return (
    <MapContainer
      center={TAMU_CENTER}
      zoom={15.5}
      scrollWheelZoom
      style={{ height: "100%", width: "100%", borderRadius: 16, overflow: "hidden" }}
      attributionControl
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
      />
      <FitOnData points={points} />
      {points.map((p) => {
        if (!p.coord) return null;
        const tier = capacityToColor(p.capacity);
        const fill = COLORS[tier];
        const stroke = COLORS.stroke[tier];
        const radius = radiusFor(p.capacity);
        return (
          <CircleMarker
            key={p.name}
            center={[p.coord.lat, p.coord.lng]}
            radius={radius}
            pathOptions={{ color: stroke, fillColor: fill, fillOpacity: 0.7, weight: 2 }}
          >
            <Popup>
              <Box sx={{ minWidth: 220 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: "primary.main" }}
                >
                  {p.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Capacity: {p.capacity}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${p.name}, College Station, TX`,
                      )}`,
                      "_blank",
                      "noopener",
                    )
                  }
                >
                  Open in Maps
                </Button>
              </Box>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}

export default Leaflet2D;
