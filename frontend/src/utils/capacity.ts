export const CAPACITY_THRESHOLDS = {
  green: 33,
  yellow: 75,
} as const;

export type CapacityColor = "green" | "yellow" | "red";

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

export function capacityToColor(value: number): CapacityColor {
  if (value <= CAPACITY_THRESHOLDS.green) return "green";
  if (value <= CAPACITY_THRESHOLDS.yellow) return "yellow";
  return "red";
}

export function radiusFor(_value: number): number {
  void _value;
  // TODO: scale marker radius by capacity; using dynamic sizing later.
  return 8;
}
