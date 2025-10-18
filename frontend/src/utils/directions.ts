import type { LatLng } from "./coords";

const BASE_URL = "https://www.google.com/maps/dir/?api=1";

export function buildDirectionsUrl(
  origin: LatLng,
  dest: LatLng,
  mode: "walking" | "driving" | "transit" | "bicycling" = "walking",
): string {
  const params = new URLSearchParams({
    origin: `${origin.lat},${origin.lng}`,
    destination: `${dest.lat},${dest.lng}`,
    travelmode: mode,
  });
  return `${BASE_URL}&${params.toString()}`;
}
