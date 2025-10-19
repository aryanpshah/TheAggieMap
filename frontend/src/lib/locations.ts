import fs from "node:fs/promises";
import path from "node:path";
import { LocationDetail } from "../types/locations";

const DATA_PATH = path.join(process.cwd(), "src/data/locations.json");

export async function getLocationById(id: string): Promise<LocationDetail | null> {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    if (base) {
      const resp = await fetch(`${base.replace(/\/$/, "")}/locations/${encodeURIComponent(id)}`, {
        cache: "no-store",
      });
      if (resp.ok) {
        return (await resp.json()) as LocationDetail;
      }
    }
  } catch {
    // Ignore upstream failures and fall back to local data.
  }

  const raw = await fs.readFile(DATA_PATH, "utf-8");
  const all = JSON.parse(raw) as LocationDetail[];
  return all.find((entry) => entry.id === id) ?? null;
}
