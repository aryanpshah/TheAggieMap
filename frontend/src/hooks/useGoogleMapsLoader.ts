"use client";

import { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

type LoaderState =
  | { google: typeof google; isReady: true; error: null }
  | { google: undefined; isReady: false; error: string | null };

const LOADER_LIBRARIES: (
  | "maps"
  | "marker"
  | "places"
  | "geometry"
  | "routes"
  | "visualization"
)[] = ["maps", "marker", "places", "geometry"];

function resolveApiKey(): string | undefined {
  if (typeof process !== "undefined") {
    if (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    }
    if (process.env.VITE_GOOGLE_MAPS_API_KEY) {
      return process.env.VITE_GOOGLE_MAPS_API_KEY;
    }
  }
  if (typeof window !== "undefined") {
    const win = window as typeof window & { __GMAPS_KEY__?: string };
    return win.__GMAPS_KEY__;
  }
  return undefined;
}

export default function useGoogleMapsLoader(): LoaderState {
  const [state, setState] = useState<LoaderState>({
    google: undefined,
    isReady: false,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    const apiKey = resolveApiKey();

    if (!apiKey) {
      setState({
        google: undefined,
        isReady: false,
        error:
          "Missing Google Maps API key. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY or VITE_GOOGLE_MAPS_API_KEY.",
      });
      return () => {
        isMounted = false;
      };
    }

    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: LOADER_LIBRARIES,
    });

    loader
      .load()
      .then((google) => {
        if (!isMounted) return;
        setState({ google, isReady: true, error: null });
      })
      .catch((error) => {
        if (!isMounted) return;
        setState({
          google: undefined,
          isReady: false,
          error: (error as Error).message ?? "Failed to load Google Maps.",
        });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
