export function buildGoogleDirectionsUrl(params: {
  dest: { lat?: number; lng?: number; placeId?: string };
  origin?: { lat: number; lng: number } | null;
}): string {
  const base = "https://www.google.com/maps/dir/?api=1";
  const parts: string[] = [base, "travelmode=walking"];

  if (params.dest.placeId) {
    parts.push(`destination_place_id=${encodeURIComponent(params.dest.placeId)}`);
  } else if (params.dest.lat != null && params.dest.lng != null) {
    parts.push(`destination=${params.dest.lat},${params.dest.lng}`);
  }

  if (
    params.origin &&
    Number.isFinite(params.origin.lat) &&
    Number.isFinite(params.origin.lng)
  ) {
    parts.push(`origin=${params.origin.lat},${params.origin.lng}`);
  }

  return parts.join("&");
}
