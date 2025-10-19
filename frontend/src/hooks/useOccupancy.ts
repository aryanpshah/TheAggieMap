"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchOccupancy, type RawOccupancyResponse } from "../services/ts.api";

export type OccupancyEntry = { name: string; capacity: number };

const DEFAULT_POLL_MS = 30_000;

export function useOccupancy(pollMs = DEFAULT_POLL_MS) {
  const [data, setData] = useState<OccupancyEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      try {
        if (mountedRef.current) {
          setLoading(true);
        }
        const raw: RawOccupancyResponse = await fetchOccupancy(signal);

        const normalized: OccupancyEntry[] = raw.flatMap((item) => {
          const [name, capacity] = Object.entries(item)[0] ?? [undefined, undefined];
          if (!name || typeof capacity !== "number" || Number.isNaN(capacity)) {
            return [];
          }
          return [{ name, capacity }];
        });

        if (mountedRef.current) {
          setData(normalized);
          setError(null);
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }
        if (mountedRef.current) {
          setError((err as Error)?.message ?? "Failed to load occupancy");
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    mountedRef.current = true;
    const controller = new AbortController();
    load(controller.signal);

    if (pollMs > 0) {
      timerRef.current = setInterval(() => {
        load();
      }, pollMs);
    }

    return () => {
      mountedRef.current = false;
      controller.abort();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [load, pollMs]);

  const reload = useCallback(() => {
    load();
  }, [load]);

  return { data, loading, error, reload };
}
