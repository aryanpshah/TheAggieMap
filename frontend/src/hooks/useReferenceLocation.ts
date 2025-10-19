"use client";

import { useEffect, useState } from "react";
import { SOUTHSIDE_COMMONS_COORD } from "../data/exploreSeed";
import type { LatLng } from "../utils/distance";

export type ReferenceStatus = "pending" | "granted" | "fallback";

export interface ReferenceLocationState {
  status: ReferenceStatus;
  reference?: LatLng;
  error?: string | null;
}

const FALLBACK_ADDRESS = "Southside Commons, College Station, TX";

function resolveMapsApiKey(): string | undefined {
  if (typeof process === "undefined") return undefined;
  return (
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
    process.env.VITE_GOOGLE_MAPS_API_KEY ??
    process.env.GOOGLE_MAPS_API_KEY
  );
}

async function geocodeFallback(apiKey: string): Promise<LatLng | null> {
  const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    FALLBACK_ADDRESS,
  )}&key=${apiKey}`;
  const response = await fetch(endpoint);
  if (!response.ok) return null;
  const data = (await response.json()) as {
    status?: string;
    results?: Array<{ geometry?: { location?: { lat: number; lng: number } } }>;
  };
  if (data.status !== "OK" || !data.results?.length) {
    return null;
  }
  const location = data.results[0].geometry?.location;
  if (!location) return null;
  return { lat: location.lat, lng: location.lng };
}

export function useReferenceLocation(): ReferenceLocationState {
  const [state, setState] = useState<ReferenceLocationState>({
    status: "pending",
  });

  useEffect(() => {
    let isMounted = true;

    const setSafeState = (next: ReferenceLocationState) => {
      if (isMounted) {
        setState(next);
      }
    };

    const assignFallback = async () => {
      const apiKey = resolveMapsApiKey();
      if (!apiKey) {
        setSafeState({
          status: "fallback",
          reference: SOUTHSIDE_COMMONS_COORD,
          error: "Missing Google Maps API key for fallback geocoding.",
        });
        return;
      }
      try {
        const coord = await geocodeFallback(apiKey);
        if (!isMounted) return;

        if (coord) {
          setSafeState({
            status: "fallback",
            reference: coord,
            error: null,
          });
        } else {
          setSafeState({
            status: "fallback",
            reference: SOUTHSIDE_COMMONS_COORD,
            error: "Unable to geocode Southside Commons fallback.",
          });
        }
      } catch (error) {
        if (!isMounted) return;
        setSafeState({
          status: "fallback",
          reference: SOUTHSIDE_COMMONS_COORD,
          error: (error as Error).message ?? "Fallback geocoding failed.",
        });
      }
    };

    const handleSuccess: PositionCallback = (position) => {
      const { latitude, longitude } = position.coords;
      setSafeState({
        status: "granted",
        reference: { lat: latitude, lng: longitude },
        error: null,
      });
    };

    const handleError = () => {
      assignFallback().catch(() => {
        // Errors handled inside assignFallback via setSafeState.
      });
    };

    try {
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 0,
        });
      } else {
        assignFallback().catch(() => {
          // noop - handled inside assignFallback
        });
      }
    } catch {
      assignFallback().catch(() => {
        // noop - handled inside assignFallback
      });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
