"use client";

import type { LatLng } from "../utils/coords";

const processEnv =
  (typeof process !== "undefined" ? process.env : undefined) ?? ({} as Record<string, string | undefined>);
const metaEnv =
  (typeof import.meta !== "undefined" ? ((import.meta as unknown as { env?: Record<string, string> }).env ?? {}) : {}) as
    | Record<string, string>
    | undefined;

const KEY =
  processEnv.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
  processEnv.VITE_GOOGLE_MAPS_API_KEY ??
  metaEnv?.VITE_GOOGLE_MAPS_API_KEY ??
  "";
const memCache = new Map<string, LatLng | null>();

function getSessionStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export async function geocodeName(name: string, signal?: AbortSignal): Promise<LatLng | null> {
  if (!name) return null;
  if (memCache.has(name)) {
    return memCache.get(name) ?? null;
  }

  const storage = getSessionStorage();
  const cacheKey = `geocode:${name}`;

  if (storage) {
    const cached = storage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as LatLng | null;
        memCache.set(name, parsed);
        return parsed;
      } catch {
        storage.removeItem(cacheKey);
      }
    }
  }

  if (!KEY) {
    memCache.set(name, null);
    return null;
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    name,
  )}&key=${KEY}`;

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      memCache.set(name, null);
      return null;
    }
    const data = (await response.json()) as {
      results?: Array<{ geometry?: { location?: { lat: number; lng: number } } }>;
      status?: string;
    };
    const loc = data?.results?.[0]?.geometry?.location;
    const coord: LatLng | null = loc ? { lat: loc.lat, lng: loc.lng } : null;

    if (storage) {
      try {
        storage.setItem(cacheKey, JSON.stringify(coord));
      } catch {
        // ignore quota/storage errors
      }
    }
    memCache.set(name, coord);
    return coord;
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      throw error;
    }
    memCache.set(name, null);
    return null;
  }
}

export async function geocodeMany(
  names: string[],
  signal?: AbortSignal,
): Promise<Record<string, LatLng | null>> {
  const output: Record<string, LatLng | null> = {};
  for (const name of names) {
    output[name] = await geocodeName(name, signal);
  }
  return output;
}

export function clearGeocodeCache() {
  memCache.clear();
}
