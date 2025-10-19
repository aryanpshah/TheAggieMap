export const CAPACITY_THRESHOLDS = {
  green: 33,
  yellow: 66,
} as const;

export type CapacityColor = "green" | "yellow" | "red";

export function capacityToColor(value: number): CapacityColor {
  if (value <= CAPACITY_THRESHOLDS.green) return "green";
  if (value <= CAPACITY_THRESHOLDS.yellow) return "yellow";
  return "red";
}

export function radiusFor(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return 3;
  }
  const minR = 3;
  const maxR = 18;
  const normalized = Math.log10(1 + value);
  const clamped = Math.min(1, normalized / 2);
  const scaled = minR + (maxR - minR) * clamped;
  return Math.round(scaled);
}

export const COLORS = {
  green: "#2E7D32",
  yellow: "#ED6C02",
  red: "#C62828",
  stroke: {
    green: "#1B5E20",
    yellow: "#E65100",
    red: "#8E0000",
  },
} as const;

// Legacy helper retained for earlier call sites.
export function parseCapacity(raw: string | number | null | undefined): number {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return raw;
  }
  if (typeof raw === "string") {
    const parsed = Number(raw.trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}
