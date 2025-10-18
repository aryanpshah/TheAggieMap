export function metersToMiles(meters: number): number {
  return meters / 1609.344;
}

export function formatMiles(meters: number): string {
  const miles = metersToMiles(meters);
  if (!Number.isFinite(miles)) {
    return "—";
  }
  if (miles < 0.05) {
    return "<0.1 mi";
  }
  const rounded = Math.round(miles * 10) / 10;
  return `${rounded.toFixed(1)} mi`;
}
