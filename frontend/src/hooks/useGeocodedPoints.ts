"use client";

import { useEffect, useState } from "react";
import type { LatLng } from "../utils/coords";
import type { OccupancyEntry } from "./useOccupancy";
import { geocodeMany } from "../services/geocode";

export type GeocodedPoint = {
  name: string;
  capacity: number;
  coord: LatLng | null;
};

export function useGeocodedPoints(occ: OccupancyEntry[]) {
  const [points, setPoints] = useState<GeocodedPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    if (occ.length === 0) {
      setPoints([]);
      setLoading(false);
      return () => {
        alive = false;
        controller.abort();
      };
    }

    async function run() {
      try {
        setLoading(true);
        const names = occ.map((entry) => entry.name);
        const coordsByName = await geocodeMany(names, controller.signal);
        if (!alive) return;

        const joined: GeocodedPoint[] = occ.map((entry) => ({
          name: entry.name,
          capacity: entry.capacity,
          coord: coordsByName[entry.name] ?? null,
        }));
        setPoints(joined);
      } catch (error) {
        if (!alive || (error as Error).name === "AbortError") {
          return;
        }
        setPoints(
          occ.map((entry) => ({
            name: entry.name,
            capacity: entry.capacity,
            coord: null,
          })),
        );
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      alive = false;
      controller.abort();
    };
  }, [occ]);

  return { points, loading };
}
