export type LatLng = { lat: number; lng: number };

const EARTH_RADIUS_METERS = 6_371_000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function haversineMeters(a: LatLng, b: LatLng): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);

  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return EARTH_RADIUS_METERS * c;
}

export function metersToMiles(meters: number): number {
  return meters / 1_609.344;
}

export function formatMiles1dp(miles: number): string {
  if (!Number.isFinite(miles)) {
    return "N/A";
  }
  if (miles < 0.05) {
    return "<0.1 mi";
  }
  const rounded = Math.round(miles * 10) / 10;
  return `${rounded.toFixed(1)} mi`;
}

// Legacy helpers retained for compatibility with existing imports.
export function haversineDistanceMeters(a: LatLng, b: LatLng): number {
  return haversineMeters(a, b);
}

export function formatMiles(meters: number): string {
  return formatMiles1dp(metersToMiles(meters));
}
