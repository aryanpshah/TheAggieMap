"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LatLng } from "../utils/coords";

export type GeocoderResult = {
  coordsByName: Map<string, LatLng>;
  unresolved: string[];
  isLoading: boolean;
  error: string | null;
};

const SESSION_CACHE_KEY = "aggie-map-geocoder-cache";
export const SOUTHSIDE_COMMONS = "Southside Commons, College Station, TX";

const memoryCache = new Map<string, LatLng>();

function loadFromSession() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, LatLng>;
    Object.entries(parsed).forEach(([key, value]) => {
      if (!memoryCache.has(key)) {
        memoryCache.set(key, value);
      }
    });
  } catch {
    // ignore parse errors
  }
}

function persistToSession() {
  if (typeof window === "undefined") return;
  try {
    const payload: Record<string, LatLng> = {};
    memoryCache.forEach((value, key) => {
      payload[key] = value;
    });
    window.sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore write errors
  }
}

async function geocodeName(name: string, apiKey: string): Promise<LatLng | null> {
  const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    name,
  )}&key=${apiKey}`;
  const response = await fetch(endpoint);
  if (!response.ok) return null;

  const data = (await response.json()) as {
    status: string;
    results?: Array<{ geometry?: { location?: { lat: number; lng: number } } }>;
  };

  if (data.status !== "OK" || !data.results?.length) return null;
  const location = data.results[0].geometry?.location;
  if (!location) return null;
  return { lat: location.lat, lng: location.lng };
}

export function useGeocoder(names: string[], apiKey: string | undefined): GeocoderResult {
  const [state, setState] = useState<GeocoderResult>({
    coordsByName: new Map(),
    unresolved: [],
    isLoading: false,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    loadFromSession();
  }, []);

  useEffect(() => {
    if (!apiKey) {
      setState({
        coordsByName: new Map(),
        unresolved: [],
        isLoading: false,
        error: "Missing Google Maps API key.",
      });
      return;
    }

    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    const uniqueNames = Array.from(
      new Set([SOUTHSIDE_COMMONS, ...names.filter((name) => name.trim().length > 0)]),
    );

    let cancelled = false;

    const run = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const coords = new Map<string, LatLng>();
      const unresolved: string[] = [];

      for (const name of uniqueNames) {
        if (cancelled) break;
        if (memoryCache.has(name)) {
          coords.set(name, memoryCache.get(name)!);
          continue;
        }

        try {
          const result = await geocodeName(name, apiKey);
          if (cancelled) break;
          if (result) {
            memoryCache.set(name, result);
            coords.set(name, result);
            persistToSession();
          } else {
            unresolved.push(name);
          }
        } catch (error) {
          if ((error as Error).name === "AbortError") {
            return;
          }
          unresolved.push(name);
        }
      }

      if (cancelled) return;

      // Ensure we include cached results for any names we didn't refetch this run.
      names.forEach((name) => {
        if (!coords.has(name) && memoryCache.has(name)) {
          coords.set(name, memoryCache.get(name)!);
        }
      });

      setState({
        coordsByName: coords,
        unresolved,
        isLoading: false,
        error: null,
      });
    };

    run().catch((error) => {
      if ((error as Error).name === "AbortError") return;
      setState({
        coordsByName: new Map(),
        unresolved: [],
        isLoading: false,
        error: (error as Error).message,
      });
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [names, apiKey]);

  return useMemo(() => state, [state]);
}
